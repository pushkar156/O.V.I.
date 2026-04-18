<div align="center">

<img src="https://img.shields.io/badge/O.V.I.-Omnipresent%20Voice%20Intelligence-00d4ff?style=for-the-badge&labelColor=0a0a0f" alt="O.V.I." />

<br/>
<br/>

```
 ██████╗    ██╗   ██╗   ██╗
██╔═══██╗   ██║   ██║   ██║
██║   ██║   ██║   ██║   ██║
██║   ██║   ╚██╗ ██╔╝   ██║
╚██████╔╝    ╚████╔╝    ██║
 ╚═════╝      ╚═══╝     ╚═╝
```

### **Omnipresent Voice Intelligence**

*A fully local, privacy-first, multi-device AI operating environment*

<br/>

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-000000?style=flat-square&logo=ollama&logoColor=white)](https://ollama.com)
[![Next.js](https://img.shields.io/badge/Next.js-Dashboard-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![React](https://img.shields.io/badge/React-Mobile%20PWA-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![License](https://img.shields.io/badge/License-MIT-00d4ff?style=flat-square)](LICENSE)

<br/>

> *"Good morning. All systems online. Your desktop, laptop, and phone are connected. How can I assist?"*

---

[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

</div>

---

## 🧠 What is O.V.I.?

**O.V.I.** is a personal AI assistant that runs **entirely on your local network** — no cloud, no subscriptions, no data leaving your home. It connects your desktop, laptop, and phone via a WebSocket mesh over local Wi-Fi, uses a local LLM (via [Ollama](https://ollama.com)) for reasoning, and executes **real actions** on your devices.

Think of it as your own **JARVIS** — but real, running on your hardware, and completely private.

```
Marvel JARVIS                      O.V.I.
──────────────────────────────     ──────────────────────────────
Holographic 3D interface      →    Sleek glass-style web dashboard
Infinite knowledge            →    Local LLM (Qwen3 / Mistral / Llama)
Controls Iron Man suit        →    Controls your PC, laptop & phone
Instant global awareness      →    Local network awareness
Reads Tony's mind             →    Voice + chat commands
Runs on arc reactor           →    Runs on Ollama (localhost)
All devices synced magically  →    WebSocket mesh over local Wi-Fi
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎙️ Voice & Chat Interface
- **Wake word detection** — *"Hey O.V.I."* activates listening
- **Local STT** — faster-whisper converts speech to text
- **Natural TTS** — AI voice responds back
- **Multi-device** — chat from any browser on any device
- **Fully offline** — all processing stays on your network

</td>
<td width="50%">

### 🖥️ Desktop Automation
- **App control** — *"Open VS Code"*, *"Close Chrome"*
- **File operations** — find, move, delete, read files
- **Screen reading** — screenshot + LLM vision analysis
- **System monitoring** — CPU, RAM, disk, battery stats
- **Media control** — play, pause, volume, next track

</td>
</tr>
<tr>
<td width="50%">

### 💻 Cross-Device Intelligence
- **Push notifications** — *"Send a reminder to my phone"*
- **Screen capture** — *"What's on my laptop screen?"*
- **File transfer** — move files between devices via O.V.I.
- **Device mesh** — all agents auto-discovered on Wi-Fi
- **Unified command** — one interface controls everything

</td>
<td width="50%">

### 🧠 Memory & Learning
- **Long-term memory** — remembers your preferences & facts
- **Conversation recall** — *"What did I ask last Tuesday?"*
- **Pattern learning** — adapts to your habits over time
- **Routines** — *"Good night"* closes apps, dims screen
- **Semantic search** — ChromaDB vector-powered recall

</td>
</tr>
</table>

### 🔒 100% Local & Private

- All LLM inference via **Ollama** → stays on your machine
- Voice processing via **faster-whisper** → stays local
- No API keys required for core functionality
- No cloud. No subscriptions. No data leaving your home.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         O.V.I. ECOSYSTEM                          │
│                                                                    │
│   Your Devices (all on same Wi-Fi)                                │
│   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│   │  Desktop /   │  │   Laptop     │  │   Mobile     │           │
│   │  Main PC     │  │  (Windows /  │  │  (Android /  │           │
│   │  (The Brain) │  │   macOS)     │  │   iOS)       │           │
│   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘           │
│          │                 │                  │                    │
│          └─────────────────┼──────────────────┘                   │
│                            │  Local Wi-Fi Network                 │
│                            ▼                                      │
│              ┌─────────────────────────┐                          │
│              │    O.V.I. CORE SERVER   │  ← runs on your PC      │
│              │   (FastAPI + WS Hub)    │    at 192.168.x.x:8000  │
│              │                         │                          │
│              │  ┌───────────────────┐  │                          │
│              │  │  Ollama LLM       │  │  Qwen3 / Mistral /     │
│              │  │  (localhost:11434) │  │  Llama3 / Gemma3       │
│              │  └───────────────────┘  │                          │
│              │  ┌───────────────────┐  │                          │
│              │  │  Tool Router      │  │  Maps intent → actions  │
│              │  └───────────────────┘  │                          │
│              │  ┌───────────────────┐  │                          │
│              │  │  Memory Store     │  │  SQLite + ChromaDB      │
│              │  │  (context + RAG)  │  │  (remembers everything) │
│              │  └───────────────────┘  │                          │
│              └─────────────────────────┘                          │
│                            │                                      │
│              ┌─────────────┼──────────────┐                       │
│              ▼             ▼              ▼                        │
│         PC Agent      Laptop Agent   Mobile Agent                 │
│         (Python)      (Python)       (PWA / React)                │
│         Controls      Controls       Controls phone               │
│         desktop       laptop         notifications, location      │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **LLM Engine** | Ollama + Qwen3 8B / Mistral 7B | Brain — reasoning & generation |
| **STT** | faster-whisper (local) | Speech-to-text transcription |
| **TTS** | edge-tts | Natural voice synthesis |
| **Wake Word** | openWakeWord | *"Hey O.V.I."* detection |
| **PC Automation** | PyAutoGUI + psutil + subprocess | Desktop control & system info |
| **Screen Vision** | Pillow + LLM multimodal (LLaVA) | Screenshot analysis |
| **Core Server** | FastAPI + WebSockets | Central hub for all devices |
| **Memory** | SQLite + ChromaDB | Short + long-term memory |
| **Web Search** | SearXNG (self-hosted) | Private web search |
| **Desktop UI** | Next.js | Iron Man-style glass dashboard |
| **Mobile UI** | React (PWA) | Phone interface |
| **Device Discovery** | mDNS / Zeroconf | Auto-find devices on Wi-Fi |
| **Notifications** | WebPush / ntfy.sh | Push notifications to phone |

---

## 📁 Project Structure

```
ovi/
│
├── core/                           ← O.V.I. Core Server (runs on main PC)
│   ├── main.py                     ← FastAPI app entry point
│   ├── config.py                   ← Centralized Pydantic settings
│   ├── llm/
│   │   ├── ollama_client.py        ← Async Ollama API wrapper
│   │   ├── prompt_builder.py       ← System prompt + context builder
│   │   └── tool_router.py          ← Parse LLM response → dispatch tools
│   ├── memory/
│   │   ├── short_term.py           ← Conversation history manager
│   │   ├── long_term.py            ← ChromaDB vector memory
│   │   ├── schema.py               ← SQLAlchemy models
│   │   └── database.py             ← SQLite async manager
│   ├── voice/
│   │   ├── stt.py                  ← faster-whisper transcription
│   │   ├── tts.py                  ← edge-tts voice synthesis
│   │   └── wake_word.py            ← "Hey O.V.I." always-on listener
│   ├── tools/                      ← All executable tools
│   │   ├── base.py                 ← BaseTool interface
│   │   ├── system_tools.py         ← CPU, RAM, battery, processes
│   │   ├── app_control.py          ← Open/close/focus applications
│   │   ├── file_tools.py           ← Find, move, delete, read files
│   │   ├── browser_tools.py        ← Open URLs, search
│   │   ├── clipboard_tools.py      ← Read/write clipboard
│   │   ├── screen_tools.py         ← Screenshot + LLM vision analysis
│   │   ├── media_tools.py          ← Music, volume, video control
│   │   ├── code_tools.py           ← Run scripts, check git status
│   │   ├── web_search.py           ← SearXNG local search
│   │   └── cross_device.py         ← Ping other agents, send data
│   ├── agents/
│   │   ├── agent_registry.py       ← Track connected devices
│   │   └── agent_protocol.py       ← WebSocket message protocol
│   ├── personality/
│   │   ├── persona.py              ← O.V.I. personality config
│   │   └── routines.py             ← Automated routines
│   └── api/
│       ├── chat.py                 ← POST /api/chat
│       ├── voice.py                ← POST /api/voice
│       ├── websocket.py            ← WS /ws — real-time bidirectional
│       ├── health.py               ← GET /health
│       ├── system.py               ← GET /api/system/stats
│       ├── devices.py              ← GET /api/devices
│       └── memory.py               ← GET/POST /api/memory
│
├── agent/                          ← Lightweight agent (runs on each device)
│   ├── agent.py                    ← Connects to core, registers capabilities
│   ├── local_tools.py              ← Device-specific tools
│   ├── screenshot.py               ← Capture device screen
│   └── config.json                 ← Device configuration
│
├── dashboard/                      ← Next.js Desktop UI (glass aesthetic)
│   ├── src/
│   │   ├── app/                    ← App router pages
│   │   ├── components/             ← GlassPanel, OVIChat, VoiceOrb, etc.
│   │   └── lib/                    ← O.V.I. client library
│   └── public/
│
├── mobile/                         ← React PWA (phone interface)
│   ├── src/
│   │   ├── components/             ← ChatView, VoiceButton, DeviceList
│   │   └── lib/                    ← O.V.I. client library
│   └── public/
│
├── services/                       ← Self-hosted supporting services
│   ├── searxng/                    ← Private local web search
│   └── ntfy/                       ← Self-hosted push notifications
│
├── data/                           ← Runtime data (gitignored)
├── docker-compose.yml              ← Run services in one command
├── requirements.txt                ← Python dependencies
├── .env.example                    ← Environment config template
└── IMPLEMENTATION.md               ← Detailed implementation guide
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Minimum | Recommended |
|:------------|:--------|:------------|
| **Python** | 3.11+ | 3.12 |
| **RAM** | 8 GB | 16 GB+ |
| **GPU** | None (CPU works) | NVIDIA GTX 1060+ |
| **OS** | Windows 10 / Ubuntu 20.04 | Windows 11 / Ubuntu 22.04 |
| **Node.js** | 18+ | 20 LTS |
| **Docker** | Latest | Latest |

### 1. Install Ollama

```bash
# Download from https://ollama.com/download
# Then pull a model:
ollama pull qwen3:8b
```

### 2. Clone & Setup

```bash
git clone https://github.com/pushkar156/O.V.I..git
cd O.V.I.

# Create virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Linux/macOS

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env
```

### 3. Start the Core Server

```bash
# Make sure Ollama is running first
ollama serve

# Start O.V.I. Core
uvicorn core.main:app --host 0.0.0.0 --port 8000 --reload
```

### 4. Start the Dashboard

```bash
cd dashboard
npm install
npm run dev
```

### 5. Access O.V.I.

| Interface | URL |
|:----------|:----|
| **Dashboard** | `http://192.168.x.x:3000` |
| **API** | `http://192.168.x.x:8000` |
| **Health Check** | `http://192.168.x.x:8000/health` |
| **API Docs** | `http://192.168.x.x:8000/docs` |

> Replace `192.168.x.x` with your PC's local IP address.

### 6. (Optional) Start Docker Services

```bash
# For SearXNG web search & ntfy notifications
docker compose up -d
```

---

## 🌐 Deployment Map

Everything runs **locally on your Wi-Fi** — zero internet required for core functionality.

| Service | Host | Port |
|:--------|:-----|:-----|
| O.V.I. Core (FastAPI) | Main PC | `:8000` |
| Ollama LLM | Main PC | `:11434` |
| Dashboard (Next.js) | Main PC | `:3000` |
| SearXNG (search) | Main PC (Docker) | `:8080` |
| ntfy (notifications) | Main PC (Docker) | `:8090` |
| Device Agents | Laptop / other PCs | → connects to `:8000` |
| Mobile PWA | Phone browser | → accesses `:3000` |

---

## 💬 Example Commands

```
"Hey O.V.I., open my projects folder"
"How much RAM is being used right now?"
"Send a notification to my phone — meeting in 5 minutes"
"What files did I work on yesterday?"
"Take a screenshot and tell me what's on my screen"
"Search for the best Python async tutorial"
"Run my Flask server"
"Play something on Spotify"
"What did I ask you about last week?"
"Copy the last thing I typed to my phone clipboard"
"Good night"  →  closes apps, sets volume to 0, dims screen
```

---

## 🗺️ Roadmap

| Phase | Milestone | Status |
|:------|:----------|:-------|
| **Phase 1** — The Brain | Ollama + FastAPI + 5 core tools | 🔨 In Progress |
| **Phase 2** — The Voice | Wake word + STT + TTS pipeline | ⏳ Planned |
| **Phase 3** — The Dashboard | Iron Man glass UI + live stats | ⏳ Planned |
| **Phase 4** — Multi-Device | Agent mesh + mobile PWA | ⏳ Planned |
| **Phase 5** — Memory & Personality | Long-term memory + routines | ⏳ Planned |

> See [IMPLEMENTATION.md](IMPLEMENTATION.md) for the complete technical implementation guide.

---

## 🔑 What Makes O.V.I. Different

| Feature | Siri / Alexa | Open WebUI | O.V.I. |
|:--------|:-------------|:-----------|:-------|
| Fully local | ❌ | ✅ | ✅ |
| Multi-device mesh | ❌ | ❌ | ✅ |
| PC automation | Partial | ❌ | ✅ |
| Screen vision | ❌ | Partial | ✅ |
| Cross-device file ops | ❌ | ❌ | ✅ |
| Custom wake word | ❌ | ❌ | ✅ |
| Iron Man-style UI | ❌ | ❌ | ✅ |
| Long-term memory | Limited | ❌ | ✅ |
| No subscription | ❌ | ✅ | ✅ |
| Works offline | ❌ | ✅ | ✅ |

---

## 🧰 Hardware Setup

| Device | Role | Minimum |
|:-------|:-----|:--------|
| **Main PC** | Core server + Ollama brain | 16 GB RAM, GPU optional |
| **Laptop** | Secondary agent | 8 GB RAM, Python installed |
| **Android Phone** | Mobile agent (PWA) | Any modern Android browser |
| **Router** | Local network hub | Any home Wi-Fi router |

> **GPU note:** A GPU (even GTX 1060) makes Ollama run **10x faster**. Without GPU, Qwen3 4B still works at ~5-8 tokens/sec on CPU — usable but not instant.

---

## 🤝 Contributing

Contributions are welcome! Please read the implementation guide first:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<br/>

**Built with ❤️ by [Pushkar](https://github.com/pushkar156)**

*O.V.I. — Because your AI should work for you, not the other way around.*

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/pushkar156/O.V.I.?style=social)](https://github.com/pushkar156/O.V.I.)

</div>
