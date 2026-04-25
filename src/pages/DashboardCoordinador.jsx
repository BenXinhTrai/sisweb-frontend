import React, { useState } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ProfileView } from '../components/ProfileView';
import { apiFetch } from '../services/api';
import './Dashboard.css';

export const DashboardCoordinador = () => {
    const [vistaActiva, setVistaActiva] = useState('inicio');
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [isLoading, setIsLoading] = useState(false);

    // Definición de las opciones del menú lateral
    const opcionesMenu = [
        { id: 'inicio', texto: 'Resumen' },
        { id: 'mis-seminarios', texto: 'Mis Seminarios' },
        { id: 'perfil', texto: 'Mi Perfil' },
        { id: 'reportes', texto: 'Reportes' }
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
                    <h1>Gestión de Seminarios</h1>
                </header>

                {/* Estadísticas de control del coordinador */}
                <section className="stats-grid">
                    <Card>
                        <p className="stat-label">Seminarios Activos</p>
                        <p className="stat-number">5</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Total Inscritos</p>
                        <p className="stat-number">120</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Evaluaciones Pendientes</p>
                        <p className="stat-number">15</p>
                    </Card>
                </section>

                <div className="action-panel">
                    <Button variant="primary" onClick={() => alert('Abriendo formulario de creación...')}>
                        + Crear Nuevo Seminario
                    </Button>
                </div>

                {/* Panel de Mis Seminarios Asignados */}
                <section className="content-panel">
                    <Card title="Mis Seminarios Asignados">
                        <table className="dashboard-table">
                            <thead>
                                <tr>
                                    <th>Nombre del Seminario</th>
                                    <th>Fecha</th>
                                    <th>Inscritos</th>
                                    <th>Estado</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Introducción a DevOps</td>
                                    <td>10 Nov, 2025</td>
                                    <td>28/30</td>
                                    <td><span style={{ color: '#1565C0', fontWeight: 'bold' }}>Próximo</span></td>
                                    <td>
                                        <Button variant="secondary" onClick={handleGestionarSeminario}>
                                            Gestionar
                                        </Button>
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
                tituloRol={user ? user.rol.replace('coordinador', 'Coord. Seminarios').toUpperCase() : "COORDINADOR"}
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