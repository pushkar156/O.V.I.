<div align="center">

<img src="https://img.shields.io/badge/O.V.I.-Desktop%20AI%20Sentinel-00d4ff?style=for-the-badge&labelColor=0a0a0f" alt="O.V.I." />

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

*A fully local, privacy-first, native desktop AI teammate*

<br/>

[![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat-square&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=flat-square&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![Ollama](https://img.shields.io/badge/Ollama-Local%20LLM-000000?style=flat-square&logo=ollama&logoColor=white)](https://ollama.com)
[![Electron](https://img.shields.io/badge/Electron-Native%20App-47848F?style=flat-square&logo=electron&logoColor=white)](https://www.electronjs.org)
[![Next.js](https://img.shields.io/badge/Next.js-Dashboard-000000?style=flat-square&logo=next.js&logoColor=white)](https://nextjs.org)
[![License](https://img.shields.io/badge/License-MIT-00d4ff?style=flat-square)](LICENSE)

<br/>

> *"Good evening, Pushkar. All systems online. How can I assist?"*

---

[Features](#-features) · [Architecture](#-architecture) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [Roadmap](#-roadmap) · [Contributing](#-contributing)

</div>

---

## 🧠 What is O.V.I.?

**O.V.I.** is not a chatbot. She's your **AI teammate** — a native desktop sentinel that runs **entirely on your machine**, starts when your laptop starts, lives in your system tray, responds to your voice from any screen, and executes **real actions** on your PC.

She uses a local LLM (via [Ollama](https://ollama.com)) for reasoning, learns your preferences over time through self-training memory, and connects your devices via an authenticated WebSocket mesh over local Wi-Fi.

Think of her as your own **JARVIS** — but real, running on your hardware, and completely private.

```
Marvel JARVIS                      O.V.I.
──────────────────────────────     ──────────────────────────────
Holographic 3D interface      →    Native Electron app (glass UI)
Infinite knowledge            →    Local LLM (Qwen3 / Ollama)
Controls Iron Man suit        →    Controls your entire PC
Instant global awareness      →    Local network mesh awareness
Reads Tony's mind             →    Voice + wake word ("Hey OVI")
Runs on arc reactor           →    Runs on Ollama (localhost)
All devices synced magically  →    Authenticated WebSocket mesh
Learns Tony's patterns        →    Self-training memory (ChromaDB)
Always there, never crashes   →    Native desktop sentinel (Electron)
```

---

## ✨ Features

<table>
<tr>
<td width="50%">

### 🎙️ Voice-First Interaction
- **Wake word** — *"Hey OVI"* activates listening instantly
- **Local STT** — Faster-Whisper converts speech to text
- **Natural TTS** — Edge-TTS speaks back with a natural voice
- **Global hotkey** — `Ctrl+Space` summons O.V.I. from anywhere
- **Native app** — Electron window, not a browser tab
- **Fully offline** — all processing stays on your machine

</td>
<td width="50%">

### 🖥️ Desktop Mastery
- **App control** — *"Open VS Code"*, *"Close Chrome"*
- **File operations** — find, move, delete, read files
- **Screen reading** — screenshot + LLM vision analysis
- **System monitoring** — CPU, RAM, disk stats in real-time
- **Window management** — split screens, multi-monitor layouts
- **Dev suite** — *"Set up my coding environment"* → full automation

</td>
</tr>
<tr>
<td width="50%">

### 🧠 Self-Training Intelligence
- **Auto-extraction** — learns facts from every conversation
- **Self-healing** — retries failed tools with adjusted parameters
- **Long-term memory** — ChromaDB remembers your preferences
- **Conversation recall** — *"What did I ask last Tuesday?"*
- **Proactive context** — injects your history before you even ask
- **Routines** — *"Good night"* → closes apps, dims screen

</td>
<td width="50%">

### 💻 Cross-Device Mesh (O.V.I. Link)
- **Authenticated mesh** — shared-secret secured WebSocket
- **Push notifications** — *"Send a reminder to my phone"*
- **Screen capture** — *"What's on my laptop screen?"*
- **File transfer** — move files between devices via O.V.I.
- **Unified command** — one voice controls everything
- **Boot-on-startup** — starts with Windows, lives in tray

</td>
</tr>
</table>

### 🔒 100% Local & Private

- All LLM inference via **Ollama** → stays on your machine
- Voice processing via **Faster-Whisper** → stays local
- Memory stored in **local SQLite + ChromaDB** → never leaves your PC
- No API keys required. No cloud. No subscriptions. No data leaving your home.

---

## 🏗️ Architecture

```
┌────────────────────────────────────────────────────────────────────┐
│                         O.V.I. ECOSYSTEM                           │
│                                                                    │
│   ┌──────────────────────────────────────────────────────────┐     │
│   │              ELECTRON NATIVE APP (The Face)              │     │
│   │   ┌──────────────────────────────────────────────────┐   │     │
│   │   │  Next.js Dashboard (Glassmorphism UI)            │   │     │
│   │   │  • Chat Interface    • System HUD                │   │     │
│   │   │  • Voice Orb         • Memory Browser            │   │     │
│   │   │  • Device Status     • Tool Manager              │   │     │
│   │   └──────────────────────────────────────────────────┘   │     │
│   │   [Ctrl+Space] Global Summon  |  Always-on-Top Overlay   │     │
│   │   System Tray Integration     |  Boot-on-Startup         │     │
│   └──────────────────────────────────────────────────────────┘     │
│                            │                                       │
│                     WebSocket + REST                               │
│                            │                                       │
│   ┌─────────────────────────────────────────────────────────┐      │
│   │              PYTHON CORE SERVER (The Brain)             │      │
│   │              FastAPI @ localhost:8000                   │      │
│   │                                                         │      │
│   │   ┌──────────────┐  ┌──────────────┐  ┌─────────────┐   │      │
│   │   │  Ollama LLM  │  │  Tool Router │  │  Memory     │   │      │
│   │   │  Qwen3 8B    │  │  Intent →    │  │  SQLite +   │   │      │
│   │   │  :11434      │  │  Actions     │  │  ChromaDB   │   │      │
│   │   └──────────────┘  └──────────────┘  └─────────────┘   │      │
│   │                                                         │      │
│   │   ┌──────────────┐  ┌──────────────┐  ┌─────────────┐   │      │
│   │   │  Voice Stack │  │  Self-Heal   │  │  Persona    │   │      │
│   │   │  Wake Word + │  │  Auto-retry  │  │  Warm AI    │   │      │
│   │   │  STT + TTS   │  │  + Learning  │  │  Teammate   │   │      │
│   │   └──────────────┘  └──────────────┘  └─────────────┘   │      │
│   └─────────────────────────────────────────────────────────┘      │
│                            │                                       │
│              ┌─────────────┼──────────────┐                        │
│              ▼             ▼              ▼                        │
│         PC Agent      Laptop Agent   Mobile Agent (V3)             │
│         (Python)      (Python)       (React Native)                │
│         Controls      Controls       Controls phone                │
│         desktop       laptop         notifications                 │
└────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|:------|:-----------|:--------|
| **LLM Engine** | Ollama + Qwen3 8B | Brain — all reasoning & generation |
| **STT** | Faster-Whisper (local) | Speech-to-text transcription |
| **TTS** | Edge-TTS | Natural voice synthesis |
| **Wake Word** | OpenWakeWord | *"Hey OVI"* detection |
| **Desktop App** | Electron + Next.js | Native window, tray, global hotkeys |
| **PC Automation** | PyAutoGUI + psutil | Desktop control & system info |
| **Audio Control** | Pycaw + Comtypes | Volume & audio routing |
| **Tool Router** | Custom (FastAPI + async) | Intent → sandboxed tool execution |
| **Core Server** | FastAPI + WebSockets | Central hub for all devices |
| **Memory (Short)** | SQLite + SQLAlchemy | Conversation history |
| **Memory (Long)** | ChromaDB | Vector embeddings & RAG |
| **Styling** | Tailwind CSS | Glassmorphism UI |
| **Animations** | Framer Motion | Smooth UI transitions |
| **System Tray** | Pystray | Background sentinel presence |
| **Logging** | Loguru | Structured application logs |

---

## 📁 Project Structure

```
ovi/
│
├── core/                           ← O.V.I. Core Server (The Brain)
│   ├── main.py                     ← FastAPI app + lifespan management
│   ├── config.py                   ← Environment & settings
│   ├── llm/
│   │   ├── ollama_client.py        ← Async Ollama API wrapper
│   │   ├── prompt_builder.py       ← Dynamic system prompt + RAG context
│   │   └── tool_router.py          ← Parse LLM response → dispatch tools
│   ├── memory/
│   │   ├── database.py             ← SQLAlchemy/SQLite async manager
│   │   ├── long_term.py            ← ChromaDB vector memory + RAG
│   │   └── schema.py               ← DB models (messages, users, tools)
│   ├── voice/
│   │   ├── stt.py                  ← Faster-Whisper transcription
│   │   ├── tts.py                  ← Edge-TTS voice synthesis
│   │   └── wake_word.py            ← "Hey OVI" always-on listener
│   ├── tools/                      ← All executable tools (sandboxed)
│   │   ├── system_tools.py         ← CPU, RAM, disk, theme control
│   │   ├── volume_control.py       ← Audio manipulation (pycaw)
│   │   ├── window_organizer.py     ← Desktop layout management
│   │   ├── routine_manager.py      ← Automated task scheduling
│   │   ├── code_tools.py           ← Run scripts, read/write files
│   │   ├── browser_tools.py        ← Open URLs, web search
│   │   ├── web_search.py           ← SearXNG integration
│   │   ├── cross_device.py         ← Mesh agent commands
│   │   └── git_monitor.py          ← Real-time git status tracking
│   ├── personality/
│   │   ├── persona.py              ← Warm persona engine + greetings
│   │   └── routines.py             ← Proactive behavior triggers
│   ├── agents/
│   │   └── agent_registry.py       ← Track connected devices
│   ├── desktop/
│   │   └── tray.py                 ← System tray integration
│   └── api/
│       ├── chat.py                 ← Central brain endpoint
│       ├── voice.py                ← Audio → transcribe → respond
│       ├── websocket.py            ← Real-time mesh hub
│       ├── devices.py              ← List all agents
│       └── memory.py               ← CRUD for RAG memory
│
├── agent/                          ← Lightweight agent (remote devices)
│   ├── agent.py                    ← Connects to core, registers tools
│   └── local_tools.py              ← Device-specific tools
│
├── dashboard/                      ← Next.js + Electron (The Face)
│   ├── main.js                     ← Electron entry point
│   ├── src/
│   │   ├── app/                    ← Next.js App Router pages
│   │   ├── components/             ← Glassmorphism UI components
│   │   ├── hooks/                  ← useSocket, useVoice, etc.
│   │   └── lib/                    ← API clients & utils
│   └── package.json
│
├── mobile/                         ← Mobile app (V3 — Future)
│
├── data/                           ← Local storage (gitignored)
│   ├── ovi.db                      ← SQLite database
│   ├── chroma/                     ← ChromaDB vector store
│   └── logs/                       ← Application logs
│
├── scripts/                        ← Utility scripts
│   ├── manage_startup.py           ← Windows Registry auto-start
│   └── cleanup_desktop.py          ← Automated desktop cleanup
│
├── config/
│   └── routines.yaml               ← Automated routine definitions
│
├── requirements.txt                ← Python dependencies
├── .env.example                    ← Environment config template
└── launch_ovi.bat                  ← Boot launcher
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Minimum | Recommended |
|:------------|:--------|:------------|
| **Python** | 3.11+ | 3.12 |
| **RAM** | 8 GB | 16 GB+ |
| **GPU** | None (CPU works) | NVIDIA GTX 1060+ |
| **OS** | Windows 10 | Windows 11 |
| **Node.js** | 18+ | 20 LTS |
| **Ollama** | Latest | Latest |

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

# Install dependencies
pip install -r requirements.txt

# Copy environment config
cp .env.example .env
```

### 3. Master Ignition (One-Click)

O.V.I. is designed for zero-friction operation. You don't need to manage multiple terminals.

1.  **Pull the Model**:
    ```bash
    ollama pull qwen2.5:7b
    ```
2.  **Ignite**:
    Right-click **`OVI.bat`** and select **"Run as Administrator"**.

This single script will:
- ✅ Verify Administrative privileges.
- ✅ Auto-sync Python & Node dependencies (if changed).
- ✅ Start Ollama (if not running).
- ✅ Launch the O.V.I. Brain (Backend).
- ✅ Launch the O.V.I. HUD (Dashboard).
- ✅ Deploy the Desktop Sentinel (Electron).

---

## 💬 Native Desktop Experience
O.V.I. lives in your system tray. Use **`Ctrl + O`** from anywhere to toggle her presence.

---

| Interface | URL |
|:----------|:----|
| **Dashboard** | `http://localhost:3000` |
| **API Docs** | `http://localhost:8000/docs` |
| **Health** | `http://localhost:8000/health` |

---

## 💬 Example Commands

```
"Hey OVI, open my projects folder"
"How much RAM is being used right now?"
"Set up my coding environment"
    → Opens VS Code, starts dev servers, sets dark mode, volume to 20%
"Take a screenshot and tell me what's on my screen"
"Volume to 30%"
"What did I ask you about last week?"
"Remember that my standup is at 10 AM every day"
"What am I working on today?"
    → Pulls from memory: "You mentioned working on OVI V2 yesterday"
"Good night"
    → Closes apps, sets volume to 0, dims screen
```


---

## 🔑 What Makes O.V.I. Different

| Feature | Siri / Alexa | ChatGPT | Open WebUI | O.V.I. |
|:--------|:-------------|:--------|:-----------|:-------|
| Fully local | ❌ | ❌ | ✅ | ✅ |
| Native desktop app | ❌ | ❌ | ❌ | ✅ |
| Multi-device mesh | ❌ | ❌ | ❌ | ✅ |
| PC automation | Partial | ❌ | ❌ | ✅ |
| Screen vision | ❌ | Partial | Partial | ✅ |
| Cross-device file ops | ❌ | ❌ | ❌ | ✅ |
| Custom wake word | ❌ | ❌ | ❌ | ✅ |
| Self-training memory | Limited | Limited | ❌ | ✅ |
| Global hotkey summon | ❌ | ❌ | ❌ | ✅ |
| No subscription | ❌ | ❌ | ✅ | ✅ |
| Works offline | ❌ | ❌ | ✅ | ✅ |

---

## 🗺️ Roadmap (V3: "The Ecosystem")

| Phase | Focus | Status |
|:------|:------|:-------|
| **V1** | **The Prototype** (Core Server, Voice Loop, LLM, Basic Tools) | ✅ Completed |
| **V2** | **The Desktop Sentinel** (Electron HUD, Security Sandbox, Mesh Auth, MemorySentinel) | ✅ Completed |
| **V3.1** | **Desktop UX Overhaul** (Modern UI, Window Layout Tool, Meeting Mode, Voice Fallback) | 🔄 Next Up |
| **V3.2** | **Unified API & Backend** (Versioned `/api/v1/`, JWT Auth, Typed WebSockets, Telemetry) | 📋 Planned |
| **V3.3** | **Website Dashboard** (Responsive remote Next.js HUD, Memory Explorer, System Monitor) | 📋 Planned |
| **V3.4** | **Chrome Extension** (Manifest V3 Side Panel, Page Context Injection, Tab Management) | 📋 Planned |
| **V3.5** | **Mobile Companion** (React Native / PWA, Push-to-Talk, Remote PC Commands, Alerts) | 📋 Planned |
| **V3.6** | **Intelligence & Memory** (Cross-platform sync, Real-time Screen Vision, Dynamic Routines) | 📋 Planned |
| **V3.7** | **Release & Showcase** (Installer `.exe`, GitHub cleanup, Chrome Store listing, Demo) | 📋 Planned |

---

## 🧰 Hardware

| Device | Role | Minimum |
|:-------|:-----|:--------|
| **Main PC** | Core server + Ollama brain | 16 GB RAM, GPU optional |
| **Laptop** | Secondary agent | 8 GB RAM, Python |
| **Android Phone** | Mobile agent (V3) | Any modern Android |

> **GPU note:** A GPU (even GTX 1060) makes Ollama run **10x faster**. Without GPU, Qwen3 models still work at ~5-8 tokens/sec on CPU — usable but not instant.

---

## 🤝 Contributing

Contributions are welcome! Please read the implementation guide first:

1. Fork the repository
2. Create your feature branch (`git checkout -b feat/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feat/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

<br/>

**Built by [Pushkar](https://github.com/pushkar156)**. Powered by Ollama. Inspired by Jarvis. Owned by Tony Stark.

</div>