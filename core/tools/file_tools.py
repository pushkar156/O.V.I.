import os
import glob
from typing import Dict, Any, List
from core.tools.base import BaseTool, ToolResult

class ListDirectoryTool(BaseTool):
    @property
    def name(self) -> str:
        return "list_directory"

    @property
    def description(self) -> str:
        return "Lists the files and folders in a specified directory."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Absolute or relative path to list."}
            },
            "required": ["path"]
        }

    async def execute(self, path: str = ".", **kwargs) -> ToolResult:
        try:
            items = os.listdir(path)
            return ToolResult(success=True, data={"items": items}, message=f"Found {len(items)} items in {path}")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))

class ReadFileTool(BaseTool):
    @property
    def name(self) -> str:
        return "read_file"

    @property
    def description(self) -> str:
        return "Reads the text content of a file."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Path to the file to read."}
            },
            "required": ["path"]
        }

    async def execute(self, path: str, **kwargs) -> ToolResult:
        try:
            with open(path, 'r', encoding='utf-8') as f:
                content = f.read(2000) # Limit to 2000 chars for context window safety
                suffix = "..." if len(content) == 2000 else ""
            return ToolResult(success=True, data={"content": content + suffix}, message=f"Read file: {path}")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))

class SearchFilesTool(BaseTool):
    @property
    def name(self) -> str:
        return "search_files"

    @property
    def description(self) -> str:
        return "Searches for files matching a pattern (e.g., *.txt) in a directory."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "pattern": {"type": "string", "description": "Search pattern (e.g., 'invoice*.pdf')"},
                "root": {"type": "string", "description": "Directory to start search from (default is current)."}
            },
            "required": ["pattern"]
        }

    async def execute(self, pattern: str, root: str = ".", **kwargs) -> ToolResult:
        try:
            search_path = os.path.join(root, "**", pattern)
            results = glob.glob(search_path, recursive=True)
            return ToolResult(success=True, data={"matches": results[:10]}, message=f"Found {len(results)} matches.")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))
