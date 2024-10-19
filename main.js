import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import regedit from 'regedit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let downloadControllers = {};

async function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    icon: path.join(__dirname, 'icons'),
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'js', 'preload.js'),
    },
  });

  win.loadFile('index.html');
}

app.whenReady().then(async () => {
  await createWindow();
  checkInstalledPrograms();
});

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

ipcMain.handle('download-file', async (event, args) => {
  const { url, fileName } = args;

  try {
    const { download } = await import('electron-dl');
    const item = await download(BrowserWindow.getFocusedWindow(), url, {
      directory: path.join(app.getPath('downloads'), 'downloads-root'),
      filename: fileName,
      onProgress: (progress) => {
        event.sender.send('download-progress', { file: fileName, progress });
      },
    });

    downloadControllers[fileName] = item;
    event.sender.send('download-complete', { file: fileName, message: 'Download completed successfully!' });
    return item.getSavePath();
  } catch (error) {
    event.sender.send('download-error', { file: fileName, message: `Error downloading file: ${error.message}` });
    throw new Error(`Failed to download file: ${error.message}`);
  }
});

ipcMain.on('pause-download', (event, fileName) => {
  if (downloadControllers[fileName] && downloadControllers[fileName].pause) {
    downloadControllers[fileName].pause();
  }
});

ipcMain.on('resume-download', (event, fileName) => {
  if (downloadControllers[fileName] && downloadControllers[fileName].resume) {
    downloadControllers[fileName].resume();
  }
});

ipcMain.on('cancel-download', (event, fileName) => {
  if (downloadControllers[fileName] && downloadControllers[fileName].cancel) {
    downloadControllers[fileName].cancel();
  }
});

ipcMain.on('pause-all-downloads', () => {
  for (const controller of Object.values(downloadControllers)) {
    if (controller.pause) {
      controller.pause();
    }
  }
});

ipcMain.on('resume-all-downloads', () => {
  for (const controller of Object.values(downloadControllers)) {
    if (controller.resume) {
      controller.resume();
    }
  }
});

ipcMain.on('cancel-all-downloads', () => {
  for (const controller of Object.values(downloadControllers)) {
    if (controller.cancel) {
      controller.cancel();
    }
  }
});

function checkInstalledPrograms() {
  const programs = [
    { name: 'Firefox', regPath: 'HKLM\\Software\\Mozilla\\Mozilla Firefox' },
    { name: 'Visual Studio Code', regPath: 'HKLM\\Software\\Microsoft\\Windows\\CurrentVersion\\Uninstall\\{app_id}' },
    { name: 'GitHub Desktop', regPath: 'HKCU\\Software\\GitHub Desktop' },
    { name: 'Intel Quartus', regPath: 'HKLM\\Software\\Intel\\FPGA' },
    { name: 'SAPHO', regPath: 'HKLM\\Software\\{SAPHO_Registry_Entry}' },
  ];

  let installedPrograms = [];

  programs.forEach(program => {
    regedit.list(program.regPath, (err, result) => {
      if (!err && result[program.regPath]) {
        installedPrograms.push(program.name);
      }

      if (installedPrograms.length === programs.length) {
        BrowserWindow.getFocusedWindow().webContents.send('installed-programs', installedPrograms);
      }
    });
  });
}
