import { Box, Button, Card, Container, TextField, Typography } from '@material-ui/core';
import React, { useState, useEffect } from 'react';


export default function CreateNotes(props) {
    const [title, setTitle] = useState("")
    const [note, setNote] = useState("")

    useEffect(() => {
        const clipboard_text = (new URLSearchParams(window.location.search)).get("text") || note
        setNote(clipboard_text)
    }, [])

    const handleChange = (event) => {
        const { name, value } = event.target
        if (name === "title") {
            setTitle(value)
        } else if (name === "note") {
            setNote(value)
        }
    }

    const handleCreate = async () => {
        console.log(title, note)

        if (!title) {
            return;
        }

        const { notes } = await chrome.storage.sync.get(["notes"])
        chrome.storage.sync.set({ notes: [...notes, { title, note }] })
        props.setPage("all")
    }

    return (<Container maxWidth="sm">
        <Card style={{ textAlign: "center", padding: "1rem" }}>
            <Typography variant="h5"  >Create Note</Typography>
            <Box>
                <TextField label="Title" value={title} name="title" onChange={handleChange} />
            </Box>
            <Box>
                <textarea value={note} name="note" onChange={handleChange} rows="15" cols="40">
                </textarea>
            </Box>
            <Box>
                <Button color="primary" onClick={handleCreate}>Create</Button>
            </Box>
        </Card>
    </Container>);
}
