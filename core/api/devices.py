from fastapi import APIRouter

router = APIRouter(prefix="/api/devices", tags=["Devices"])

@router.get("")
async def list_devices():
    return {"message": "Device registry not implemented yet (Phase 4)"}
