import React from 'react';
import { useEffect } from 'react';
import { useState } from 'react';
import { Card, Container, Typography } from '@material-ui/core';

export default function AllNotes() {
    const [state, setState] = useState({
        notes: [
        ]
    })

    useEffect(() => {
        chrome.storage.sync.get(["notes"], (data) => {
            setState(data)
        })
    })

    return (
        <Container maxWidth="sm" style={{ textAlign: "center" }}>
            <Typography variant="h5" style={{ marginBottom: "2rem" }}  >All Notes</Typography>
            {state.notes.map(note => {
                return (
                    <Card style={{ textAlign: "left", padding: "1rem", margin: "1rem" }}>
                        <Typography variant="h6" component="h2">{note.title}</Typography>
                        <Typography variant="body2" component="p" >{note.note}</Typography>

                    </Card>
                )
            })}

        </Container>
    );
}
