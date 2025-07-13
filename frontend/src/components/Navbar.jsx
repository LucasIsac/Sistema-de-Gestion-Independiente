import { Link } from 'react-router-dom';
import '../assets/styles/navbar.css'; 
import logo from '../assets/imagenes/logo.png';

function Navbar({ user }) {
  const categoria = user?.categoria;

  // Opciones según el rol del usuario
  const renderLinks = () => {
    switch (categoria) {
      case 'periodista':
        return (
          <>
            <Link to="/notas">Mis notas</Link>
            <Link to="/mensajes">Mensajes</Link>
          </>
        );
      case 'fotografo':
        return (
          <>
            <Link to="/galeria">Subir fotos</Link>
            <Link to="/mensajes">Mensajes</Link>
          </>
        );
      case 'editor':
        return (
          <>
            <Link to="/revisiones">Revisar publicaciones</Link>
            <Link to="/notificaciones">Notificaciones</Link>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo Diario" />
      </div>
      <div className="navbar-links">
        {renderLinks()}
      </div>
      <div className="navbar-user">
        {user ? (
          <span>{user.nombre} {user.apellido}</span>
        ) : (
          <Link to="/login">Iniciar sesión</Link>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
