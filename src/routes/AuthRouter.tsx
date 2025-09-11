import { Route } from 'react-router-dom'
import { Routes } from "react-router-dom";
import { Login } from "../pages/Login";
import { Home } from '../pages/Home';

export const AuthRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      {/* Ruta de registro eliminada - solo admins existentes pueden acceder */}
    </Routes>
  );
};
