let installedPrograms = [];

function showInstalledPrograms() {
  const installedList = document.getElementById('installedList');
  installedList.innerHTML = '';

  installedPrograms.forEach(program => {
    const li = document.createElement('li');
    li.textContent = program;
    installedList.appendChild(li);
  });
}

function showAvailableSection() {
  const installedSection = document.getElementById('installedSection');
  const availableSection = document.getElementById('availableSection');

  installedSection.style.display = 'none';
  availableSection.style.display = 'block';
}

document.getElementById('installedBtn').addEventListener('click', function () {
  showInstalledPrograms();
  document.getElementById('installedBtn').classList.add('active');
  document.getElementById('availableBtn').classList.remove('active');
  document.getElementById('installedSection').style.display = 'block';
  document.getElementById('availableSection').style.display = 'none';
});

document.getElementById('availableBtn').addEventListener('click', function () {
  showAvailableSection();
  document.getElementById('installedBtn').classList.remove('active');
  document.getElementById('availableBtn').classList.add('active');
});

document.addEventListener('DOMContentLoaded', function () {
  showInstalledPrograms();
});

window.electron.ipcRenderer.on('installed-programs', (event, programs) => {
  installedPrograms = programs;
  showInstalledPrograms();
});

// Variáveis globais para controlar o estado do download
let downloadControllers = {
  firefox: null,
  vscode: null,
  github: null,
  quartus: null,
  sapho: null,
};

async function downloadFile(url, fileName, progressBar, speedIndicator, cancelBtn, pauseBtn, statusText) {
  const progressContainer = progressBar.parentNode;
  progressContainer.style.display = 'block';
  cancelBtn.disabled = false;
  pauseBtn.style.display = 'inline-block';

  let paused = false;

  pauseBtn.addEventListener('click', () => {
    if (!paused) {
      window.electron.ipcRenderer.send('pause-download', fileName);
      paused = true;
      pauseBtn.textContent = 'Resume';
    } else {
      window.electron.ipcRenderer.send('resume-download', fileName);
      paused = false;
      pauseBtn.textContent = 'Pause';
    }
  });

  cancelBtn.addEventListener('click', () => {
    window.electron.ipcRenderer.send('cancel-download', fileName);
    progressContainer.style.display = 'none';
    statusText.textContent = 'Download canceled';
  });

  window.electron.ipcRenderer.send('download-file', { url, filename: fileName });

  window.electron.ipcRenderer.on('download-progress', (event, { file, progress }) => {
    if (file === fileName) {
      const percentComplete = Math.round(progress.percent * 100);
      progressBar.value = percentComplete;
      const speedMbps = (progress.bytesPerSecond * 8) / 1000000;
      speedIndicator.textContent = `${speedMbps.toFixed(2)} Mbps`;
      statusText.textContent = `Downloading... ${percentComplete}%`;
    }
  });

  window.electron.ipcRenderer.once('download-complete', (event, { file, message }) => {
    if (file === fileName) {
      progressContainer.style.display = 'none';
      statusText.textContent = message;
    }
  });

  window.electron.ipcRenderer.once('download-error', (event, { file, message }) => {
    if (file === fileName) {
      progressContainer.style.display = 'none';
      statusText.textContent = message;
    }
  });
}

function setupDownloadButton(buttonId, url, fileName, progressBarId, speedIndicatorId, cancelBtnId, pauseBtnId, statusTextId) {
  document.getElementById(buttonId).addEventListener('click', () => {
    const progressBar = document.getElementById(progressBarId);
    const speedIndicator = document.getElementById(speedIndicatorId);
    const cancelBtn = document.getElementById(cancelBtnId);
    const pauseBtn = document.getElementById(pauseBtnId);
    const statusText = document.getElementById(statusTextId);
    const progressContainer = document.getElementById(`${progressBarId.replace('-bar', '')}`);

    progressContainer.style.display = 'block';
    statusText.textContent = '';
    cancelBtn.disabled = true;
    pauseBtn.style.display = 'inline-block';
    pauseBtn.textContent = 'Pause';

    downloadFile(url, fileName, progressBar, speedIndicator, cancelBtn, pauseBtn, statusText);
  });
}

setupDownloadButton('download-firefox', 'https://download.mozilla.org/?product=firefox-stub&os=win&lang=en-GB', 'firefox.exe', 'progress-bar-firefox', 'speed-firefox', 'cancel-firefox', 'pause-firefox', 'status-firefox');
setupDownloadButton('download-vscode', 'https://code.visualstudio.com/docs/?dv=win64user', 'vscode.exe', 'progress-bar-vscode', 'speed-vscode', 'cancel-vscode', 'pause-vscode', 'status-vscode');
setupDownloadButton('download-github', 'https://central.github.com/deployments/desktop/desktop/latest/win32', 'github.exe', 'progress-bar-github', 'speed-github', 'cancel-github', 'pause-github', 'status-github');
setupDownloadButton('download-quartus', 'https://cdrdv2.intel.com/v1/dl/getContent/773998/774011?filename=QuartusLiteSetup-22.1std.1.917-windows.exe', 'quartus.exe', 'progress-bar-quartus', 'speed-quartus', 'cancel-quartus', 'pause-quartus', 'status-quartus');
setupDownloadButton('download-sapho', 'https://github.com/nipscernlab/sapho/blob/main/Sapho_atual/Setup/inno/SAPHO.exe?raw=true', 'sapho.exe', 'progress-bar-sapho', 'speed-sapho', 'cancel-sapho', 'pause-sapho', 'status-sapho');
