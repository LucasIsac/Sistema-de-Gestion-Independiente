import React, { useState, useRef, useEffect } from "react";
import { useChat } from "../context/chatContext.jsx";
import { Send } from "lucide-react";

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
    <div className="flex flex-col max-w-3xl w-full mx-auto mt-10 bg-white rounded-3xl shadow-2xl overflow-hidden border border-green-100 transition-all">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-green-700 to-green-600 text-white px-6 py-5 flex items-center justify-between shadow-lg">
        <h2 className="font-semibold text-xl flex items-center gap-2 tracking-wide">
          💬 <span>{receptor.nombre}</span>
        </h2>
        <span className="text-xs opacity-80 italic animate-pulse">
          en línea
        </span>
      </div>

      {/* MENSAJES */}
      <div className="flex-1 overflow-y-auto p-6 bg-gradient-to-b from-green-50 via-white to-white scrollbar-thin scrollbar-thumb-green-300 scrollbar-track-transparent">
        {mensajesFiltrados.length === 0 ? (
          <p className="text-center text-gray-500 mt-16 text-sm">
            No hay mensajes todavía.
            <br />
            <span className="text-green-700 font-medium">
              ¡Comenzá la conversación! 🌱
            </span>
          </p>
        ) : (
          mensajesFiltrados.map((m) => (
            <div
              key={m.id_mensaje}
              className={`flex mb-3 ${
                m.emisor_id === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`relative max-w-xs md:max-w-sm px-4 py-3 rounded-2xl text-sm shadow-md transform transition-all duration-300 animate-fadeIn ${
                  m.emisor_id === userId
                    ? "bg-green-600 text-white rounded-br-none hover:scale-[1.02]"
                    : "bg-gray-100 text-gray-800 rounded-bl-none hover:bg-gray-200"
                }`}
              >
                {m.contenido}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* INPUT */}
      <div className="p-4 border-t border-green-200 bg-white flex gap-3 items-center">
        <input
          type="text"
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder="Escribí un mensaje..."
          onKeyDown={(e) => e.key === "Enter" && handleEnviar()}
          className="flex-1 border border-green-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition-all"
        />
        <button
          onClick={handleEnviar}
          disabled={!texto.trim()}
          className={`flex items-center gap-2 px-5 py-2 rounded-full font-medium shadow-md transition-all ${
            texto.trim()
              ? "bg-green-600 hover:bg-green-700 active:scale-95 text-white"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
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
