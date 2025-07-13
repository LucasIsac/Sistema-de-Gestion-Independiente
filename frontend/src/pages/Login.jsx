// src/pages/Login.jsx
import LoginForm from '../components/LoginForm';
import Header from '../components/Header';
import Navbar from '../components/Navbar';
import '../assets/styles/login.css';

function Login() {
  const handleLogin = (credenciales) => {
    console.log('Intento de login:', credenciales);
  };

  return (
   <div className="login-page">
      <Header />
      <div className="login-container">
        <LoginForm onLogin={handleLogin} />
      </div>
    </div>
  );
}

export default Login;
