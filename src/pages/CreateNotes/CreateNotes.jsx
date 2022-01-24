import React, { useState, useEffect } from 'react';
import { Typography, Card, Row, Col, Divider, Input } from 'antd';

const { Title } = Typography;
const { TextArea } = Input;

export default function CreateNotes() {
    const [state, setState] = useState({
        title: "",
        note: ""
    })

    useEffect(() => {
        const clipboard_text = (new URLSearchParams(window.location.search)).get("text")
        setState({ note: (clipboard_text || ""), title: state.title })

    }, [])

    return (
        <Row style={{ textAlign: "center" }}>
            <Col span={12}>
                <Title>
                    create Notes
                </Title>
                <Divider dashed />
                <Card title="new note">
                    <Input value={state.title} placeholder="Note title" style={{ display: "block" }} readOnly />
                    <textarea value={state.note} readOnly cols={40} rows={15}></textarea>
                    <button>Add Note</button>
                </Card>
            </Col>
        </Row>
    );
}
