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
            default:
                break;
        }
    }
);

