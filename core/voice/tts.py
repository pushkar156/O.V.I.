import edge_tts
import io
from loguru import logger
from typing import Optional

class TTSManager:
    """
    Manages Text-to-Speech synthesis using edge-tts.
    Provides high-quality, natural-sounding voices without needing local heavy models.
    """
    def __init__(self, default_voice: str = "en-US-GuyNeural"):
        self.default_voice = default_voice
        logger.info(f"TTS Engine Ready (Default Voice: {self.default_voice})")

    async def synthesize(self, text: str, voice: Optional[str] = None) -> bytes:
        """
        Converts text input into MP3 audio bytes.
        """
        if not text:
            return b""
            
        selected_voice = voice or self.default_voice
        
        try:
            communicate = edge_tts.Communicate(text, selected_voice)
            
            # Collect audio chunks into a buffer
            audio_buffer = io.BytesIO()
            async for chunk in communicate.stream():
                if chunk["type"] == "audio":
                    audio_buffer.write(chunk["data"])
            
            return audio_buffer.getvalue()
            
        except Exception as e:
            logger.error(f"TTS Synthesis failed: {e}")
            return b""

    async def list_voices(self):
        """Returns a list of available voices from edge-tts."""
        return await edge_tts.list_voices()

# Default instance
tts_manager = TTSManager()
