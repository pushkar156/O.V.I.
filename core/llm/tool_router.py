import json
import re
import inspect
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
            func = self.registered_tools[tool_name]
            
            # Determine calling convention:
            # Old tools (BaseTool): async def execute(**kwargs) -> ToolResult
            # New tools (Phase 5.2): def execute(args: dict) -> str
            if inspect.iscoroutinefunction(func):
                # Async tool (BaseTool style) — unpack args as kwargs
                result = await func(**args)
            else:
                # Sync tool (new style) — pass the args dict directly
                result = func(args)
            
            return tool_name, result
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return tool_name, {"success": False, "error": str(e)}

    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        """Finds and parses the first JSON block in the LLM response."""
        # Strategy 1: Find JSON in a markdown code block (```json ... ```)
        # The LLM sometimes puts extra text after the JSON inside the block,
        # so we look for the first valid JSON object within the block.
        markdown_match = re.search(r"```json\s*(.*?)```", text, re.DOTALL)
        if markdown_match:
            block_content = markdown_match.group(1).strip()
            parsed = self._find_first_json_object(block_content)
            if parsed:
                return parsed

        # Strategy 2: Find any JSON-like { "tool": ... } structure in the text
        parsed = self._find_first_json_object(text)
        if parsed:
            return parsed

        return None

    def _find_first_json_object(self, text: str) -> Optional[Dict[str, Any]]:
        """Extracts the first valid JSON object from a string using brace matching."""
        start = text.find('{')
        if start == -1:
            return None
        
        depth = 0
        for i in range(start, len(text)):
            if text[i] == '{':
                depth += 1
            elif text[i] == '}':
                depth -= 1
                if depth == 0:
                    candidate = text[start:i+1]
                    try:
                        obj = json.loads(candidate)
                        if isinstance(obj, dict) and "tool" in obj:
                            return obj
                    except json.JSONDecodeError:
                        pass
                    break
        return None

# Global instance
tool_router = ToolRouter()
