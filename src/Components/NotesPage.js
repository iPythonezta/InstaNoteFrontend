import React from 'react';
import { Card, Container, Navbar, Button, Form } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import axios from 'axios';
import { useUserContext } from '../ContextApi';
import { useNavigate } from 'react-router-dom';

const NotesPage = () => {
    const {id} = useParams();
    const [note, setNote] = React.useState({});
    const {token, setLogin, setToken, setUser, login, user} = useUserContext();
    const navigate = useNavigate();
    useEffect(() => {
        axios.get(`http://localhost:8080/api/notes/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
        })
        .then(response => {
            const json = JSON.parse(response.data.notes.trim());
            setNote(json);
        })
        .catch(error => {
            console.error('Error fetching note:', error);
        });
    }, [id, token]);
    return (
        <Container
            fluid
            style={{
                padding: 0,
                margin: 0,
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '100vw',
                // maxHeight: '100vh',
                overflow: 'hidden'
            }}
        >
            <div className="upper-portion" style={{minHeight:'100vh !important', overflow:'auto'}}>
                <Navbar className="navbar justify-content-between mb-3">
                    <Navbar.Brand className="name" href='/'>InstaNote AI</Navbar.Brand>
                    <Container style={{ justifyContent: 'flex-end' }}>
                        {login && <div className="user">Hi, {user} </div>}
                        <Button className="special-btn" onClick={()=>{setLogin(false); setToken(''); navigate('/login'); localStorage.removeItem('token'); setUser('');}}>Logout</Button>
                    </Container>
                </Navbar>
                <div style={{margin:'10px auto'}}>
                    <Form className="bar">
                        <Form.Control
                            id="video-url"
                            type="url"
                            placeholder="Enter youtube video link."
                        />
                        <Button id="submit" type="submit">Generate</Button>
                    </Form>
                </div>
                <div style={{margin:'0 auto'}}>
                <p className='text-center text-muted'>
                    Study another video!
                </p>
                </div>

                <Card className="mb-4" style={{ maxWidth: '800px', borderRadius: '10px', margin:'30px' }}>
                    <Card.Body>
                        <Card.Title>{note.title}</Card.Title>
                        <Card.Subtitle className="mb-3 text-muted">Notes</Card.Subtitle>
                        <Card.Text>{note.introduction}</Card.Text>

                        {note.sections && note.sections.map((section, idx) => (
                        <div key={idx} className="mb-3">
                            <h6>{section.heading}</h6>
                            <p>{section.content}</p>
                        </div>
                        ))}

                        <hr />
                        <p><strong>Conclusion:</strong> {note.conclusion}</p>
                    </Card.Body>
                </Card>
            </div>

        </Container>
    );
};

export default NotesPage;
