const createNotes = (data) => {
    chrome.windows.create({
        type: "popup",
        url: `create-notes.html?text=${data.txt}`
    })
}


export default createNotes;