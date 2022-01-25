import React from 'react';

export default function AllNotes() {
    const [screenshortURL, setScreenshortUrl] = React.useState("")
    React.useEffect(() => {
        chrome.storage.local.get("cropped", (data) => {
            console.log("Dataa", data);
            setScreenshortUrl(data.cropped);
        });
    }, [screenshortURL])
    return <div>All Notes
        <img src={screenshortURL} alt="No Image" width="100%" style={{height:"90vh"}} />
    </div>;
}
