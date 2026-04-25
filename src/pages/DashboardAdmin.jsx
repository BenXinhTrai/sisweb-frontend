import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ProfileView } from '../components/ProfileView';
import { apiFetch } from '../services/api';
import './Dashboard.css';

export const DashboardAdmin = () => {
    const [vistaActiva, setVistaActiva] = useState('inicio');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isLoading, setIsLoading] = useState(false);

    // Definición de las opciones del menú lateral
    const opcionesMenu = [
        { id: 'inicio', texto: 'Dashboard Principal' },
        { id: 'usuarios', texto: 'Gestión de Usuarios' },
        { id: 'perfil', texto: 'Mi Perfil' }, 
        { id: 'reportes', texto: 'Reportes Globales' }
    ];

    const handleCerrarSesion = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const renderVista = () => {
        if (vistaActiva === 'perfil') {
            return <ProfileView user={user} onUserUpdate={(updated) => setUser(updated)} />;
        }

        return (
            <>
                <header className="dashboard-header">
                    <h1>Panel de Control Global</h1>
                    <div className="user-profile">
                        <span>Bienvenido, {user?.nombre || 'Admin'}</span>
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
            </>
        );
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                tituloRol={user ? user.rol.toUpperCase() : "ADMIN"}
                opciones={opcionesMenu}
                onCerrarSesion={handleCerrarSesion}
                onNavegar={(idVista) => setVistaActiva(idVista)}
            />

            <main className="dashboard-main">
                {renderVista()}
            </main>
        </div>
    );
};