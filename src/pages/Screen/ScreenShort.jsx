import React from 'react';

function ScreenShort() {
    const [screenshort, setScreenshort] = React.useState("")
    React.useEffect(() => {
        chrome.storage.local.get("data", (data) => {
            setScreenshort(JSON.parse(data.data))
            console.log("SCREENSHORT", data.data);
        })
    }, [])
    return <div>ScreenShort
        <img id="target" src={screenshort} height="100%" width="100%" />
    </div>;
}

export default ScreenShort;
