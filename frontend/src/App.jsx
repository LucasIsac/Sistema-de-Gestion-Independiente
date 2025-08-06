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
import PeriodistaUpload from './pages/PeriodistaUpload';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route element={<ProtectedRoute allow={['Periodista']} />}>
          <Route path="/notas" element={<Notas />} />
          <Route path="/subir-articulo" element={<PeriodistaUpload />} />

        </Route>

        <Route element={<ProtectedRoute allow={['fotografo']} />}>
          <Route path="/galeria" element={<Galeria />} />
        </Route>

        <Route element={<ProtectedRoute allow={['periodista', 'fotografo', 'editor']} />}>
          <Route path="/mensajes" element={<Mensajes />} />
        </Route>

        <Route path="/no-autorizado" element={<h2>No autorizado</h2>} />
      </Routes>
    </Router>
  );
}

export default App;