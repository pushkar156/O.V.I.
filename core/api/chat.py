from fastapi import APIRouter

router = APIRouter(prefix="/api/chat", tags=["Chat"])

@router.post("")
async def chat_endpoint():
    return {"message": "Chat endpoint not implemented yet (Phase 1.4)"}
