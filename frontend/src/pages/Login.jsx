// src/pages/login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js'; // Importar AuthContext
import LoginForm from '../components/LoginForm';
import '../assets/styles/login.css';

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); // Ahora sí está definido

 const handleLogin = async (credentials) => {
  try {
    const response = await fetch('http://localhost:5000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password
      }),
    });
    
    const data = await response.json();
    
    console.log('📡 Respuesta del servidor:', data);
    
    if (response.ok) {
      // Pasar tanto el usuario como el token al login
      login(data.user, data.token); // Asegúrate que el backend devuelve token

      // Redirigir según el rol
      const rol = data.user.categoria;
      console.log('Redirigiendo según el rol:', rol);
      
      switch(rol) {
        case 'Periodista':
          navigate('/notas');
          break;
        case 'Fotografo':
          navigate('/galeria');
          break;
        case 'Editor':
          navigate('/editor');
          break;
        default:
          navigate('/');
      }
    } else {
      setError(data.message || 'Credenciales incorrectas');
    }
  } catch (error) {
    console.error('💥 Error al intentar login:', error);
    setError('Error de conexión con el servidor');
  }
};

  return (
    <div className="login-page">
      <div className="login-container">
        {error && <div className="error-message">{error}</div>}
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}

export default Login;
