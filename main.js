const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;
let childWindow;

function createMainWindow() {
    mainWindow = new BrowserWindow({
        fullscreen: false,
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'assets/icons/timer-icon.png'),
        webPreferences: {            
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    mainWindow.loadFile('src/index.html');
}

function createChildWindow() {
    childWindow = new BrowserWindow({
        autoHideMenuBar: true,
        resizable: false,
        width: 400,
        height: 250,
        icon: path.join(__dirname, 'assets/icons/timer-icon.png'),
        parent: mainWindow, // Sets mainWindow as the parent
        modal: false,            
        show: false, // Start hidden
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    childWindow.loadFile('src/controls.html');

    // Show the child window when it’s ready
    childWindow.once('ready-to-show', () => {
        childWindow.show();
    });
}

app.whenReady().then(() => {
    createMainWindow();
    createChildWindow();

    ipcMain.on('main-message', (event, message) => {
        if (childWindow) {
            childWindow.webContents.send('message', (event, message));
        }
    });

    ipcMain.on('child-message', (event, message) => {
        if (mainWindow) {
            mainWindow.webContents.send('message', (event, message));
        }
    });
});

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
