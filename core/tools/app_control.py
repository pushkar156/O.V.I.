import subprocess
import os
from typing import Dict, Any
from core.tools.base import BaseTool, ToolResult

# Extension: Add your common app paths here
APP_REGISTRY = {
    "vscode": "code",
    "notepad": "notepad.exe",
    "chrome": "chrome.exe",
    "firefox": "firefox.exe",
    "spotify": "spotify.exe",
    "calculator": "calc.exe",
    "explorer": "explorer.exe",
    "terminal": "wt.exe" # Windows Terminal
}

class OpenAppTool(BaseTool):
    @property
    def name(self) -> str:
        return "open_application"

    @property
    def description(self) -> str:
        return "Opens a specified application. Use common names like 'vscode', 'chrome', or provide the executable name."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Name of the application to open."}
            },
            "required": ["name"]
        }

    async def execute(self, name: str, **kwargs) -> ToolResult:
        app_cmd = APP_REGISTRY.get(name.lower(), name)
        try:
            # We use subprocess.Popen to launch without blocking the server
            subprocess.Popen(app_cmd, shell=True)
            return ToolResult(success=True, data=None, message=f"Successfully signaled system to open {name}.")
        except Exception as e:
            return ToolResult(success=False, data=None, message=f"Failed to open {name}: {str(e)}")

class CloseAppTool(BaseTool):
    @property
    def name(self) -> str:
        return "close_application"

    @property
    def description(self) -> str:
        return "Closes a running application by name."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "name": {"type": "string", "description": "Name of the process to kill (e.g., 'chrome.exe')."}
            },
            "required": ["name"]
        }

    async def execute(self, name: str, **kwargs) -> ToolResult:
        try:
            # For Windows, we use taskkill
            subprocess.run(["taskkill", "/F", "/IM", name], check=True, capture_output=True)
            return ToolResult(success=True, data=None, message=f"Closed application: {name}")
        except subprocess.CalledProcessError:
            return ToolResult(success=False, data=None, message=f"Process '{name}' not found or could not be closed.")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))
