import pystray
from PIL import Image
import threading
import sys
import os
import uvicorn
from loguru import logger
import webbrowser

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
            pystray.MenuItem("Settings", self.on_settings),
            pystray.Menu.Separator(),
            pystray.MenuItem("Exit", self.on_exit)
        )

    def on_dashboard(self):
        logger.info("Opening O.V.I. Dashboard...")
        webbrowser.open(f"http://localhost:3000") # Default dashboard port

    def on_settings(self):
        logger.info("Opening Settings...")
        # Placeholder for settings UI
        pass

    def on_exit(self, icon, item):
        logger.info("Shutting down O.V.I. Desktop Layer...")
        self.is_running = False
        icon.stop()
        # In a real app, we'd signal the FastAPI server to stop
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
