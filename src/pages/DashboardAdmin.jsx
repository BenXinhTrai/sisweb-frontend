import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import './Dashboard.css';

/**
 * Componente funcional DashboardAdmin
 * Traducido desde administrador.html. Permite la gestión global del sistema.
 */
export const DashboardAdmin = () => {
    // Definición de las opciones del menú lateral
    const opcionesMenu = [
        { id: 'inicio', texto: 'Dashboard Principal' },
        { id: 'usuarios', texto: 'Gestión de Usuarios' },
        { id: 'configuracion', texto: 'Configuración' },
        { id: 'reportes', texto: 'Reportes Globales' },
        { id: 'mantenimiento', texto: 'Mantenimiento' }
    ];

    // Función para manejar el cierre de sesión
    const handleCerrarSesion = () => {
        window.location.href = '/login'; // Redirige al login
    };

    // Funciones de acción extraídas del HTML original
    const handleCrearUsuario = () => {
        alert('Abriendo modal para crear nuevo usuario...');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                tituloRol="Administrador"
                opciones={opcionesMenu}
                onCerrarSesion={handleCerrarSesion}
            />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Panel de Control Global</h1>
                    <div className="user-profile">
                        <span>Bienvenido, Admin</span>
                    </div>
                </header>

                {/* Sección de Tarjetas de Estadísticas usando <Card> */}
                <section className="stats-grid">
                    <Card>
                        <p className="stat-label">Total Usuarios</p>
                        <p className="stat-number">1,245</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Seminarios Activos</p>
                        <p className="stat-number">42</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Sesiones Hoy</p>
                        <p className="stat-number">156</p>
                    </Card>
                </section>

                <div className="action-panel">
                    <Button variant="primary" onClick={handleCrearUsuario}>
                        + Nuevo Usuario
                    </Button>
                </div>

                {/* Panel de contenido principal */}
                <section className="content-panel">
                    <Card title="Últimos Usuarios Registrados">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Email</th>
                                    <th>Rol</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Ana García</td>
                                    <td>ana.g@univalle.edu.co</td>
                                    <td>Participante</td>
                                    <td><span style={{ color: '#388E3C' }}>Activo</span></td>
                                    <td>
                                        <Button variant="secondary" onClick={() => alert('Editando...')}>Editar</Button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>Carlos López</td>
                                    <td>carlos.l@univalle.edu.co</td>
                                    <td>Coordinador</td>
                                    <td><span style={{ color: '#388E3C' }}>Activo</span></td>
                                    <td>
                                        <Button variant="secondary" onClick={() => alert('Editando...')}>Editar</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </Card>
                </section>
            </main>
        </div>
    );
};