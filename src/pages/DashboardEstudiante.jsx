import React from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import './Dashboard.css';

/**
 * Componente funcional DashboardEstudiante
 * Traducido desde estudiante.html. Vista para que los participantes consulten catálogo e inscripciones.
 */
export const DashboardEstudiante = () => {
    // Definición de las opciones del menú lateral para el estudiante
    const opcionesMenu = [
        { id: 'inicio', texto: 'Mi Dashboard' },
        { id: 'catalogo', texto: 'Catálogo de Seminarios' },
        { id: 'inscripciones', texto: 'Mis Inscripciones' },
        { id: 'certificados', texto: 'Mis Certificados' },
        { id: 'perfil', texto: 'Mi Perfil' }
    ];

    const handleCerrarSesion = () => {
        window.location.href = '/login';
    };

    const handleInscribirse = (curso) => {
        if (window.confirm(`¿Desea inscribirse en el seminario de ${curso}?`)) {
            alert('¡Inscripción exitosa! Recibirá un correo de confirmación.');
        }
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                tituloRol="Participante"
                opciones={opcionesMenu}
                onCerrarSesion={handleCerrarSesion}
            />

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <h1>Portal del Participante</h1>
                </header>

                {/* Resumen de Información */}
                <section className="stats-grid">
                    <Card>
                        <p className="stat-label">Seminarios Inscritos</p>
                        <p className="stat-number">3</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Certificados Obtenidos</p>
                        <p className="stat-number">2</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Horas Acumuladas</p>
                        <p className="stat-number">45h</p>
                    </Card>
                </section>

                <h2 style={{ marginBottom: '1rem', color: '#1565C0' }}>Próximos Seminarios Disponibles</h2>

                {/* Catálogo de Seminarios usando una grilla de Cards */}
                <section className="stats-grid">
                    <Card title="React Moderno">
                        <p><strong>Fecha:</strong> 15 de Octubre - 08:00 AM</p>
                        <p><strong>Cupos:</strong> 12/30</p>
                        <div style={{ marginTop: '1rem' }}>
                            <Button variant="primary" onClick={() => handleInscribirse('React Moderno')}>
                                Inscribirse
                            </Button>
                        </div>
                    </Card>

                    <Card title="Machine Learning">
                        <p><strong>Fecha:</strong> 22 de Octubre - 10:00 AM</p>
                        <p><strong>Cupos:</strong> Lleno</p>
                        <div style={{ marginTop: '1rem' }}>
                            <Button variant="secondary" onClick={() => alert('Añadido a lista de espera')}>
                                Lista de Espera
                            </Button>
                        </div>
                    </Card>
                </section>
            </main>
        </div>
    );
};