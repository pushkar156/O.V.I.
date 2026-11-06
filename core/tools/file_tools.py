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

class WriteFileTool(BaseTool):
    @property
    def name(self) -> str:
        return "write_file"

    @property
    def description(self) -> str:
        return "Creates or overwrites a file with new content. Use with caution."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Path to the file to create/overwrite."},
                "content": {"type": "string", "description": "Full text content to write."}
            },
            "required": ["path", "content"]
        }

    async def execute(self, path: str, content: str, **kwargs) -> ToolResult:
        try:
            # Safety: Ensure directory exists
            os.makedirs(os.path.dirname(path), exist_ok=True) if os.path.dirname(path) else None
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(content)
            return ToolResult(success=True, data={"path": path}, message=f"Successfully wrote to {path}")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))

class EditFileTool(BaseTool):
    @property
    def name(self) -> str:
        return "edit_file"

    @property
    def description(self) -> str:
        return "Applies a targeted edit to a file by replacing a block of text."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "Path to the file to edit."},
                "search_text": {"type": "string", "description": "The exact text block to find and replace."},
                "replace_text": {"type": "string", "description": "The new text block to insert."}
            },
            "required": ["path", "search_text", "replace_text"]
        }

    async def execute(self, path: str, search_text: str, replace_text: str, **kwargs) -> ToolResult:
        try:
            if not os.path.exists(path):
                return ToolResult(success=False, data=None, message=f"File not found: {path}")

            with open(path, 'r', encoding='utf-8') as f:
                content = f.read()

            if search_text not in content:
                return ToolResult(success=False, data=None, message="Target text block not found in file. Make sure your search_text is an exact match.")

            new_content = content.replace(search_text, replace_text, 1)
            
            with open(path, 'w', encoding='utf-8') as f:
                f.write(new_content)

            return ToolResult(success=True, data={"path": path}, message=f"Successfully edited {path}")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))
