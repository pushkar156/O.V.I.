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
            "Your tone is professional, efficient, and helpful, with a subtle hint of wit. "
            "You run entirely on the user's local hardware—privacy and speed are your core principles. "
            "You don't just chat; you execute actions to help the user manage their digital life."
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
        
        return (
            "### CURRENT CONTEXT\n"
            f"- Current Time: {current_time}\n"
            f"- Active Device: {device_info}\n"
            f"- Connected Agents: {context.get('agent_count', 0)}\n"
            f"- User Preferences: {context.get('preferences', 'None set.')}"
        )

    def _get_output_formatting_section(self) -> str:
        return (
            "### OUTPUT FORMATTING\n"
            "1. **Direct Communication**: Reply naturally if no action is needed.\n"
            "2. **Tool Use**: If you need to perform an action, you MUST include a JSON block in the following format:\n"
            "   ```json\n"
            '   { "tool": "tool_name", "args": { "arg1": "value" } }\n'
            "   ```\n"
            "3. **Multi-Step**: You can chain thoughts, but only call one tool at a time unless they are independent.\n"
            "4. **Safety**: Never execute destructive commands without confirming if they seem suspicious."
        )

# Global instance
prompt_builder = PromptBuilder()
