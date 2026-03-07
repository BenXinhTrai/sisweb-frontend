import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importamos todas las páginas que hemos creado
import { Login } from './pages/Login';
import { Registro } from './pages/Registro';
import { RecuperarPassword } from './pages/RecuperarPassword';
import { DashboardAdmin } from './pages/DashboardAdmin';
import { DashboardEstudiante } from './pages/DashboardEstudiante';
import { DashboardCoordinador } from './pages/DashboardCoordinador';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Ruta por defecto redirige al Login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Rutas Públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
        <Route path="/recuperar-password" element={<RecuperarPassword />} />

        {/* Rutas Privadas (Dashboards) */}
        <Route path="/dashboard-administrador" element={<DashboardAdmin />} />
        <Route path="/dashboard-participante" element={<DashboardEstudiante />} />
        <Route path="/dashboard-coordinador-seminarios" element={<DashboardCoordinador />} />
        {/* Usamos el mismo componente para coordinador de recursos temporalmente */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;