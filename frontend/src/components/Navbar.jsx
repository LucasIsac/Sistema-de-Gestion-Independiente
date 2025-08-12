import { useContext, useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext.js';
import logo from '../assets/imagenes/logo.png';
import '../assets/styles/navbar.css';

export default function Navbar() {
  const { usuario, logout } = useContext(AuthContext);
  const [mostrarNotificaciones, setMostrarNotificaciones] = useState(false);
  const [notificaciones, setNotificaciones] = useState([]);
  const [expandedNotificationId, setExpandedNotificationId] = useState(null);
  const [menuAbierto, setMenuAbierto] = useState(false); // Nuevo estado para menú móvil
  const menuRef = useRef(null);
  const navbarRef = useRef(null);

  const linksPorCategoria = {
    periodista: [
      { to: '/notas', texto: 'Mis Artículos' },
      { to: '/enviados-revision', texto: 'Enviados a Revisión' },
      { tipo: 'notificaciones', texto: 'Notificaciones' },
      { to: '/ajustes', texto: 'Ajustes' },
      { to: '/mensajes', texto: 'Mensajes' },
      { to: '/periodista-upload', texto: 'Archivo' },
    ],
    fotografo: [
      { to: '/galeria', texto: 'Galería' },
      { tipo: 'notificaciones', texto: 'Notificaciones' },
      { to: '/ajustes', texto: 'Ajustes' },
      { to: '/mensajes', texto: 'Mensajes' },
    ],
    editor: [
      { to: '/revisiones', texto: 'Revisiones' },
      { to: '/notificaciones-internas', texto: 'Notificaciones Internas' },
      { tipo: 'notificaciones', texto: 'Notificaciones' },
    ],
    administrador: [
      { to: '/gestion-roles', texto: 'Gestión de Roles' },
      { to: '/gestion-usuario', texto: 'Gestión de Usuario' },
      { to: '/gestion-categorias', texto: 'Gestión de Categorías' },
      { to: '/notificaciones-internas', texto: 'Notificaciones Internas' },
      { tipo: 'notificaciones', texto: 'Notificaciones' },
      { to: '/ajustes', texto: 'Ajustes' },
    ],
  };

  const links = usuario ? linksPorCategoria[usuario.categoria] ?? [] : [];

  useEffect(() => {
    if (usuario) {
      const cargarNotificaciones = async () => {
        try {
          const res = await fetch(`http://localhost:5000/api/notificaciones/${usuario.id_usuario}`);
          if (!res.ok) throw new Error('Error al cargar notificaciones');
          const data = await res.json();
          setNotificaciones(data);
        } catch (err) {
          console.error("❌ Error al obtener notificaciones:", err);
        }
      };

      cargarNotificaciones();
    }
  }, [usuario]);

  // Marcar notificación como leída
  const marcarComoLeida = async (id) => {
    try {
      await fetch("http://localhost:5000/api/notificaciones/marcar-leida", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id_notificacion: id })
      });

      // Actualizar estado local para que se quite el "no-leída" visualmente
      setNotificaciones((prev) =>
        prev.map((n) =>
          n.id_notificacion === id ? { ...n, leido: true } : n
        )
      );
    } catch (error) {
      console.error("Error al marcar como leída:", error);
    }
  };


  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMostrarNotificaciones(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función para alternar el menú móvil
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