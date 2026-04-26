import asyncio
from typing import Dict, Any, List, Optional
from loguru import logger
from datetime import datetime

from core.llm.tool_router import tool_router


# Predefined routine templates
ROUTINES = {
    "good_morning": {
        "trigger_phrases": ["good morning", "start my day", "morning routine"],
        "description": "Opens your daily apps and gives you a morning briefing.",
        "steps": [
            {"tool": "open_application", "args": {"name": "chrome"}, "label": "Opening Chrome"},
            {"tool": "open_application", "args": {"name": "code"}, "label": "Opening VS Code"},
        ]
    },
    "good_night": {
        "trigger_phrases": ["good night", "end my day", "night routine", "shut down"],
        "description": "Closes non-essential apps and lowers volume.",
        "steps": [
            {"tool": "set_system_volume", "args": {"level": 0}, "label": "Muting volume"},
            {"tool": "close_application", "args": {"name": "chrome"}, "label": "Closing Chrome"},
        ]
    },
    "focus_mode": {
        "trigger_phrases": ["focus mode", "do not disturb", "deep work"],
        "description": "Mutes volume and closes distracting apps.",
        "steps": [
            {"tool": "toggle_system_mute", "args": {}, "label": "Muting system"},
        ]
    },
    "workspace_setup": {
        "trigger_phrases": ["setup my workspace", "set up my workspace", "coding setup", "time to code"],
        "description": "Opens VS Code, dark mode, and starts dev environment.",
        "steps": [
            {"tool": "open_application", "args": {"name": "code"}, "label": "Opening VS Code"},
            {"tool": "set_system_theme", "args": {"theme": "dark"}, "label": "Switching to Dark Mode"},
            {"tool": "run_shell_command", "args": {"command": "npm run dev"}, "label": "Starting Dev Server"},
        ]
    }
}


class RoutineManager:
    """
    Manages and executes predefined and custom routines.
    A routine is a sequence of tool calls triggered by a keyword or schedule.
    """
    def __init__(self):
        self.routines: Dict[str, Dict[str, Any]] = dict(ROUTINES)
        self.custom_routines: Dict[str, Dict[str, Any]] = {}
    
    def match_routine(self, user_message: str) -> Optional[str]:
        """Check if user message triggers a routine."""
        message_lower = user_message.lower().strip()
        
        for routine_name, routine in self.routines.items():
            for phrase in routine.get("trigger_phrases", []):
                if phrase in message_lower:
                    return routine_name
        
        for routine_name, routine in self.custom_routines.items():
            for phrase in routine.get("trigger_phrases", []):
                if phrase in message_lower:
                    return routine_name
        
        return None
    
    async def execute_routine(self, routine_name: str) -> str:
        """Execute all steps of a routine sequentially."""
        routine = self.routines.get(routine_name) or self.custom_routines.get(routine_name)
        if not routine:
            return f"Routine '{routine_name}' not found."
        
        results = []
        steps = routine.get("steps", [])
        
        logger.info(f"Executing routine: {routine_name} ({len(steps)} steps)")
        
        for step in steps:
            tool_name = step.get("tool")
            args = step.get("args", {})
            label = step.get("label", tool_name)
            
            if tool_name not in tool_router.registered_tools:
                results.append(f"⚠ {label}: Tool '{tool_name}' not available.")
                continue
            
            try:
                logger.info(f"  → {label}")
                func = tool_router.registered_tools[tool_name]
                
                import inspect
                if inspect.iscoroutinefunction(func):
                    result = await func(**args)
                else:
                    result = func(**args)
                
                results.append(f"✓ {label}: Done.")
            except Exception as e:
                logger.error(f"  ✗ {label}: {e}")
                results.append(f"✗ {label}: Failed ({e})")
        
        summary = "\n".join(results)
        return f"Routine '{routine_name}' completed:\n{summary}"
    
    def add_custom_routine(self, name: str, trigger_phrases: List[str], steps: List[Dict[str, Any]]):
        """Add a user-defined routine."""
        self.custom_routines[name] = {
            "trigger_phrases": trigger_phrases,
            "description": f"Custom routine: {name}",
            "steps": steps
        }
        logger.info(f"Custom routine '{name}' registered with {len(steps)} steps.")
    
    def list_routines(self) -> List[Dict[str, Any]]:
        """List all available routines."""
        all_routines = []
        for name, r in {**self.routines, **self.custom_routines}.items():
            all_routines.append({
                "name": name,
                "description": r.get("description", ""),
                "triggers": r.get("trigger_phrases", []),
                "steps": len(r.get("steps", []))
            })
        return all_routines


# Global instance
routine_manager = RoutineManager()
