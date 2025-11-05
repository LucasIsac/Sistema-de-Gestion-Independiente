import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../context/chatContext.jsx";
import { Send } from "lucide-react";
import "../assets/styles/chat-page.css"; // asegúrate de tenerlo importado

const ChatBox = ({ receptor, userId }) => {
  const { mensajes, enviarMensaje } = useChat();
  const [texto, setTexto] = useState("");
  const chatEndRef = useRef(null);

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

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [mensajesFiltrados]);

  return (
    <div className="chat-box-container">
      {/* HEADER */}
      <div className="chat-header">
        <h2>💬 {receptor.nombre}</h2>
        <span className="chat-status">en línea</span>
      </div>

      {/* MENSAJES */}
      <div className="chat-messages">
        {mensajesFiltrados.length === 0 ? (
          <div className="chat-placeholder">
            <h3>🌱 No hay mensajes todavía</h3>
            <p>Comenzá la conversación con {receptor.nombre}</p>
          </div>
        ) : (
          mensajesFiltrados.map((m) => {
            const esPropio = m.emisor_id === userId;
            return (
              <div
                key={m.id_mensaje}
                className={`message-bubble ${
                  esPropio ? "message-sent" : "message-received"
                }`}
              >
                {/* Nombre del otro usuario */}
                {!esPropio && (
                  <div className="message-sender">{receptor.nombre}</div>
                )}

                {/* Contenido */}
                <div className="message-text">{m.contenido}</div>

                {/* Etiqueta inferior */}
                <div className="message-label">
                  {esPropio ? "Tú" : receptor.nombre}
                </div>
              </div>
            );
          })
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="chat-input-container">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribí un mensaje..."
          onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
          className="chat-input"
        />
        <button
          onClick={handleEnviar}
          disabled={!texto.trim()}
          className={`chat-send-btn ${
            texto.trim() ? "active" : "inactive"
          }`}
        >
          <Send className="w-4 h-4" />
          <span className="hidden sm:inline">Enviar</span>
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
