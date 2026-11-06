import json
import re
import inspect
from typing import Dict, Any, Optional, Tuple
from loguru import logger
from core.memory.long_term import long_term_memory

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
                # Async tool — use await with unpacked arguments
                result = await func(**args)
            else:
                # Sync tool — call with unpacked arguments
                result = func(**args)
            
            # Self-Healing: Store 'Success Patterns' for future reference
            is_success = False
            if hasattr(result, 'success'):
                is_success = result.success
            elif isinstance(result, dict):
                is_success = result.get("success", True)
            else:
                is_success = True # Assume success if no flag provided

            if is_success:
                import asyncio
                # Store the intent and the successful tool call structure
                # We use the text context to link the user's intent to the tool
                pattern = f"Intent context: {text[:100]} | Successful Tool: {tool_name} | Args: {json.dumps(args)}"
                asyncio.create_task(long_term_memory.store_memory(pattern, category="success_pattern"))
            
            return tool_name, result
        except Exception as e:
            logger.error(f"Error executing tool {tool_name}: {e}")
            return tool_name, {"success": False, "error": str(e)}

    def _extract_json(self, text: str) -> Optional[Dict[str, Any]]:
        """Finds and parses the first JSON block in the LLM response."""
        # 1. Try to find JSON blocks first (standard markdown)
        json_blocks = re.findall(r"```(?:json)?\s*(.*?)```", text, re.DOTALL)
        for block in json_blocks:
            parsed = self._find_first_json_object(block.strip())
            if parsed:
                return parsed

        # 2. If no block found or no tool in blocks, scan the raw text for any { ... } object
        return self._find_first_json_object(text)

    def _find_first_json_object(self, text: str) -> Optional[Dict[str, Any]]:
        """Extracts the first valid JSON object from a string using robust brace matching."""
        # Find all '{' indices
        starts = [m.start() for m in re.finditer(r'\{', text)]
        
        for start in starts:
            depth = 0
            for i in range(start, len(text)):
                if text[i] == '{':
                    depth += 1
                elif text[i] == '}':
                    depth -= 1
                    if depth == 0:
                        candidate = text[start:i+1]
                        try:
                            # Clean up potential artifacts like trailing commas before closing braces
                            # although json.loads is strict, we'll try it raw first
                            obj = json.loads(candidate)
                            if isinstance(obj, dict) and "tool" in obj:
                                return obj
                        except json.JSONDecodeError:
                            # Try to fix common LLM mistakes (like trailing commas)
                            try:
                                # Very simple fix for trailing comma before }
                                fixed = re.sub(r',\s*}', '}', candidate)
                                obj = json.loads(fixed)
                                if isinstance(obj, dict) and "tool" in obj:
                                    return obj
                            except:
                                pass
                        break
        return None

# Global instance
tool_router = ToolRouter()
