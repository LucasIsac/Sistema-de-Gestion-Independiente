import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import UserDrawer from './UserDrawer';
import logo from '../assets/imagenes/logo.png';
import '../assets/styles/navbar.css';

export default function Navbar() {
  const { usuario } = useContext(AuthContext);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const linksPorCategoria = {
    periodista: [ 
      { to: '/notas', texto: 'Mis Artículos' },
      { to: '/enviados-revision', texto: 'Enviados a Revisión' },
      { to: '/notificaciones', texto: 'Notificaciones' },
      { to: '/ajustes', texto: 'Ajustes' },
      { to: '/mensajes', texto: 'Mensajes' },
      { to: '/periodista-upload', texto:'Archivo' },
    ],
    fotografo: [
      { to: '/galeria', texto: 'Galería' },
      { to: '/notificaciones', texto: 'Notificaciones' },
      { to: '/ajustes', texto: 'Ajustes' },
      { to: '/mensajes', texto: 'Mensajes' },
    ],
    editor: [
      { to: '/revisiones', texto: 'Revisiones' },
      { to: '/notificaciones', texto: 'Notificaciones' },
    ],
  };

  const links = usuario ? linksPorCategoria[usuario.categoria] ?? [] : [];

  return (
    <nav className="navbar">
      <div className="nav-logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className="nav-links">
        {links.map((l) => (
          <li key={l.to}>
            <Link to={l.to}>{l.texto}</Link>
          </li>
        ))}
      </ul>

      <div className="nav-user">
        {usuario ? (
          <div className="user-dropdown-container">
            <div 
              className="user-avatar" 
              onClick={() => setDrawerOpen(!drawerOpen)}
              title="Abrir/cerrar menú usuario"
            >
              {usuario.nombre.charAt(0)}{usuario.apellido.charAt(0)}
            </div>

            <UserDrawer 
              isOpen={drawerOpen} 
              onClose={() => setDrawerOpen(false)} 
            />
          </div>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}
