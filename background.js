let intervalId;

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "start") {
    const { interval, keyword } = request;
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0].id;
      intervalId = setInterval(() => {
        chrome.scripting.executeScript(
          {
            target: { tabId: tabId },
            func: checkKeyword,
            args: [keyword],
          },
          (results) => {
            if (results && results[0] && results[0].result) {
              clearInterval(intervalId);
              chrome.tabs.sendMessage(tabId, { action: "keywordFound" });
            } else {
              chrome.tabs.reload(tabId);
            }
          }
        );
      }, interval * 1000);
    });
  } else if (request.action === "stop") {
    clearInterval(intervalId);
  }
});

function checkKeyword(keyword) {
  return document.body.innerText.includes(keyword);
}
