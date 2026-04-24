import asyncio
import json
import uuid
import time
import websockets
import logging
from local_tools import get_local_system_info, take_screenshot, open_local_app

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger("OVI-Agent")

class OVIAgent:
    def __init__(self, config_path="config.json"):
        with open(config_path, 'r') as f:
            self.config = json.load(f)
        
        self.device_name = self.config.get("device_name", f"agent-{uuid.uuid4().hex[:6]}")
        self.core_url = self.config.get("core_url", "ws://localhost:8000/ws/agent")
        self.ws = None

    async def connect(self):
        """Establish connection to the O.V.I. Core Server."""
        while True:
            try:
                logger.info(f"Connecting to O.V.I. Core at {self.core_url}...")
                async with websockets.connect(self.core_url) as websocket:
                    self.ws = websocket
                    # 1. Register Device
                    await self.register()
                    # 2. Start Message Loop & Heartbeat
                    await asyncio.gather(
                        self.message_handler(),
                        self.heartbeat()
                    )
            except Exception as e:
                logger.error(f"Connection failed: {e}. Retrying in 5s...")
                await asyncio.sleep(5)

    async def register(self):
        """Send registration message with device capabilities."""
        registration = {
            "type": "register",
            "source": self.device_name,
            "target": "core",
            "data": {
                "capabilities": self.config.get("capabilities", []),
                "system_info": get_local_system_info()
            },
            "timestamp": time.time()
        }
        await self.ws.send(json.dumps(registration))
        logger.info(f"Registered as '{self.device_name}' with core.")

    async def heartbeat(self):
        """Send periodic heartbeat to keep connection alive."""
        while True:
            await asyncio.sleep(10)
            if self.ws:
                try:
                    await self.ws.send(json.dumps({
                        "type": "heartbeat",
                        "source": self.device_name,
                        "timestamp": time.time()
                    }))
                except:
                    break

    async def message_handler(self):
        """Listen for incoming commands from the Core Server."""
        async for message in self.ws:
            try:
                payload = json.loads(message)
                logger.info(f"Received {payload.get('type')} from {payload.get('source')}")
                
                if payload.get("type") == "command":
                    await self.execute_command(payload)
                
            except json.JSONDecodeError:
                logger.warning(f"Received invalid JSON: {message}")

    async def execute_command(self, payload):
        """Execute a local tool based on the command payload."""
        command_data = payload.get("data", {})
        cmd_type = command_data.get("action")
        msg_id = payload.get("id")
        
        result = {"success": False, "data": None}
        
        try:
            if cmd_type == "get_system_info":
                result["data"] = get_local_system_info()
                result["success"] = True
            
            elif cmd_type == "take_screenshot":
                path = take_screenshot()
                result["data"] = {"path": path}
                result["success"] = True
                
            elif cmd_type == "open_app":
                open_local_app(command_data.get("app_name"))
                result["success"] = True
                
            elif cmd_type == "open_url":
                from agent.local_tools import open_local_url
                open_local_url(command_data.get("url"))
                result["success"] = True
                
            elif cmd_type == "play_sound":
                import winsound
                # Play a system beep or a specific frequency
                winsound.Beep(1000, 1000) # 1000Hz for 1 second
                result["success"] = True
            
            # Send result back to core
            response = {
                "type": "result",
                "source": self.device_name,
                "target": payload.get("source"),
                "id": msg_id,
                "data": result,
                "timestamp": time.time()
            }
            await self.ws.send(json.dumps(response))
            logger.info(f"Executed {cmd_type} and returned result.")
            
        except Exception as e:
            logger.error(f"Error executing command {cmd_type}: {e}")

if __name__ == "__main__":
    agent = OVIAgent()
    asyncio.run(agent.connect())
