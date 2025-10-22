import React from 'react';

const TarjetaFoto = ({ imagen, titulo }) => {
  return (
    <div className="tarjeta-foto">
      <img src={imagen} alt={titulo} />
      <div className="tarjeta-info">
        <p>{titulo}</p>
      </div>
    </div>
  );
};

export default TarjetaFoto;
