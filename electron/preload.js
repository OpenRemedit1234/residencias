const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs seguras al renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    getAppPath: () => ipcRenderer.invoke('get-app-path'),
    getVersion: () => ipcRenderer.invoke('get-version'),
    getServerIp: () => ipcRenderer.invoke('get-server-ip'),
    selectDatabase: () => ipcRenderer.invoke('select-database')
});
