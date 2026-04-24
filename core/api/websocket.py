from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
from loguru import logger
import json
import time
from core.agents.agent_registry import agent_registry

router = APIRouter(prefix="/ws", tags=["WebSocket"])

class ConnectionManager:
    """Manages active WebSocket connections across different devices."""
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.device_map: Dict[str, WebSocket] = {}

    async def connect(self, websocket: WebSocket, device_id: str = "unknown"):
        await websocket.accept()
        self.active_connections.append(websocket)
        self.device_map[device_id] = websocket
        logger.info(f"Device '{device_id}' connected to WebSocket hub.")

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        # Clean up device map
        for device_id, ws in list(self.device_map.items()):
            if ws == websocket:
                del self.device_map[device_id]
                logger.info(f"Device '{device_id}' disconnected.")
                break

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                # Connection might be stale
                pass

    async def broadcast_stats(self):
        """Fetches and broadcasts real-time system stats (local + agents)."""
        from core.api.devices import get_system_stats
        if not self.active_connections:
            return
            
        local_stats = await get_system_stats()
        agents = agent_registry.get_online_agents()
        
        await self.broadcast({
            "type": "stats", 
            "payload": {
                "local": local_stats,
                "agents": agents
            }
        })

manager = ConnectionManager()

@router.websocket("/dashboard")
async def websocket_dashboard(websocket: WebSocket):
    device_id = "dashboard"
    await manager.connect(websocket, device_id)
    try:
        while True:
            # Wait for messages from the client
            data = await websocket.receive_text()
            try:
                payload = json.loads(data)
                logger.info(f"WS Message from {device_id}: {payload}")
                
                # Handle basic ping/pong for heartbeats
                if payload.get("type") == "ping":
                    await websocket.send_json({"type": "pong", "timestamp": time.time()})
                
                # Forward to chat logic or other handlers in future phases
                
            except json.JSONDecodeError:
                logger.warning(f"Received non-JSON data over WS: {data}")
                
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception as e:
        logger.error(f"WebSocket error in dashboard: {e}")
        manager.disconnect(websocket)

@router.websocket("/agent")
async def websocket_agent(websocket: WebSocket):
    """Endpoint for secondary device agents (laptops, etc.) to connect."""
    await websocket.accept()
    agent_name = "unknown"
    
    try:
        while True:
            data = await websocket.receive_text()
            payload = json.loads(data)
            msg_type = payload.get("type")
            
            if msg_type == "register":
                agent_name = payload.get("source", "unknown")
                agent_registry.register(
                    name=agent_name,
                    websocket=websocket,
                    capabilities=payload.get("data", {}).get("capabilities", []),
                    system_info=payload.get("data", {}).get("system_info", {})
                )
                await websocket.send_json({"type": "ack", "status": "registered"})
                
            elif msg_type == "heartbeat":
                agent_name = payload.get("source", "unknown")
                agent_registry.update_heartbeat(agent_name)
                
            elif msg_type == "result":
                # Handle command results (could be forwarded to dashboard or memory)
                logger.info(f"Received result from agent {agent_name}: {payload.get('data')}")
                # Broadcast result to dashboard so it can show success
                await manager.broadcast({"type": "agent_result", "payload": payload})
                
    except WebSocketDisconnect:
        agent_registry.unregister(agent_name)
    except Exception as e:
        logger.error(f"WebSocket error in agent {agent_name}: {e}")
        agent_registry.unregister(agent_name)
