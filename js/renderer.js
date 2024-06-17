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

async function downloadFile(url, fileName, progressBar, speedIndicator, cancelBtn) {
  const progressContainer = progressBar.parentNode;
  progressContainer.style.display = 'block';
  cancelBtn.disabled = false;

  let controller = new AbortController();
  cancelBtn.addEventListener('click', () => {
    controller.abort();
    progressContainer.style.display = 'none';
  });

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/octet-stream',
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Failed to start download: ${response.status} ${response.statusText}`);
    }

    const contentLength = +response.headers.get('Content-Length');
    let receivedLength = 0;
    const chunks = [];
    const startTime = Date.now();
    const reader = response.body.getReader();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
      receivedLength += value.length;

      const percentComplete = Math.round((receivedLength / contentLength) * 100);
      progressBar.value = percentComplete;
      progressBar.textContent = `${percentComplete}%`;

      const elapsedTime = (Date.now() - startTime) / 1000;
      const speedMbps = (receivedLength / elapsedTime) * 8 / 1000000;
      speedIndicator.textContent = `${speedMbps.toFixed(2)} Mbps`;
    }

    let blob = new Blob(chunks);
    let link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    progressContainer.style.display = 'none';
  } catch (error) {
    if (error.name === 'AbortError') {
      console.log('Download cancelled');
    } else {
      console.error('Error downloading file:', error);
      alert(`Failed to download ${fileName}`);
    }
    progressContainer.style.display = 'none';
  }
}

document.getElementById('download-firefox').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-firefox');
  const speedIndicator = document.getElementById('speed-firefox');
  const cancelBtn = document.getElementById('cancel-firefox');
  downloadFile('https://download.mozilla.org/?product=firefox-stub&os=win&lang=en-GB', 'firefox.exe', progressBar, speedIndicator, cancelBtn);
});

document.getElementById('download-vscode').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-vscode');
  const speedIndicator = document.getElementById('speed-vscode');
  const cancelBtn = document.getElementById('cancel-vscode');
  downloadFile('https://code.visualstudio.com/docs/?dv=win64user', 'vscode.exe', progressBar, speedIndicator, cancelBtn);
});

document.getElementById('download-github').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-github');
  const speedIndicator = document.getElementById('speed-github');
  const cancelBtn = document.getElementById('cancel-github');
  downloadFile('https://central.github.com/deployments/desktop/desktop/latest/win32', 'github.exe', progressBar, speedIndicator, cancelBtn);
});

document.getElementById('download-quartus').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-quartus');
  const speedIndicator = document.getElementById('speed-quartus');
  const cancelBtn = document.getElementById('cancel-quartus');
  downloadFile('https://cdrdv2.intel.com/v1/dl/getContent/773998/774011?filename=QuartusLiteSetup-22.1std.1.917-windows.exe', 'QuartusLiteSetup-22.1std.1.917-windows.exe', progressBar, speedIndicator, cancelBtn);
});


document.getElementById('download-sapho').addEventListener('click', () => {
  const progressBar = document.getElementById('progress-bar-sapho');
  const speedIndicator = document.getElementById('speed-sapho');
  const cancelBtn = document.getElementById('cancel-sapho');
  downloadFile('https://github.com/nipscernlab/sapho/blob/main/Sapho_atual/Setup/inno/SAPHO.exe?raw=true', 'SAPHO.exe', progressBar, speedIndicator, cancelBtn);
});
