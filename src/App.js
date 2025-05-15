import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from 'react-bootstrap';
import Home from './Components/Home';
import Login from './Components/Login';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import {ToastContainer} from 'react-toastify';

function App() {
  return (
    <Container style={{padding: 0, margin: 0, display: 'flex', flexDirection:'column', maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden'}}>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </Container>
  );
}

export default App;
