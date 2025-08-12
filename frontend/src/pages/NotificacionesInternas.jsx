import React, { useState } from "react";
import "../assets/styles/notificaciones.css";

export default function NotificacionesInternas() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [tipoDestino, setTipoDestino] = useState("usuario"); // usuario, grupo, todos
  const [valorDestino, setValorDestino] = useState("");

  const generarNotificacion = async () => {
    if (!titulo || !descripcion || (tipoDestino !== "todos" && !valorDestino)) {
      alert("Por favor complete todos los campos");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/notificaciones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, mensaje: descripcion, tipoDestino, valorDestino })
      });

      if (response.ok) {
        alert("Notificación generada con éxito");
        setTitulo("");
        setDescripcion("");
        setValorDestino("");
        setTipoDestino("usuario");
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

      <label>Enviar a:</label>
      <select value={tipoDestino} onChange={(e) => setTipoDestino(e.target.value)}>
        <option value="usuario">Usuario específico</option>
        <option value="grupo">Grupo de usuarios</option>
        <option value="todos">Todos los usuarios</option>
      </select>

      {tipoDestino === "usuario" && (
        <input
          type="number"
          value={valorDestino}
          onChange={(e) => setValorDestino(e.target.value)}
          placeholder="ID del usuario"
        />
      )}

      {tipoDestino === "grupo" && (
        <input
          type="text"
          value={valorDestino}
          onChange={(e) => setValorDestino(e.target.value)}
          placeholder="Nombre del rol (ej: periodista)"
        />
      )}

      <button onClick={generarNotificacion}>Generar Notificación</button>
    </div>
  );
}
