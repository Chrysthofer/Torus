let installedPrograms = ['VSCode', 'Chrome'];

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

// Variáveis globais para controlar o estado do download
let downloadControllers = {
  firefox: null,
  vscode: null,
  github: null,
  quartus: null,
  sapho: null,
};

const { ipcRenderer } = require('electron');

async function downloadFile(url, fileName, progressBar, speedIndicator, cancelBtn, pauseBtn, statusText) {
  const progressContainer = progressBar.parentNode;
  progressContainer.style.display = 'block';
  cancelBtn.disabled = false;

  // Pausar o download
  let paused = false;
  pauseBtn.addEventListener('click', () => {
    if (!paused) {
      ipcRenderer.send('pause-download', fileName);
      paused = true;
      pauseBtn.textContent = 'Resume';
    } else {
      ipcRenderer.send('resume-download', fileName);
      paused = false;
      pauseBtn.textContent = 'Pause';
    }
  });

  cancelBtn.addEventListener('click', () => {
    ipcRenderer.send('cancel-download', fileName);
    progressContainer.style.display = 'none';
    statusText.textContent = 'Download canceled';
  });

  ipcRenderer.send('download-file', { url, filename: fileName });

  ipcRenderer.on('download-progress', (event, { file, progress }) => {
    if (file === fileName) {
      const percentComplete = Math.round(progress.percent * 100);
      progressBar.value = percentComplete;

      const speedMbps = (progress.bytesPerSecond * 8) / 1000000;
      speedIndicator.textContent = `${speedMbps.toFixed(2)} Mbps`;
      statusText.textContent = `Downloading... ${percentComplete}%`;
    }
  });

  ipcRenderer.once('download-complete', (event, { file, message }) => {
    if (file === fileName) {
      progressContainer.style.display = 'none';
      statusText.textContent = message;
    }
  });

  ipcRenderer.once('download-error', (event, { file, message }) => {
    if (file === fileName) {
      progressContainer.style.display = 'none';
      statusText.textContent = message;
    }
  });
}

document.getElementById('download-firefox').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-firefox');
  const speedIndicator = document.getElementById('speed-firefox');
  const cancelBtn = document.getElementById('cancel-firefox');
  const pauseBtn = document.getElementById('pause-firefox');
  const statusText = document.getElementById('status-firefox');
  const progressContainer = document.getElementById('progress-firefox');

  progressContainer.style.display = 'none';
  statusText.textContent = '';
  cancelBtn.disabled = true;
  pauseBtn.style.display = 'inline-block';
  pauseBtn.textContent = 'Pause';

  downloadFile('https://download.mozilla.org/?product=firefox-stub&os=win&lang=en-GB', 'firefox.exe', progressBar, speedIndicator, cancelBtn, pauseBtn, statusText);
});

document.getElementById('download-vscode').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-vscode');
  const speedIndicator = document.getElementById('speed-vscode');
  const cancelBtn = document.getElementById('cancel-vscode');
  const pauseBtn = document.getElementById('pause-vscode');
  const statusText = document.getElementById('status-vscode');
  const progressContainer = document.getElementById('progress-vscode');

  progressContainer.style.display = 'none';
  statusText.textContent = '';
  cancelBtn.disabled = true;
  pauseBtn.style.display = 'inline-block';
  pauseBtn.textContent = 'Pause';

  downloadFile('https://code.visualstudio.com/docs/?dv=win64user', 'vscode.exe', progressBar, speedIndicator, cancelBtn, pauseBtn, statusText);
});

// Adicione os outros downloads aqui seguindo o mesmo padrão

document.getElementById('download-github').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-github');
  const speedIndicator = document.getElementById('speed-github');
  const cancelBtn = document.getElementById('cancel-github');
  const pauseBtn = document.getElementById('pause-github');
  const statusText = document.getElementById('status-github');
  const progressContainer = document.getElementById('progress-github');

  // Resetar o estado do download
  progressContainer.style.display = 'none';
  statusText.textContent = '';
  cancelBtn.disabled = true;
  pauseBtn.style.display = 'inline-block';
  pauseBtn.textContent = 'Pause';

  // Iniciar o download
  downloadFile('https://central.github.com/deployments/desktop/desktop/latest/win32', 'github.exe', progressBar, speedIndicator, cancelBtn, pauseBtn, statusText);
});


document.getElementById('download-quartus').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-quartus');
  const speedIndicator = document.getElementById('speed-quartus');
  const cancelBtn = document.getElementById('cancel-quartus');
  const pauseBtn = document.getElementById('pause-quartus');
  const statusText = document.getElementById('status-quartus');
  const progressContainer = document.getElementById('progress-quartus');

  // Resetar o estado do download
  progressContainer.style.display = 'none';
  statusText.textContent = '';
  cancelBtn.disabled = true;
  pauseBtn.style.display = 'inline-block';
  pauseBtn.textContent = 'Pause';

  // Iniciar o download
  downloadFile('https://cdrdv2.intel.com/v1/dl/getContent/773998/774011?filename=QuartusLiteSetup-22.1std.1.917-windows.exe', 'quartus.exe', progressBar, speedIndicator, cancelBtn, pauseBtn, statusText);
});


document.getElementById('download-sapho').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-sapho');
  const speedIndicator = document.getElementById('speed-sapho');
  const cancelBtn = document.getElementById('cancel-sapho');
  const pauseBtn = document.getElementById('pause-sapho');
  const statusText = document.getElementById('status-sapho');
  const progressContainer = document.getElementById('progress-sapho');

  // Resetar o estado do download
  progressContainer.style.display = 'none';
  statusText.textContent = '';
  cancelBtn.disabled = true;
  pauseBtn.style.display = 'inline-block';
  pauseBtn.textContent = 'Pause';

  // Iniciar o download
  downloadFile('https://github.com/nipscernlab/sapho/blob/main/Sapho_atual/Setup/inno/SAPHO.exe?raw=true', 'sapho.exe', progressBar, speedIndicator, cancelBtn, pauseBtn, statusText);
});
