import React, { useEffect, useState } from 'react';
import AllNotes from './AllNotes';
import CreateNotes from './CreateNotes';
import SingleNote from './SingleNote';
const pages = {
    create: { component: CreateNotes, title: "Create New Note" },
    all: { component: AllNotes, title: "All Notes" },
    single: { component: SingleNote, title: "Note :" }
}

export default function Note() {
    const [state, setState] = useState({
        page: "",
    })

    const setPage = (page) => {
        if (!Object.keys(pages).includes(page)) {
            page = "create"
        }
        setState({ page })
        document.title = pages[page].title
    }

    useEffect(() => {
        let page = (new URLSearchParams(window.location.search)).get("page")
        setPage(page)
    }, [])

    const childProps = {
        setPage
    }
    const Children = pages[state.page]?.component || CreateNotes;

    return <Children {...childProps} />
}
