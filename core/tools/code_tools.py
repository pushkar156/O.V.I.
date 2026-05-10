import subprocess
import os
import shlex
from loguru import logger
from typing import Dict, Any
from core.tools.base import BaseTool, ToolResult, tool_sandbox

class RunCommandTool(BaseTool):
    @property
    def name(self) -> str:
        return "run_shell_command"

    @property
    def description(self) -> str:
        return "Executes a system command securely. Note: Does not support shell pipes or redirects."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "command": {"type": "string", "description": "The command to run (e.g. 'dir', 'python --version')."},
                "cwd": {"type": "string", "description": "The working directory (optional)."}
            },
            "required": ["command"]
        }

    async def execute(self, command: str, cwd: str = None, **kwargs) -> ToolResult:
        try:
            target_cwd = cwd or os.getcwd()
            logger.info(f"Executing command: {command} in {target_cwd}")
            
            # Safe tokenization: 'ls -l' -> ['ls', '-l']
            args = shlex.split(command)
            
            result = tool_sandbox.run_command(args, timeout=30)
            
            if result.returncode == 0:
                return ToolResult(
                    success=True, 
                    data={"stdout": result.stdout}, 
                    message="Command executed successfully."
                )
            else:
                return ToolResult(
                    success=False, 
                    data={"stdout": result.stdout, "stderr": result.stderr}, 
                    message=f"Command failed with exit code {result.returncode}."
                )
                
        except Exception as e:
            logger.error(f"Command execution failed: {e}")
            return ToolResult(success=False, message=f"Failed to run command: {e}")

class GitStatusTool(BaseTool):
    @property
    def name(self) -> str:
        return "check_git_status"

    @property
    def description(self) -> str:
        return "Checks the git status of a repository."

    @property
    def parameters(self) -> Dict[str, Any]:
        return {
            "type": "object",
            "properties": {
                "path": {"type": "string", "description": "The path to the git repository."}
            }
        }

    async def execute(self, path: str = None, **kwargs) -> ToolResult:
        try:
            target_path = path or os.getcwd()
            result = tool_sandbox.run_command(["git", "status"], timeout=10)
            
            if result.returncode == 0:
                return ToolResult(success=True, data={"status": result.stdout}, message="Git status retrieved.")
            else:
                return ToolResult(success=False, message=f"Git command failed: {result.stderr}")
        except Exception as e:
            return ToolResult(success=False, message=f"Failed to check git status: {e}")

CODE_TOOLS = [RunCommandTool(), GitStatusTool()]
