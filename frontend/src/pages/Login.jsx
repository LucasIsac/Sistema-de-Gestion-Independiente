import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../assets/styles/login.css';
import AuthContext from '../context/AuthContext.js';

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleLogin = async (credentials) => {
    try {
      console.log('🔄 Enviando credenciales:', credentials);
      
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
        console.log('✅ Login exitoso:', data.user);
        // Actualizar contexto (y localStorage dentro del provider)
        login(data.user);

        // Redirigir según el rol del usuario
        const rol = data.user.categoria;
        console.log('Redirigiendo según el rol:', rol);

        if (rol === 'periodista') {
          navigate('/notas');
        } else if (rol === 'fotografo') {
          navigate('/galeria');
        } else if (rol === 'administrador') {
          navigate('/gestion-roles');
        } else if (rol === 'editor') {
          navigate('/revisiones');
        } else {
          navigate('/dashboard'); // ruta por defecto
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
