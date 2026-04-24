from typing import Dict, List, Any, Optional
from pydantic import BaseModel
from fastapi import WebSocket
from loguru import logger
import time

class AgentInfo(BaseModel):
    name: str
    capabilities: List[str]
    last_seen: float
    system_info: Dict[str, Any] = {}

    class Config:
        arbitrary_types_allowed = True

class AgentRegistry:
    def __init__(self):
        self.agents: Dict[str, AgentInfo] = {}
        self.connections: Dict[str, WebSocket] = {}

    def register(self, name: str, websocket: WebSocket, capabilities: List[str], system_info: Dict[str, Any] = {}):
        """Register or update an agent."""
        self.agents[name] = AgentInfo(
            name=name,
            capabilities=capabilities,
            last_seen=time.time(),
            system_info=system_info
        )
        self.connections[name] = websocket
        logger.info(f"Agent '{name}' registered with capabilities: {capabilities}")

    def unregister(self, name: str):
        """Remove an agent from the registry."""
        if name in self.agents:
            del self.agents[name]
        if name in self.connections:
            del self.connections[name]
        logger.info(f"Agent '{name}' unregistered.")

    def update_heartbeat(self, name: str):
        """Update the last seen timestamp for an agent."""
        if name in self.agents:
            self.agents[name].last_seen = time.time()

    def get_online_agents(self) -> List[Dict[str, Any]]:
        """Return a list of all currently online agents."""
        # Clean up stale agents (older than 30 seconds)
        now = time.time()
        stale = [name for name, info in self.agents.items() if now - info.last_seen > 30]
        for name in stale:
            self.unregister(name)
            
        return [info.dict() for info in self.agents.values()]

    async def send_command(self, target_name: str, action: str, data: Dict[str, Any] = {}) -> bool:
        """Route a command to a specific agent."""
        if target_name not in self.connections:
            logger.warning(f"Attempted to send command to offline agent: {target_name}")
            return False
            
        import uuid
        command = {
            "type": "command",
            "source": "core",
            "target": target_name,
            "id": str(uuid.uuid4()),
            "data": {
                "action": action,
                **data
            },
            "timestamp": time.time()
        }
        
        try:
            await self.connections[target_name].send_json(command)
            return True
        except Exception as e:
            logger.error(f"Failed to send command to agent {target_name}: {e}")
            self.unregister(target_name)
            return False

# Global instance
agent_registry = AgentRegistry()
