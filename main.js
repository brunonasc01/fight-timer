const { app, BrowserWindow } = require('electron');
const path = require('path');

function createMainWindow() {
    const mainWindow = new BrowserWindow({
        fullscreen: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/icons/wkb_icon.ico'),
        webPreferences: {            
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('src/index.html');
}

app.whenReady().then(createMainWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createMainWindow();
    }
});
