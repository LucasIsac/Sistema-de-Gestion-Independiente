import React, { useState } from 'react';
import '../assets/styles/galeria.css';
import TarjetaFoto from '../components/TarjetaFoto';

const GaleriaPersonal = () => {
  // Datos de prueba para mostrar en la galería
  const [fotos] = useState([
    { url: 'https://picsum.photos/400/500?random=1', titulo: 'Paisaje' },
    { url: 'https://picsum.photos/400/300?random=2', titulo: 'Montaña' },
    { url: 'https://picsum.photos/400/600?random=3', titulo: 'Ciudad' },
    { url: 'https://picsum.photos/400/400?random=4', titulo: 'Campo' },
    { url: 'https://picsum.photos/400/450?random=5', titulo: 'Playa' },
    { url: 'https://picsum.photos/400/350?random=6', titulo: 'Cascada' },
    { url: 'https://picsum.photos/400/550?random=7', titulo: 'Lago' },
    { url: 'https://picsum.photos/400/370?random=8', titulo: 'Bosque' }
  ]);

  return (
    <div className="galeria-container">
      <h1>Mi Galería</h1>
      <div className="galeria-grid">
        {fotos.map((foto, index) => (
          <TarjetaFoto key={index} imagen={foto.url} titulo={foto.titulo} />
        ))}
      </div>
    </div>
  );
};

export default GaleriaPersonal;
