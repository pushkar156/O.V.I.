import subprocess
import os
from loguru import logger
from typing import Dict, Any

class RunCommandTool:
    name = "run_shell_command"
    description = "Executes a shell command on the local system. Use for system tasks, git operations, or running scripts."
    
    def get_llm_definition(self):
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "The exact shell command to run."},
                    "cwd": {"type": "string", "description": "The working directory (optional)."}
                },
                "required": ["command"]
            }
        }

    def execute(self, **kwargs) -> str:
        try:
            command = kwargs.get("command")
            cwd = kwargs.get("cwd", os.getcwd())
            
            # Safety Check: Warn LLM about dangerous commands in prompt, 
            # but for now, we'll just execute.
            logger.info(f"Executing command: {command} in {cwd}")
            
            result = subprocess.run(
                command, 
                shell=True, 
                capture_output=True, 
                text=True, 
                cwd=cwd,
                timeout=30
            )
            
            output = result.stdout if result.stdout else ""
            error = result.stderr if result.stderr else ""
            
            if result.returncode == 0:
                return f"Command executed successfully.\nOutput:\n{output}"
            else:
                return f"Command failed with exit code {result.returncode}.\nError:\n{error}\nOutput:\n{output}"
                
        except Exception as e:
            logger.error(f"Command execution failed: {e}")
            return f"Failed to run command: {e}"

class GitStatusTool:
    name = "check_git_status"
    description = "Checks the git status of a repository."
    
    def get_llm_definition(self):
        return {
            "name": self.name,
            "description": self.description,
            "parameters": {
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "The path to the git repository."}
                }
            }
        }

    def execute(self, **kwargs) -> str:
        try:
            path = kwargs.get("path", os.getcwd())
            result = subprocess.run(
                "git status", 
                shell=True, 
                capture_output=True, 
                text=True, 
                cwd=path
            )
            return result.stdout if result.stdout else "No git status output."
        except Exception as e:
            return f"Failed to check git status: {e}"

CODE_TOOLS = [RunCommandTool(), GitStatusTool()]
