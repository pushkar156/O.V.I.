from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional, Dict, Any
from core.memory.long_term import long_term_memory

router = APIRouter(prefix="/api/memory", tags=["Memory"])

class MemoryRequest(BaseModel):
    text: str
    category: Optional[str] = "fact"
    metadata: Optional[Dict[str, Any]] = {}

@router.get("")
async def get_memory_stats():
    """Get overview of stored memories."""
    # This is a placeholder for future stats
    return {
        "status": "active",
        "engine": "chromadb",
        "collections": ["memories", "knowledge"]
    }

@router.post("")
async def store_memory_endpoint(request: MemoryRequest):
    """Manually imprint a fact or preference into O.V.I.'s long-term memory."""
    await long_term_memory.store_memory(
        text=request.text, 
        category=request.category, 
        metadata=request.metadata
    )
    return {"status": "success", "message": "Memory imprinted successfully."}

@router.get("/search")
async def search_memory(query: str, limit: int = 5):
    """Search for relevant memories."""
    results = await long_term_memory.recall(query, limit=limit)
    return {"results": results}
