console.log('This is the background page.');
console.log('Put the background scripts here.');
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        chrome.tabs.captureVisibleTab(
            null,
            {},
            function (dataUrl) {
                chrome.tabs.create({ url: "screen.html" }, () => {
                    console.log("DATA", dataUrl);
                    chrome.storage.local.set({ data: JSON.stringify(dataUrl) });
                });
            })
        sendResponse({ imgSrc: dataUrl });
    }
);