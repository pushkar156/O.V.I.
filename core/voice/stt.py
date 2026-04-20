import os
import io
import torch
from faster_whisper import WhisperModel
from loguru import logger
from typing import Optional

class STTManager:
    """
    Manages Speech-to-Text transcription using faster-whisper.
    """
    def __init__(self, model_size: str = "base", device: str = "auto"):
        # Auto-detect CUDA for GPU acceleration
        if device == "auto":
            self.device = "cuda" if torch.cuda.is_available() else "cpu"
        else:
            self.device = device
            
        self.compute_type = "float16" if self.device == "cuda" else "int8"
        
        logger.info(f"Initializing STT Engine ({model_size}) on {self.device}...")
        self.model = WhisperModel(model_size, device=self.device, compute_type=self.compute_type)
        logger.info("STT Engine Ready.")

    async def transcribe(self, audio_data: bytes) -> str:
        """
        Transcribes raw audio bytes into text.
        Expected audio: 16-bit PCM, 16kHz mono.
        """
        try:
            # Convert bytes to file-like object
            audio_file = io.BytesIO(audio_data)
            
            # Transcribe with VAD (Voice Activity Detection) to skip silence
            segments, info = self.model.transcribe(
                audio_file, 
                beam_size=5, 
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=500)
            )
            
            # Combine segments into a single string
            text = " ".join([segment.text for segment in segments]).strip()
            return text
            
        except Exception as e:
            logger.error(f"STT Transcription failed: {e}")
            return ""

# Default instance (lazy loaded on first use if needed)
stt_manager: Optional[STTManager] = None

def get_stt_manager() -> STTManager:
    global stt_manager
    if stt_manager is None:
        stt_manager = STTManager()
    return stt_manager
