//src/pages/login.jsx
import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import Header from '../components/Header';
import '../assets/styles/login.css';

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
          // ✅ CAMBIO: Guardar token y usuario
          login(data.user, data.token);
          
          // Redirigir según el rol del usuario
          const rol = data.user.categoria;
          console.log('Redirigiendo según el rol:', rol);
          if (rol === 'Periodista') {
            navigate('/notas');
          } else if (rol === 'Fotografo') {
            navigate('/galeria');
          } else if (rol === 'Editor') {
            navigate('/editor');
          } else {
            navigate('/Dashboard');
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
      <Header />
      <div className="login-container">
        {error && <div className="error-message">{error}</div>}
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}

export default Login;