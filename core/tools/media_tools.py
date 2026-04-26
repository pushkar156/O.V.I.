import keyboard
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from loguru import logger
from typing import Dict, Any

class BaseMediaTool:
    def __init__(self):
        self._volume_interface = None

    def _get_volume_interface(self):
        if self._volume_interface:
            return self._volume_interface
        try:
            devices = AudioUtilities.GetSpeakers()
            interface = devices.Activate(IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
            self._volume_interface = cast(interface, POINTER(IAudioEndpointVolume))
            return self._volume_interface
        except Exception as e:
            logger.error(f"Failed to initialize audio interface: {e}")
            return None

class SetVolumeTool(BaseMediaTool):
    name = "set_system_volume"
    description = "Sets the system volume to a specific percentage (0-100)."
    
    def get_llm_definition(self):
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "level": {"type": "integer", "description": "Volume level (0-100)"}
                },
                "required": ["level"]
            }
        }
    
    def execute(self, **kwargs) -> str:
        volume = self._get_volume_interface()
        if not volume: return "Audio interface unavailable."
        try:
            level = kwargs.get("level", 50)
            volume.SetMasterVolumeLevelScalar(level / 100.0, None)
            return f"System volume set to {level}%."
        except Exception as e:
            return f"Error: {e}"

class ToggleMuteTool(BaseMediaTool):
    name = "toggle_system_mute"
    description = "Toggles the system mute state."
    
    def get_llm_definition(self):
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {"type": "object", "properties": {}}
        }
    
    def execute(self, **kwargs) -> str:
        volume = self._get_volume_interface()
        if not volume: return "Audio interface unavailable."
        try:
            is_muted = volume.GetMute()
            volume.SetMute(not is_muted, None)
            return f"System {'muted' if not is_muted else 'unmuted'}."
        except Exception as e:
            return f"Error: {e}"

class MediaPlaybackTool:
    name = "control_media_playback"
    description = "Controls system media playback (play_pause, next, previous)."
    
    def get_llm_definition(self):
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "action": {
                        "type": "string", 
                        "enum": ["play_pause", "next", "previous"]
                    }
                },
                "required": ["action"]
            }
        }
    
    def execute(self, **kwargs) -> str:
        try:
            action = kwargs.get("action", "play_pause")
            if action == "play_pause": keyboard.send("play/pause media")
            elif action == "next": keyboard.send("next track")
            elif action == "previous": keyboard.send("previous track")
            return f"Media action '{action}' executed."
        except Exception as e:
            return f"Error: {e}"

MEDIA_TOOLS = [SetVolumeTool(), ToggleMuteTool(), MediaPlaybackTool()]
