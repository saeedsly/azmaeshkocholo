const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');
const crypto = require('crypto');

let autoUpdater = null;
try {
  ({ autoUpdater } = require('electron-updater'));
} catch {
  // Optional in unpacked dev environments
}

let MsEdgeTTS = null;
let OUTPUT_FORMAT = null;
try {
  ({ MsEdgeTTS, OUTPUT_FORMAT } = require('msedge-tts'));
} catch (err) {
  console.warn('msedge-tts optional module:', err?.message);
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
      .get(url, { headers: { 'User-Agent': 'DaneshmandKocholo-Updater/2.0' } }, (res) => {
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
    width: 1420,
    height: 890,
    minWidth: 1000,
    minHeight: 680,
    title: 'دانشمند کوچولو | نسخه فوق‌حرفه‌ای سخنگو — طراحی و ساخت: مهندس سعید سالاری',
    icon: iconPath,
    backgroundColor: '#070b19',
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

// Neural Persian TTS Synthesizer with Persistent Disk Cache!
ipcMain.handle('desktop:synthesizePersian', async (_event, text, voiceName = 'fa-IR-DilaraNeural') => {
  if (!text || typeof text !== 'string') return null;
  const cacheDir = path.join(app.getPath('userData'), 'persian-tts-cache');
  fs.mkdirSync(cacheDir, { recursive: true });
  const hash = crypto.createHash('sha1').update(`${voiceName}::${text}`).digest('hex');
  const cachedMp3 = path.join(cacheDir, `${hash}.mp3`);

  try {
    if (fs.existsSync(cachedMp3) && fs.statSync(cachedMp3).size > 400) {
      const b64 = fs.readFileSync(cachedMp3).toString('base64');
      return `data:audio/mpeg;base64,${b64}`;
    }

    // Primary: edge-tts-universal (modern Sec-MS-GEC DRM token + Origin header)
    try {
      const { EdgeTTS } = require('edge-tts-universal');
      const uTts = new EdgeTTS(text, voiceName, { rate: '-4%', pitch: '+3Hz' });
      const res = await uTts.synthesize();
      const arrBuf = await res.audio.arrayBuffer();
      const buf = Buffer.from(arrBuf);
      if (buf.length > 400) {
        fs.writeFileSync(cachedMp3, buf);
        return `data:audio/mpeg;base64,${buf.toString('base64')}`;
      }
    } catch (uErr) {
      console.warn('edge-tts-universal fallback:', uErr?.message);
    }

    if (!MsEdgeTTS || !OUTPUT_FORMAT) return null;

    const tts = new MsEdgeTTS({ connectionTimeoutMs: 6000, synthesisTimeoutMs: 12000 });
    await tts.setMetadata(voiceName, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    const { audioStream } = tts.toStream(text, { rate: '-4%', pitch: '+3Hz' });
    const chunks = [];
    await new Promise((resolve, reject) => {
      audioStream.on('data', (chunk) => chunks.push(Buffer.from(chunk)));
      audioStream.on('end', resolve);
      audioStream.on('close', resolve);
      audioStream.on('error', reject);
    });
    tts.close();

    const fullBuffer = Buffer.concat(chunks);
    if (fullBuffer.length > 400) {
      fs.writeFileSync(cachedMp3, fullBuffer);
      return `data:audio/mpeg;base64,${fullBuffer.toString('base64')}`;
    }
    return null;
  } catch (err) {
    console.warn('Neural TTS fallback triggered:', err?.message);
    return null;
  }
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
