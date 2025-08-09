// src/App.jsx 
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Recuperar from './pages/Recuperar';
import ResetPassword from './pages/ResetPassword';
import Presentacion from './pages/Presentacion';
import Navbar from './components/Navbar';
import ProtectedRoute from './routes/ProtectedRoutes';
import Notas from './pages/Notas';
import PeriodistaUpload from './pages/PeriodistaUpload';
import ConfiguracionUsuario from './pages/ConfiguracionUsuario.jsx'


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


        <Route element={<ProtectedRoute allow={['Periodista']} />}>
          <Route path="/notas" element={<Notas />} />
          <Route path="/subir-articulo" element={<PeriodistaUpload />} />
          <Route path="/configuracion-usuario" element={<ConfiguracionUsuario />} />

        </Route>

        <Route path="/no-autorizado" element={<h2>No autorizado</h2>} />
      </Routes>
    </>
  );
}

export default App;