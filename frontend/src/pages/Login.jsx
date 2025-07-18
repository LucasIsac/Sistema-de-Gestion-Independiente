import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../assets/styles/login.css';

function Login() {
  const [error, setError] = useState('');
  const navigate = useNavigate();

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
        // Guardar token en localStorage
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        
        // Redirigir a notas
        navigate('/notas');
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