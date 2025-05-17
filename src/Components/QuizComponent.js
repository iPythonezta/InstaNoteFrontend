import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Button, Card, Container, Form, Spinner, Navbar } from 'react-bootstrap';
import { useUserContext } from '../ContextApi';

const QuizComponent = () => {
    const { id } = useParams();
    const { token, login, setLogin, setUser, setToken, user } = useUserContext();
    const [quiz, setQuiz] = useState([]);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [score, setScore] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [videoUrl, setVideoUrl] = useState('');
    const [isPlaylist, setIsPlaylist] = useState(false);

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const num = queryParams.get('count');
    const navigate = useNavigate();

    const handleSubvid = async (e) => {
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
        const fetchQuiz = async () => {
            if (num <= 0 || num == null) return;
            try {
                const res = await axios.post(`http://localhost:8080/api/generate-mcqs/${id}/${num}`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setQuiz(res.data);
            } catch (error) {
                console.error("Failed to fetch quiz:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [id, token, num]);

    const handleOptionChange = (questionIdx, choiceId) => {
        if (submitted) return;
        setAnswers(prev => ({ ...prev, [questionIdx]: choiceId }));
    };

    const handleSubmit = () => {
        let correct = 0;
        quiz.forEach((q, idx) => {
            const selectedId = answers[idx];
            const correctChoice = q.choices.find(choice => choice.isCorrect === "true");
            if (selectedId === correctChoice?.id) correct++;
        });
        setScore(correct);
        setSubmitted(true);
    };

    const handleRetake = () => {
        setAnswers({});
        setScore(null);
        setSubmitted(false);
        window.location.reload();
    };

    return (
        <Container fluid style={{ padding: 0, margin: 0, display: 'flex', flexDirection: 'column', maxWidth: '100vw', overflow: 'auto' }}>
            <div className="upper-portion">
                <Navbar className="navbar justify-content-between mb-3">
                    <Navbar.Brand className="name" href='/'>InstaNote AI</Navbar.Brand>
                    <Container style={{ justifyContent: 'flex-end' }}>
                        {login && <div className="user">Hi, {user}</div>}
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
                            <Button id="submit" type="submit" onClick={handleSubvid}>Generate</Button>
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

            <div className='upper-portion' style={{ minHeight: 'fit-content', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h2 className="mb-4">Quiz</h2>

                {score !== null && (
                    <Card className="quiz-banner-card mb-3" style={{
                        background: 'linear-gradient(rgba(52, 149, 141, 1), rgba(180, 202, 160, 1))',
                        color: 'white',
                        borderRadius: '15px',
                        padding: '5px',
                        width: '1000px',
                        textAlign: 'center',
                        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)'
                    }}>
                        <Card.Body>
                            <Card.Title style={{ fontSize: '2rem', fontWeight: 'bold' }}>
                                Quiz Result:
                            </Card.Title>
                            <Card.Text style={{ fontSize: '1.1rem', marginTop: '10px' }}>
                                You got {score} out of {quiz.length}
                            </Card.Text>
                        </Card.Body>
                    </Card>
                )}

                {quiz.map((q, idx) => {
                    const correctChoiceId = q.choices.find(choice => choice.isCorrect === "true")?.id;
                    const userChoiceId = answers[idx];

                    return (
                        <Card key={idx} className="mb-3" style={{
                            background: 'linear-gradient(rgba(52, 149, 141, 0.1), rgba(180, 202, 160, 0.1))',
                            borderRadius: '10px',
                            width: '60%',
                            padding:'0px 30px'
                        }}>
                            <Card.Body>
                                <Card.Title>{q.question}</Card.Title>
                                <Form>
                                    {q.choices.map(choice => {
                                        let bgColor = '';
                                        if (submitted) {
                                            if (choice.id === correctChoiceId) {
                                                bgColor = 'rgba(0, 200, 0, 0.2)'; // correct: green
                                            } else if (choice.id === userChoiceId && choice.id !== correctChoiceId) {
                                                bgColor = 'rgba(255, 0, 0, 0.2)'; // incorrect selected: red
                                            }
                                        }

                                        return (
                                            <Form.Check
                                                key={choice.id}
                                                type="radio"
                                                name={`question-${idx}`}
                                                id={`q${idx}-choice-${choice.id}`}
                                                label={`${choice.text}${submitted && choice.isCorrect === "true" ? " ✅" : ""}`}
                                                value={choice.id}
                                                checked={userChoiceId === choice.id}
                                                onChange={() => handleOptionChange(idx, choice.id)}
                                                disabled={submitted}
                                                style={{
                                                    backgroundColor: bgColor,
                                                    borderRadius: '10px',
                                                    padding: '5px 10px',
                                                    marginBottom: '5px'
                                                }}
                                            />
                                        );
                                    })}
                                </Form>

                                {submitted && (
                                    <div style={{ marginTop: '10px', fontWeight: '500' }}>
                                        {userChoiceId === correctChoiceId
                                            ? <span style={{ color: 'green' }}>✔ Correct</span>
                                            : <span style={{ color: 'red' }}>✖ Incorrect</span>}
                                    </div>
                                )}
                            </Card.Body>
                        </Card>
                    );
                })}

                {!submitted ? (
                    <Button onClick={handleSubmit} className="mb-3" style={{
                        background: 'linear-gradient(to right, rgba(103, 4, 169, 0.6), rgba(6, 116, 206, 0.9), rgba(170, 39, 188, 0.6))',
                        border: 'none',
                        padding: '10px 30px',
                        borderRadius: '25px',
                        fontWeight: '600'
                    }}>
                        Submit
                    </Button>
                ) : (
                    <Button onClick={handleRetake} className="mb-3" variant="secondary" style={{
                        padding: '10px 30px',
                        borderRadius: '25px',
                        fontWeight: '600'
                    }}>
                        Retake Quiz
                    </Button>
                )}
            </div>
        </Container>
    );
};

export default QuizComponent;
