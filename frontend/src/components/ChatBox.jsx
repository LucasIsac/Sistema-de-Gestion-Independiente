import React, { useState } from "react";
import { useChat } from "../context/chatContext.jsx";

const ChatBox = ({ receptor, userId }) => {
  const { mensajes, enviarMensaje } = useChat();
  const [texto, setTexto] = useState("");

  const handleEnviar = () => {
    if (texto.trim()) {
      enviarMensaje(receptor.id, texto);
      setTexto("");
    }
  };

  const mensajesFiltrados = mensajes.filter(
    (m) =>
      (m.emisor_id === userId && m.receptor_id === receptor.id) ||
      (m.emisor_id === receptor.id && m.receptor_id === userId)
  );

  return (
    <div className="p-4 border rounded-lg bg-white shadow-md w-full max-w-md">
      <h2 className="font-bold mb-2 text-gray-800">
        Chat con {receptor.nombre}
      </h2>

      <div className="h-64 overflow-y-auto border p-2 mb-2 bg-gray-50 rounded">
        {mensajesFiltrados.map((m) => (
          <div
            key={m.id_mensaje}
            className={`my-1 flex ${
              m.emisor_id === userId ? "justify-end" : "justify-start"
            }`}
          >
            <p
              className={`inline-block px-2 py-1 rounded-lg ${
                m.emisor_id === userId
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-black"
              }`}
            >
              {m.contenido}
            </p>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribe un mensaje..."
          className="border flex-1 p-2 rounded"
        />
        <button
          onClick={handleEnviar}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
        >
          Enviar
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
