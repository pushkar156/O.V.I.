import webbrowser
import urllib.parse
from typing import Dict, Any
from core.tools.base import BaseTool, ToolResult

class OpenURLTool(BaseTool):
    @property
    def name(self) -> str:
        return "open_url"

    @property
    def description(self) -> str:
        return "Opens a specific URL in the default web browser."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "url": {"type": "string", "description": "The full URL to open (e.g., https://google.com)."}
            },
            "required": ["url"]
        }

    async def execute(self, url: str, **kwargs) -> ToolResult:
        try:
            webbrowser.open(url)
            return ToolResult(success=True, data=None, message=f"Opened URL: {url}")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))

class WebSearchTool(BaseTool):
    @property
    def name(self) -> str:
        return "web_search"

    @property
    def description(self) -> str:
        return "Performs a web search using the default browser."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "query": {"type": "string", "description": "The search query to perform."}
            },
            "required": ["query"]
        }

    async def execute(self, query: str, **kwargs) -> ToolResult:
        try:
            encoded_query = urllib.parse.quote(query)
            # Default to Google for now; could be made configurable later
            search_url = f"https://www.google.com/search?q={encoded_query}"
            webbrowser.open(search_url)
            return ToolResult(success=True, data=None, message=f"Performed web search for: {query}")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))
