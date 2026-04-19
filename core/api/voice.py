from fastapi import APIRouter

router = APIRouter(prefix="/api/voice", tags=["Voice"])

@router.post("")
async def voice_endpoint():
    return {"message": "Voice endpoint not implemented yet (Phase 2)"}
