import { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import logo from '../assets/imagenes/logo.png';
import '../assets/styles/navbar.css';

export default function Navbar() {
  const { user, logout, token } = useContext(AuthContext);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuRef = useRef(null);
  const navbarRef = useRef(null);

  const linksPorCategoria = {
    periodista: [
      { to: '/notas', texto: 'Mis Artículos' },
      { to: '/periodista-upload', texto: 'Subir Articulo' },
      { to: '/ArticulosEnRevision', texto: 'Enviados a Revisión' },
      { to: '/galeria-global', texto: 'Galeria' },
      { to: '/chat', texto: 'Chat' },
      { tipo: 'notificaciones', texto: 'Notificaciones' },
    
    ],
    fotografo: [
      { to: '/galeria-global', texto: 'Galeria' },
      { to: '/galeria', texto: 'Galería Personal' },
      { to: '/FotografoUpload', texto: 'Subir foto' },
      { to: '/chat', texto: 'Chat' },
      { tipo: 'notificaciones', texto: 'Notificaciones' },

    ],
    editor: [
      { to: '/revisiones', texto: 'Revisiones' },
      { to: '/articulos-aprobados', texto: 'Aprobados' },
      { to: '/galeria-global', texto: 'Galeria' },
      { to: '/chat', texto: 'Chat' },
      { tipo: 'notificaciones', texto: 'Notificaciones' },

    ],
    administrador: [
      { to: '/gestion-roles', texto: 'Gestión de Roles' },
      { to: '/gestion-usuario', texto: 'Gestión de Usuario' },
      { to: '/gestion-categorias', texto: 'Gestión de Categorías' },
      { to: '/notificaciones-internas', texto: 'Notificaciones Internas' },
      { to: '/admin/dashboard', texto: 'Panel' },
      { to: '/galeria-global', texto: 'Galeria' },
      { to: '/chat', texto: 'Chat' },
      { tipo: 'notificaciones', texto: 'Notificaciones' },

    ],
  };

  const links = user ? linksPorCategoria[user.categoria] ?? [] : [];

  useEffect(() => {
    if (user && token) {
      const cargarNotificaciones = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/notificaciones/${user.id_usuario}`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          if (!res.ok) throw new Error('Error al cargar notificaciones');
          const data = await res.json();
          setNotificaciones(data);
        } catch (err) {
          console.error("❌ Error al obtener notificaciones:", err);
        }
      };

      cargarNotificaciones();
    }
  }, [user, token]);

  // Marcar notificación como leída
  const marcarComoLeida = async (id) => {
    try {
      await fetch("http://localhost:5000/api/notificaciones/marcar-leida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_notificacion: id })
      });

      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id_notificacion === id ? { ...n, leido: true } : n
        )
      );
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarNotificaciones(false);
      }
      if (navbarRef.current && !navbarRef.current.contains(event.target)) {
        setDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Componente UserDrawer
  const UserDrawer = ({ isOpen, onClose }) => {
    return (
      <>
        <div className={`user-drawer-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
        
        <div className={`user-drawer ${isOpen ? 'open' : ''}`}>
          <div className="user-drawer-header">
            {user?.foto ? (
              <img 
                src={user.foto}
                alt="Avatar"
                className="user-drawer-avatar"
              />
            ) : (
              <div className="user-drawer-avatar">
                {user?.nombre.charAt(0)}
                {user?.apellido.charAt(0)}
              </div>
            )}
            <div className="user-drawer-info">
              <h3>{user?.nombre} {user?.apellido}</h3>
              <p>{user?.email}</p>
            </div>
          </div>

          <div className="user-drawer-options">
            <Link to="/perfil" className="user-drawer-item" onClick={onClose}>
              <span>👤</span> Mi perfil
            </Link>
            <Link to="/configuracion" className="user-drawer-item" onClick={onClose}>
              <span>⚙️</span> Configuración
            </Link>
          </div>

          <button className="user-drawer-logout" onClick={() => {
            logout();
            onClose();
          }}>
            Cerrar sesión
          </button>
        </div>
      </>
    );
  };

  // Función para alternar el menú hamburguesa
  const toggleMenu = () => {
    setMenuAbierto((prev) => !prev);
  };

  return (
    <nav className="navbar" ref={navbarRef}>
      {/* Botón de menú hamburguesa para móviles */}
      <button className="menu-toggle" onClick={toggleMenu}>
        ☰
      </button>

      <div className="nav-logo">
        <img src={logo} alt="Logo" />
      </div>

      <ul className={`nav-links ${menuAbierto ? 'active' : ''}`}>
        {links.map((l) =>
          l.tipo === 'notificaciones' ? (
            <li key="notificaciones" className="notificaciones-wrapper" ref={menuRef}>
              <button
                className="btn-notificaciones"
                onClick={() => setMostrarNotificaciones(!mostrarNotificaciones)}
              >
                🔔
                {notificaciones.filter(n => !n.leido).length > 0 && (
                  <span className="badge">
                    {notificaciones.filter(n => !n.leido).length}
                  </span>
                )}
              </button>

              {mostrarNotificaciones && (
                <div className="dropdown-notificaciones">
                  {notificaciones.length > 0 ? (
                    notificaciones.map((n) => (
                      <div key={n.id_notificacion} className={`notificacion-item ${!n.leido ? 'no-leida' : ''}`}>
                        <strong
                          onClick={() => {
                            setExpandedNotificationId(
                              expandedNotificationId === n.id_notificacion ? null : n.id_notificacion
                            );
                            if (!n.leido) {
                              marcarComoLeida(n.id_notificacion);
                            }
                          }}
                        >
                          {n.titulo}
                        </strong>
                        {expandedNotificationId === n.id_notificacion && (
                          <div className="notificacion-contenido">
                            <p>{n.mensaje}</p>
                            <small>{n.fecha}</small>
                          </div>
                        )}
                      </div>
                    ))
                  ) : (
                    <div>No tienes notificaciones</div>
                  )}
                </div>
              )}
            </li>
          ) : (
            <li key={l.to}>
              <Link to={l.to} onClick={() => setMenuAbierto(false)}>{l.texto}</Link>
            </li>
          )
        )}
      </ul>

      <div className="nav-user">
        {user ? (
          <div className="user-dropdown-container">
            <div
              className="user-avatar"
              onClick={() => setDrawerOpen(true)}
              title="Abrir/cerrar menú usuario"
            >
              {user?.foto ? (
                <img
                  src={user.foto}
                  alt="Avatar"
                  className="avatar-image"
                />
              ) : (
                <div className="avatar-initials">
                  {user?.nombre.charAt(0)}
                  {user?.apellido.charAt(0)}
                </div>
              )}
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
