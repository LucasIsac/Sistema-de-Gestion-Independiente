import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext.js';

export default function ProtectedRoute({ allow }) {
  const { usuario } = useContext(AuthContext);
  if (!usuario)         return <Navigate to="/login" replace />;
  if (!allow.includes(usuario.categoria))
                        return <Navigate to="/no-autorizado" replace />;
  return <Outlet />;
}
