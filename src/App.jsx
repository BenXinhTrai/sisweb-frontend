import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componente de protección
const PrivateRoute = ({ children, rolRequerido }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) return <Navigate to="/login" />;
    
    // Adaptación: soportar 'id_rol' del snippet o 'rol' real de la BD
    const userRol = user.id_rol || user.rol;
    
    if (rolRequerido && userRol !== rolRequerido) return <Navigate to="/login" />;
    return children;
};

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
        <Route path="/dashboard-administrador" element={
          <PrivateRoute rolRequerido="administrador">
            <DashboardAdmin />
          </PrivateRoute>
        } />
        <Route path="/dashboard-participante" element={
          <PrivateRoute rolRequerido="participante">
            <DashboardEstudiante />
          </PrivateRoute>
        } />
        <Route path="/dashboard-coordinador-seminarios" element={
          <PrivateRoute rolRequerido="coordinador">
            <DashboardCoordinador />
          </PrivateRoute>
        } />
        {/* Usamos el mismo componente para coordinador de recursos temporalmente */}

      </Routes>
    </BrowserRouter>
  );
}

export default App;