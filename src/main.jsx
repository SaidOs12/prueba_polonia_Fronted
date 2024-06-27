import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "../node_modules/@fortawesome/fontawesome-free/css/all.min.css";

import "./index.css";
import AuthLayout from "./layouts/Auth";
import UsuarioLayout from "./layouts/Admin";
import MecanicoLayout from "./layouts/Mecanico"
import OperadorLayout from "./layouts/Operador"
import { VerificarToken ,VerificarRol} from "./components/Seguridad/VerificarToken";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      {/* <VerificarToken/>
      <VerificarRol/> */}
      <Routes>
        <Route path="/admin/*" element={<UsuarioLayout />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="/mecanico/*" element={<MecanicoLayout />} />
        <Route path="/operador/*" element={<OperadorLayout />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
