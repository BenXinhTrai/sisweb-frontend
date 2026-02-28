import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import './Dashboard.css';

/**
 * Componente funcional DashboardCoordinador
 * Traducido desde seminarioscordi.html. Permite gestionar seminarios asignados.
 */
export const DashboardCoordinador = () => {
    // Definición de las opciones del menú lateral
    const opcionesMenu = [
        { id: 'inicio', texto: 'Resumen' },
        { id: 'mis-seminarios', texto: 'Mis Seminarios' },
        { id: 'crear', texto: 'Crear Seminario' },
        { id: 'reportes', texto: 'Reportes' },
        { id: 'perfil', texto: 'Mi Perfil' }
    ];

    const handleCerrarSesion = () => {
        window.location.href = '/login';
    };

    const handleGestionarSeminario = () => {
        alert('Abriendo herramientas de gestión de recursos y ponentes...');
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                tituloRol="Coord. Seminarios"
                opciones={opcionesMenu}
                onCerrarSesion={handleCerrarSesion}
            />

            <main className="dashboard-main">
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
            </main>
        </div>
    );
};