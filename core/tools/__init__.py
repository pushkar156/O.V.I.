from core.tools.system_tools import SystemInfoTool, TimeTool
from core.tools.app_control import OpenAppTool, CloseAppTool
from core.tools.file_tools import ListDirectoryTool, ReadFileTool, SearchFilesTool
from core.tools.browser_tools import OpenURLTool, WebSearchTool
from core.tools.clipboard_tools import ReadClipboardTool, WriteClipboardTool
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
    
    # Clipboard
    ReadClipboardTool(),
    WriteClipboardTool(),
    
    # Cross-Device (Multi-Agent Mesh)
    *CROSS_DEVICE_TOOLS
]

def get_tool_definitions():
    """Returns a list of tool definitions for the LLM prompt."""
    return [tool.get_llm_definition() for tool in ALL_TOOLS]
