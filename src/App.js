import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from 'react-bootstrap';
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import {ToastContainer} from 'react-toastify';
import { useUserContext } from './ContextApi';
import { useEffect } from 'react';
import axios from 'axios';

function App() {

  const {login, setLogin, setToken, setUser} = useUserContext();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.get('http://localhost:8080/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => {
        const username = response.data;
        setUser(username);
        setToken(token);
        setLogin(true);
      })
      .catch(error => {
        console.error('Error fetching user data:', error);
        localStorage.removeItem('token');
        setLogin(false);
      });
    }
  })
  

  return (
    <Container style={{padding: 0, margin: 0, display: 'flex', flexDirection:'column', maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden'}}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path='/register' element={<Register />} /> 
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
