import React, { useEffect, useState, useContext } from "react";
import { useChat } from "../context/chatContext.jsx";
import { AuthContext } from "../context/AuthContext.js";

const UserList = ({ onSelectUser, userId }) => {
  const [usuarios, setUsuarios] = useState([]);
  const { solicitarHistorial } = useChat();
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      fetch("http://localhost:5000/api/usuarios", { // URL corregida
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => {
          if (!res.ok) {
            throw new Error('Error al cargar usuarios');
          }
          return res.json();
        })
        .then((data) => setUsuarios(data.filter((u) => u.id !== userId)))
        .catch((err) => console.error("Error cargando usuarios:", err));
    }
  }, [userId, token]);

  const handleSelectUser = (user) => {
    onSelectUser(user);
    solicitarHistorial(user.id);
  };

  return (
    <div className="border p-3 rounded-lg bg-white shadow-md">
      <h3 className="font-semibold mb-2 text-gray-800">Usuarios disponibles</h3>
      <ul>
        {usuarios.map((u) => (
          <li
            key={u.id}
            onClick={() => handleSelectUser(u)}
            className="cursor-pointer hover:bg-blue-100 p-2 rounded"
          >
            {u.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
