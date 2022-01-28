import createNotes from "./create_notes"
chrome.storage.sync.set({ notes: [] })

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
                    chrome.windows.create({ url: "all-notes.html", type: "popup" })
                });
                break;
            default:
                break;
        }
    }
);
chrome.runtime.onInstalled.addListener(function() {
    chrome.contextMenus.create({
        "title": 'Search Google for "%s"',
        "contexts": ["selection"],
        "id": "myContextMenuId"
    });
});
    
chrome.contextMenus.onClicked.addListener(function(info, tab) {
    chrome.tabs.create({  
        url: "http://www.google.com/search?q=" + encodeURIComponent(info.selectionText)
    });
})
