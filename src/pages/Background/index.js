import createNotes from "./create_notes"

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        switch (request.type) {
            case "CREATE_NOTES":
                createNotes(request)
                break;
            case "TAKE_SCREENSHORT":
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
                break;
            case "OPEN_SCREENSHORT_IN_WINDOW":
                console.log("OPen Screenshort", request);
                chrome.storage.local.set({ cropped: request.data }, () => {
                    chrome.windows.create({ url: "all-notes.html" })
                });
                break;
            default:
                break;
        }
    }
);

