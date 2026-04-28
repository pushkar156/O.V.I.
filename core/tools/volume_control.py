from ctypes import cast, POINTER
from comtypes import CLSCTX_ALL
from pycaw.pycaw import AudioUtilities, IAudioEndpointVolume
from loguru import logger

def set_system_volume(level: int):
    """
    Sets the system volume to a specific level (0-100).
    """
    try:
        devices = AudioUtilities.GetSpeakers()
        interface = devices.Activate(
            IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        volume = cast(interface, POINTER(IAudioEndpointVolume))
        
        # level is 0 to 100, set_master_volume_level_scalar expects 0.0 to 1.0
        volume.SetMasterVolumeLevelScalar(level / 100.0, None)
        logger.info(f"System volume set to {level}%")
    except Exception as e:
        logger.error(f"Failed to set system volume: {e}")

def get_system_volume() -> int:
    """
    Returns the current system volume level (0-100).
    """
    try:
        devices = AudioUtilities.GetSpeakers()
        interface = devices.Activate(
            IAudioEndpointVolume._iid_, CLSCTX_ALL, None)
        volume = cast(interface, POINTER(IAudioEndpointVolume))
        current_volume = volume.GetMasterVolumeLevelScalar()
        return int(current_volume * 100)
    except Exception as e:
        logger.error(f"Failed to get system volume: {e}")
        return 0
