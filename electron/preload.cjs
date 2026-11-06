const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopAPI', {
  isDesktop: true,
  getInfo: () => ipcRenderer.invoke('desktop:getInfo'),
  toggleFullscreen: () => ipcRenderer.invoke('desktop:toggleFullscreen'),
  synthesizePersian: (text, voiceName) =>
    ipcRenderer.invoke('desktop:synthesizePersian', text, voiceName),
  loadSavedPacks: () => ipcRenderer.invoke('desktop:loadSavedPacks'),
  savePacks: (packs) => ipcRenderer.invoke('desktop:savePacks', packs),
  fetchOnlineManifest: (url) => ipcRenderer.invoke('desktop:fetchOnlineManifest', url),
  importPackDialog: () => ipcRenderer.invoke('desktop:importPackDialog'),
  exportPackDialog: (packData) => ipcRenderer.invoke('desktop:exportPackDialog', packData),
  checkAppUpdate: () => ipcRenderer.invoke('desktop:checkAppUpdate'),
  installAppUpdate: () => ipcRenderer.invoke('desktop:installAppUpdate'),
  onUpdateReady: (callback) => {
    ipcRenderer.on('desktop:update-ready', (_event, info) => callback(info));
  },
});
