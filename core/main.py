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
from core.memory.database import init_db, close_db
import asyncio

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup logic
    logger.info("Initializing O.V.I. Core Systems...")
    
    try:
        # 1. Initialize Database
        logger.debug("Connecting to SQLite...")
        await init_db()
        
        # 2. Check Ollama Health
        logger.debug("Verifying Ollama link...")
        ollama_healthy = await ollama_client.check_health()
        if not ollama_healthy:
            logger.warning("Ollama connection failed or model not found. Some features may be limited.")
        else:
            logger.info(f"Ollama connected. Model: {settings.DEFAULT_MODEL}")
        
        # 3. Register Tools
        logger.debug("Registering core tools...")
        for tool in ALL_TOOLS:
            tool_router.register_tool(tool.name, tool.execute)
        
        # 4. Start Telemetry Heartbeat
        async def telemetry_heartbeat():
            while True:
                try:
                    await asyncio.sleep(2)
                    await websocket.manager.broadcast_stats()
                except Exception as e:
                    logger.error(f"Heartbeat error: {e}")
                    await asyncio.sleep(5)
                    
        asyncio.create_task(telemetry_heartbeat())

        # 5. Start Wake Word Listener
        from core.voice.wake_word import wake_listener
        from core.api.websocket import manager
        from core.voice.tts import tts_provider

        async def handle_wake():
            logger.info("Handling Wake Word trigger...")
            # 1. Notify Dashboard for visual feedback
            await manager.broadcast({
                "type": "wake",
                "status": "active",
                "timestamp": time.time()
            })
            
            # 2. Voice Response
            await tts_provider.speak("I am here. How can I assist?")
            
            logger.success("O.V.I. is now listening.")

        asyncio.create_task(wake_listener.start(on_wake=handle_wake))
        
        logger.success("O.V.I. Core Systems Online and Ready.")
        yield
    except Exception as e:
        logger.critical(f"FATAL: Core systems failed to initialize: {e}")
        # We don't raise here to allow FastAPI to at least try and show the error
        yield
    finally:
        # Shutdown logic
        logger.info("Shutting down O.V.I. Core Systems...")
        try:
            await close_db()
            logger.success("Clean Shutdown Complete. Data persisted safely.")
        except Exception as e:
            logger.error(f"Error during shutdown: {e}")

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
