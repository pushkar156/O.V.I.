import os
import io
import torch
import asyncio
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
        Transcribes raw audio bytes into text securely via thread offloading.
        """
        try:
            return await asyncio.to_thread(self._sync_transcribe, audio_data)
        except Exception as e:
            logger.error(f"STT Transcription failed: {e}")
            return ""

    def _sync_transcribe(self, audio_data: bytes) -> str:
        """Synchronous helper for thread-based transcription."""
        try:
            from pydub import AudioSegment
            from core.config import settings
            import os

            # Tell pydub exactly where ffmpeg is
            if settings.FFMPEG_PATH:
                AudioSegment.converter = os.path.join(settings.FFMPEG_PATH, "ffmpeg.exe")
                AudioSegment.ffprobe = os.path.join(settings.FFMPEG_PATH, "ffprobe.exe")

            # 1. Load audio from bytes (supports webm, ogg, wav, etc.)
            audio = AudioSegment.from_file(io.BytesIO(audio_data))
            
            # 2. Normalize to 16kHz Mono (Whisper's favorite)
            audio = audio.set_frame_rate(16000).set_channels(1)
            
            # 3. Export to wav buffer
            buffer = io.BytesIO()
            audio.export(buffer, format="wav")
            buffer.seek(0)
            
            # 4. Transcribe
            segments, info = self.model.transcribe(
                buffer, 
                beam_size=5, 
                vad_filter=True,
                vad_parameters=dict(min_silence_duration_ms=500)
            )
            return " ".join([segment.text for segment in segments]).strip()
        except Exception as e:
            logger.error(f"Audio conversion/transcription failed: {e}")
            # Fallback to direct transcription if pydub fails
            audio_file = io.BytesIO(audio_data)
            segments, info = self.model.transcribe(audio_file, beam_size=5)
            return " ".join([segment.text for segment in segments]).strip()

# Default instance (lazy loaded on first use if needed)
stt_manager: Optional[STTManager] = None

def get_stt_manager() -> STTManager:
    global stt_manager
    if stt_manager is None:
        stt_manager = STTManager()
    return stt_manager
