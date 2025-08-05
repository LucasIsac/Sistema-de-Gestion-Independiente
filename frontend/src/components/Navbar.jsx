import { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.js';
import logo from '../assets/imagenes/logo.png';
import '../assets/styles/navbar.css';

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext);

  // --- Links por categoría -----------------------------
  const linksPorCategoria = {
    periodista: [ 
      { to: '/notas', texto: 'Mis Artículos' },
      { to: '/enviados-revision', texto: 'Enviados a Revisión' },
      { to: '/notificaciones', texto: 'Notificaciones' },
      { to: '/ajustes', texto: 'Ajustes' },
      { to: '/mensajes', texto: 'Mensajes' },
      { to: '/periodista-upload', texto:'Archivo' }, // si querés mensajes también para periodista
    ],
    fotografo: [
      { to: '/galeria', texto: 'Galería' },
      { to: '/notificaciones', texto: 'Notificaciones' },
      { to: '/ajustes', texto: 'Ajustes' },
      { to: '/mensajes', texto: 'Mensajes' },
    ],
    editor: [
  { to: '/revisiones', texto: 'Revisiones' },
  { to: '/gestion-roles', texto: 'Gestión de Roles' },
  { to: '/gestion-categorias', texto: 'Gestión de Categorías' },
  { to: '/notificaciones-internas', texto: 'Notificaciones Internas' },
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
          <>
            <span className="nav-name">
              {usuario.nombre} {usuario.apellido}
            </span>
            <button onClick={logout} className="btn-logout">
              Cerrar sesión
            </button>
          </>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}