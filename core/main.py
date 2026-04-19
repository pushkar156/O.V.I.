import time
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from core.config import settings
from core.api import chat, voice, websocket, devices, memory

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Initializing O.V.I. Core Systems...")
    logger.info(f"Using Model: {settings.DEFAULT_MODEL}")
    logger.info(f"Ollama URL: {settings.OLLAMA_URL}")
    
    # TODO: Initialize Ollama Connection
    # TODO: Initialize Memory Store
    # TODO: Register Tools
    
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
