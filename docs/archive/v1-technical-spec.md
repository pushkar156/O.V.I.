<div align="center">

# 📋 O.V.I. Implementation Guide

### Complete Technical Blueprint

*Every module, every API, every design decision — documented.*

</div>

---

## Table of Contents

- [Architecture Overview](#architecture-overview)
- [Phase 1 — The Brain](#phase-1--the-brain-week-1-2)
- [Phase 2 — The Voice](#phase-2--the-voice-week-2-3)
- [Phase 3 — The Dashboard](#phase-3--the-dashboard-week-3-4)
- [Phase 4 — Multi-Device Mesh](#phase-4--multi-device-mesh-week-4-6)
- [Phase 5 — Memory & Personality](#phase-5--memory--personality-week-6-8)
- [Supporting Infrastructure](#supporting-infrastructure)
- [API Reference](#api-reference)
- [Design System](#design-system)
- [Testing & Verification](#testing--verification)
- [Risk Mitigation](#risk-mitigation)

---

## Architecture Overview

The O.V.I. ecosystem is built as a **hub-and-spoke** model. Your main PC runs the core server (the hub), and all other devices connect as lightweight agents (spokes) over your local Wi-Fi network.

```
┌────────────────────────────────────────────────────────────────────┐
│                         O.V.I. ECOSYSTEM                           │
│                                                                    │
│   Your Devices (all on same Wi-Fi)                                 │ 
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐             │
│   │  Desktop /   │  │   Laptop     │  │   Mobile     │             │
│   │  Main PC     │  │  (Windows /  │  │  (Android /  │             │
│   │  (The Brain) │  │   macOS)     │  │   iOS)       │             │
│   └──────┬───────┘  └──────┬───────┘  └───────┬──────┘             │
│          │                 │                  │                    │
│          └─────────────────┼──────────────────┘                    │
│                            │  WebSocket Mesh                       │
│                            ▼                                       │
│              ┌─────────────────────────┐                           │
│              │    O.V.I. CORE SERVER   │                           │
│              │   (FastAPI + WS Hub)    │  192.168.x.x:8000         │
│              │                         │                           │
│              │  ┌───────────────────┐  │                           │
│              │  │  Ollama LLM       │  │  Qwen3 8B / Mistral 7B    │
│              │  │ (localhost:11434) │  │                           │
│              │  └───────────────────┘  │                           │
│              │  ┌───────────────────┐  │                           │
│              │  │  Tool Router      │  │  Intent → Actions         │
│              │  └───────────────────┘  │                           │
│              │  ┌───────────────────┐  │                           │
│              │  │  Memory Store     │  │  SQLite + ChromaDB        │
│              │  └───────────────────┘  │                           │
│              └─────────────────────────┘                           │
│                            │                                       │
│              ┌─────────────┼──────────────┐                        │
│              ▼             ▼              ▼                        │
│         PC Agent      Laptop Agent   Mobile Agent                  │
│         (Python)      (Python)       (PWA / React)                 │
└────────────────────────────────────────────────────────────────────┘
```

### Core Principles
1. **Local-first** — All processing happens on your network. No data leaves your home.
2. **Modular** — Each component is independently replaceable (swap LLMs, TTS engines, etc.).
3. **Progressive** — Each phase produces a working system. You can stop at any phase.
4. **Tool-driven** — The LLM reasons about intent, then dispatches to concrete tool functions.

---

## Phase 1 — The Brain (Week 1-2)

> **Goal**: Ollama running → chat with O.V.I. via REST API → basic tools work → terminal demo functional.

This is the foundation. Everything else builds on top of this.

---

### 1.1 Dependencies

```txt
# Core Server
fastapi>=0.115.0
uvicorn[standard]>=0.30.0
websockets>=12.0
python-multipart>=0.0.9

# LLM
ollama>=0.4.0
httpx>=0.27.0

# Memory
chromadb>=0.5.0
sqlalchemy>=2.0.0
aiosqlite>=0.20.0

# Voice (Phase 2 — install early, no harm)
faster-whisper>=1.0.0
sounddevice>=0.5.0
numpy>=1.26.0
edge-tts>=6.1.0

# Desktop Automation
pyautogui>=0.9.54
psutil>=5.9.0
pyperclip>=1.9.0

# Utilities
python-dotenv>=1.0.0
pydantic>=2.7.0
pydantic-settings>=2.3.0
loguru>=0.7.0
```

---

### 1.2 Configuration

#### `core/config.py` — Centralized Settings

Uses `pydantic-settings` for type-safe configuration with `.env` file support:

| Variable | Default | Description |
|:---------|:--------|:------------|
| `OLLAMA_URL` | `http://localhost:11434` | Ollama API endpoint |
| `DEFAULT_MODEL` | `qwen3:8b` | Default LLM model |
| `SERVER_HOST` | `0.0.0.0` | FastAPI bind address |
| `SERVER_PORT` | `8000` | FastAPI port |
| `MEMORY_DB_PATH` | `./data/ovi.db` | SQLite database path |
| `CHROMA_PERSIST_DIR` | `./data/chroma` | ChromaDB storage directory |
| `LOG_LEVEL` | `INFO` | Logging verbosity |

#### `.env.example`

```env
OLLAMA_URL=http://localhost:11434
DEFAULT_MODEL=qwen3:8b
SERVER_HOST=0.0.0.0
SERVER_PORT=8000
MEMORY_DB_PATH=./data/ovi.db
CHROMA_PERSIST_DIR=./data/chroma
LOG_LEVEL=INFO
```

---

### 1.3 Core Server

#### `core/main.py` — FastAPI Entry Point

The main application bootstraps all subsystems:

- **CORS middleware** — configured for local network access (`192.168.*`, `localhost`)
- **Lifespan handler** — initializes Ollama connection, memory store, tool registry on startup
- **API routers** — mounts chat, voice, websocket, devices, memory endpoints
- **Health check** — `GET /health` returns system status

```python
# Startup flow:
# 1. Load config from .env
# 2. Connect to Ollama, verify model is available
# 3. Initialize SQLite database (create tables if needed)
# 4. Register all available tools
# 5. Start WebSocket hub
# 6. Ready to accept connections
```

---

### 1.4 LLM Integration

#### `core/llm/ollama_client.py` — Async Ollama Wrapper

The brain of O.V.I. — wraps the Ollama Python library with async support:

| Method | Description |
|:-------|:------------|
| `generate(prompt)` | Single prompt → response |
| `chat(messages)` | Multi-turn conversation with message history |
| `stream_chat(messages)` | Streaming response generator for real-time UI |
| `check_health()` | Verify Ollama is running and model is loaded |
| `list_models()` | Get available models |

**Key design decisions:**
- Uses `ollama.AsyncClient` for non-blocking inference (critical for FastAPI)
- Connection health check with auto-retry logic
- Model availability verification on startup — fails fast if model isn't pulled

#### `core/llm/prompt_builder.py` — System Prompt Engineering

Constructs the system prompt dynamically based on context:

```
┌─────────────────────────────────────────────┐
│  SYSTEM PROMPT                              │
│  ┌────────────────────────────────────────┐ │
│  │ O.V.I. Persona                        │ │
│  │ (personality, tone, capabilities)      │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ Available Tools                        │ │
│  │ (name, description, parameters)        │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ Context                                │ │
│  │ (time, date, connected devices,        │ │
│  │  recent memory, user preferences)      │ │
│  └────────────────────────────────────────┘ │
│  ┌────────────────────────────────────────┐ │
│  │ Tool-Use Instructions                  │ │
│  │ (JSON format for tool calls)           │ │
│  └────────────────────────────────────────┘ │
└─────────────────────────────────────────────┘
```

#### `core/llm/tool_router.py` — Intent → Action Dispatch

Parses LLM structured output and dispatches to the correct tool:

```
User: "Open VS Code"
  → LLM responds: { "tool": "open_application", "args": { "name": "vscode" } }
  → Tool Router validates JSON schema
  → Dispatches to app_control.open_application("vscode")
  → Tool returns: { "success": true, "message": "VS Code opened" }
  → Result fed back to LLM for final response
  → LLM: "I've opened VS Code for you."
```

**Pipeline:**
1. Parse LLM response for tool call JSON
2. Validate against registered tool schemas
3. Execute tool function
4. Format result
5. Feed result back to LLM for natural language response
6. Support chained tool calls (multi-step reasoning)

---

### 1.5 Tools System

#### `core/tools/base.py` — Base Tool Interface

All tools implement this interface:

```python
class BaseTool:
    name: str              # Unique identifier
    description: str       # Used in LLM prompt for tool selection
    parameters: dict       # JSON schema defining expected arguments
    
    async def execute(self, **kwargs) -> ToolResult:
        """Execute the tool and return a result."""
        ...

@dataclass
class ToolResult:
    success: bool
    data: Any
    message: str
```

#### Phase 1 Tools

| Tool | File | Capabilities |
|:-----|:-----|:-------------|
| **System Tools** | `system_tools.py` | `get_system_info` (CPU%, RAM%, disk, battery, uptime), `list_processes` (PID, name, memory), `get_time` |
| **App Control** | `app_control.py` | `open_application` (name→executable mapping), `close_application` (by name/PID), `focus_application` (bring to front) |
| **File Tools** | `file_tools.py` | `search_files` (by name/extension), `read_file`, `list_directory`, `move_file`, `copy_file`, `delete_file` (with safety confirmation) |
| **Browser Tools** | `browser_tools.py` | `open_url` (default browser via `webbrowser`), `search_web` (construct search URL) |
| **Clipboard Tools** | `clipboard_tools.py` | `read_clipboard`, `write_clipboard` (via `pyperclip`) |

**App Registry** (Windows):
```python
APP_REGISTRY = {
    "vscode": "code",
    "chrome": "chrome.exe",
    "firefox": "firefox.exe",
    "spotify": "spotify.exe",
    "notepad": "notepad.exe",
    "explorer": "explorer.exe",
    "terminal": "wt.exe",
    # ... extensible via config
}
```

---

### 1.6 API Endpoints (Phase 1)

#### `POST /api/chat` — Main Command Endpoint

```json
// Request
{
  "message": "Open VS Code",
  "conversation_id": "uuid-optional"
}

// Response
{
  "response": "Opening VS Code now.",
  "tools_used": [
    { "name": "open_application", "args": { "name": "vscode" }, "success": true }
  ],
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

**Flow:**
1. Receive user message
2. Build prompt with context + tool descriptions
3. Send to Ollama → parse response
4. If tool call detected → execute → feed result back to LLM
5. Return final natural language response
6. Save to conversation history

#### `GET /health` — System Status

```json
{
  "status": "online",
  "ollama": true,
  "model": "qwen3:8b",
  "uptime": "2h 15m",
  "tools_loaded": 5,
  "memory_entries": 42
}
```

#### `WS /ws` — WebSocket (Real-Time)

Bidirectional real-time communication:

```json
// Message protocol
{
  "type": "chat | tool_result | status | ping",
  "data": { ... },
  "timestamp": "2026-04-18T19:00:00Z"
}
```

- Client registration and heartbeat tracking
- Streaming LLM responses token-by-token
- Real-time tool execution status updates

---

### 1.7 Memory (Phase 1 — Basic)

#### `core/memory/short_term.py` — Conversation Manager

In-memory sliding window of conversation history:
- Maintains last N messages per conversation ID
- Token counting to stay within model context window
- Session isolation — each conversation is independent

#### `core/memory/schema.py` — Database Models

```python
# SQLAlchemy models

class Conversation:
    id: UUID
    title: str
    device_source: str      # "desktop" | "laptop" | "phone"
    created_at: datetime
    updated_at: datetime

class Message:
    id: UUID
    conversation_id: UUID   # FK → Conversation
    role: str               # "user" | "assistant" | "system"
    content: str
    tool_calls: JSON        # Optional tool call data
    timestamp: datetime

class Fact:
    id: UUID
    key: str                # "standup_time"
    value: str              # "10:00 AM"
    category: str           # "preference" | "fact" | "event"
    created_at: datetime
```

#### `core/memory/database.py` — SQLite Manager

- Async connection pool via `aiosqlite`
- CRUD operations for conversations, messages, facts
- Schema auto-migration on startup (creates tables if they don't exist)

---

### 1.8 Phase 1 Verification

```bash
# Test 1: Health check
curl http://localhost:8000/health
# Expected: { "status": "online", "ollama": true, "model": "qwen3:8b" }

# Test 2: Time query
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "What time is it?"}'
# Expected: Returns current time

# Test 3: App launch
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Open VS Code"}'
# Expected: VS Code opens on desktop

# Test 4: System info
curl -X POST http://localhost:8000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "How much RAM is being used?"}'
# Expected: Returns RAM usage stats

# Test 5: WebSocket
websocat ws://localhost:8000/ws
# Expected: Connection established, can send/receive messages
```

---

## Phase 2 — The Voice (Week 2-3)

> **Goal**: *"Hey O.V.I."* → you speak → it responds with voice. Full voice pipeline working.

---

### 2.1 Speech-to-Text

#### `core/voice/stt.py` — faster-whisper Integration

| Config | CPU | GPU (CUDA) |
|:-------|:----|:-----------|
| Model size | `small` | `medium` or `large-v3` |
| Compute type | `int8` | `float16` |
| Real-time factor | ~3-5x | ~0.5-1x |

```python
# Core function
async def transcribe_audio(audio_bytes: bytes) -> str:
    """Convert audio bytes to text using faster-whisper."""
    # 1. Load audio (16-bit PCM, 16kHz mono)
    # 2. Run through whisper model with VAD filtering
    # 3. Return concatenated segment texts
```

**Key features:**
- VAD filtering enabled (`vad_filter=True`) — skips silence, improves accuracy
- Supports both file upload and real-time streaming chunks
- Audio format: 16-bit PCM, 16kHz mono

---

### 2.2 Text-to-Speech

#### `core/voice/tts.py` — edge-tts Integration

```python
async def synthesize(text: str, voice: str = "en-US-GuyNeural") -> bytes:
    """Convert text to speech audio bytes (MP3)."""
```

**Why `edge-tts` over Piper TTS?**

| Factor | edge-tts | Piper TTS |
|:-------|:---------|:----------|
| Setup complexity | `pip install edge-tts` | Download models manually |
| Windows support | ✅ Excellent | ⚠️ Limited streaming |
| Voice quality | Natural, many voices | Good, fewer options |
| Truly offline | Needs Edge engine | ✅ Fully offline |
| Latency | ~100-300ms | ~50-100ms |

> **Recommendation:** Start with `edge-tts` for zero-friction setup. Swap to Piper later for fully offline operation.

**Voice options:**
- `en-US-GuyNeural` — deep male voice (JARVIS-like) ← default
- `en-US-AriaNeural` — female voice (FRIDAY-like)
- `en-GB-RyanNeural` — British male (classic butler)

---

### 2.3 Wake Word Detection

#### `core/voice/wake_word.py` — openWakeWord

```python
# Always-on microphone listener
# ~2-3% CPU when idle
# Triggers recording pipeline on detection

class WakeWordListener:
    def __init__(self, sensitivity: float = 0.5):
        self.model = Model()  # Loads pre-trained models
        
    async def listen(self, on_wake: Callable):
        """Continuously listen for wake word, call on_wake when detected."""
        # Opens microphone stream via sounddevice
        # Feeds audio chunks to openWakeWord model
        # When confidence > threshold → trigger callback
```

**Wake word options:**
- Pre-trained: `hey jarvis`, `alexa`, `hey mycroft` (available out of box)
- Custom: Train a `hey ovi` model using openWakeWord's training pipeline
- Fallback: Push-to-talk button in dashboard/mobile UI

---

### 2.4 Voice API

#### `POST /api/voice` — Audio In, Text + Audio Out

```
POST /api/voice
Content-Type: multipart/form-data
Body: { audio: <wav/mp3 file> }

Response:
{
  "transcription": "What time is it?",
  "response": "It's 7:15 PM.",
  "audio_url": "/api/voice/tts/abc123"
}
```

#### `GET /api/voice/tts/{id}` — Stream Audio Response

```
GET /api/voice/tts/abc123
Content-Type: audio/mpeg
Body: <MP3 audio stream>
```

---

### 2.5 Phase 2 Verification

| Test | Action | Expected Result |
|:-----|:-------|:----------------|
| STT | Upload audio file | Correct transcription returned |
| TTS | Send text | Natural-sounding MP3 audio returned |
| Wake Word | Say "Hey O.V.I." | System activates and begins listening |
| Full Loop | Wake word → speak → action → voice | Complete end-to-end voice interaction |

---

## Phase 3 — The Dashboard (Week 3-4)

> **Goal**: Iron Man-style glass UI running in browser. Chat, system stats, and tool controls — all live.

---

### 3.1 Project Setup

```bash
npx -y create-next-app@latest ./dashboard \
  --typescript --tailwind --app --src-dir --no-eslint
  
cd dashboard
npm install framer-motion recharts lucide-react socket.io-client
```

---

### 3.2 Component Architecture

```
dashboard/src/
├── app/
│   ├── page.tsx              ← Main HUD (home)
│   ├── layout.tsx            ← Root layout + fonts
│   ├── memory/page.tsx       ← Memory browser
│   └── globals.css           ← Design system tokens
├── components/
│   ├── GlassPanel.tsx        ← Reusable glass card
│   ├── OVIChat.tsx           ← Chat interface
│   ├── VoiceOrb.tsx          ← Animated listening orb
│   ├── SystemHUD.tsx         ← CPU/RAM/Network gauges
│   └── DeviceStatus.tsx      ← Connected devices panel
└── lib/
    └── ovi-client.ts         ← WebSocket + REST client
```

---

### 3.3 Key Components

#### `GlassPanel.tsx` — Reusable Glass Card

The building block of the entire UI:

```
┌─────────────────────────────────┐
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← backdrop-filter: blur(20px)
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← background: rgba(255,255,255,0.04)
│  ░░░░░  GLASS PANEL  ░░░░░░░  │  ← border: 1px solid rgba(0,212,255,0.15)
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │  ← box-shadow: 0 0 30px rgba(0,212,255,0.1)
│  ░░░░░░░░░░░░░░░░░░░░░░░░░░░  │
└─────────────────────────────────┘
```

Variants: `default`, `alert` (red glow), `active` (bright cyan), `minimal` (no border)

#### `VoiceOrb.tsx` — Animated Listening Orb

Visual states:
| State | Animation |
|:------|:----------|
| **Idle** | Gentle breathing pulse (cyan glow) |
| **Listening** | Expanding rings + waveform visualization |
| **Processing** | Rotating particle effect |
| **Speaking** | Audio-reactive pulsing |

Built with CSS keyframe animations + Canvas API for waveform rendering.

#### `OVIChat.tsx` — Chat Interface

- Message bubbles with typing indicator (animated dots)
- Streaming response display (token by token as they arrive)
- Tool execution indicators (shows which tool ran + result)
- Voice input button (browser MediaRecorder API → POST `/api/voice`)
- Command history navigation (↑/↓ arrow keys)

#### `SystemHUD.tsx` — System Stats Display

- Circular gauge components for CPU, RAM, Disk, Network
- Real-time updates every 2 seconds via WebSocket
- Color-coded thresholds:
  - 🟢 Green: 0-60%
  - 🟡 Yellow: 60-85%
  - 🔴 Red: 85-100%
- Additional readouts: uptime, process count, Ollama model status

#### `DeviceStatus.tsx` — Connected Devices

- Visual device icons with online/offline pulsing dots
- Ping latency display (ms)
- Device capabilities list
- Last activity timestamp

---

### 3.4 Client Library

#### `lib/ovi-client.ts` — WebSocket + REST Client

```typescript
class OVIClient {
  // WebSocket
  connect(): void              // Auto-reconnect with exp. backoff
  onMessage(handler): void     // Subscribe to events
  sendChat(message): void      // Send chat via WS
  
  // REST
  chat(message): Promise       // POST /api/chat
  getHealth(): Promise         // GET /health
  getSystemStats(): Promise    // GET /api/system/stats
  getDevices(): Promise        // GET /api/devices
  
  // Voice
  startRecording(): void       // Browser MediaRecorder
  stopRecording(): Blob        // Returns audio blob
  playResponse(url): void      // Play TTS audio
}
```

---

### 3.5 New API Endpoints for Dashboard

#### `GET /api/system/stats` — Live System Data

```json
{
  "cpu": 34.5,
  "ram": { "used": 8.2, "total": 16.0, "percent": 51.25 },
  "disk": { "used": 256.7, "total": 512.0, "percent": 50.1 },
  "network": { "bytes_sent": 1024000, "bytes_recv": 2048000 },
  "battery": { "percent": 85, "plugged": true },
  "uptime": "4h 32m",
  "process_count": 187
}
```

Pushed via WebSocket every 2 seconds for real-time dashboard updates.

#### `GET /api/devices` — Connected Agents

```json
[
  {
    "name": "desktop",
    "status": "online",
    "ip": "192.168.1.5",
    "capabilities": ["screenshot", "app_control", "file_ops", "media"],
    "last_seen": "2026-04-18T19:00:00Z",
    "latency_ms": 1
  }
]
```

---

### 3.6 Phase 3 Verification

| Test | Action | Expected Result |
|:-----|:-------|:----------------|
| Load UI | Open `http://192.168.x.x:3000` | Full HUD renders with glass panels |
| Chat | Type in chat input | Streaming response appears bubble by bubble |
| Stats | Observe system HUD | CPU/RAM gauges update in real-time |
| Voice | Click voice button, speak | Records → transcribes → responds |
| Mobile | Open on phone browser | Responsive layout adapts correctly |

---

## Phase 4 — Multi-Device Mesh (Week 4-6)

> **Goal**: Laptop and phone both connected. Cross-device commands work.

---

### 4.1 Agent Framework

#### `agent/agent.py` — Lightweight Device Agent

Runs on every secondary device (laptop, another PC, etc.):

```
┌───────────────────────────┐
│     DEVICE AGENT          │
│                           │
│  ┌─────────────────────┐  │
│  │  WebSocket Client   │──│──→ connects to core:8000/ws/agent
│  └─────────────────────┘  │
│  ┌─────────────────────┐  │
│  │  Local Tool Runner  │  │  ← executes commands on THIS device
│  └─────────────────────┘  │
│  ┌─────────────────────┐  │
│  │  Heartbeat (10s)    │  │  ← keeps connection alive
│  └─────────────────────┘  │
└───────────────────────────┘
```

**Lifecycle:**
1. Read `config.json` for core URL and device name
2. Connect to core via WebSocket
3. Send registration message with capabilities
4. Listen for commands → execute local tools → return results
5. Heartbeat ping every 10 seconds
6. Auto-reconnect with exponential backoff on disconnect

#### `agent/config.json` — Device Configuration

```json
{
  "device_name": "laptop",
  "core_url": "ws://192.168.1.5:8000/ws/agent",
  "capabilities": ["screenshot", "system_info", "app_control", "file_ops"],
  "auto_start": true
}
```

#### `agent/local_tools.py` — Device-Specific Tools

| Tool | Description |
|:-----|:------------|
| `take_screenshot` | Captures screen, compresses, sends to core |
| `get_local_system_info` | This device's CPU/RAM/battery |
| `open_local_app` | Launch application on this specific device |
| `play_sound` | Play notification sound (for "find my phone") |
| `get_recent_files` | List recently opened/modified files |

---

### 4.2 Server-Side Agent Management

#### `core/agents/agent_registry.py` — Device Tracking

```python
class AgentRegistry:
    agents: dict[str, AgentInfo]
    
    def register(self, name, ws, capabilities): ...
    def unregister(self, name): ...
    def get_agent(self, name) -> AgentInfo: ...
    def route_command(self, target_device, command): ...
    def list_online() -> list[AgentInfo]: ...
```

- Capability-based routing: _"take screenshot on laptop"_ → routes to laptop agent
- Agent health monitoring (heartbeat timeout → mark offline)
- Device discovery via mDNS / Zeroconf (auto-find agents on network)

#### `core/agents/agent_protocol.py` — Message Protocol

All WebSocket messages follow this schema:

```json
{
  "type": "command | result | register | heartbeat | error",
  "source": "core | desktop | laptop | phone",
  "target": "core | desktop | laptop | phone | broadcast",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "data": { ... },
  "timestamp": "2026-04-18T19:00:00Z"
}
```

#### `core/tools/cross_device.py` — Cross-Device Tools

| Tool | Description |
|:-----|:------------|
| `send_notification(device, message)` | Push text to specific device |
| `capture_remote_screen(device)` | Request screenshot from another device |
| `transfer_file(source, target, path)` | Cross-device file transfer via core relay |
| `get_device_status(device)` | Query specific device state |

---

### 4.3 Mobile PWA

```bash
npx -y create-vite@latest ./mobile -- --template react-ts
cd mobile && npm install
```

#### `mobile/src/App.tsx` — Mobile Interface

- **Bottom navigation:** Chat | Voice | Devices
- Full-screen chat interface optimized for touch
- Pull-to-refresh for device status

#### `mobile/src/components/VoiceButton.tsx` — Push-to-Talk

- Large circular button (entire lower third of screen)
- Uses browser `MediaRecorder` API
- Visual feedback: idle → recording (red pulse) → processing (spinner) → done
- Haptic feedback via `navigator.vibrate()` API

#### PWA Configuration (`manifest.json`)

```json
{
  "name": "O.V.I.",
  "short_name": "OVI",
  "description": "Your personal AI assistant",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#0a0a0f",
  "background_color": "#0a0a0f",
  "icons": [...]
}
```

Enables "Add to Home Screen" on Android and iOS — works like a native app.

---

### 4.4 Phase 4 Verification

| Test | Action | Expected Result |
|:-----|:-------|:----------------|
| Agent connect | Start agent on laptop | Appears in dashboard device panel |
| Screen query | _"What's on my laptop screen?"_ | Returns analyzed screenshot |
| Notification | _"Send 'hello' to my phone"_ | Notification appears on phone |
| File transfer | Transfer file between devices | File arrives on target device |
| Concurrency | Two devices chatting simultaneously | No interference or deadlocks |

---

## Phase 5 — Memory & Personality (Week 6-8)

> **Goal**: O.V.I. remembers you, learns your patterns, has personality.

---

### 5.1 Long-Term Memory

#### `core/memory/long_term.py` — ChromaDB Vector Store

```python
class LongTermMemory:
    def store_memory(text: str, metadata: dict) -> str:
        """Embed and store a fact/preference/conversation summary."""
        # Categories: fact, preference, event, conversation_summary
        
    def recall(query: str, k: int = 5) -> list[Memory]:
        """Semantic search for relevant past memories."""
        
    def prune_stale(max_age_days: int = 90) -> int:
        """Remove old/redundant memories."""
```

**Hybrid storage strategy:**
- **SQLite** — structured, chronological logs (exact messages)
- **ChromaDB** — semantic memory (compressed summaries, facts, preferences)

**Memory lifecycle:**
1. Every conversation gets logged to SQLite (exact messages)
2. After conversation ends, LLM summarizes key points
3. Important facts/preferences extracted and stored in ChromaDB
4. Periodic pruning removes stale/redundant entries

#### Enhanced Prompt Builder

The prompt builder (from Phase 1) gets enhanced to query memory before each response:

```
User asks: "When is my standup?"
  → ChromaDB query: "standup meeting time"
  → Returns: "User's standup is at 10 AM every day" (stored 2 weeks ago)
  → Injected into system prompt as context
  → LLM responds: "Your standup is at 10 AM, as usual."
```

#### `GET/POST/DELETE /api/memory` — Memory Management

```json
// GET /api/memory?query=standup&limit=5
[
  {
    "id": "mem_abc123",
    "content": "User's standup meeting is at 10 AM every weekday",
    "category": "fact",
    "created_at": "2026-04-10T09:00:00Z",
    "relevance_score": 0.94
  }
]

// POST /api/memory
{
  "content": "My standup is at 10 AM",
  "category": "fact"
}

// DELETE /api/memory/mem_abc123
{ "deleted": true }
```

---

### 5.2 Advanced Tools

#### Screen Vision — `core/tools/screen_tools.py`

```
User: "What's on my screen?"
  → Capture screenshot via Pillow
  → Send to LLM vision model (Ollama supports LLaVA, Gemma3 multimodal)
  → LLM: "You have VS Code open with a Python file. Chrome is in the background 
          showing GitHub. Discord notification visible in the taskbar."
```

#### Media Control — `core/tools/media_tools.py`

| Action | Implementation |
|:-------|:---------------|
| Volume up/down/mute | `pycaw` (Windows Core Audio API) |
| Play/pause/next/prev | `keyboard` library (media keys) |
| Spotify | Local Spotify API (optional) |

#### Developer Tools — `core/tools/code_tools.py`

| Tool | Description | Safety |
|:-----|:------------|:-------|
| `run_command(cmd)` | Execute shell command | Whitelist + confirmation |
| `check_git_status(path)` | Git status of a repo | Read-only |
| `run_python_script(path)` | Execute Python script | Sandboxed subprocess |

#### Web Search — `core/tools/web_search.py`

Integrates with self-hosted SearXNG:

```python
async def search(query: str, num_results: int = 5) -> list[SearchResult]:
    """Query local SearXNG instance, parse and format results."""
    # Primary: SearXNG at localhost:8080
    # Fallback: DuckDuckGo lite scraping
```

---

### 5.3 Personality & Routines

#### `core/personality/persona.py` — O.V.I. Personality

```python
PERSONA = {
    "name": "O.V.I.",
    "full_name": "Omnipresent Voice Intelligence",
    "tone": "Professional but warm. Subtle wit. Never sarcastic.",
    "greeting_morning": "Good morning. All systems are online. {device_count} devices connected.",
    "greeting_afternoon": "Good afternoon. How can I assist you?",
    "greeting_evening": "Good evening. Your systems are running smoothly.",
    "farewell": "Standing by. Call me if you need anything.",
}
```

#### `core/personality/routines.py` — Automated Routines

```python
ROUTINES = {
    "good_morning": [
        "open_application('chrome')",
        "open_application('vscode')",
        "web_search('weather today')",
        "read_memory('schedule today')",
        "tts('Good morning. Weather is sunny, 72 degrees. You have a standup at 10 AM.')"
    ],
    "good_night": [
        "close_application('chrome')",
        "close_application('vscode')",
        "set_volume(0)",
        "tts('Goodnight. Closing non-essential applications. See you tomorrow.')"
    ]
}
```

Custom routines can be defined by the user via the memory API.

---

### 5.4 Phase 5 Verification

| Test | Action | Expected Result |
|:-----|:-------|:----------------|
| Store fact | _"Remember my standup is at 10 AM"_ | Fact stored in ChromaDB |
| Recall fact | Next day: _"When is my standup?"_ | _"Your standup is at 10 AM"_ |
| Conversation history | _"What did I ask last Tuesday?"_ | Retrieves relevant messages |
| Screen vision | _"What's on my screen?"_ | Accurate description of screen contents |
| Good night routine | _"Good night"_ | Apps close, volume drops, farewell message |

---

## Supporting Infrastructure

### Docker Services

#### `docker-compose.yml`

```yaml
version: '3.8'

services:
  searxng:
    image: searxng/searxng:latest
    container_name: ovi-searxng
    ports:
      - "8080:8080"
    volumes:
      - ./services/searxng:/etc/searxng
    restart: unless-stopped

  ntfy:
    image: binwiederhier/ntfy
    container_name: ovi-ntfy
    ports:
      - "8090:80"
    command: serve
    restart: unless-stopped
```

#### SearXNG Configuration — `services/searxng/settings.yml`

- JSON API output enabled (for programmatic access)
- Search engines: Google, DuckDuckGo, Wikipedia, StackOverflow
- Rate limiting disabled for local access
- No analytics, no tracking

---

## API Reference

### Complete Endpoint Map

| Method | Endpoint | Phase | Description |
|:-------|:---------|:------|:------------|
| `GET` | `/health` | 1 | System health status |
| `POST` | `/api/chat` | 1 | Send chat message, get response |
| `WS` | `/ws` | 1 | Real-time WebSocket connection |
| `POST` | `/api/voice` | 2 | Send audio, get transcription + response |
| `GET` | `/api/voice/tts/{id}` | 2 | Stream TTS audio response |
| `GET` | `/api/system/stats` | 3 | Live system statistics |
| `GET` | `/api/devices` | 4 | List connected device agents |
| `WS` | `/ws/agent` | 4 | Agent registration WebSocket |
| `GET` | `/api/memory` | 5 | Query stored memories |
| `POST` | `/api/memory` | 5 | Store a new memory |
| `DELETE` | `/api/memory/{id}` | 5 | Delete a memory |

---

## Design System

### Color Palette

| Token | Value | Usage |
|:------|:------|:------|
| `--bg-primary` | `#0a0a0f` | Main background |
| `--bg-surface` | `rgba(255, 255, 255, 0.03)` | Elevated surfaces |
| `--glass` | `rgba(255, 255, 255, 0.06)` | Glass panel fill |
| `--glass-border` | `rgba(0, 212, 255, 0.15)` | Glass panel border |
| `--glow-primary` | `#00d4ff` | Primary accent (cyan) |
| `--glow-secondary` | `#7b61ff` | Secondary accent (purple) |
| `--success` | `#00ff88` | Success states |
| `--warning` | `#ff6b35` | Warning states |
| `--error` | `#ff3366` | Error states |
| `--text-primary` | `#e0e0e0` | Primary text |
| `--text-secondary` | `#888888` | Secondary/muted text |

### Typography

| Role | Font | Fallback |
|:-----|:-----|:---------|
| **Headings** | Orbitron | sans-serif |
| **Body** | Inter | sans-serif |
| **Monospace** | JetBrains Mono | monospace |

### Effects

| Effect | CSS |
|:-------|:----|
| **Glass** | `backdrop-filter: blur(20px); background: rgba(255,255,255,0.04)` |
| **Glow** | `box-shadow: 0 0 30px rgba(0,212,255,0.1)` |
| **Scan line** | CSS keyframe animation — subtle horizontal line sweep |
| **Grid** | Faint cyan grid pattern on background via CSS gradients |

---

## Testing & Verification

### Per-Phase Test Commands

```bash
# Phase 1 — Core
python -m pytest tests/test_tools.py       # Tool execution
python -m pytest tests/test_chat.py        # Chat pipeline

# Phase 2 — Voice
python -m pytest tests/test_stt.py         # Transcription accuracy
python -m pytest tests/test_tts.py         # Audio generation

# Phase 3 — Dashboard
cd dashboard && npm run build              # Build succeeds
# Browser: navigate to localhost:3000, verify HUD renders

# Phase 4 — Multi-device
python -m pytest tests/test_agent.py       # Agent registration
# Manual: start agent on second device, verify commands work

# Phase 5 — Memory
python -m pytest tests/test_memory.py      # Store/recall accuracy
```

### Manual Verification Checklist

- [ ] Each phase ends with a complete user-flow smoke test
- [ ] Dashboard visually verified on desktop and mobile browsers
- [ ] Voice pipeline tested with real microphone input
- [ ] Cross-device commands tested on actual separate devices
- [ ] Memory recall tested across multiple sessions/days

---

## Risk Mitigation

| Risk | Impact | Mitigation Strategy |
|:-----|:-------|:--------------------|
| Ollama model too slow on CPU | High | Start with Qwen3 4B, upgrade to 8B with GPU |
| Wake word false positives | Medium | Adjustable sensitivity threshold, push-to-talk fallback |
| Windows compatibility issues | Medium | Use `edge-tts` over Piper, `pywinauto` as PyAutoGUI fallback |
| WebSocket disconnects | Medium | Auto-reconnect with exponential backoff, offline message queue |
| Memory database grows too large | Low | Periodic LLM summarization + pruning, configurable retention window |
| LLM hallucinates tool calls | High | Strict JSON schema validation, tool whitelist, confirmation prompt for destructive actions |
| SearXNG Docker fails to start | Low | Fallback to DuckDuckGo lite scraping |
| Microphone access denied | Medium | Clear error message, guide user to browser permissions |

---

<div align="center">

---

**O.V.I.** — Omnipresent Voice Intelligence

*Built by [Pushkar](https://github.com/pushkar156) · [Back to README](README.md)*

</div>
