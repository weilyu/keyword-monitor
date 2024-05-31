let countdownInterval;

document.getElementById("startButton").addEventListener("click", () => {
  const interval = parseInt(document.getElementById("interval").value);
  const keyword = document.getElementById("keyword").value;

  if (interval >= 1 && interval <= 60 && keyword.length <= 20) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.runtime.sendMessage({ action: "start", interval, keyword });
      startCountdown(interval);
    });
  } else {
    alert("Please enter valid values.");
  }
});

document.getElementById("cancelButton").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "stop" });
  clearInterval(countdownInterval);
  document.getElementById("countdown").innerText = "";
  alert("Process cancelled.");
});

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "keywordFound") {
    alert("Keyword found!");
    clearInterval(countdownInterval);
    document.getElementById("countdown").innerText = "";
  }
});

function startCountdown(interval) {
  let timeRemaining = interval;
  document.getElementById(
    "countdown"
  ).innerText = `Next check in: ${timeRemaining} seconds`;

  countdownInterval = setInterval(() => {
    timeRemaining -= 1;
    if (timeRemaining <= 0) {
      clearInterval(countdownInterval);
      startCountdown(interval);
    } else {
      document.getElementById(
        "countdown"
      ).innerText = `Next check in: ${timeRemaining} seconds`;
    }
  }, 1000);
}
