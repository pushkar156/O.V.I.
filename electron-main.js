const { app, BrowserWindow, globalShortcut, Tray, Menu, nativeImage, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');
const { spawn } = require('child_process');

let mainWindow;
let tray;
let isQuitting = false;
let pythonProcess = null;

function startBackend() {
  const pythonPath = path.join(__dirname, 'venv', 'Scripts', 'python.exe');
  
  console.log('Starting Python backend...');
  
  pythonProcess = spawn(pythonPath, ['-m', 'core.main'], {
    cwd: __dirname,
    env: { 
      ...process.env, 
      PYTHONUNBUFFERED: '1',
      PYTHONPATH: __dirname // Ensure root is in path
    }
  });

  pythonProcess.stdout.on('data', (data) => {
    console.log(`[Backend]: ${data}`);
  });

  pythonProcess.stderr.on('data', (data) => {
    console.error(`[Backend Error]: ${data}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });
}

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    titleBarStyle: 'hidden',
    backgroundMaterial: 'mica',
    webPreferences: {
      nodeIntegration: false, // Security best practice
      contextIsolation: true, // Required for contextBridge
      preload: path.join(__dirname, 'preload.js'),
      devTools: isDev
    },
  });

  // Disable zooming and standard browser shortcuts
  mainWindow.webContents.on('before-input-event', (event, input) => {
    if ((input.control || input.meta) && (input.key === '=' || input.key === '-' || input.key === '0')) {
      event.preventDefault();
    }
    if (!isDev && (input.control || input.meta) && input.key.toLowerCase() === 'r') {
      event.preventDefault();
    }
  });

  const startURL = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, './out/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('close', (event) => {
    if (!isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createTray() {
  const iconPath = path.join(__dirname, 'assets/icon.png');
  const icon = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  
  tray = new Tray(icon);
  const contextMenu = Menu.buildFromTemplate([
    { 
      label: 'Show O.V.I.', 
      click: () => {
        mainWindow.show();
        mainWindow.focus();
      } 
    },
    { type: 'separator' },
    { 
      label: 'Quit O.V.I.', 
      click: () => {
        isQuitting = true;
        app.quit();
      } 
    }
  ]);

  tray.setToolTip('O.V.I. Sentinel');
  tray.setContextMenu(contextMenu);

  tray.on('double-click', () => {
    mainWindow.show();
    mainWindow.focus();
  });
}

function registerHotkeys() {
  globalShortcut.unregisterAll();
  globalShortcut.register('CommandOrControl+O', () => {
    if (mainWindow) {
      if (mainWindow.isVisible()) {
        mainWindow.hide();
      } else {
        mainWindow.show();
        mainWindow.focus();
      }
    }
  });
}

app.on('ready', () => {
  startBackend();
  createWindow();
  createTray();
  registerHotkeys();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Ensure Python backend dies when Electron dies
app.on('will-quit', () => {
  if (pythonProcess) {
    console.log('Stopping Python backend...');
    pythonProcess.kill();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost:3000') {
      event.preventDefault();
    }
  });
});

// IPC Listeners for Window Controls
ipcMain.on('window-minimize', () => {
  if (mainWindow) mainWindow.minimize();
});

ipcMain.on('window-close', () => {
  if (mainWindow) mainWindow.close(); // This will trigger the 'close' event (hide to tray)
});
