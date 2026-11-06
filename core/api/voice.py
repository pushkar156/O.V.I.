from fastapi import APIRouter, UploadFile, File, Response, HTTPException
from fastapi.responses import StreamingResponse
import io
from loguru import logger
import uuid

from core.voice.stt import get_stt_manager
from core.voice.tts import tts_manager
from core.api.chat import chat_endpoint, ChatRequest

router = APIRouter(prefix="/api/voice", tags=["Voice"])

# Simple in-memory cache for demo purposes
# In a production app, we would use a temporary file or Redis
audio_cache = {}

@router.post("")
async def voice_command(audio: UploadFile = File(...)):
    """
    Receives an audio file, transcribes it, runs the chat logic,
    and prepares a TTS response.
    """
    logger.info(f"Received voice command audio: {audio.filename}")
    
    try:
        # 1. Transcribe the audio
        audio_bytes = await audio.read()
        logger.debug(f"Received audio data: {len(audio_bytes)} bytes, content_type: {audio.content_type}")
        
        if len(audio_bytes) < 1000:
            logger.warning("Received very small audio file. Recording might have failed.")
            return {"error": "Audio too short", "response": "I'm sorry, I couldn't hear anything. Please try again."}

        stt = get_stt_manager()
        text_command = await stt.transcribe(audio_bytes)
            
        logger.info(f"Transcribed voice command: {text_command}")
        
        # 2. Forward to Chat Engine
        # We reuse the existing chat logic to handle tool execution
        chat_request = ChatRequest(message=text_command)
        chat_resp = await chat_endpoint(chat_request)
        
        # 3. Generate TTS for the response
        response_audio = await tts_manager.synthesize(chat_resp.response)
        
        # 4. Cache audio for retrieval
        audio_id = str(uuid.uuid4())
        audio_cache[audio_id] = response_audio
        
        return {
            "transcription": text_command,
            "response": chat_resp.response,
            "tools_used": chat_resp.tools_used,
            "audio_url": f"/api/voice/tts/{audio_id}"
        }
        
    except Exception as e:
        logger.error(f"Voice pipeline error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tts/{audio_id}")
async def get_tts_audio(audio_id: str):
    """
    Retrieves the synthesized audio MP3 from the cache.
    """
    audio_data = audio_cache.get(audio_id)
    if not audio_data:
        raise HTTPException(status_code=404, detail="Audio response not found")
        
    return Response(content=audio_data, media_type="audio/mpeg")
