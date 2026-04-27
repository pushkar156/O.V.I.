import pystray
from PIL import Image
import threading
import sys
import os
import uvicorn
from loguru import logger
import webbrowser
import winreg

# Add parent directory to path to allow imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from core.main import app
from core.config import settings

class OVITrayApp:
    def __init__(self):
        self.icon = None
        self.server_thread = None
        self.is_running = True

    def create_menu(self):
        return pystray.Menu(
            pystray.MenuItem("Show Dashboard", self.on_dashboard),
            pystray.MenuItem("Run Routine", pystray.Menu(
                pystray.MenuItem("Workspace Setup", lambda: self.run_routine("workspace_setup")),
                pystray.MenuItem("Clean Desktop", lambda: self.run_routine("desktop_cleanup")),
            )),
            pystray.Menu.Separator(),
            pystray.MenuItem("Launch on Startup", self.on_toggle_startup, checked=lambda item: self.is_startup_enabled()),
            pystray.MenuItem("Settings", self.on_settings),
            pystray.Menu.Separator(),
            pystray.MenuItem("Exit", self.on_exit)
        )

    def on_dashboard(self):
        logger.info("Opening O.V.I. Dashboard...")
        webbrowser.open(f"http://localhost:3000")

    def run_routine(self, routine_name):
        logger.info(f"Triggering routine: {routine_name}")
        # In a real implementation, we'd call the core API or RoutineManager directly
        # For now, it's a bridge to the persona module
        pass

    def is_startup_enabled(self):
        try:
            key = winreg.OpenKey(winreg.HKEY_CURRENT_USER, r"Software\Microsoft\Windows\CurrentVersion\Run", 0, winreg.KEY_READ)
            winreg.QueryValueEx(key, "OVI_Assistant")
            winreg.CloseKey(key)
            return True
        except:
            return False

    def on_toggle_startup(self, icon, item):
        import subprocess
        enable = not self.is_startup_enabled()
        cmd = ["python", "scripts/manage_startup.py", "--enable" if enable else "--disable"]
        subprocess.run(cmd, capture_output=True)
        icon.update_menu()

    def on_settings(self):
        logger.info("Opening Settings...")
        pass

    def on_exit(self, icon, item):
        logger.info("Shutting down O.V.I. Desktop Layer...")
        self.is_running = False
        icon.stop()
        os._exit(0) 

    def run_server(self):
        logger.info("Starting O.V.I. Core Server in background...")
        uvicorn.run(app, host=settings.SERVER_HOST, port=settings.SERVER_PORT, log_level="info")

    def run(self):
        # 1. Start Server in Thread
        self.server_thread = threading.Thread(target=self.run_server, daemon=True)
        self.server_thread.start()

        # 2. Create Tray Icon
        # Attempt to load the O.V.I. logo
        logo_path = os.path.join(os.path.dirname(__file__), "..", "assets", "logo.png")
        if os.path.exists(logo_path):
            image = Image.open(logo_path)
        else:
            # Fallback to a warm amber square (matching the new theme)
            image = Image.new('RGB', (64, 64), color=(217, 119, 6)) 
        
        self.icon = pystray.Icon(
            "O.V.I.",
            image,
            "O.V.I. (Active)",
            menu=self.create_menu()
        )

        logger.success("O.V.I. System Tray Icon initialized.")
        self.icon.run()

if __name__ == "__main__":
    app_tray = OVITrayApp()
    app_tray.run()
