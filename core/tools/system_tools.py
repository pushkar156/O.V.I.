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

class ProcessControlTool(BaseTool):
    @property
    def name(self) -> str:
        return "manage_processes"

    @property
    def description(self) -> str:
        return "Lists running processes or terminates a specific process by name or PID."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "action": {"type": "string", "enum": ["list", "kill"], "description": "Whether to list all processes or kill one."},
                "target": {"type": "string", "description": "The name or PID of the process to kill (if action is 'kill')."}
            },
            "required": ["action"]
        }

    async def execute(self, action: str, target: str = None, **kwargs) -> ToolResult:
        try:
            if action == "list":
                processes = []
                for proc in psutil.process_iter(['pid', 'name', 'cpu_percent']):
                    processes.append(proc.info)
                # Sort by CPU and take top 10
                top_procs = sorted(processes, key=lambda x: x['cpu_percent'] or 0, reverse=True)[:10]
                return ToolResult(success=True, data={"top_processes": top_procs}, message="Top 10 CPU processes retrieved.")
            
            elif action == "kill" and target:
                count = 0
                for proc in psutil.process_iter(['pid', 'name']):
                    if target.lower() in proc.info['name'].lower() or str(proc.info['pid']) == target:
                        proc.kill()
                        count += 1
                return ToolResult(success=True, message=f"Terminated {count} process(es) matching '{target}'.")
            
            return ToolResult(success=False, message="Invalid action or target missing.")
        except Exception as e:
            return ToolResult(success=False, message=str(e))

class PowerControlTool(BaseTool):
    @property
    def name(self) -> str:
        return "system_power_control"

    @property
    def description(self) -> str:
        return "Executes power commands like shutdown, restart, or sleep. USE WITH EXTREME CAUTION."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "command": {"type": "string", "enum": ["shutdown", "restart", "sleep"], "description": "The power command to execute."}
            },
            "required": ["command"]
        }

    async def execute(self, command: str, **kwargs) -> ToolResult:
        try:
            import os
            if command == "shutdown":
                os.system("shutdown /s /t 60") # 60 sec delay for safety
                return ToolResult(success=True, message="System will shutdown in 60 seconds. You can cancel with 'shutdown /a' in CMD.")
            elif command == "restart":
                os.system("shutdown /r /t 60")
                return ToolResult(success=True, message="System will restart in 60 seconds.")
            elif command == "sleep":
                # Requires 'Powertool' or just the rundll32 command
                os.system("rundll32.exe powrprof.dll,SetSuspendState 0,1,0")
                return ToolResult(success=True, message="System is going to sleep.")
            
            return ToolResult(success=False, message="Invalid command.")
        except Exception as e:
            return ToolResult(success=False, message=str(e))
