import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { apiFetch } from '../services/api';
import './Dashboard.css';

export const DashboardEstudiante = () => {
    // Estado para la navegación lateral
    const [vistaActiva, setVistaActiva] = useState('inicio');

    // Estados para la carga de datos y UI
    const [seminarios, setSeminarios] = useState([]);
    const [misInscripciones, setMisInscripciones] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Estados para los Modales
    const [modalInscribir, setModalInscribir] = useState({ isOpen: false, seminarioId: null, seminarioNombre: '' });
    const [modalExito, setModalExito] = useState({ isOpen: false, mensaje: '' });
    const [modalError, setModalError] = useState({ isOpen: false, mensaje: '' });

    // Acceso al usuario logueado
    const user = JSON.parse(localStorage.getItem('user'));

    const opcionesMenu = [
        { id: 'inicio', texto: 'Mi Dashboard' },
        { id: 'catalogo', texto: 'Catálogo de Seminarios' },
        { id: 'inscripciones', texto: 'Mis Inscripciones' },
        { id: 'certificados', texto: 'Mis Certificados' },
        { id: 'perfil', texto: 'Mi Perfil' }
    ];

    // Cargar datos reales de la BD
    useEffect(() => {
        const fetchDatos = async () => {
            try {
                // Traer seminarios
                const dataSeminarios = await apiFetch('/seminarios');
                setSeminarios(dataSeminarios);

                // Traer inscripciones (Requiere endpoint mis-inscripciones que ya existe)
                if (user && user.id_usuario) {
                    const dataInscripciones = await apiFetch(`/mis-inscripciones/${user.id_usuario}`);
                    setMisInscripciones(dataInscripciones || []);
                }
            } catch (err) {
                console.error("Error cargando el dashboard:", err);
            }
        };
        fetchDatos();
    }, []);

    const handleCerrarSesion = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Abre el modal de confirmación
    const intentarInscripcion = (id, nombre) => {
        setModalInscribir({ isOpen: true, seminarioId: id, seminarioNombre: nombre });
    };

    // Ejecuta la petición cuando el usuario confirma en el modal
    const confirmarInscripcion = async () => {
        const id_seminario = modalInscribir.seminarioId;
        setModalInscribir({ isOpen: false, seminarioId: null, seminarioNombre: '' });
        setIsLoading(true);

        try {
            await apiFetch('/inscripciones', {
                method: 'POST',
                body: JSON.stringify({
                    id_seminario: id_seminario,
                    id_usuario: user.id_usuario // Ahora esto es capturado correctamente por el backend
                })
            });

            // Refrescar lista visual restando un cupo artificialmente para UX rapido
            setSeminarios(prev => prev.map(s => s.id_seminario === id_seminario ? { ...s, cupos_disponibles: s.cupos_disponibles - 1 } : s));

            setModalExito({ isOpen: true, mensaje: '¡Inscripción exitosa! Tu cupo ha sido reservado y en minutos llegará un correo a tu bandeja de entrada.' });
        } catch (error) {
            setModalError({ isOpen: true, mensaje: error.message || 'No se pudo completar la inscripción.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Renderizadores de las vistas condicionales
    const renderVista = () => {
        if (vistaActiva === 'inicio') {
            return (
                <>
                    <header className="dashboard-header">
                        <h1>Bienvenido al Portal, {user ? user.nombre : 'Participante'}</h1>
                    </header>
                    <section className="stats-grid">
                        <Card>
                            <p className="stat-label">Seminarios Inscritos</p>
                            <p className="stat-number">{misInscripciones.length}</p>
                        </Card>
                        <Card>
                            <p className="stat-label">Certificados Obtenidos</p>
                            <p className="stat-number">0</p>
                        </Card>
                        <Card>
                            <p className="stat-label">Horas Acumuladas</p>
                            <p className="stat-number">0h</p>
                        </Card>
                    </section>

                    <h2 style={{ marginTop: '3rem', marginBottom: '1rem', color: '#1565C0' }}>Próximos Seminarios Disponibles</h2>
                    <section className="stats-grid">
                        {seminarios.length === 0 ? <p>No hay seminarios disponibles por el momento.</p> : null}
                        {seminarios.map(sem => (
                            <Card key={sem.id_seminario} title={sem.nombre}>
                                <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Código:</strong> {sem.codigo}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Fecha:</strong> {new Date(sem.fecha).toLocaleDateString()}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Cupos Libres:</strong> {sem.cupos_disponibles}</p>
                                    <p style={{ margin: '0.5rem 0', height: '40px', overflow: 'hidden' }}>{sem.descripcion}</p>
                                </div>
                                <div>
                                    <Button 
                                        variant="primary" 
                                        disabled={isLoading || sem.cupos_disponibles <= 0}
                                        onClick={() => intentarInscripcion(sem.id_seminario, sem.nombre)}
                                    >
                                        {sem.cupos_disponibles <= 0 ? 'Sin Cupos' : 'Inscribirse'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </section>
                </>
            );
        }

        if (vistaActiva === 'catalogo') {
            return (
                <>
                    <header className="dashboard-header">
                        <h1>Catálogo de Seminarios</h1>
                        <p>Explora y matricúlate en los próximos eventos</p>
                    </header>
                    <section className="stats-grid">
                        {seminarios.length === 0 ? <p>No hay seminarios disponibles por el momento.</p> : null}
                        {seminarios.map(sem => (
                            <Card key={sem.id_seminario} title={sem.nombre}>
                                <div style={{ fontSize: '0.9rem', color: '#555', marginBottom: '1rem' }}>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Código:</strong> {sem.codigo}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Fecha:</strong> {new Date(sem.fecha).toLocaleDateString()}</p>
                                    <p style={{ margin: '0.5rem 0' }}><strong>Cupos Libres:</strong> {sem.cupos_disponibles}</p>
                                    <p style={{ margin: '0.5rem 0', height: '40px', overflow: 'hidden' }}>{sem.descripcion}</p>
                                </div>
                                <div>
                                    <Button
                                        variant="primary"
                                        disabled={isLoading || sem.cupos_disponibles <= 0}
                                        onClick={() => intentarInscripcion(sem.id_seminario, sem.nombre)}
                                    >
                                        {sem.cupos_disponibles <= 0 ? 'Sin Cupos' : 'Inscribirse'}
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </section>
                </>
            );
        }

        if (vistaActiva === 'inscripciones') {
            return (
                <>
                    <header className="dashboard-header">
                        <h1>Mis Inscripciones</h1>
                    </header>
                    <div style={{ backgroundColor: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                        {misInscripciones.length === 0 ? (
                            <p>Aún no te has inscrito a ningún seminario.</p>
                        ) : (
                            <ul style={{ listStyle: 'none', padding: 0 }}>
                                {misInscripciones.map((ins, idx) => (
                                    <li key={idx} style={{ padding: '1rem', borderBottom: '1px solid #eee' }}>
                                        <strong>{ins.nombre}</strong> (Inscrito el: {new Date(ins.fecha_inscripcion).toLocaleDateString()}) - Estado: <span style={{ color: 'green' }}>{ins.estado}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </>
            );
        }

        return (
            <header className="dashboard-header">
                <h1>Sección en Construcción</h1>
                <p>Pronto podrás ver más detalles aquí.</p>
            </header>
        );
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                tituloRol={user ? user.rol.toUpperCase() : "PARTICIPANTE"}
                opciones={opcionesMenu}
                onCerrarSesion={handleCerrarSesion}
                onNavegar={(idVista) => setVistaActiva(idVista)}
            />

            <main className="dashboard-main">
                {renderVista()}
            </main>

            {/* Modales Desplegables */}
            <Modal
                isOpen={modalInscribir.isOpen}
                onClose={() => setModalInscribir({ isOpen: false, seminarioId: null, seminarioNombre: '' })}
                title="Confirmar Inscripción"
            >
                <div style={{ textAlign: 'center' }}>
                    <p>Estás a un paso de inscribirte en el seminario: <br /><strong>{modalInscribir.seminarioNombre}</strong></p>
                    <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#666' }}>Se enviará automáticamente un correo a tu cuenta institucional.</p>
                    <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                        <Button variant="primary" onClick={confirmarInscripcion} disabled={isLoading}>
                            {isLoading ? 'Procesando...' : 'Sí, Inscribirme'}
                        </Button>
                        <Button variant="secondary" onClick={() => setModalInscribir({ isOpen: false, seminarioId: null, seminarioNombre: '' })} disabled={isLoading}>
                            Cancelar
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modalExito.isOpen}
                onClose={() => setModalExito({ isOpen: false, mensaje: '' })}
                title="¡Inscripción Confirmada!"
            >
                <div style={{ textAlign: 'center' }}>
                    <p>{modalExito.mensaje}</p>
                    <div style={{ marginTop: '2rem' }}>
                        <Button variant="primary" onClick={() => { setModalExito({ isOpen: false, mensaje: '' }); setVistaActiva('inscripciones'); }}>
                            Ver mis seminarios
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modalError.isOpen}
                onClose={() => setModalError({ isOpen: false, mensaje: '' })}
                title="Aviso del Sistema"
            >
                <div style={{ textAlign: 'center' }}>
                    <p style={{ color: '#c62828' }}>{modalError.mensaje}</p>
                    <div style={{ marginTop: '2rem' }}>
                        <Button variant="secondary" onClick={() => setModalError({ isOpen: false, mensaje: '' })}>
                            Cerrar
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};