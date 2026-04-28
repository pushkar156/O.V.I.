import numpy as np
import openwakeword
from openwakeword.model import Model
import sounddevice as sd
from loguru import logger
import asyncio
from typing import Callable, Optional

class WakeWordListener:
    """
    Background listener that triggers a callback when a wake word is detected.
    Uses openWakeWord for low-CPU, always-on detection.
    """
    def __init__(self, model_name: str = "hey_jarvis", sensitivity: float = 0.5):
        self.model_name = model_name
        self.sensitivity = sensitivity
        self.running = False
        self.on_wake_callback = None
        self.loop = None
        
        # Load the pre-trained model
        self.model = Model(wakeword_models=[self.model_name])
        logger.info(f"Wake Word Listener Initialized (Model: {self.model_name})")

    def _audio_callback(self, indata, frames, time, status):
        """Callback for sounddevice to process incoming audio chunks."""
        if status:
            logger.warning(f"Microphone Status Error: {status}")
            
        # Convert float32 to int16 PCM
        audio_int16 = (indata[:, 0] * 32767).astype(np.int16)
        
        # Get predictions
        prediction = self.model.predict(audio_int16)
        
        # Check if the confidence exceeds our sensitivity
        for model_name, confidence in prediction.items():
            if confidence >= self.sensitivity:
                logger.info(f"Wake word detected: {model_name} (Confidence: {confidence:.2f})")
                if self.on_wake_callback and self.loop:
                    # Trigger the callback in the main thread's event loop
                    self.loop.call_soon_threadsafe(
                        lambda: asyncio.create_task(self.on_wake_callback())
                    )

    async def start(self, on_wake: Callable):
        """Starts the background listening loop."""
        self.on_wake_callback = on_wake
        self.running = True
        self.loop = asyncio.get_running_loop()
        
        logger.info("Starting background wake word listening...")
        
        try:
            # Required format: 16000 Hz, mono
            # OpenWakeWord works best with chunks of 1280 samples (80ms)
            with sd.InputStream(samplerate=16000, channels=1, callback=self._audio_callback, blocksize=1280):
                while self.running:
                    await asyncio.sleep(0.1)
        except Exception as e:
            logger.error(f"Wake word listener failed: {e}")
            self.running = False

    def stop(self):
        """Stops the listening loop."""
        self.running = False
        logger.info("Wake word listener stopped.")

# Global instance
wake_listener = WakeWordListener()
