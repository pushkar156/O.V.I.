from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
from loguru import logger
import json
import time

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
        """Fetches and broadcasts real-time system stats."""
        from core.api.devices import get_system_stats
        if not self.active_connections:
            return
            
        stats = await get_system_stats()
        await self.broadcast({"type": "stats", "payload": stats})

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
        logger.error(f"WebSocket error: {e}")
        manager.disconnect(websocket)
