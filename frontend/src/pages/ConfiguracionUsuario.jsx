import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import '../assets/styles/configuracion-usuario.css';

export default function ConfiguracionUsuario() {
  const { usuario, token, setUsuario } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [password, setPassword] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    telefono: '',
    email: ''
  });
  const [error, setError] = useState('');
  const [preview, setPreview] = useState(null);
  const inputFotoRef = useRef(null);
  const navigate = useNavigate();

  // Cargar datos del usuario
  useEffect(() => {
    if (usuario && usuario.id_usuario) {
      fetch(`http://localhost:5000/api/users/${usuario.id_usuario}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Error al cargar datos');
          return res.json();
        })
        .then(data => {
          if (data.usuario) {
            setFormData({
              nombre: data.usuario.nombre || '',
              apellido: data.usuario.apellido || '',
              telefono: data.usuario.telefono || '',
              email: data.usuario.email || ''
            });
            setError('');
          } else {
            setError('No se encontró información del usuario');
          }
        })
        .catch(err => {
          console.error('Error:', err);
          setError('Error al cargar datos del usuario');
        });
    }
  }, [usuario, token]);

  const handleFotoClick = () => inputFotoRef.current.click();

  const handleFotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('http://localhost:5000/api/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await response.json();

      if (response.ok) {
        setPreview(URL.createObjectURL(file));
        setUsuario(prev => ({
          ...prev,
          avatar_url: data.avatarUrl
        }));
      } else {
        throw new Error(data.message || 'Error al subir imagen');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al actualizar la foto de perfil');
    }
  };

  const handleUpdate = async () => {
    try {
      if (!usuario?.id_usuario) {
        throw new Error('ID de usuario no disponible');
      }

      const response = await fetch(`http://localhost:5000/api/users/${usuario.id_usuario}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          password
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar');
      }

      await response.json();
      alert('¡Datos actualizados correctamente!');
      setEditMode(false);
      setPassword('');
    } catch (err) {
      console.error('Error en handleUpdate:', err);
      setError(err.message || 'Error al actualizar los datos');
    }
  };

  return (
    <div className="configuracion-upload-container">
      <div className="upload-header">CONFIGURACIÓN DE USUARIO</div>

      <div className="upload-wrapper">
        <aside className="sidebar">
          {/* Espacio para opciones laterales */}
        </aside>

        <main className="upload-main">
          <div className="form-container">
            <h2 className="mi-perfil-titulo">Mi perfil</h2>

            {error && <div className="error-message">{error}</div>}

            <div className="imagen-perfil-box" onClick={handleFotoClick} style={{ cursor: 'pointer' }}>
              {preview ? (
                <img src={preview} alt="Foto de perfil" className="imagen-perfil" />
              ) : usuario?.avatar_url ? (
                <img src={`http://localhost:5000${usuario.avatar_url}`} alt="Foto de perfil" className="imagen-perfil" />
              ) : (
                <div className="imagen-perfil placeholder" />
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              hidden
              ref={inputFotoRef}
              onChange={handleFotoChange}
            />

            <button className="upload-button subir-btn" onClick={handleFotoClick}>
              Subir imagen
            </button>

            <div className="info-section">
              <div className="info-group">
                <label>Rol</label>
                <div className="info-value">{usuario?.categoria}</div>
              </div>

              <div className="info-group">
                <label>Nombre</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  />
                ) : (
                  <div className="info-value">{formData.nombre}</div>
                )}
              </div>

              <div className="info-group">
                <label>Apellido</label>
                {editMode ? (
                  <input
                    type="text"
                    value={formData.apellido}
                    onChange={(e) => setFormData({ ...formData, apellido: e.target.value })}
                  />
                ) : (
                  <div className="info-value">{formData.apellido}</div>
                )}
              </div>

              <div className="info-group">
                <label>Email</label>
                {editMode ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                ) : (
                  <div className="info-value">{formData.email}</div>
                )}
              </div>

              <div className="info-group">
                <label>Teléfono</label>
                {editMode ? (
                  <input
                    type="tel"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />
                ) : (
                  <div className="info-value">{formData.telefono || 'No especificado'}</div>
                )}
              </div>

              {editMode && (
                <div className="info-group">
                  <label>Contraseña actual*</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Requerida para guardar cambios"
                  />
                  <small className="password-note">
                    *Debes ingresar tu contraseña actual para confirmar los cambios
                  </small>
                </div>
              )}
            </div>

            <div className="button-group">
              {!editMode ? (
                <button onClick={() => setEditMode(true)} className="upload-button">
                  Editar información
                </button>
              ) : (
                <>
                  <button
                    onClick={handleUpdate}
                    className="upload-button guardar-btn"
                    disabled={!password}
                  >
                    Guardar cambios
                  </button>
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setPassword('');
                      setError('');
                    }}
                    className="upload-button cancel-btn"
                  >
                    Cancelar
                  </button>
                </>
              )}
              <button onClick={() => navigate('/recuperar')} className="upload-button">
                Cambiar contraseña
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
