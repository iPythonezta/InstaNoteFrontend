import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Form, Button, Navbar } from 'react-bootstrap';
import { useUserContext } from '../ContextApi';
import { useNavigate } from 'react-router-dom';

const Home = () => {

  const {login, setLogin, user, setToken, setUser} = useUserContext();
  const navigate = useNavigate();
  useEffect(() => {
    if (!login) {
      navigate('/login');
    }
  }, [login])
  return (
    <Container
      fluid
      style={{
        padding: 0,
        margin: 0,
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '100vw',
        maxHeight: '100vh',
        overflow: 'hidden'
      }}
    >
      <div className="upper-portion">
        <Navbar className="navbar justify-content-between mb-3">
          <Navbar.Brand className="name" href='/'>InstaNote AI</Navbar.Brand>
          <Container style={{ justifyContent: 'flex-end' }}>
            {login && <div className="user">Hi, {user} </div>}
            <Button className="special-btn" onClick={()=>{setLogin(false); setToken(''); navigate('/login'); localStorage.removeItem('token'); setUser('');}}>Logout</Button>
        </Container>
        </Navbar>

        <Form className="bar d-flex gap-2">
          <Form.Control
            id="video-url"
            type="url"
            placeholder="Enter youtube video link."
          />
          <Button id="submit" type="submit">Generate</Button>
        </Form>
        <div style={{margin:'0 auto'}}>
          <p className='text-center text-muted'>
            Enter the URL of the YouTube video/playlist you want to study.
          </p>
        </div>

        <div className="filler mt-3"></div>
      </div>

      <div className="lower-portion" style={{ minHeight: '100vh' }}>
        <h5 className="m-3" style={{padding:'10px', alignSelf:'center'}}>Use History</h5>
        <div id="note-container" style={{ marginLeft: '10px' }}>
          {/* <div className="previous-note border" style={{ borderRadius: '10px' }}>
            <span>
              <strong>Photosynthesis Explained - CrashCourse</strong>
            </span>
          </div> */}
        </div>
        <div className="filler">
          <p className='text-center text-muted'>
            No history yet. Start by entering a video URL.
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Home;
