import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Recuperar from './pages/Recuperar';
import Presentacion from './pages/Presentacion';

function App() {
 

  return (
   <Router>
      <Routes>
        <Route path="/" element={<Presentacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-contraseña" element={<Recuperar />} />
        
      </Routes>
    </Router>
  )
}

export default App
