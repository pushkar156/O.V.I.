import os
import subprocess
import threading
import time
from loguru import logger

class GitMonitor:
    def __init__(self, project_paths=None, interval=300):
        self.project_paths = project_paths or []
        self.interval = interval
        self.status_cache = {}
        self.is_running = False
        self.thread = None

    def get_git_status(self, path):
        """Runs git status on a path and returns a summary."""
        if not os.path.isdir(os.path.join(path, ".git")):
            return None
        
        try:
            # Check for changes
            result = subprocess.run(
                ["git", "status", "--short"], 
                cwd=path, 
                capture_output=True, 
                text=True
            )
            changes = result.stdout.strip()
            
            # Check for unpushed commits
            result_branch = subprocess.run(
                ["git", "rev-parse", "--abbrev-ref", "HEAD"],
                cwd=path,
                capture_output=True,
                text=True
            )
            branch = result_branch.stdout.strip()
            
            result_behind = subprocess.run(
                ["git", "rev-list", "--count", f"origin/{branch}..HEAD"],
                cwd=path,
                capture_output=True,
                text=True
            )
            # Default to 0 if origin doesn't exist or error
            ahead = result_behind.stdout.strip() if result_behind.returncode == 0 else "0"

            return {
                "name": os.path.basename(path),
                "path": path,
                "branch": branch,
                "has_changes": len(changes) > 0,
                "ahead_count": ahead,
                "last_check": time.time()
            }
        except Exception as e:
            logger.error(f"Error checking git status for {path}: {e}")
            return None

    def scan_all(self):
        """Scans all configured project paths."""
        logger.info(f"O.V.I. Git Monitor: Scanning {len(self.project_paths)} projects...")
        new_status = {}
        for path in self.project_paths:
            status = self.get_git_status(path)
            if status:
                new_status[path] = status
        self.status_cache = new_status
        logger.success("O.V.I. Git Monitor: Scan complete.")

    def _monitor_loop(self):
        self.is_running = True
        while self.is_running:
            self.scan_all()
            time.sleep(self.interval)

    def start(self):
        if not self.thread:
            self.thread = threading.Thread(target=self._monitor_loop, daemon=True)
            self.thread.start()
            logger.info("O.V.I. Git Monitor service started.")

    def stop(self):
        self.is_running = False

# Example usage singleton
git_monitor = GitMonitor()
