from datetime import datetime
from typing import List, Dict, Any
import json

from core.personality.persona import persona_manager

class PromptBuilder:
    """
    Constructs dynamic system prompts based on persona, context, and available tools.
    """
    def __init__(self):
        self.persona = persona_manager
        
    def build_system_prompt(self, tools: List[Dict[str, Any]] = None, context: Dict[str, Any] = None) -> str:
        """
        Assembles the full system prompt.
        """
        prompt = [
            self.persona.get_personality_prompt(),
            self._get_tools_section(tools or []),
            self._get_context_section(context or {}),
            self._get_routines_section(),
            self._get_output_formatting_section()
        ]
        return "\n\n".join(prompt)

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
        time_ctx = self.persona.get_time_context()
        
        device_info = context.get("devices", "Primary Desktop")
        agents = context.get("agents", [])
        agent_names = " | ".join([f"[{a['name'].upper()}]" for a in agents]) if agents else "NONE"
        
        # Memory-injected preferences
        preferences = context.get("preferences", "None set.")
        
        return (
            "### NETWORK STATUS\n"
            f"- {time_ctx}\n"
            f"- Primary Device: {device_info}\n"
            f"- CONNECTED AGENTS: {agent_names}\n"
            f"- (Use 'capture_remote_screen', 'ping_device', etc. for these agents)\n\n"
            f"### USER PREFERENCES (from long-term memory)\n"
            f"{preferences}"
        )

    def _get_routines_section(self) -> str:
        from core.personality.routines import routine_manager
        routines = routine_manager.list_routines()
        
        routines_list = ""
        for r in routines:
            triggers = " / ".join([f"'{t}'" for t in r['triggers']])
            routines_list += f"- {triggers} → {r['description']}\n"
            
        return (
            "### ROUTINES\n"
            "You have pre-configured routines. When a user says a trigger phrase, "
            "respond by telling them you're activating the routine. "
            "The system will handle execution automatically.\n"
            "Available routines:\n"
            f"{routines_list}"
        )

    def _get_output_formatting_section(self) -> str:
        return (
            "### CRITICAL: OUTPUT FORMATTING\n"
            "You are a tool-use model. For ANY action involving the system (volume, files, apps, web, agents), you MUST include a JSON block. "
            "If you only respond with text, nothing will happen.\n\n"
            "Format: ```json { \"tool\": \"tool_name\", \"args\": { ... } } ```\n\n"
            "Example:\n"
            "User: 'Set volume to 30'\n"
            "Assistant: Adjusting volume to 30%. ```json { \"tool\": \"set_system_volume\", \"args\": { \"level\": 30 } } ```\n\n"
            "IMPORTANT: Do not hallucinate capabilities. If you can't 'play a specific song', use 'control_media_playback' with 'play_pause' and tell the user to have their music app open."
        )

# Global instance
prompt_builder = PromptBuilder()
