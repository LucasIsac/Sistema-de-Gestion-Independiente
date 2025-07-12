// src/pages/Recuperar.jsx
import Header from '../components/Header';
import RecuperarForm from '../components/RecuperarForm';
import '../assets/styles/recuperar.css';

function Recuperar() {
  return (
    <>
      <Header />
      <div className="recuperar-container">
        <RecuperarForm />
      </div>
    </>
  );
}

export default Recuperar;

