import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ProfileView } from '../components/ProfileView';
import { InputText } from '../components/InputText';
import { apiFetch } from '../services/api';
import './Dashboard.css';

export const DashboardCoordinador = () => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            if (!stored || stored === 'undefined') return null;
            return JSON.parse(stored);
        } catch (e) {
            console.error("Error al leer sesión en Coordinador:", e);
            return null;
        }
    });

    const [vistaActiva, setVistaActiva] = useState('inicio');
    const [isLoading, setIsLoading] = useState(false);
    
    // Estados de base de datos
    const [seminarios, setSeminarios] = useState([]);
    const [coordinadores, setCoordinadores] = useState([]);
    const [inscritosEnGestion, setInscritosEnGestion] = useState([]);

    // Estados de Modales
    const [modalExito, setModalExito] = useState({ isOpen: false, mensaje: '' });
    const [modalError, setModalError] = useState({ isOpen: false, mensaje: '' });
    
    // Formularios
    const [modalCrearSeminario, setModalCrearSeminario] = useState(false);
    const [formSeminario, setFormSeminario] = useState({ codigo: '', nombre: '', descripcion: '', fecha: '' });

    // Modal de Gestión
    const [modalGestionar, setModalGestionar] = useState({ isOpen: false, seminarioNombre: '' });

    const opcionesMenu = [
        { id: 'inicio', texto: 'Resumen' },
        { id: 'mis-seminarios', texto: 'Mis Seminarios' },
        { id: 'perfil', texto: 'Mi Perfil' },
        { id: 'reportes', texto: 'Reportes' }
    ];

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const dataCoordinadores = await apiFetch('/coordinadores');
                setCoordinadores(Array.isArray(dataCoordinadores) ? dataCoordinadores : []);

                const dataSeminarios = await apiFetch('/seminarios');
                setSeminarios(Array.isArray(dataSeminarios) ? dataSeminarios : []);
            } catch (err) {
                console.error("Error cargando datos:", err);
            }
        };
        fetchDatos();
    }, []);

    const handleCerrarSesion = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    // Crear Seminario
    const handleSumbitSeminario = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Buscamos el id_coordinador correlacionado con el usuario actual
            const coord = coordinadores.find(c => c.id_usuario === user?.id_usuario);
            const id_coordinador = coord ? coord.id_coordinador : (coordinadores.length > 0 ? coordinadores[0].id_coordinador : 1);

            await apiFetch('/seminarios', {
                method: 'POST',
                body: JSON.stringify({ ...formSeminario, id_coordinador })
            });

            // Recargar seminarios
            const dataSeminarios = await apiFetch('/seminarios');
            setSeminarios(Array.isArray(dataSeminarios) ? dataSeminarios : []);
            
            setModalCrearSeminario(false);
            setModalExito({ isOpen: true, mensaje: 'El seminario ha sido agendado exitosamente.' });
            setFormSeminario({ codigo: '', nombre: '', descripcion: '', fecha: '' });
        } catch (error) {
            setModalError({ isOpen: true, mensaje: error.message || 'Error al crear seminario.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Abrir Gestión de un Seminario Particular
    const handleGestionarSeminario = async (id_seminario, nombre) => {
        setIsLoading(true);
        try {
            const dataInscritos = await apiFetch(`/seminario-inscritos/${id_seminario}`);
            setInscritosEnGestion(Array.isArray(dataInscritos) ? dataInscritos : []);
            setModalGestionar({ isOpen: true, seminarioNombre: nombre });
        } catch (error) {
            setModalError({ isOpen: true, mensaje: 'Error al obtener la lista de estudiantes inscritos.' });
        } finally {
            setIsLoading(false);
        }
    };

    const simularCalificacion = (nombreEstudiante) => {
        alert(`Has enviado la calificación aprobatoria simulada al estudiante: ${nombreEstudiante}. ¡Registro exitoso!`);
    };

    const renderVista = () => {
        if (vistaActiva === 'perfil') {
            return <ProfileView user={user} onUserUpdate={(updated) => setUser(updated)} />;
        }

        if (vistaActiva === 'mis-seminarios') {
            return (
                <>
                    <header className="dashboard-header">
                        <h1>Gestión de Seminarios</h1>
                        <p>Visualiza y administra las inscripciones de todos los programas a tu cargo.</p>
                    </header>
                    <div className="action-panel">
                        <Button variant="primary" onClick={() => setModalCrearSeminario(true)}>
                            + Crear Nuevo Seminario
                        </Button>
                    </div>
                    <section className="content-panel">
                        <Card title="Directorio de Seminarios Asignados">
                            <div style={{ overflowX: 'auto' }}>
                                <table className="dashboard-table">
                                    <thead>
                                        <tr>
                                            <th>Código</th>
                                            <th>Nombre del Seminario</th>
                                            <th>Fecha Programada</th>
                                            <th>Inscritos</th>
                                            <th>Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {seminarios.length === 0 ? (
                                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No tienes seminarios asignados.</td></tr>
                                        ) : (
                                            seminarios.map(s => (
                                                <tr key={s.id_seminario}>
                                                    <td>{s.codigo}</td>
                                                    <td><strong>{s.nombre}</strong></td>
                                                    <td>{new Date(s.fecha).toLocaleDateString()}</td>
                                                    <td>
                                                        <span style={{ backgroundColor: '#e3f2fd', color: '#1565C0', padding: '2px 8px', borderRadius: '12px', fontSize: '0.9rem' }}>
                                                            {s.cupos_totales - s.cupos_disponibles} / {s.cupos_totales}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <Button variant="secondary" onClick={() => handleGestionarSeminario(s.id_seminario, s.nombre)}>
                                                            Gestionar / Calificar
                                                        </Button>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    </section>
                </>
            );
        }

        if (vistaActiva === 'reportes') {
            return (
                <>
                    <header className="dashboard-header">
                        <h1>Reportes de Rendimiento</h1>
                        <p>Panel de estadísticas y extracción de datos.</p>
                    </header>
                    <section className="stats-grid">
                        <Card title="Gráficas y Descargas">
                            <div style={{ padding: '2rem', textAlign: 'center', color: '#666' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                                <h3 style={{ color: '#1565C0' }}>Módulo Analítico en Desarrollo</h3>
                                <p>Estamos integrando los motores de exportación para PDF y Excel. Muy pronto podrás descargar métricas por cada seminario.</p>
                                <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                                    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', minWidth: '150px' }}>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>Total Seminarios</p>
                                        <strong style={{ fontSize: '1.8rem', color: '#333' }}>{seminarios.length}</strong>
                                    </div>
                                    <div style={{ padding: '1rem', border: '1px solid #ccc', borderRadius: '8px', minWidth: '150px' }}>
                                        <p style={{ margin: '0 0 5px 0', fontSize: '0.9rem' }}>Asistencia Promedio</p>
                                        <strong style={{ fontSize: '1.8rem', color: '#333' }}>85%</strong>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </section>
                </>
            );
        }

        // Vista 'inicio'
        return (
            <>
                <header className="dashboard-header">
                    <h1>Resumen de Coordinación</h1>
                    <div className="user-profile">
                        <span>Bienvenido, {user?.nombre || 'Coordinador'}</span>
                    </div>
                </header>

                <section className="stats-grid">
                    <Card>
                        <p className="stat-label">Seminarios Activos</p>
                        <p className="stat-number">{seminarios.length}</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Evaluaciones Pendientes</p>
                        <p className="stat-number">Aprox. {seminarios.length * 3}</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Aulas / Recursos Asignados</p>
                        <p className="stat-number">{seminarios.length}</p>
                    </Card>
                </section>
            </>
        );
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                tituloRol={user?.rol === 'coordinador' ? "COORDINADOR DE SEMINARIOS" : (user?.rol?.toUpperCase() || "COORDINADOR")}
                opciones={opcionesMenu}
                onCerrarSesion={handleCerrarSesion}
                onNavegar={(idVista) => setVistaActiva(idVista)}
            />

            <main className="dashboard-main">
                {renderVista()}
            </main>

            {/* Modal para Crear Seminario */}
            <Modal isOpen={modalCrearSeminario} onClose={() => setModalCrearSeminario(false)} title="Agendar Nuevo Seminario">
                <form onSubmit={handleSumbitSeminario}>
                    <InputText id="sem-cod" label="Código del Seminario" name="codigo" value={formSeminario.codigo} onChange={(e) => setFormSeminario({...formSeminario, codigo: e.target.value})} placeholder="Ej: SEM-2026-01" required />
                    <InputText id="sem-nom" label="Nombre" name="nombre" value={formSeminario.nombre} onChange={(e) => setFormSeminario({...formSeminario, nombre: e.target.value})} required />
                    
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label" htmlFor="sem-desc">Descripción (Temario)</label>
                        <textarea 
                            id="sem-desc" 
                            className="input-control" 
                            rows="3" 
                            value={formSeminario.descripcion} 
                            onChange={(e) => setFormSeminario({...formSeminario, descripcion: e.target.value})} 
                            required 
                        />
                    </div>

                    <InputText id="sem-fecha" label="Fecha de Inicio" name="fecha" type="date" value={formSeminario.fecha} onChange={(e) => setFormSeminario({...formSeminario, fecha: e.target.value})} required />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <Button type="button" variant="secondary" onClick={() => setModalCrearSeminario(false)} disabled={isLoading}>Cancelar</Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>{isLoading ? 'Agendando...' : 'Crear Seminario'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal para Gestionar Inscripciones */}
            <Modal isOpen={modalGestionar.isOpen} onClose={() => setModalGestionar({ isOpen: false, seminarioNombre: '' })} title={`Inscritos en: ${modalGestionar.seminarioNombre}`}>
                <div style={{ padding: '0.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
                    <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>A continuación se muestra el listado de todos los participantes matriculados.</p>
                    
                    {inscritosEnGestion.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                            <p style={{ color: '#666' }}>Aún no hay estudiantes inscritos en este seminario.</p>
                        </div>
                    ) : (
                        <table className="dashboard-table" style={{ fontSize: '0.9rem' }}>
                            <thead>
                                <tr>
                                    <th>Cédula</th>
                                    <th>Nombre del Estudiante</th>
                                    <th>Correo</th>
                                    <th>Calificación</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inscritosEnGestion.map((ins, idx) => (
                                    <tr key={idx}>
                                        <td>{ins.matricula || 'N/A'}</td>
                                        <td><strong>{ins.nombre || 'Desconocido'}</strong></td>
                                        <td>{ins.correo}</td>
                                        <td>
                                            <Button variant="primary" style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }} onClick={() => simularCalificacion(ins.nombre)}>
                                                Aprobar ✅
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </Modal>

            <Modal isOpen={modalExito.isOpen} onClose={() => setModalExito({ isOpen: false, mensaje: '' })} title="Proceso Exitoso">
                <div style={{ textAlign: 'center' }}>
                    <p>{modalExito.mensaje}</p>
                    <div style={{ marginTop: '2rem' }}><Button variant="primary" onClick={() => setModalExito({ isOpen: false, mensaje: '' })}>Continuar</Button></div>
                </div>
            </Modal>

            <Modal isOpen={modalError.isOpen} onClose={() => setModalError({ isOpen: false, mensaje: '' })} title="Aviso del Sistema">
                <div style={{ textAlign: 'center', color: '#c62828' }}>
                    <p>{modalError.mensaje}</p>
                    <div style={{ marginTop: '2rem' }}><Button variant="secondary" onClick={() => setModalError({ isOpen: false, mensaje: '' })}>Cerrar</Button></div>
                </div>
            </Modal>

        </div>
    );
};