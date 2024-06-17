const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { download } = require('electron-dl');
const downloadManager = require('electron-download-manager');

// Configurar o gerenciador de downloads
downloadManager.register({
  downloadFolder: app.getPath('downloads'),
});

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icons', ''), // Caminho para o ícone no formato .ico
    webPreferences: {
      preload: path.join(__dirname, 'js' , 'preload.js'), // Arquivo de preload
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// Manipulador para o download de arquivos
ipcMain.handle('download-file', async (event, args) => {
  const { url, fileName } = args;
  try {
    const item = await downloadManager.download({
      url: url,
      filename: fileName,
    });

    return item.getSavePath();
  } catch (error) {
    throw new Error(`Failed to download file: ${error.message}`);
  }
});

// Manipulador para exibir o arquivo na pasta
ipcMain.on('show-item-in-folder', (event, filePath) => {
  shell.showItemInFolder(filePath);
});


ipcMain.on('download-file', async (event, { url, filename }) => {
  const downloadPath = path.join(app.getPath('downloads'), 'downloads-root');
  if (!fs.existsSync(downloadPath)) {
    fs.mkdirSync(downloadPath);
  }

  try {
    await download(BrowserWindow.getFocusedWindow(), url, {
      directory: downloadPath,
      filename: filename,
      onProgress: (progress) => {
        event.sender.send('download-progress', { file: filename, progress });
      },
    });
    event.sender.send('download-complete', { file: filename, message: 'Download completed successfully!' });
  } catch (error) {
    event.sender.send('download-error', { file: filename, message: 'Error downloading file' });
  }
});
