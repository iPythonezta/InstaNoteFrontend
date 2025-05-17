import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Navbar, Spinner } from 'react-bootstrap';
import { useUserContext } from '../ContextApi';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './home.css';

const Home = () => {
  const { login, setLogin, user, token, setToken, setUser, loading, setLoading } = useUserContext();
  const [notes, setNotes] = useState([]);
  const [isPlaylist, setIsPlaylist] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading2, setLoading2] = useState(false);
  const notesPerPage = 5;

  const fetchAllNotes = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/notes', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setNotes(response.data.map(item => ({
        id: item.id,
        ...JSON.parse(item.notes.trim())
      })));
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  };

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

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this note?");
    if (!confirmDelete) return;
    setLoading2(true);

    try {
      await axios.delete(`http://localhost:8080/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotes(prev => prev.filter(note => note.id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
    setLoading2(false);
  };

  const navigate = useNavigate();

  useEffect(() => {
    fetchAllNotes();
  }, []);

  useEffect(() => {
    if (!login) {
      navigate('/login');
    }
  }, [login]);

  // Pagination logic
  const sortedNotes = [...notes].sort((a, b) => b.id - a.id);
  const indexOfLastNote = currentPage * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = sortedNotes.slice(indexOfFirstNote, indexOfLastNote);
  const totalPages = Math.ceil(sortedNotes.length / notesPerPage);

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

      <div className="lower-portion">
        {loading2 ? (
          <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '50vh' }}>
            <Spinner animation="border" variant="primary" style={{ height: '60px', width: '60px' }} />
            <p className="mt-3 text-muted">Deleting...</p>
          </div>
        ) : (
          <>
            <h5 className="m-3" style={{ padding: '10px', alignSelf: 'center' }}>Use History</h5>
            <div id="note-container" style={{ marginLeft: '10px', alignSelf: 'center' }}>
              {currentNotes.map((note) => (
                <div
                  className="previous-note border mt-3"
                  style={{ borderRadius: '10px', cursor: 'pointer' }}
                  key={note.id}
                  onClick={(e) => {
                    if (e.target.classList.contains('delete-btn')) return;
                    navigate(`/notes/${note.id}`);
                  }}
                >
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(note.id);
                    }}
                  >
                    ×
                  </button>
                  <span><strong>{note.title}</strong></span>
                  <p>{note.description}</p>
                </div>
              ))}
            </div>

            {sortedNotes.length === 0 && (
              <div className="filler">
                <p className='text-center text-muted'>
                  No history yet. Start by entering a video URL.
                </p>
              </div>
            )}

            {sortedNotes.length > notesPerPage && (
              <div className="d-flex justify-content-center mt-4 mb-5 gap-3">
                <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
                  Previous
                </Button>
                <span className="align-self-center">Page {currentPage} of {totalPages}</span>
                <Button variant="secondary" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
};

export default Home;
