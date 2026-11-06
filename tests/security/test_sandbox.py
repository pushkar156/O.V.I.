import pytest
import subprocess
from core.tools.base import ToolSandbox

@pytest.fixture
def sandbox():
    return ToolSandbox()

def test_sandbox_prevents_shell_injection(sandbox):
    # Payload attempting to run a second command
    # On Windows, we'll use a dir command as an example
    malicious_input = "nonexistent.txt & echo INJECTED"
    
    # We expect 'INJECTED' to NOT be in the output because & shouldn't be interpreted
    result = sandbox.run_command(["cmd", "/c", "dir", malicious_input])
    
    assert "INJECTED" not in result.stdout
    assert result.returncode != 0

def test_sandbox_handles_list_args(sandbox):
    # Basic sanity check for valid command
    result = sandbox.run_command(["cmd", "/c", "echo", "hello"])
    assert "hello" in result.stdout.strip()
    assert result.returncode == 0

def test_sandbox_rejects_shell_true(sandbox, monkeypatch):
    # We want to ensure that internal calls NEVER use shell=True
    # We can mock subprocess.run to verify this
    import subprocess
    original_run = subprocess.run
    
    def mocked_run(*args, **kwargs):
        if kwargs.get('shell') is True:
            raise RuntimeError("CRITICAL SECURITY VIOLATION: shell=True detected!")
        return original_run(*args, **kwargs)
    
    monkeypatch.setattr(subprocess, "run", mocked_run)
    
    # This should work fine because it's secure
    sandbox.run_command(["cmd", "/c", "echo", "secure"])
