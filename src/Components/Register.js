import React, { useState, useEffect } from 'react';
import { Container, Navbar, Button, Form, Spinner } from 'react-bootstrap';
import { useUserContext } from '../ContextApi';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import './login.css'; // reuse styling

const Register = () => {
    const { loading, setUser, setLoading, setToken, setLogin, login } = useUserContext();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        if (login) {
            navigate('/');
        }
    }, [login]);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:8080/auth/register', {
                username:username.toLowerCase(),
                password
            });

            const token = response.data.token; 
            localStorage.setItem('token', token);
            setToken(token);
            setUser(username);
            setLogin(true);
            toast.success('Registration successful!');
            setTimeout(() => navigate('/login'), 1);
        } catch (error) {
            console.error('Registration failed:', error);
            toast.error('Registration failed. Try a different username.');
            setLoading(false);
        }
    };

    return (
        <Container fluid style={{ padding: 0, margin: 0, display: 'flex', flexDirection: 'column', maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden' }}>
            <div className="upper-portion" style={{ height: '100vh', justifyContent: 'flex-start' }}>
                <Navbar className="navbar justify-content-between mb-3">
                    <Navbar.Brand className="name" href='/'>InstaNote AI</Navbar.Brand>
                    <Container style={{ justifyContent: 'flex-end' }}>
                        <Button className="special-btn" style={{ marginRight: '30px' }} href='/login'>Login</Button>
                        <Button className="special-btn">Register</Button>
                    </Container>
                </Navbar>
                {
                    loading ? (
                        <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh', marginTop: '-50px' }}>
                            <Spinner animation="border" variant="primary" style={{ height: '100px', width: '100px' }} />
                        </Container>
                    ) : (
                        <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh', marginTop: '-50px' }}>
                            <Form onSubmit={handleRegister} style={{ width: '100%', maxWidth: '400px' }}>
                                <h2 className="text-center text-black mb-4">Register</h2>
                                <Form.Group className="mb-3" controlId="formUsername">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="formPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        placeholder="Enter password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                    />
                                </Form.Group>

                                <Button variant="primary" type="submit" className="w-100 special-btn" style={{ padding: '10px 0' }}>
                                    Register
                                </Button>
                            </Form>
                        </Container>
                    )
                }
            </div>
        </Container>
    );
};

export default Register;
