import json
import re
from typing import Dict, Any, Optional, Tuple
from loguru import logger

class ToolRouter:
    """
    Parses LLM output for tool calls and dispatches them to registered tools.
    """
    def __init__(self):
        self.registered_tools = {}

    def register_tool(self, tool_name: str, func_callable):
        """Registers a function to be callable by the LLM."""
        self.registered_tools[tool_name] = func_callable
        logger.info(f"Registered tool: {tool_name}")

    async def parse_and_route(self, text: str) -> Tuple[Optional[str], Optional[Dict[str, Any]]]:
        """
        Extracts JSON tool calls from text and executes them.
        Returns: (tool_name, tool_result)
        """
        tool_call = self._extract_json(text)
        if not tool_call:
            return None, None

        tool_name = tool_call.get("tool")
        args = tool_call.get("args", {})

        if not tool_name:
            return None, None

        if tool_name not in self.registered_tools:
            logger.error(f"LLM tried to call unregistered tool: {tool_name}")
            return tool_name, {"success": False, "error": f"Tool '{tool_name}' not found."}

        try:
            logger.info(f"Executing tool: {tool_name} with args: {args}")
            result = await self.registered_tools[tool_name](**args)
            return tool_name, result
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return tool_name, {"success": False, "error": str(e)}

    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        """Finds and parses the first JSON block in the LLM response."""
        # Try finding JSON within markdown blocks first
        markdown_match = re.search(r"```json\s*(\{.*?\})\s*```", text, re.DOTALL)
        if markdown_match:
            try:
                return json.loads(markdown_match.group(1))
            except json.JSONDecodeError:
                pass

        # Fallback: try finding any JSON-like structure
        json_match = re.search(r"(\{.*?\})", text, re.DOTALL)
        if json_match:
            try:
                return json.loads(json_match.group(1))
            except json.JSONDecodeError:
                pass

        return None

# Global instance
tool_router = ToolRouter()
