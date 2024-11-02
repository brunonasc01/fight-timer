const { ipcRenderer } = require('electron');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');
const continueBtn = document.getElementById('continueBtn');
const resetBtn = document.getElementById('resetBtn');
const minuteInput = document.getElementById('minuteInput');
const secondInput = document.getElementById('secondInput');
const mirrorTimer = document.getElementById('mirrorTimer');

function controlButtons(command) {
    if(command === 'start') {
        stopBtn.disabled = false;
        document.getElementById("stopBtn").classList.remove('hidden');
        document.getElementById("continueBtn").classList.add('hidden');
    }
    else if(command === 'stop') {
        document.getElementById("stopBtn").classList.add('hidden');
        document.getElementById("continueBtn").classList.remove('hidden');
    }
    else if(command === 'continue') {
        document.getElementById("stopBtn").classList.remove('hidden');
        document.getElementById("continueBtn").classList.add('hidden');
    }
    else if(command === 'reset') {
        mirrorTimer.textContent = '00:00';
        stopBtn.disabled = true;
        document.getElementById("stopBtn").classList.remove('hidden');
        document.getElementById("continueBtn").classList.add('hidden');
    }
}

// Send commands to the parent window (main timer window)
function sendCommand(command, time = null) {
    ipcRenderer.send('child-message', { command, time });
    controlButtons(command);
}

startBtn.addEventListener('click', () => {
    const minutes = parseInt(minuteInput.value, 10);
    const seconds = parseInt(secondInput.value, 10);
    if (isNaN(minutes) || minutes < 0) {
        alert("Informe os minutos corretamente.");
    }
    else if (isNaN(seconds) || seconds < 0 || seconds > 59) {
        alert("Informe os segundos corretamente.");
    }
    else if (minutes == 0 && seconds == 0) {
        alert("Defina o intervalo de tempo corretamente.");
    }
    else {
        const time = (minutes * 60) + seconds;
        sendCommand('start', time);
    }
});

stopBtn.addEventListener('click', () => sendCommand('stop'));
continueBtn.addEventListener('click', () => sendCommand('continue'));
resetBtn.addEventListener('click', () => sendCommand('reset'));

// Listen for time updates from the main timer window
ipcRenderer.on('message', (sender, data) => {
    mirrorTimer.textContent = data.time;
});