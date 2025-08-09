import React, { useState, useEffect } from 'react';
import RoleForm from '../components/RoleForm';
import RoleList from '../components/RoleList';
import '../assets/styles/gestionRoles.css';

export default function GestionRoles() {
  const [roles, setRoles] = useState([]);

  // Simulamos carga inicial desde backend
  useEffect(() => {
    fetch('/api/roles')
      .then((res) => res.json())
      .then((data) => setRoles(data))
      .catch((err) => console.error('Error cargando roles', err));
  }, []);

  const agregarRol = (nuevoRol) => {
    // Enviar al backend
    fetch('/api/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(nuevoRol),
    })
      .then((res) => res.json())
      .then((data) => {
        setRoles([...roles, data]);
      })
      .catch((err) => console.error('Error agregando rol', err));
  };

  return (
    <div className="gestion-roles-container">
      <h2>Gestión de Roles</h2>
      <RoleForm onAddRole={agregarRol} />
      <RoleList roles={roles} />
    </div>
  );
}
