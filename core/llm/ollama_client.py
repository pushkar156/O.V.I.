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
            # Get available models
            models_info = await self.client.list()
            
            # Extract names safely - works with both dicts and objects
            available_names = []
            if hasattr(models_info, 'models'):
                # It's an object with a models attribute
                for m in models_info.models:
                    available_names.append(getattr(m, 'model', getattr(m, 'name', '')))
            elif isinstance(models_info, dict):
                # It's a dictionary
                for m in models_info.get('models', []):
                    if isinstance(m, dict):
                        available_names.append(m.get('model', m.get('name', '')))
                    else:
                        available_names.append(getattr(m, 'model', getattr(m, 'name', '')))
            
            logger.info(f"Available models: {available_names}")
            
            # Check for exact match or :latest tag
            if self.model in available_names or f"{self.model}:latest" in available_names:
                return True
                
            logger.warning(f"Model '{self.model}' not found. You may need to run 'ollama pull {self.model}'")
            return False
            
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

    async def get_embeddings(self, text: str, model: str = "nomic-embed-text") -> List[float]:
        """Convert text into a vector representation."""
        try:
            response = await self.client.embeddings(
                model=model,
                prompt=text
            )
            return response['embedding']
        except Exception as e:
            logger.error(f"Ollama embedding failed: {e}")
            return []

# Global instance
ollama_client = OllamaClient()
