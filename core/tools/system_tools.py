import psutil
import platform
import time
from datetime import datetime
from typing import Dict, Any

from core.tools.base import BaseTool, ToolResult

class SystemInfoTool(BaseTool):
    @property
    def name(self) -> str:
        return "get_system_info"

    @property
    def description(self) -> str:
        return "Returns information about the computer's CPU, RAM, and Disk usage."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {"type": "object", "properties": {}}

    async def execute(self, **kwargs) -> ToolResult:
        try:
            cpu_pct = psutil.cpu_percent(interval=None)
            ram = psutil.virtual_memory()
            disk = psutil.disk_usage('/')
            
            info = {
                "os": platform.system(),
                "node": platform.node(),
                "cpu_percent": f"{cpu_pct}%",
                "ram": {
                    "used": f"{ram.used / (1024**3):.1f} GB",
                    "total": f"{ram.total / (1024**3):.1f} GB",
                    "percent": f"{ram.percent}%"
                },
                "disk": {
                    "used": f"{disk.used / (1024**3):.1f} GB",
                    "total": f"{disk.total / (1024**3):.1f} GB",
                    "percent": f"{disk.percent}%"
                }
            }
            return ToolResult(success=True, data=info, message="System information retrieved.")
        except Exception as e:
            return ToolResult(success=False, data=None, message=str(e))

class TimeTool(BaseTool):
    @property
    def name(self) -> str:
        return "get_time"

    @property
    def description(self) -> str:
        return "Returns the current date and time."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {"type": "object", "properties": {}}

    async def execute(self, **kwargs) -> ToolResult:
        now = datetime.now().strftime("%A, %B %d, %Y %H:%M:%S")
        return ToolResult(success=True, data={"time": now}, message=f"Current time is {now}")

class SetSystemThemeTool(BaseTool):
    @property
    def name(self) -> str:
        return "set_system_theme"

    @property
    def description(self) -> str:
        return "Sets the Windows system theme to 'light' or 'dark'."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "theme": {"type": "string", "enum": ["light", "dark"], "description": "The theme to apply."}
            },
            "required": ["theme"]
        }

    async def execute(self, theme: str, **kwargs) -> ToolResult:
        if platform.system() != "Windows":
            return ToolResult(success=False, message="Theme control is only supported on Windows.")
        
        try:
            import winreg
            key_path = r"Software\Microsoft\Windows\CurrentVersion\Themes\Personalize"
            value_name_apps = "AppsUseLightTheme"
            value_name_system = "SystemUsesLightTheme"
            
            value = 1 if theme == "light" else 0
            
            with winreg.OpenKey(winreg.HKEY_CURRENT_USER, key_path, 0, winreg.KEY_SET_VALUE) as key:
                winreg.SetValueEx(key, value_name_apps, 0, winreg.REG_DWORD, value)
                winreg.SetValueEx(key, value_name_system, 0, winreg.REG_DWORD, value)
            
            return ToolResult(success=True, message=f"System theme set to {theme}.")
        except Exception as e:
            return ToolResult(success=False, message=f"Failed to set theme: {e}")
