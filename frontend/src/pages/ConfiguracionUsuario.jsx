import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../assets/styles/configuracion-usuario.css';

export default function ConfiguracionUsuario() {
  const inputFotoRef = useRef();
  const navigate = useNavigate();

  const [preview, setPreview] = useState(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');

  const handleFotoClick = () => inputFotoRef.current.click();

  const handleFotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleGuardar = () => {
    console.log({
      nombre,
      apellido,
      telefono,
      correo,
    });
    // Lógica de guardado
  };

  return (
    <div className="configuracion-upload-container">
      <div className="upload-header">CONFIGURACIÓN</div>
      <div className="upload-wrapper">
        <aside className="sidebar"></aside>

        <main className="upload-main">
          <div className="form-container">
            <h2 className="mi-perfil-titulo">Mi perfil</h2>

            <div className="imagen-perfil-box" onClick={handleFotoClick}>
              {preview ? (
                <img src={preview} alt="Foto de perfil" className="imagen-perfil" />
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

            <label>Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Tu nombre"
            />

            <label>Apellido</label>
            <input
              type="text"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              placeholder="Tu apellido"
            />

            <label>Teléfono</label>
            <input
              type="text"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Tu teléfono"
            />

            <label>Correo electrónico</label>
            <input
              type="text"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              placeholder="Tu correo"
            />

            <button
              className="upload-button"
              onClick={() => navigate('/recuperar')}
            >
              Cambiar contraseña
            </button>

            <button className="upload-button guardar-btn" onClick={handleGuardar}>
              Guardar
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}
