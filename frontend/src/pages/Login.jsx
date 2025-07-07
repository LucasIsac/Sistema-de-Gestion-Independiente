// src/pages/Login.jsx
import LoginForm from '../components/LoginForm';
import '../assets/styles/login.css';

function Login() {
  const handleLogin = (credenciales) => {
    console.log('Intento de login:', credenciales);
  };

  return (
    <div className="login-container">
      <LoginForm onLogin={handleLogin} />
    </div>
  );
}

export default Login;
