import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import FotografoUpload from './pages/FotografoUpload';
import PeriodistaUpload from './pages/PeriodistaUpload';
import Presentacion from './pages/Presentacion';
import Login from './pages/Login';
import Recuperar from './pages/Recuperar';
import ResetPassword from './pages/ResetPassword';
import Notas from './pages/Notas';
import ConfiguracionUsuario from './pages/ConfiguracionUsuario';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import GestionRoles from './pages/GestionRoles';
import GestionCategorias from './pages/GestionCategorias';
import NotificacionesInternas from './pages/NotificacionesInternas';
import GestionUsuario from './pages/GestionUsuario';
import RevisionEditor from './pages/RevisionEditor';
import GaleriaPersonal from './pages/GaleriaPersonal';
import Revisiones from './pages/Revisiones';
import GestionEditor from './pages/GestionEditor';
import Categorias from './pages/Categorias';
import EnviadosRevision from './pages/EnviadosRevision';

function App() {
  return (
    <>
      <Navbar /> {/* visible siempre */}
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

        <Route element={<ProtectedRoute allow={['periodista']} />}>
          <Route path="/enviados-revision" element={<EnviadosRevision />} />
        </Route>

        <Route element={<ProtectedRoute allow={['fotografo']} />}>
          <Route path="/fotografo-upload" element={<FotografoUpload />} />
        </Route>

        <Route element={<ProtectedRoute allow={['fotografo']} />}>
          <Route path="/galeriaPersonal" element={<GaleriaPersonal />} />
        </Route>

        <Route element={<ProtectedRoute allow={['administrador']} />}>
          <Route path="/gestion-roles" element={<GestionRoles />} />
        </Route>

        <Route element={<ProtectedRoute allow={['administrador']} />}>
          <Route path="/gestion-categorias" element={<GestionCategorias />} />
        </Route>

        <Route element={<ProtectedRoute allow={['administrador', 'editor']} />}>
          <Route path="/notificaciones-internas" element={<NotificacionesInternas />} />
        </Route>

        <Route element={<ProtectedRoute allow={['administrador']} />}>
          <Route path="/gestion-usuario" element={<GestionUsuario />} />
        </Route>

        <Route element={<ProtectedRoute allow={['editor']} />}>
          <Route path="/revision-editor" element={<RevisionEditor />} />
        </Route>

        <Route element={<ProtectedRoute allow={['editor']} />}>
          <Route path="/gestion-editor" element={<GestionEditor />} />
        </Route>

        <Route element={<ProtectedRoute allow={['editor']} />}>
          <Route path="/revisiones" element={<Revisiones />} />
        </Route>

        <Route element={<ProtectedRoute allow={['editor']} />}>
          <Route path="/categorias" element={<Categorias />} />
        </Route>

        <Route path="/no-autorizado" element={<h2>No autorizado</h2>} />
      </Routes>
    </>
  );
}

export default App;
