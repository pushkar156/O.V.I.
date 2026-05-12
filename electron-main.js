const { app, BrowserWindow, globalShortcut, Tray, Menu } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    show: false, // Don't show until ready-to-show
    frame: false, // Frameless for that sleek AI feel
    transparent: true, // Allows for glassmorphism effects
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'), // We'll create this next
    },
  });

  // In development, load the Next.js dev server
  const startURL = isDev 
    ? 'http://localhost:3000' 
    : `file://${path.join(__dirname, './out/index.html')}`;

  mainWindow.loadURL(startURL);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    if (isDev) {
      mainWindow.webContents.openDevTools({ mode: 'detach' });
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// Global hotkey to "Summon" O.V.I. (Task 2.2)
function registerHotkeys() {
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
  createWindow();
  registerHotkeys();
  
  // Set up a basic Tray icon (Task 2.4)
  // Note: You'll need an icon file eventually, using a placeholder for now
  // tray = new Tray(path.join(__dirname, 'assets/icon.png'));
  // const contextMenu = Menu.buildFromTemplate([
  //   { label: 'Show O.V.I.', click: () => mainWindow.show() },
  //   { label: 'Quit', click: () => app.quit() }
  // ]);
  // tray.setToolTip('O.V.I. Sentinel');
  // tray.setContextMenu(contextMenu);
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// Security: Disable certain navigations
app.on('web-contents-created', (event, contents) => {
  contents.on('will-navigate', (event, navigationUrl) => {
    const parsedUrl = new URL(navigationUrl);
    if (parsedUrl.origin !== 'http://localhost:3000') {
      event.preventDefault();
    }
  });
});
