import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ProfileView } from '../components/ProfileView';
import { InputText } from '../components/InputText';
import { apiFetch } from '../services/api';
// Importamos recharts para gráficos avanzados
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
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
    const [notasTemporales, setNotasTemporales] = useState({});

    // Estados de Modales
    const [modalExito, setModalExito] = useState({ isOpen: false, mensaje: '' });
    const [modalError, setModalError] = useState({ isOpen: false, mensaje: '' });
    
    // Formularios
    const [modalCrearSeminario, setModalCrearSeminario] = useState(false);
    const [formSeminario, setFormSeminario] = useState({ codigo: '', nombre: '', descripcion: '', fecha: '' });

    // Modal de Gestión
    const [modalGestionar, setModalGestionar] = useState({ isOpen: false, seminarioNombre: '', idSeminario: null });

    const opcionesMenu = [
        { id: 'inicio', texto: 'Resumen' },
        { id: 'mis-seminarios', texto: 'Mis Seminarios' },
        { id: 'perfil', texto: 'Mi Perfil' },
        { id: 'reportes', texto: 'Reportes' }
    ];

    const COLORES = ['#1565C0', '#42A5F5', '#1E88E5', '#90CAF9', '#0D47A1', '#64B5F6'];

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
            const coord = coordinadores.find(c => c.id_usuario === user?.id_usuario);
            const id_coordinador = coord ? coord.id_coordinador : (coordinadores.length > 0 ? coordinadores[0].id_coordinador : 1);

            await apiFetch('/seminarios', {
                method: 'POST',
                body: JSON.stringify({ ...formSeminario, id_coordinador })
            });

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
            const arrayInscritos = Array.isArray(dataInscritos) ? dataInscritos : [];
            
            const notasInit = {};
            arrayInscritos.forEach(ins => {
                notasInit[ins.id_inscripcion] = ins.calificacion !== null ? ins.calificacion : '';
            });
            
            setNotasTemporales(notasInit);
            setInscritosEnGestion(arrayInscritos);
            setModalGestionar({ isOpen: true, seminarioNombre: nombre, idSeminario: id_seminario });
        } catch (error) {
            setModalError({ isOpen: true, mensaje: 'Error al obtener la lista de estudiantes inscritos.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Subir Calificacion a la API
    const handleSubirCalificacion = async (id_inscripcion) => {
        setIsLoading(true);
        try {
            const nota = parseFloat(notasTemporales[id_inscripcion]);
            if (isNaN(nota) || nota < 0 || nota > 5.0) {
                setModalError({ isOpen: true, mensaje: 'La calificación debe ser un número entre 0.0 y 5.0' });
                setIsLoading(false);
                return;
            }

            const res = await apiFetch(`/inscripciones/${id_inscripcion}/calificar`, {
                method: 'PUT',
                body: JSON.stringify({ calificacion: nota })
            });

            // Actualizar la lista local
            setInscritosEnGestion(prev => prev.map(ins => 
                ins.id_inscripcion === id_inscripcion ? { ...ins, calificacion: nota, estado: res.estado } : ins
            ));

            alert(`✅ Calificación guardada exitosamente. Nuevo estado: ${res.estado}`);
        } catch (error) {
            setModalError({ isOpen: true, mensaje: error.message || 'Error al calificar.' });
        } finally {
            setIsLoading(false);
        }
    };

    // Preparar datos para los reportes
    const ocupacionData = seminarios.map(s => ({
        nombre: s.nombre.substring(0, 15) + '...',
        inscritos: s.cupos_totales - s.cupos_disponibles,
        disponibles: s.cupos_disponibles
    }));

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
                        <h1>Reportes Reales de Rendimiento</h1>
                        <p>Análisis en vivo de los datos registrados en el módulo de seminarios.</p>
                    </header>
                    <section className="stats-grid" style={{ gridTemplateColumns: '1fr', gap: '2rem' }}>
                        <Card title="Ocupación de Seminarios Activos">
                            <div style={{ width: '100%', height: 350, marginTop: '1rem' }}>
                                <ResponsiveContainer>
                                    <BarChart data={ocupacionData} margin={{ top: 20, right: 30, left: 20, bottom: 50 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="nombre" angle={-45} textAnchor="end" height={70} tick={{fontSize: 12}} />
                                        <YAxis />
                                        <Tooltip cursor={{fill: 'rgba(21, 101, 192, 0.05)'}} />
                                        <Legend verticalAlign="top" height={36}/>
                                        <Bar dataKey="inscritos" name="Inscritos" stackId="a" fill="#1565C0" />
                                        <Bar dataKey="disponibles" name="Cupos Libres" stackId="a" fill="#90CAF9" />
                                    </BarChart>
                                </ResponsiveContainer>
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
                        <p className="stat-label">Seminarios Impartidos</p>
                        <p className="stat-number">{seminarios.length}</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Estudiantes Capcitados</p>
                        <p className="stat-number">{seminarios.reduce((acc, curr) => acc + (curr.cupos_totales - curr.cupos_disponibles), 0)}</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Aulas Asignadas</p>
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

                    <InputText id="sem-fecha" label="Fecha Programada" name="fecha" type="date" value={formSeminario.fecha} onChange={(e) => setFormSeminario({...formSeminario, fecha: e.target.value})} required />
                    
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                        <Button type="button" variant="secondary" onClick={() => setModalCrearSeminario(false)} disabled={isLoading}>Cancelar</Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>{isLoading ? 'Agendando...' : 'Crear Seminario'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Modal para Gestionar Inscripciones */}
            <Modal isOpen={modalGestionar.isOpen} onClose={() => setModalGestionar({ isOpen: false, seminarioNombre: '' })} title={`Inscritos en: ${modalGestionar.seminarioNombre}`}>
                <div style={{ padding: '0.5rem', maxHeight: '60vh', overflowY: 'auto' }}>
                    <p style={{ color: '#555', marginBottom: '1rem', fontSize: '0.9rem' }}>Ingresa la nota (0.0 a 5.0) y haz clic en "Subir" para guardar la valoración.</p>
                    
                    {inscritosEnGestion.length === 0 ? (
                        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f9f9f9', borderRadius: '8px' }}>
                            <p style={{ color: '#666' }}>Aún no hay estudiantes inscritos en este seminario.</p>
                        </div>
                    ) : (
                        <table className="dashboard-table" style={{ fontSize: '0.9rem' }}>
                            <thead>
                                <tr>
                                    <th>Cédula</th>
                                    <th>Estudiante</th>
                                    <th>Estado</th>
                                    <th>Calificación</th>
                                    <th>Acción</th>
                                </tr>
                            </thead>
                            <tbody>
                                {inscritosEnGestion.map((ins) => (
                                    <tr key={ins.id_inscripcion}>
                                        <td>{ins.matricula || 'N/A'}</td>
                                        <td><strong>{ins.nombre || 'Desconocido'}</strong></td>
                                        <td style={{ color: ins.estado === 'Aprobado' ? '#388E3C' : (ins.estado === 'Reprobado' ? '#D32F2F' : '#F57C00'), fontWeight: 'bold' }}>
                                            {ins.estado}
                                        </td>
                                        <td style={{ width: '80px' }}>
                                            <input 
                                                type="number" 
                                                step="0.1" 
                                                min="0" 
                                                max="5"
                                                className="input-control" 
                                                style={{ padding: '0.3rem', width: '100%', minWidth: '60px' }}
                                                value={notasTemporales[ins.id_inscripcion] !== undefined ? notasTemporales[ins.id_inscripcion] : ''}
                                                onChange={(e) => setNotasTemporales({...notasTemporales, [ins.id_inscripcion]: e.target.value})}
                                            />
                                        </td>
                                        <td>
                                            <Button variant="primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }} onClick={() => handleSubirCalificacion(ins.id_inscripcion)} disabled={isLoading}>
                                                Subir ☁️
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