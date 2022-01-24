console.log('This is the background page.');
console.log('Put the background scripts here.');
export const takeScreentShort = () => {
    chrome.runtime.onMessage.addListener(
        function (request, sender, sendResponse) {
            chrome.tabs.captureVisibleTab(
                null,
                {},
                function (dataUrl) {
                    console.log("imgSrc", dataUrl)
                    chrome.tabs.create({ url: chrome.runtime.getURL("index.html") }, (res) => {
                        console.log("Response", res);
                    })
                    sendResponse({ imgSrc: dataUrl });
                }
            );

            return true;
        }
    );
}