import edge_tts
import asyncio
import os
import pygame
from loguru import logger

class TTSProvider:
    def __init__(self, voice: str = "en-GB-SoniaNeural"):
        self.voice = voice
        self.output_dir = "data/audio"
        os.makedirs(self.output_dir, exist_ok=True)
        
        # Initialize pygame mixer for audio playback
        try:
            pygame.mixer.init()
        except Exception as e:
            logger.error(f"Failed to initialize pygame mixer: {e}")

    async def speak(self, text: str):
        """
        Converts text to speech and plays it.
        """
        logger.info(f"O.V.I. Speaking: {text}")
        output_file = os.path.join(self.output_dir, "response.mp3")
        
        try:
            # 1. Generate Speech
            communicate = edge_tts.Communicate(text, self.voice)
            await communicate.save(output_file)
            
            # 2. Play Audio
            if os.path.exists(output_file):
                pygame.mixer.music.load(output_file)
                pygame.mixer.music.play()
                while pygame.mixer.music.get_busy():
                    await asyncio.sleep(0.1)
            
        except Exception as e:
            logger.error(f"TTS Error: {e}")

# Singleton instance
tts_provider = TTSProvider()

if __name__ == "__main__":
    async def test():
        await tts_provider.speak("Neural Link Online. Systems check complete.")
    asyncio.run(test())
