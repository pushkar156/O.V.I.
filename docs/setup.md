# 🚀 O.V.I. Desktop Sentinel: Startup Guide

Follow these steps to initialize the O.V.I. Command Center. This guide is updated for the **V3 Ecosystem Sentinel** architecture.

---

## 🛠️ Prerequisites
Before starting, ensure the following are installed and configured:
- [ ] **Ollama**: Local AI engine (Must be running for reasoning and vision).
- [ ] **Python 3.10+**: Core logic and system tools.
- [ ] **Node.js**: Powers the HUD and Desktop interface.
- [ ] **FFmpeg**: Required for voice processing. (Configured in `core/config.py`).

---

## 📦 Step 0: Setup & Dependencies
Before launching, you must install the required libraries for both the Brain (Python) and the Face (Node.js).

### **1. Python Backend Setup**
Create a virtual environment and install all dependencies:
```powershell
# Create virtual environment
python -m venv venv

# Activate it
.\venv\Scripts\activate

# Install core libraries
pip install -r requirements.txt
```

### **2. Node.js Dashboard & Frame Setup**
Install dependencies for both the Electron frame and the Next.js HUD:
```powershell
# 1. Install Electron dependencies (Root)
npm install

# 2. Install HUD dependencies (Dashboard)
cd dashboard
npm install
cd ..
```


---

## ⚡ Step 1: Intelligence Setup (Neural Engine)

O.V.I. V2 uses high-performance models for reasoning, vision, and memory.

### **1. Start the Ollama Service**
If Ollama is not already running in your system tray:
```powershell
ollama serve
```

### **2. Pull Required Models**
Run these once to ensure your local brain has all its lobes:
```powershell
# Reasoning Engine (Logic & Tools)
ollama pull qwen2.5:7b

# Embedding Engine (Memory & Knowledge)
ollama pull nomic-embed-text

# Vision Engine (Screen Analysis)
ollama pull moondream
```

### **3. Verify & Test**
Check if the models are loaded correctly:
```powershell
ollama list

# Optional: Quick logic check
ollama run qwen2.5:7b "Are you ready, Sentinel?"
```

---

## 🛡️ Step 2: Ignite the Core (Administrator Mode)
To allow O.V.I. to control system processes, manage power (Shutdown/Sleep), and interact with other apps, the backend **must** run with Administrator privileges.

### **The Easy Way (Recommended)**
1. Navigate to the project root: `.../Ovi`.
2. **Right-click** `start_sentinel_admin.bat`.
3. Select **"Run as Administrator"**.

### **The Manual Way**
1. Open **PowerShell** as Administrator.
2. Navigate to the drive and folder:
   ```powershell
   E:
   cd "E:\Pushkar\Personal Projects\Ovi"
   python -m core.main
   ```


---

## 🖥️ Step 3: Launch the HUD (Dashboard & Desktop)
The visual interface consists of the Next.js Dashboard and the Electron desktop frame.

### **1. Start the Frontend Server**
Open a terminal in the root and run:
```powershell
cd dashboard
npm run dev
```
*This starts the Dashboard at http://localhost:3000.*

### **2. Launch the Desktop Frame**
In a **second terminal** (ensure you are in the project root), run:
```powershell
npm run electron
```

*This wraps the dashboard in the native Sentinel glass frame and initializes the system tray.*

---

## 🎧 Step 4: Sentinel Verification
Once the system is operational, verify the "Sentinel Glass" state:

- **Summon Key**: Press `Ctrl + O` to show/hide the sentinel window.
- **Visual Identity**: You should see the **Obsidian Glass** UI with glowing states.
- **System Tool Check**: Ask O.V.I. *"List my top CPU processes"* to verify Administrator tool access.
- **Voice Wake**: Say *"Hey OVI"* to test the wake-word engine.

---

## ❓ Troubleshooting
- **"Permission Denied" in Tools**: Ensure you ran `core/main.py` or the `.bat` file as **Administrator**.
- **Wake Word Errors**: On Windows, we use `onnxruntime` instead of `tflite-runtime`. Ensure you've run `pip install onnxruntime`.
- **Port 8000 Busy**: Another instance of O.V.I. is likely running. Check your task manager or system tray.

---

<div align="center">
  <b>System Status: <span style="color: #00ff00">OPERATIONAL</span></b><br/>
  <i>"I am active and monitoring. Standing by for your command, Commander."</i>
</div>

