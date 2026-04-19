import ollama
from loguru import logger
from typing import AsyncGenerator, Dict, List, Optional, Any

from core.config import settings

class OllamaClient:
    """
    Async wrapper for Ollama API providing chat, generation, and health monitoring.
    """
    def __init__(self):
        self.client = ollama.AsyncClient(host=settings.OLLAMA_URL)
        self.model = settings.DEFAULT_MODEL

    async def check_health(self) -> bool:
        """Verify Ollama is reachable and the model is loaded/available."""
        try:
            # Check if we can connect
            models_info = await self.client.list()
            available_models = [m['name'] for m in models_info.get('models', [])]
            
            if self.model not in available_models and f"{self.model}:latest" not in available_models:
                logger.warning(f"Model '{self.model}' not found in Ollama. Available: {available_models}")
                return False
                
            return True
        except Exception as e:
            logger.error(f"Ollama health check failed: {e}")
            return False

    async def list_models(self) -> List[str]:
        """Returns a list of available models in the local Ollama instance."""
        try:
            response = await self.client.list()
            return [m['name'] for m in response.get('models', [])]
        except Exception as e:
            logger.error(f"Failed to list models: {e}")
            return []

    async def generate(self, prompt: str, system: Optional[str] = None) -> str:
        """Single prompt → response generation."""
        try:
            response = await self.client.generate(
                model=self.model,
                prompt=prompt,
                system=system
            )
            return response['response']
        except Exception as e:
            logger.error(f"Ollama generation failed: {e}")
            return f"Error: {e}"

    async def chat(self, messages: List[Dict[str, str]]) -> Dict[str, Any]:
        """Multi-turn conversation with message history."""
        try:
            response = await self.client.chat(
                model=self.model,
                messages=messages,
            )
            return response['message']
        except Exception as e:
            logger.error(f"Ollama chat failed: {e}")
            return {"role": "assistant", "content": f"I encountered an error: {e}"}

    async def stream_chat(self, messages: List[Dict[str, str]]) -> AsyncGenerator[str, None]:
        """Streaming response generator for real-time UI interaction."""
        try:
            stream = await self.client.chat(
                model=self.model,
                messages=messages,
                stream=True,
            )
            async for chunk in stream:
                if 'message' in chunk and 'content' in chunk['message']:
                    yield chunk['message']['content']
        except Exception as e:
            logger.error(f"Ollama streaming chat failed: {e}")
            yield f"\n[Error: {e}]"

# Global instance
ollama_client = OllamaClient()
