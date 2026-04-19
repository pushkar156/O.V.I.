from fastapi import APIRouter

router = APIRouter(prefix="/api/memory", tags=["Memory"])

@router.get("")
async def get_memory():
    return {"message": "Memory store not implemented yet (Phase 5)"}
