import subprocess
import os
from typing import Dict, Any
from core.tools.base import BaseTool, ToolResult, tool_sandbox

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
            # Enforce shell=False by passing command as a list
            subprocess.Popen([app_cmd], shell=False)
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
            # For Windows, we use taskkill via the secure sandbox
            result = tool_sandbox.run_command(["taskkill", "/F", "/IM", name])
            if result.returncode == 0:
                return ToolResult(success=True, data=None, message=f"Closed application: {name}")
            else:
                return ToolResult(success=False, data=None, message=f"Process '{name}' not found or could not be closed. Error: {result.stderr}")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))
