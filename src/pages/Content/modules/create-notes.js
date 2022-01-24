export default function createNotesButtonRender() {
    document.addEventListener('mouseup', function (event) {
        document.getElementById("chrome-ext")?.remove()

        var selection = window.getSelection().toString();
        if (selection.length > 0) {
            var icon = document.createElement("div")
            icon.style.position = "absolute"
            icon.id = "chrome-ext"
            icon.style.cursor = "pointer"
            icon.style.top = event.pageY + "px"
            icon.style.left = event.pageX + "px"
            icon.style.visibility = "visible"
            icon.style.color = "white"
            icon.style.background = "red"
            icon.innerHTML = "Create Notes"
            document.body.appendChild(icon)
            return;
        }

    });


    document.addEventListener('mousedown', (event) => {
        var selection = window.getSelection().toString();
        if (selection.length > 0) {
            if (event.target && event.target.id === "chrome-ext") {
                chrome.runtime.sendMessage({ type: "CREATE_NOTES", txt: selection }, (response) => {
                    document.getElementById("chrome-ext")?.remove()
                });
            }
        }

    });
}


