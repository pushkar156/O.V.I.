from datetime import datetime
from typing import List, Dict, Any
import json

class PromptBuilder:
    """
    Constructs dynamic system prompts based on persona, context, and available tools.
    """
    def __init__(self):
        self.persona_name = "O.V.I."
        self.persona_full = "Omnipresent Voice Intelligence"
        
    def build_system_prompt(self, tools: List[Dict[str, Any]] = None, context: Dict[str, Any] = None) -> str:
        """
        Assembles the full system prompt.
        """
        prompt = [
            self._get_persona_section(),
            self._get_tools_section(tools or []),
            self._get_context_section(context or {}),
            self._get_output_formatting_section()
        ]
        return "\n\n".join(prompt)

    def _get_persona_section(self) -> str:
        return (
            f"You are {self.persona_name} ({self.persona_full}), a highly advanced, local AI assistant. "
            "You are the BRAIN of a multi-device mesh. You control the local machine AND any connected AGENTS. "
            "If a user mentions a device that appears in your 'Connected Agents' list, you MUST use the corresponding remote/cross-device tools. "
            "Your tone is professional, efficient, and helpful, with a subtle hint of wit."
        )

    def _get_tools_section(self, tools: List[Dict[str, Any]]) -> str:
        if not tools:
            return "Currently, no external tools are registered. You can only respond via text."
        
        tools_str = json.dumps(tools, indent=2)
        return (
            "### AVAILABLE TOOLS\n"
            "You have access to the following tools to interact with the system:\n"
            f"{tools_str}\n\n"
            "To use a tool, you must output a JSON object in your response (more details below)."
        )

    def _get_context_section(self, context: Dict[str, Any]) -> str:
        now = datetime.now()
        current_time = now.strftime("%Y-%m-%d %H:%M:%S")
        
        device_info = context.get("devices", "Primary Desktop")
        agents = context.get("agents", [])
        agent_names = " | ".join([f"[{a['name'].upper()}]" for a in agents]) if agents else "NONE"
        
        return (
            "### NETWORK STATUS\n"
            f"- Current Time: {current_time}\n"
            f"- Primary Device: {device_info}\n"
            f"- CONNECTED AGENTS: {agent_names}\n"
            f"- (Use 'capture_remote_screen', 'ping_device', etc. for these agents)\n\n"
            f"### USER PREFERENCES\n"
            f"- {context.get('preferences', 'None set.')}"
        )

    def _get_output_formatting_section(self) -> str:
        return (
            "### OUTPUT FORMATTING & EXAMPLES\n"
            "You MUST use tools for mesh operations. Here are examples:\n\n"
            "User: 'Ping my laptop-agent'\n"
            "Assistant: I'll ping that device for you now. ```json { \"tool\": \"ping_device\", \"args\": { \"device_name\": \"laptop-agent\" } } ```\n\n"
            "User: 'What is on my laptop screen?'\n"
            "Assistant: Capturing the remote screen now. ```json { \"tool\": \"capture_remote_screen\", \"args\": { \"device_name\": \"laptop-agent\" } } ```\n\n"
            "User: 'Check laptop stats'\n"
            "Assistant: Checking remote vitals. ```json { \"tool\": \"get_remote_status\", \"args\": { \"device_name\": \"laptop-agent\" } } ```\n\n"
            "IMPORTANT: Always use the exact name from the CONNECTED AGENTS list. Never guess file paths like '/sys/class/net' or '~/.config'."
        )

# Global instance
prompt_builder = PromptBuilder()
