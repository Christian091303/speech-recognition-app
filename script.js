const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const startBtn = document.getElementById("start-btn");
const statusDiv = document.getElementById("status");
const outputDiv = document.getElementById("output");
const toggleThemeBtn = document.getElementById("toggle-theme");
const icon = toggleThemeBtn.querySelector(".icon");

let isListening = false;
let mode = "continuous";

if (!SpeechRecognition) {
  alert("Speech Recognition API not supported in this browser.");
} else {
  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.interimResults = true;
  recognition.continuous = true;

  recognition.onstart = () => {
    statusDiv.textContent = "Listening...";
    startBtn.classList.add("listening");
    startBtn.innerHTML = '<i class="fas fa-microphone-slash mic-icon"></i> Stop Listening';
  };

  recognition.onend = () => {
    statusDiv.textContent = "Stopped.";
    startBtn.classList.remove("listening");
    startBtn.innerHTML = '<i class="fas fa-microphone mic-icon"></i> Start Listening';
    isListening = false;
  };

  recognition.onresult = (event) => {
    if (mode === "continuous") {
      let text = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        text += event.results[i][0].transcript;
      }
      outputDiv.textContent = text;
      outputDiv.scrollTop = outputDiv.scrollHeight;
    } else {
      const transcript = event.results[0][0].transcript;
      outputDiv.textContent = transcript;
      console.log("Confidence:", event.results[0][0].confidence);
    }
  };

  recognition.onerror = (event) => {
    outputDiv.textContent = "Error: " + event.error;
    startBtn.classList.remove("listening");
  };

  startBtn.onclick = () => {
    if (!isListening) {
      if (mode === "single") {
        recognition.interimResults = false;
        recognition.continuous = false;
      } else {
        recognition.interimResults = true;
        recognition.continuous = true;
      }
      recognition.start();
      isListening = true;
    } else {
      recognition.stop();
      isListening = false;
    }
  };
}

toggleThemeBtn.onclick = () => {
  document.body.classList.toggle("dark");
  if (document.body.classList.contains("dark")) {
    icon.textContent = "🌞";
  } else {
    icon.textContent = "🌓";
  }
};

if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  document.body.classList.add("dark");
  icon.textContent = "🌞";
} else {
  icon.textContent = "🌓";
}