import os
import yaml
import subprocess
import webbrowser
import asyncio
from loguru import logger
from typing import List, Dict, Any

class RoutineManager:
    def __init__(self, routines_config_path: str = "config/routines.yaml"):
        self.config_path = routines_config_path
        self.routines = self._load_routines()

    def _load_routines(self) -> Dict[str, Any]:
        if not os.path.exists(self.config_path):
            logger.warning(f"Routines config not found at {self.config_path}")
            return {}
        try:
            with open(self.config_path, 'r') as f:
                config = yaml.safe_load(f)
                return config.get('routines', {})
        except Exception as e:
            logger.error(f"Failed to load routines: {e}")
            return {}

    def get_available_routines(self) -> List[str]:
        return list(self.routines.keys())

    async def run_routine(self, routine_name: str):
        if routine_name not in self.routines:
            logger.error(f"Routine '{routine_name}' not found.")
            return False

        routine = self.routines[routine_name]
        logger.info(f"Executing routine: {routine_name} - {routine.get('description', '')}")

        for step in routine.get('steps', []):
            action = step.get('action')
            params = step.get('params', {})
            
            try:
                await self._execute_action(action, params)
            except Exception as e:
                logger.error(f"Error executing step {action}: {e}")

        return True

    async def _execute_action(self, action: str, params: Dict[str, Any]):
        logger.debug(f"Action: {action}, Params: {params}")
        
        if action == "open_app":
            path = params.get('path')
            args = params.get('args', [])
            # Using subprocess.Popen to not block
            subprocess.Popen([path] + args, shell=True)
            
        elif action == "open_url":
            url = params.get('url')
            webbrowser.open(url)
            
        elif action == "notify":
            message = params.get('message')
            # For now, just log and eventually hook into a notification system or WebSocket
            logger.info(f"[OVI NOTIFY] {message}")
            
        elif action == "run_script":
            script = params.get('script')
            if os.path.exists(script):
                subprocess.Popen(["python", script], shell=True)
            else:
                logger.warning(f"Script not found: {script}")
                
        elif action == "set_volume":
            level = params.get('level', 50)
            from core.tools.volume_control import set_system_volume
            set_system_volume(level)
            
        elif action == "organize_windows":
            layout = params.get('layout', 'coding')
            from core.tools.window_organizer import organize_windows
            organize_windows(layout)
            
        else:
            logger.warning(f"Unknown action: {action}")

# Singleton instance
routine_manager = RoutineManager()
