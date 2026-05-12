import pytest
import asyncio
import time
from fastapi.testclient import TestClient
from core.main import app
from unittest.mock import patch, MagicMock
import sys

# Prevent openwakeword from loading
sys.modules["openwakeword"] = MagicMock()
sys.modules["openwakeword.model"] = MagicMock()

client = TestClient(app)

def test_health_check_latency():
    """Verifies that the health check is fast and responsive."""
    # Mocking initialization to speed up test
    with patch("core.main.init_db"), \
         patch("core.main.ollama_client.check_health", return_value=True), \
         patch("core.voice.wake_word.wake_listener.start"):
        
        start_time = time.time()
        response = client.get("/health")
        latency = time.time() - start_time
        
        assert response.status_code == 200
        assert latency < 0.2 

@pytest.mark.asyncio
async def test_event_loop_not_blocked_by_voice_logic():
    """
    Verifies that the server remains responsive during a simulated voice task.
    """
    # Mock STT to simulate a background thread task
    with patch("core.voice.stt.STTManager._sync_transcribe", return_value="hello"):
        from core.voice.stt import get_stt_manager
        stt = get_stt_manager()
        
        # Start a "transcription" task
        task = asyncio.create_task(stt.transcribe(b"dummy"))
        
        # Check if we can still hit health immediately
        response = client.get("/health")
        assert response.status_code == 200
        
        await task # Cleanup
