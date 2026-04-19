import pyperclip
from typing import Dict, Any
from core.tools.base import BaseTool, ToolResult

class ReadClipboardTool(BaseTool):
    @property
    def name(self) -> str:
        return "read_clipboard"

    @property
    def description(self) -> str:
        return "Reads the text currently copied to the computer's clipboard."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {"type": "object", "properties": {}}

    async def execute(self, **kwargs) -> ToolResult:
        try:
            text = pyperclip.paste()
            return ToolResult(success=True, data={"text": text}, message="Clipboard content retrieved.")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))

class WriteClipboardTool(BaseTool):
    @property
    def name(self) -> str:
        return "write_clipboard"

    @property
    def description(self) -> str:
        return "Copies text to the computer's clipboard."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "text": {"type": "string", "description": "Text to copy to the clipboard."}
            },
            "required": ["text"]
        }

    async def execute(self, text: str, **kwargs) -> ToolResult:
        try:
            pyperclip.copy(text)
            return ToolResult(success=True, data=None, message="Text copied to clipboard.")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))
