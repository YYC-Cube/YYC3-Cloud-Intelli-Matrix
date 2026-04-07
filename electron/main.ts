import { app, BrowserWindow, Tray, Menu, nativeImage, dialog, shell } from 'electron';
import path from 'path';
import { registerAllIPCHandlers, registerDatabaseHandlers } from './ipc-handlers';

let mainWindow: Electron.BrowserWindow | null = null;
let tray: Electron.Tray | null = null;

const isMac = process.platform === 'darwin';

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'YYC³ Cloud Intelli-Matrix',
    icon: path.join(__dirname, '../public/yyc3-icons/macOS/512.png'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#060e1f',
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: isMac ? 'hiddenInset' : 'default',
    trafficLightPosition: { x: 12, y: 12 },
  });

  mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));

  mainWindow.on('ready-to-show', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

function createTray() {
  const trayIconPath = path.join(__dirname, '../public/yyc3-icons/macOS/512.png');
  const trayIcon = nativeImage.createFromPath(trayIconPath).resize({ width: 16, height: 16 });

  tray = new Tray(trayIcon);
  tray.setContextMenu(Menu.buildFromTemplate([
    {
      label: '显示主窗口',
      click: () => {
        if (mainWindow) {
          mainWindow.show();
          mainWindow.focus();
        }
      },
    },
    {
      label: '重启应用',
      click: () => {
        app.relaunch();
        app.exit();
      },
    },
    {
      label: '检查更新',
      click: async () => {
        if (mainWindow) {
          dialog.showMessageBox(mainWindow, {
            title: '检查更新',
            message: '当前版本: v1.0.0',
            detail: '请访问 GitHub 查看最新版本',
            buttons: ['确定'],
          });
        }
      },
    },
    { type: 'separator' },
    {
      label: '退出',
      click: () => {
        app.quit();
      },
    },
  ]));

  tray.setIgnoreDoubleClickEvents(true);
  tray.on('click', () => {
    if (mainWindow) {
      mainWindow.show();
      mainWindow.focus();
    }
  });
}

function init() {
  // 注册所有 IPC 处理器
  registerAllIPCHandlers();
  registerDatabaseHandlers();

  if (app.requestSingleInstanceLock()) {
    app.on('second-instance', () => {
      if (mainWindow) {
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.show();
        mainWindow.focus();
      }
    });

    app.whenReady().then(() => {
      createWindow();
      createTray();

      app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
          createWindow();
        }
      });
    });

    app.on('window-all-closed', () => {
      if (!isMac) {
        app.quit();
      }
    });
  } else {
    app.quit();
  }
}

init();
