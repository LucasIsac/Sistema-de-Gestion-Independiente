// src/context/AuthContext.js
import { createContext } from 'react';

const AuthContext = createContext({
  usuario: null,
  token: null,
  login: () => {},
  logout: () => {}
});

export default AuthContext;