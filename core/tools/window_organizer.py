import pygetwindow as gw
import pyautogui
from loguru import logger
from typing import Dict, Any, List

def organize_windows(layout_type: str = "coding"):
    """
    Organizes open windows based on a predefined layout.
    """
    logger.info(f"Organizing windows for layout: {layout_type}")
    
    # Get screen size
    width, height = pyautogui.size()
    
    if layout_type == "coding":
        # VS Code on the left half, Browser on the right half
        vscode_windows = [w for w in gw.getAllWindows() if "Visual Studio Code" in w.title]
        browser_windows = [w for w in gw.getAllWindows() if "Chrome" in w.title or "Edge" in w.title or "Firefox" in w.title]
        
        if vscode_windows:
            win = vscode_windows[0]
            win.restore()
            win.moveTo(0, 0)
            win.resizeTo(width // 2, height)
            win.activate()
            
        if browser_windows:
            win = browser_windows[0]
            win.restore()
            win.moveTo(width // 2, 0)
            win.resizeTo(width // 2, height)
            win.activate()

    elif layout_type == "center":
        # Center the active window
        win = gw.getActiveWindow()
        if win:
            win.restore()
            win_w, win_h = win.width, win.height
            win.moveTo((width - win_w) // 2, (height - win_h) // 2)

    elif layout_type == "minimize_all":
        # Minimize everything except the dashboard
        for win in gw.getAllWindows():
            if "O.V.I." not in win.title and win.title != "":
                try:
                    win.minimize()
                except:
                    pass

def get_open_windows() -> List[str]:
    return [w.title for w in gw.getAllWindows() if w.title != ""]
