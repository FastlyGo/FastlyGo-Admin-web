import { Routes, Route, Navigate } from "react-router-dom";
import { Login } from "../pages/Login";

export const AuthRouter = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/*" element={<Navigate to="/auth/login" replace />} />
    </Routes>
  );
};
