import React, { Component } from 'react';
import { Container, Row, Col, Form, Button, Navbar } from 'react-bootstrap';

class Home extends Component {
  render() {
    return (
      <Container fluid style={{padding: 0, margin: 0, display: 'flex', flexDirection:'column', maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden'}}>
        <div className="upper-portion">
          <Navbar className="navbar justify-content-between mb-3">
            <Navbar.Brand className="name">InstaNote AI</Navbar.Brand>
            <div className="user">Hi, Username</div>
          </Navbar>

          <Form className="bar d-flex gap-2">
            <Form.Control
              id="video-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=VIDEO_ID"
            />
            <Button id="submit" type="submit">Generate</Button>
          </Form>

          <div className="filler mt-3"></div>
        </div>

        <div className="lower-portion" style={{minHeight: '100vh'}}>
          <h5>Use History</h5>
          <div id="note-container" style={{marginLeft: '10px'}}>
            <div className="previous-note border" style={{borderRadius:'10px'}}>
                <span>
                    <strong>
                        Photosynthesis Explained - CrashCourse
                    </strong>
                </span>
            </div>
          </div>
        </div>
      </Container>
    );
  }
}

export default Home;
