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
      { to: '/notas', texto: 'Mis Notas' },
      { to: '/mensajes', texto: 'Mensajes' },
    ],
    fotografo: [
      { to: '/galeria', texto: 'Subir Fotos' },
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