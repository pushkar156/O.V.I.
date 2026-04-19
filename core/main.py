import time
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from core.config import settings
from core.api import chat, voice, websocket, devices, memory
from core.llm.ollama_client import ollama_client
from core.llm.tool_router import tool_router
from core.tools import ALL_TOOLS
from core.memory.database import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Initializing O.V.I. Core Systems...")
    
    # 1. Initialize Database
    await init_db()
    
    # 2. Check Ollama Health
    ollama_healthy = await ollama_client.check_health()
    if not ollama_healthy:
        logger.error("Ollama connection failed or model not found. Check if Ollama is running.")
    else:
        logger.info(f"Ollama connected. Model: {settings.DEFAULT_MODEL}")
    
    # 2. Register Tools
    for tool in ALL_TOOLS:
        tool_router.register_tool(tool.name, tool.execute)
    
    # TODO: Initialize Memory Store
    
    logger.info("O.V.I. Core Systems Online.")
    yield
    # Shutdown logic
    logger.info("Shutting down O.V.I. Core Systems...")

app = FastAPI(
    title="O.V.I. Core Server",
    description="Omnipresent Voice Intelligence central hub",
    version="0.1.0",
    lifespan=lifespan
)

# Mount Routers
app.include_router(chat.router)
app.include_router(voice.router)
app.include_router(websocket.router)
app.include_router(devices.router)
app.include_router(memory.router)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local network access, we allow all for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
async def health_check():
    """Returns the health status of O.V.I. and its subsystems."""
    return {
        "status": "online",
        "timestamp": time.time(),
        "version": "0.1.0",
        "ollama": "pending",  # Will be updated in Phase 1.4
        "model": settings.DEFAULT_MODEL
    }

@app.get("/")
async def root():
    return {"message": "O.V.I. Core Server is running. Visit /health for status."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host=settings.SERVER_HOST, port=settings.SERVER_PORT)
