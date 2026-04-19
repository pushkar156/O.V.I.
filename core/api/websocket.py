from fastapi import APIRouter, WebSocket

router = APIRouter(prefix="/ws", tags=["WebSocket"])

@router.websocket("")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    await websocket.send_json({"message": "WebSocket connected (Stub)"})
    await websocket.close()
