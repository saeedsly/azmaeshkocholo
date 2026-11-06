const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

let autoUpdater = null;
try {
  ({ autoUpdater } = require('electron-updater'));
} catch {
  // Optional in unpacked dev environments
}

let mainWindow = null;

const getUserStorePath = (filename) =>
  path.join(app.getPath('userData'), filename);

function readJsonSafe(filePath, fallback) {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error('Failed reading JSON:', filePath, err);
  }
  return fallback;
}

function writeJsonSafe(filePath, data) {
  try {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Failed writing JSON:', filePath, err);
    return false;
  }
}

function fetchHttpsJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': 'DaneshmandKocholo-Updater/1.0' } }, (res) => {
        if (res.statusCode && res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          return resolve(fetchHttpsJson(res.headers.location));
        }
        if (res.statusCode !== 200) {
          return reject(new Error(`HTTP ${res.statusCode}`));
        }
        let raw = '';
        res.on('data', (chunk) => (raw += chunk));
        res.on('end', () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function createWindow() {
  const unpackedIcon = path.join(process.resourcesPath || '', 'app.asar.unpacked', 'dist', 'icon.ico');
  const devIcon = path.join(__dirname, '..', 'public', 'icon.ico');
  const iconPath = app.isPackaged && fs.existsSync(unpackedIcon) ? unpackedIcon : devIcon;

  mainWindow = new BrowserWindow({
    width: 1380,
    height: 860,
    minWidth: 980,
    minHeight: 660,
    title: 'دانشمند کوچولو | آزمایشگاه برق، شیمی و علوم',
    icon: iconPath,
    backgroundColor: '#090d1e',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  const devServerUrl = process.env.VITE_DEV_SERVER_URL;
  if (devServerUrl) {
    mainWindow.loadURL(devServerUrl);
  } else {
    mainWindow.loadFile(path.join(__dirname, '..', 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  if (autoUpdater && app.isPackaged) {
    autoUpdater.autoDownload = true;
    autoUpdater.on('update-downloaded', (info) => {
      if (mainWindow) {
        mainWindow.webContents.send('desktop:update-ready', {
          version: info.version,
        });
      }
    });
    autoUpdater.checkForUpdatesAndNotify().catch(() => {});
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers for Persistent Progress, Custom Level Packs & Online Updates
ipcMain.handle('desktop:getInfo', () => ({
  isDesktop: true,
  version: app.getVersion(),
  platform: process.platform,
  userDataPath: app.getPath('userData'),
}));

ipcMain.handle('desktop:toggleFullscreen', () => {
  if (!mainWindow) return false;
  const next = !mainWindow.isFullScreen();
  mainWindow.setFullScreen(next);
  return next;
});

ipcMain.handle('desktop:loadSavedPacks', () =>
  readJsonSafe(getUserStorePath('custom-level-packs.json'), [])
);

ipcMain.handle('desktop:savePacks', (_event, packs) =>
  writeJsonSafe(getUserStorePath('custom-level-packs.json'), packs)
);

ipcMain.handle('desktop:fetchOnlineManifest', async (_event, manifestUrl) => {
  const data = await fetchHttpsJson(manifestUrl);
  return data;
});

ipcMain.handle('desktop:importPackDialog', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    title: 'انتخاب فایل بسته مراحل جدید دانشمند کوچولو',
    filters: [{ name: 'Daneshmand Kocholo Pack', extensions: ['json', 'dkpack'] }],
    properties: ['openFile'],
  });
  if (result.canceled || !result.filePaths[0]) return null;
  const content = fs.readFileSync(result.filePaths[0], 'utf-8');
  return JSON.parse(content);
});

ipcMain.handle('desktop:exportPackDialog', async (_event, packData) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'ذخیره بسته مراحل دانشمند کوچولو',
    defaultPath: `daneshmand-kocholo-pack-${Date.now()}.json`,
    filters: [{ name: 'Daneshmand Kocholo Pack', extensions: ['json'] }],
  });
  if (result.canceled || !result.filePath) return false;
  fs.writeFileSync(result.filePath, JSON.stringify(packData, null, 2), 'utf-8');
  return true;
});

ipcMain.handle('desktop:checkAppUpdate', async () => {
  if (!autoUpdater || !app.isPackaged) {
    return { status: 'dev', message: 'در نسخه نصبی ویندوز، بروزرسانی خودکار فایل اجرایی فعال است.' };
  }
  try {
    const res = await autoUpdater.checkForUpdates();
    return { status: 'checked', version: res?.updateInfo?.version || app.getVersion() };
  } catch (err) {
    return { status: 'error', message: err.message };
  }
});

ipcMain.handle('desktop:installAppUpdate', () => {
  if (autoUpdater) {
    autoUpdater.quitAndInstall();
  }
});
