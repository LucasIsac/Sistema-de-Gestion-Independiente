import React, { useState } from "react";
import "../assets/styles/notificaciones.css";

export default function NotificacionesInternas() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [destinatario, setDestinatario] = useState("");

  const generarNotificacion = async () => {
    if (!titulo || !descripcion || !destinatario) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descripcion, destinatario })
      });

      if (response.ok) {
        alert("Notificación generada con éxito");
        setTitulo("");
        setDescripcion("");
        setDestinatario("");
      } else {
        alert("Error al generar la notificación");
      }
    } catch (error) {
      console.error(error);
      alert("Error de conexión con el servidor");
    }
  };

  return (
    <div className="notificaciones-container">
      <h1>Notificaciones Internas</h1>

      <label>Título:</label>
      <input
        type="text"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        placeholder="Ingrese el título"
      />

      <label>Descripción:</label>
      <textarea
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        placeholder="Ingrese la descripción"
      />

      <label>Destinatario:</label>
      <input
        type="text"
        value={destinatario}
        onChange={(e) => setDestinatario(e.target.value)}
        placeholder="Ingrese el destinatario"
      />

      <button onClick={generarNotificacion}>Generar Notificación</button>
    </div>
  );
}
