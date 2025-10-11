import React, { useState } from "react";
import "../assets/styles/mensajes.css";

function Mensajes() {
  const [mensajes, setMensajes] = useState([
    { id: 1, autor: "Admin", texto: "Bienvenido al sistema 🎉" },
    { id: 2, autor: "Soporte", texto: "Tu cuenta fue actualizada correctamente ✅" },
  ]);
  const [nuevoMensaje, setNuevoMensaje] = useState("");

  const enviarMensaje = (e) => {
    e.preventDefault();
    if (!nuevoMensaje.trim()) return;

    const nuevo = {
      id: mensajes.length + 1,
      autor: "Tú",
      texto: nuevoMensaje,
    };
    setMensajes([...mensajes, nuevo]);
    setNuevoMensaje("");
  };

  return (
    <div className="mensajes-container">
      <header className="mensajes-header">
        <h1>Mensajes</h1>
        <p>Visualiza y envía mensajes dentro del sistema</p>
      </header>

      <div className="mensajes-lista">
        {mensajes.map((m) => (
          <div key={m.id} className="mensaje-card">
            <div className="mensaje-autor">{m.autor}</div>
            <div className="mensaje-texto">{m.texto}</div>
          </div>
        ))}
      </div>

      <form className="mensaje-form" onSubmit={enviarMensaje}>
        <input
          type="text"
          placeholder="Escribe un mensaje..."
          value={nuevoMensaje}
          onChange={(e) => setNuevoMensaje(e.target.value)}
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}

export default Mensajes;
