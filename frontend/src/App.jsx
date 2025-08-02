import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Mensajes from './pages/Mensajes';
import FotografoUpload from './pages/FotografoUpload';
import PeriodistaUpload from './pages/PeriodistaUpload';

import Presentacion from './pages/Presentacion';
import Login from './pages/Login';
import Recuperar from './pages/Recuperar';
import ResetPassword from './pages/ResetPassword';
import Notas from './pages/Notas';
import Galeria from './pages/Galeria';
import ConfiguracionUsuario from './pages/ConfiguracionUsuario'; // ✅ NUEVO
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Presentacion />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar" element={<Recuperar />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/configuracion" element={<ConfiguracionUsuario />} /> {/* ✅ NUEVA RUTA */}

        <Route element={<ProtectedRoute allow={['periodista']} />}>
          <Route path="/periodista-upload" element={<PeriodistaUpload />} />
        </Route>

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
