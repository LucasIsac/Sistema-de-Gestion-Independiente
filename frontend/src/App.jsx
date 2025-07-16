// src/App.jsx (o donde tengas tus rutas)
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Recuperar from './pages/Recuperar';
import ResetPassword from './pages/ResetPassword';
import Presentacion from './pages/Presentacion';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoutes';
import Notas from './pages/Notas';
import Galeria from './pages/Galeria';
import Mensajes from './pages/Mensajes';


function App() {
  return (
     <>
      <Navbar /> {/* visible siempre */}
      <Routes>
        {/* Define tus rutas aquí sin envolverlas en Router */}
        <Route path="/" element={<Presentacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute allow={['periodista']} />}>
          <Route path="/notas" element={<Notas />} />
        </Route>

        <Route element={<ProtectedRoute allow={['fotografo']} />}>
          <Route path="/galeria" element={<Galeria />} />
        </Route>

        <Route element={<ProtectedRoute allow={['periodista', 'fotografo', 'editor']} />}>
          <Route path="/mensajes" element={<Mensajes />} />
        </Route>

        <Route path="/no-autorizado" element={<h2>No autorizado</h2>} />
      </Routes>
    </>
  );
}

export default App;