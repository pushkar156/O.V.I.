import pytest
from fastapi.testclient import TestClient
from core.main import app
from core.config import settings
import os

@pytest.fixture
def client():
    return TestClient(app)

def test_agent_ws_rejects_without_token(client):
    # Set a required token in the settings
    settings.OVI_TOKEN = "secure-token-123"
    
    # In FastAPI TestClient, a rejected WS connection during handshake 
    # usually raises a WebSocketDisconnect or similar depending on how it's handled.
    # We expect the connection to fail if the header is missing.
    with pytest.raises(Exception):
        with client.websocket_connect("/ws/agent") as websocket:
            pass

def test_agent_ws_rejects_invalid_token(client):
    settings.OVI_TOKEN = "secure-token-123"
    
    with pytest.raises(Exception):
        with client.websocket_connect(
            "/ws/agent", 
            headers={"x-ovi-token": "wrong-token"}
        ) as websocket:
            pass

def test_agent_ws_accepts_valid_token(client):
    settings.OVI_TOKEN = "secure-token-123"
    
    with client.websocket_connect(
        "/ws/agent", 
        headers={"x-ovi-token": "secure-token-123"}
    ) as websocket:
        assert websocket is not None
