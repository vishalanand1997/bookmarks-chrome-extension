import React, { useState, useEffect } from 'react';


export default function CreateNotes() {
    const [state, setState] = useState({
        title: "",
        note: ""
    })

    useEffect(() => {
        const clipboard_text = (new URLSearchParams(window.location.search)).get("text")
        setState({ note: (clipboard_text || ""), title: state.title })

    }, [])

    return <div>
        <h2>
        Create new Note
        </h2>
    </div>;
}
