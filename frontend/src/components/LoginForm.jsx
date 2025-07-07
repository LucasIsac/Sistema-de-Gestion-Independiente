
import { useState } from 'react';
import { Link } from 'react-router-dom';
import '../assets/styles/login.css';

function LoginForm({ onLogin }) {
  const [usuario, setUsuario] = useState('');
  const [clave, setClave] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ usuario, clave });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      <h2>Iniciar sesión</h2>
      <input
        type="text"
        placeholder="Usuario"
        value={usuario}
        onChange={(e) => setUsuario(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={clave}
        onChange={(e) => setClave(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>

       <div className="login-options">
        <Link to="/recuperar" className="link-recuperar">
          ¿Olvidaste tu contraseña?
        </Link>
      </div>
    </form>
  );
}

export default LoginForm;
