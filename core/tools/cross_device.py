from typing import Dict, Any, Optional
from core.tools.base import BaseTool
from core.agents.agent_registry import agent_registry
from loguru import logger

class RemoteScreenshotTool(BaseTool):
    name = "capture_remote_screen"
    description = "CRITICAL: Use this to see what is on the screen of a CONNECTED AGENT (like 'laptop-agent'). DO NOT use local screen tools for agents."
    parameters = {
        "type": "object",
        "properties": {
            "device_name": {"type": "string", "description": "The name of the target device to capture."}
        },
        "required": ["device_name"]
    }

    async def execute(self, device_name: str) -> Dict[str, Any]:
        success = await agent_registry.send_command(device_name, "take_screenshot")
        if success:
            return {"status": "success", "message": f"Screenshot command sent to {device_name}. Waiting for result."}
        return {"status": "error", "message": f"Device '{device_name}' is offline or not found."}

class RemoteSystemInfoTool(BaseTool):
    name = "get_remote_status"
    description = "Use this to check CPU/RAM/Battery of a CONNECTED AGENT. DO NOT use local system tools for agents."
    parameters = {
        "type": "object",
        "properties": {
            "device_name": {"type": "string", "description": "The name of the target device."}
        },
        "required": ["device_name"]
    }

    async def execute(self, device_name: str) -> Dict[str, Any]:
        success = await agent_registry.send_command(device_name, "get_local_system_info")
        if success:
            return {"status": "success", "message": f"Status query sent to {device_name}."}
        return {"status": "error", "message": f"Device '{device_name}' is offline."}

class RemoteAppControlTool(BaseTool):
    name = "open_remote_app"
    description = "Launches an application on a specific remote device."
    parameters = {
        "type": "object",
        "properties": {
            "device_name": {"type": "string", "description": "Target device name."},
            "app_name": {"type": "string", "description": "Name of the app to open."}
        },
        "required": ["device_name", "app_name"]
    }

    async def execute(self, device_name: str, app_name: str) -> Dict[str, Any]:
        success = await agent_registry.send_command(device_name, "open_app", {"app_name": app_name})
        if success:
            return {"status": "success", "message": f"Opening {app_name} on {device_name}."}
        return {"status": "error", "message": f"Could not reach {device_name}."}

class PingDeviceTool(BaseTool):
    name = "ping_device"
    description = "Use this to 'Find My Device' by playing an alert sound on a CONNECTED AGENT."
    parameters = {
        "type": "object",
        "properties": {
            "device_name": {"type": "string", "description": "The name of the device to ping."}
        },
        "required": ["device_name"]
    }

    async def execute(self, device_name: str) -> Dict[str, Any]:
        success = await agent_registry.send_command(device_name, "play_sound")
        if success:
            return {"status": "success", "message": f"Ping sent to {device_name}."}
        return {"status": "error", "message": f"Device '{device_name}' is not responsive."}

# List of cross-device tools to register
CROSS_DEVICE_TOOLS = [
    RemoteScreenshotTool(),
    RemoteSystemInfoTool(),
    RemoteAppControlTool(),
    PingDeviceTool()
]
