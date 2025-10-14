// src/pages/login.jsx - VERSIÓN LIMPIA
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.js';
import LoginForm from '../components/LoginForm';
import '../assets/styles/login.css';

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

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
      
      if (response.ok) {
        login(data.user, data.token);

      // Redirigir según el rol
      const rol = data.user.categoria;
      console.log('Redirigiendo según el rol:', rol);
      
      switch(rol) {
        case 'periodista':
          navigate('/notas');
          break;
        case 'fotografo':
          navigate('/galeria');
          break;
        case 'editor':
          navigate('/editor');
          break;
        case 'administrador': // Estandarizar con el backend
          navigate('/gestion-usuario');
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