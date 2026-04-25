import pyautogui
import base64
from io import BytesIO
from PIL import Image
from loguru import logger
from typing import Dict, Any
import os

from core.llm.ollama_client import ollama_client

class ScreenVisionTool:
    name = "analyze_screen_vision"
    description = "Captures the current screen and uses a vision model to describe what is happening."
    
    def __init__(self, vision_model: str = "llama3.2-vision:11b"):
        self.vision_model = vision_model

    def get_llm_definition(self):
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "focus": {"type": "string", "description": "Specific thing to look for on screen (optional)"}
                }
            }
        }

    async def execute(self, args: Dict[str, Any]) -> str:
        try:
            # 1. Capture Screenshot
            screenshot = pyautogui.screenshot()
            
            # 2. Resize for faster processing (Vision models don't need 4K)
            screenshot.thumbnail((1280, 720))
            
            # 3. Encode to Base64
            buffered = BytesIO()
            screenshot.save(buffered, format="JPEG", quality=70)
            img_str = base64.b64encode(buffered.getvalue()).decode()
            
            # 4. Prepare Vision Prompt
            focus = args.get("focus", "everything")
            prompt = f"Describe what is happening on this computer screen. Focus on {focus}."
            
            # 5. Call Ollama with Vision Support
            # Note: We use the dedicated vision model here
            logger.info(f"Using vision model '{self.vision_model}' to analyze screen...")
            
            response = await ollama_client.client.generate(
                model=self.vision_model,
                prompt=prompt,
                images=[img_str]
            )
            
            return response['response']
            
        except Exception as e:
            logger.error(f"Screen vision failed: {e}")
            return f"I tried to look at your screen but encountered an error: {e}. (Make sure you have pulled a vision model like 'llama3.2-vision')"

# Instance for registry
screen_vision_tool = ScreenVisionTool()
