from core.tools.system_tools import SystemInfoTool, TimeTool
from core.tools.app_control import OpenAppTool, CloseAppTool
from core.tools.file_tools import ListDirectoryTool, ReadFileTool, SearchFilesTool
from core.tools.browser_tools import OpenURLTool, WebSearchTool
from core.tools.clipboard_tools import ReadClipboardTool, WriteClipboardTool
from core.tools.media_tools import MEDIA_TOOLS
from core.tools.screen_tools import ScreenVisionTool
from core.tools.code_tools import CODE_TOOLS
from core.tools.web_search import advanced_search_tool
from core.tools.cross_device import CROSS_DEVICE_TOOLS

# Instantiate all tools
ALL_TOOLS = [
    # System
    SystemInfoTool(),
    TimeTool(),
    
    # App Control
    OpenAppTool(),
    CloseAppTool(),
    
    # Files
    ListDirectoryTool(),
    ReadFileTool(),
    SearchFilesTool(),
    
    # Browser
    OpenURLTool(),
    WebSearchTool(),
    advanced_search_tool,
    
    # Clipboard
    ReadClipboardTool(),
    WriteClipboardTool(),
    
    # Media
    *MEDIA_TOOLS,
    
    # Vision
    ScreenVisionTool(),
    
    # Developer
    *CODE_TOOLS,
    
    # Cross-Device (Multi-Agent Mesh)
    *CROSS_DEVICE_TOOLS
]

def get_tool_definitions():
    """Returns a list of tool definitions for the LLM prompt."""
    return [tool.get_llm_definition() for tool in ALL_TOOLS]
