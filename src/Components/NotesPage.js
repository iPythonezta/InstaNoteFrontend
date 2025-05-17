import React from 'react';
import { Card, Container, Navbar, Button, Form, Spinner, Modal } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUserContext } from '../ContextApi';
import { useNavigate } from 'react-router-dom';

const NotesPage = () => {
    const {id} = useParams();
    const [note, setNote] = useState({});
    const {token, setLogin, setToken, setUser, login, user, loading, setLoading} = useUserContext();
    const [isPlaylist, setIsPlaylist] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [questionCount, setQuestionCount] = useState(10);
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
        const response = await axios.post('http://localhost:8080/api/generate-notes', {
            url: videoUrl,
        }, {
            headers: {
            'Authorization': `Bearer ${token}`
            }
        });
        navigate(`/notes/${response.data.id}`);
        setVideoUrl('');
        setIsPlaylist(false);
        } catch (error) {
        console.error('Error adding note:', error);
        } finally {
        setLoading(false);
        }
    };
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
                overflow: 'auto'
            }}
        >
            <div className="upper-portion">
                    <Navbar className="navbar justify-content-between mb-3">
                      <Navbar.Brand className="name" href='/'>InstaNote AI</Navbar.Brand>
                      <Container style={{ justifyContent: 'flex-end' }}>
                        {login && <div className="user">Hi, {user} </div>}
                        <Button className="special-btn" onClick={() => {
                          setLogin(false);
                          setToken('');
                          localStorage.removeItem('token');
                          setUser('');
                          navigate('/login');
                        }}>Logout</Button>
                      </Container>
                    </Navbar>
            
                    {loading ? (
                      <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh', marginTop: '-50px' }}>
                        <Spinner animation="border" variant="primary" style={{ height: '100px', width: '100px' }} />
                      </Container>
                    ) : (
                      <>
                        <Form className="bar d-flex gap-2 align-items-center">
                          <Form.Control
                            id="video-url"
                            type="url"
                            placeholder="Enter youtube video link."
                            value={videoUrl}
                            onChange={(e) => setVideoUrl(e.target.value)}
                          />
                          <Button id="submit" type="submit" onClick={handleSubmit}>Generate</Button>
                        </Form>
                        <Container className='text-center' style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', fontSize: '18px' }}>
                          <Form.Check
                            type="checkbox"
                            id="is-playlist"
                            label="Is Playlist"
                            className="text-nowrap"
                            checked={isPlaylist}
                            onChange={(e) => setIsPlaylist(e.target.checked)}
                            style={{ marginTop: '-20px', width: 'fit-content' }}
                          />
                        </Container>
                      </>
                    )}
                    <div className="filler mt-3"></div>
                  </div>
                <div className='upper-portion' style={{minHeight:'fit-content', display:'flex', justifyContent:'center', alignItems:'center'}}>
                    <Card
                        className="quiz-banner-card mb-3"
                        style={{
                            background: 'linear-gradient(rgba(52, 149, 141, 1), rgba(180, 202, 160, 1))',
                            color: 'white',
                            borderRadius: '15px',
                            padding: '30px',
                            width: '1000px',
                            textAlign: 'center',
                            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                        }}
                        >
                        <Card.Body>
                            <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                            Ready to test your understanding?
                            </Card.Title>
                            <Card.Text style={{ fontSize: '1.1rem', marginTop: '10px' }}>
                            Take a quick quiz based on this video to see how well you understood the concepts!
                            </Card.Text>
                            <Button
                                variant="light"
                                style={{
                                    marginTop: '20px',
                                    padding: '10px 30px',
                                    borderRadius: '25px',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    color: '#34958d',
                                    backgroundColor: 'white',
                                    border: 'none'
                                }}
                                onClick={() => setShowModal(true)}
                            >
                                Start Quiz
                            </Button>
                        </Card.Body>
                    </Card>

                    <Card className="mb-4" style={{ maxWidth: '1000px', borderRadius: '10px', margin:'30px' }}>
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
                <>
                    <Modal
                        show={showModal}
                        onHide={() => setShowModal(false)}
                        centered
                        contentClassName="quiz-modal-content"
                    >
                        <Modal.Header closeButton style={{ borderBottom: 'none' }}>
                            <Modal.Title style={{ color: 'white', fontWeight: 'bold' }}>
                            Select Quiz Length
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form.Group>
                            <Form.Label style={{ color: 'white' }}>How many questions would you like?</Form.Label>
                            <Form.Control
                                type="number"
                                min={5}
                                max={30}
                                value={questionCount}
                                onChange={(e) => setQuestionCount(e.target.value)}
                                style={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                border: 'none',
                                borderRadius: '10px',
                                padding: '10px',
                                fontWeight: '500',
                                fontSize: '1rem',
                                }}
                            />
                            <Form.Text style={{ color: '#e0e0e0' }}>Choose between 5 and 30 questions.</Form.Text>
                            </Form.Group>
                        </Modal.Body>
                        <Modal.Footer style={{ borderTop: 'none' }}>
                            <Button
                            variant="light"
                            onClick={() => setShowModal(false)}
                            style={{
                                backgroundColor: 'white',
                                color: '#34958d',
                                borderRadius: '20px',
                                padding: '8px 20px',
                                fontWeight: '600',
                            }}
                            >
                            Cancel
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowModal(false);
                                    navigate(`/quiz/${id}?count=${questionCount}`);
                                }}
                                style={{
                                    backgroundColor: '#34958d',
                                    border: 'none',
                                    borderRadius: '20px',
                                    padding: '8px 20px',
                                    fontWeight: '600',
                                    color: 'white',
                                }}
                                >
                                Start
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </>


        </Container>
    );
};

export default NotesPage;
