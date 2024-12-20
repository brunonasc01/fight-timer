const { ipcRenderer } = require('electron');
let timerInterval;
let remainingTime = 0; // Time in seconds
let pausedTime = 0; // Holds the time when paused

function toggleRed(append) {
    if(append === true) {
        document.getElementById("timer").classList.add('red-flag');
    }
    else {
        document.getElementById("timer").classList.remove('red-flag');
    }
}

// Format time into MM:SS format
function formatTime(seconds) {
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${minutes}:${secs}`;
}

// Start the timer
function startCountdown() {
    (remainingTime <= 10)? toggleRed(true) : toggleRed(false);        
    if (remainingTime > 0 && !timerInterval) {
        timerInterval = setInterval(() => {
            remainingTime--;

            if(remainingTime <= 10) {
                toggleRed(true);
            }

            document.getElementById("timer").textContent = formatTime(remainingTime);

            // Send the updated time to the control window
            ipcRenderer.send('main-message', { time: formatTime(remainingTime) });

            // Stop the timer when it reaches zero
            if (remainingTime <= 0) {
                clearInterval(timerInterval);
                timerInterval = null;
            }
        }, 1000);
    }
}

function stopTimer() {
    clearInterval(timerInterval);
    timerInterval = null;
    pausedTime = remainingTime;
}

function resetTimer() {
    stopTimer();
    remainingTime = 0;
    document.getElementById("timer").textContent = formatTime(remainingTime);
    toggleRed(false);
}

// Continue countdown from the paused time
function continueCountdown() {
    remainingTime = pausedTime;
    startCountdown();
}

// Listen for messages from control window
ipcRenderer.on('message', (sender, data) => {
    if (data.command === "start") {
        remainingTime = data.time; // Set the countdown starting time
        document.getElementById("timer").textContent = formatTime(remainingTime);
        startCountdown();
    } else if (data.command === "stop") {
        stopTimer();
    } else if (data.command === "continue") {
        continueCountdown();
    } else if (data.command === "reset") {
        resetTimer();
    }
});