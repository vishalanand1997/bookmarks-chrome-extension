const createNotes = (data) => {
    chrome.windows.create({
        type: "popup",
        url: `notes.html?text=${data.txt}`
    })
}



export default createNotes;