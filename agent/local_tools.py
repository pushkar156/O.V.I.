import psutil
import pyautogui
import os
import platform
import subprocess
from typing import Dict, Any

def get_local_system_info() -> Dict[str, Any]:
    """Retrieve system stats for the current agent device."""
    return {
        "cpu_percent": psutil.cpu_percent(),
        "memory_percent": psutil.virtual_memory().percent,
        "battery_percent": psutil.sensors_battery().percent if psutil.sensors_battery() else 100,
        "os": platform.system(),
        "hostname": platform.node(),
    }

def take_screenshot(save_path: str = "screenshot.png") -> str:
    """Capture a screenshot on the agent device."""
    screenshot = pyautogui.screenshot()
    screenshot.save(save_path)
    return os.path.abspath(save_path)

def open_local_app(app_name: str):
    """Launch an application on this specific device."""
    if platform.system() == "Windows":
        os.startfile(app_name)
    elif platform.system() == "Darwin":  # macOS
        subprocess.Popen(["open", "-a", app_name])
    else:  # Linux
        subprocess.Popen([app_name])

def get_recent_files(limit: int = 5) -> list:
    """List recently modified files in the user's home directory (simulated)."""
    home = os.path.expanduser("~")
    # This is a very basic implementation for demonstration
    return [f for f in os.listdir(home) if os.path.isfile(os.path.join(home, f))][:limit]
