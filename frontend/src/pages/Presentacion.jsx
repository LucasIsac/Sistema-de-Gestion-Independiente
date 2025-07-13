import '../assets/styles/presentacion.css';
import logo from '../assets/imagenes/logo.png';
import Navbar from '../components/Navbar';

function Presentacion() {
  return (
    <>
      <Navbar user={null} />
      <div className="presentacion-container">
        <div className="contenido">
          <img src={logo} alt="Logo Diario" className="logo-presentacion" />
          <h1>Sistema de Gestión de Archivos</h1>
          <p>
            Bienvenido al sistema interno del Diario El Independiente.
            Este sistema permite a periodistas, fotógrafos y editores gestionar su trabajo de forma eficiente y colaborativa.
          </p>
          <p>
            Inicie sesión desde el botón ubicado arriba a la derecha para acceder a sus herramientas.
          </p>
        </div>
      </div>
    </>
  );
}

export default Presentacion;
