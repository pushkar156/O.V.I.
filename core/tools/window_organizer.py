import pygetwindow as gw
import pyautogui
from loguru import logger
from typing import Dict, Any, List
from core.tools.base import BaseTool, ToolResult

def organize_windows(layout_type: str = "coding") -> str:
    """
    Organizes open windows based on a predefined layout.
    """
    logger.info(f"Organizing windows for layout: {layout_type}")
    
    # Get screen size
    width, height = pyautogui.size()
    
    if layout_type == "coding":
        # VS Code on the left half, Browser on the right half
        vscode_windows = [w for w in gw.getAllWindows() if "Visual Studio Code" in w.title]
        browser_windows = [w for w in gw.getAllWindows() if any(b in w.title for b in ["Chrome", "Edge", "Firefox"])]
        
        moved = []
        if vscode_windows:
            win = vscode_windows[0]
            win.restore()
            win.moveTo(0, 0)
            win.resizeTo(width // 2, height)
            win.activate()
            moved.append("VS Code")
            
        if browser_windows:
            win = browser_windows[0]
            win.restore()
            win.moveTo(width // 2, 0)
            win.resizeTo(width // 2, height)
            win.activate()
            moved.append("Browser")
            
        return f"Arranged windows for coding: {', '.join(moved) if moved else 'No matching coding windows found'}."

    elif layout_type == "center":
        # Center the active window
        win = gw.getActiveWindow()
        if win:
            win.restore()
            win_w, win_h = win.width, win.height
            win.moveTo((width - win_w) // 2, (height - win_h) // 2)
            return f"Centered window '{win.title}'."
        return "No active window found to center."

    elif layout_type == "minimize_all":
        # Minimize everything except O.V.I.
        count = 0
        for win in gw.getAllWindows():
            if "O.V.I." not in win.title and win.title != "":
                try:
                    win.minimize()
                    count += 1
                except:
                    pass
        return f"Minimized {count} background window(s)."
    
    return f"Unknown layout type: {layout_type}"

def get_open_windows() -> List[str]:
    return [w.title for w in gw.getAllWindows() if w.title != ""]

class WindowLayoutTool(BaseTool):
    @property
    def name(self) -> str:
        return "arrange_windows"

    @property
    def description(self) -> str:
        return "Organizes open desktop windows into layout presets ('coding', 'center', 'minimize_all') or lists open windows."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string", 
                    "enum": ["coding", "center", "minimize_all", "list"],
                    "description": "Layout preset to apply, or 'list' to get open window titles."
                }
            },
            "required": ["action"]
        }

    async def execute(self, action: str, **kwargs) -> ToolResult:
        try:
            if action == "list":
                windows = get_open_windows()
                return ToolResult(
                    success=True, 
                    data={"windows": windows[:15]}, 
                    message=f"Found {len(windows)} open windows."
                )
            
            msg = organize_windows(action)
            return ToolResult(success=True, message=msg)
        except Exception as e:
            logger.error(f"Window layout tool error: {e}")
            return ToolResult(success=False, message=str(e))

