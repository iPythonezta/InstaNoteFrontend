import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import { Container } from 'react-bootstrap';
import Home from './Components/Home';
import './Components/home.css';

function App() {
  return (
    <Container style={{padding: 0, margin: 0, display: 'flex', flexDirection:'column', maxWidth: '100vw', maxHeight: '100vh', overflow: 'hidden'}}>
      <Home />
    </Container>
  );
}

export default App;
