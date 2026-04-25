import React, { useState, useEffect } from 'react';
import { Sidebar } from '../components/Sidebar';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { ProfileView } from '../components/ProfileView';
import { InputText } from '../components/InputText';
import { apiFetch } from '../services/api';
import { PieChart, Pie, Cell, Tooltip as ChartTooltip, Legend as ChartLegend, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import './Dashboard.css';

export const DashboardAdmin = () => {
    const [user, setUser] = useState(() => {
        try {
            const stored = localStorage.getItem('user');
            if (!stored || stored === 'undefined') return null;
            return JSON.parse(stored);
        } catch (e) {
            console.error("Error al leer sesión en Admin:", e);
            return null;
        }
    });

    const [vistaActiva, setVistaActiva] = useState('inicio');
    const [isLoading, setIsLoading] = useState(false);
    const [usuarios, setUsuarios] = useState([]);
    const [seminarios, setSeminarios] = useState([]);

    // Modales y formularios
    const [modalExito, setModalExito] = useState({ isOpen: false, mensaje: '' });
    const [modalError, setModalError] = useState({ isOpen: false, mensaje: '' });
    const [modalUsuario, setModalUsuario] = useState(false);
    
    // Estado del formulario de nuevo usuario
    const [formUsuario, setFormUsuario] = useState({
        nombre: '', 
        documento: '', 
        email: '', 
        telefono: '', 
        password: '', 
        rol: 'participante'
    });

    // Definición de las opciones del menú lateral
    const opcionesMenu = [
        { id: 'inicio', texto: 'Dashboard Principal' },
        { id: 'usuarios', texto: 'Gestión de Usuarios' },
        { id: 'perfil', texto: 'Mi Perfil' }, 
        { id: 'reportes', texto: 'Reportes Globales' }
    ];

    const COLORS_BRAND = ['#1565C0', '#42A5F5', '#90CAF9'];

    useEffect(() => {
        const fetchDatos = async () => {
            try {
                const dataUsuarios = await apiFetch('/usuarios');
                setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : []);
                
                const dataSeminarios = await apiFetch('/seminarios');
                setSeminarios(Array.isArray(dataSeminarios) ? dataSeminarios : []);
            } catch (err) {
                console.error("Error cargando datos del dashboard admin:", err);
            }
        };
        fetchDatos();
    }, []);

    const handleCerrarSesion = () => {
        localStorage.removeItem('user');
        window.location.href = '/login';
    };

    const handleApeirCrearUsuario = () => {
        setFormUsuario({ nombre: '', documento: '', email: '', telefono: '', password: '', rol: 'participante' });
        setModalUsuario(true);
    };

    const handleSubmitUsuario = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await apiFetch('/registro', {
                method: 'POST',
                body: JSON.stringify(formUsuario)
            });
            
            // Recargar lista de usuarios
            const dataUsuarios = await apiFetch('/usuarios');
            setUsuarios(Array.isArray(dataUsuarios) ? dataUsuarios : []);
            
            setModalUsuario(false);
            setModalExito({ isOpen: true, mensaje: 'Usuario creado exitosamente y correo de bienvenida enviado.' });
        } catch (error) {
            setModalError({ isOpen: true, mensaje: error.message || 'Error al crear el usuario.' });
        } finally {
            setIsLoading(false);
        }
    };

    const countRoles = () => {
        const counts = { participante: 0, coordinador: 0, administrador: 0 };
        usuarios.forEach(u => {
            if (counts[u.rol] !== undefined) counts[u.rol]++;
        });
        return [
            { name: 'Participantes', value: counts.participante },
            { name: 'Coordinadores', value: counts.coordinador },
            { name: 'Administradores', value: counts.administrador },
        ].filter(r => r.value > 0);
    };

    const renderVista = () => {
        if (vistaActiva === 'perfil') {
            return <ProfileView user={user} onUserUpdate={(updated) => setUser(updated)} />;
        }

        if (vistaActiva === 'usuarios') {
            return (
                <>
                    <header className="dashboard-header">
                        <h1>Gestión de Usuarios</h1>
                        <p>Administra los participantes, coordinadores y administradores del sistema.</p>
                    </header>
                    <div className="action-panel">
                        <Button variant="primary" onClick={handleApeirCrearUsuario}>
                            + Nuevo Usuario
                        </Button>
                    </div>
                    <section className="content-panel">
                        <Card title="Lista de Usuarios Registrados">
                            <div style={{ overflowX: 'auto' }}>
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
                                        {usuarios.length === 0 ? (
                                            <tr><td colSpan="5" style={{ textAlign: 'center' }}>No hay usuarios registrados.</td></tr>
                                        ) : (
                                            usuarios.map(u => (
                                                <tr key={u.id_usuario}>
                                                    <td>{u.nombre || 'Sin nombre'}</td>
                                                    <td>{u.email}</td>
                                                    <td style={{ textTransform: 'capitalize' }}>{u.rol}</td>
                                                    <td><span style={{ color: '#388E3C', fontWeight: 'bold' }}>Activo</span></td>
                                                    <td>
                                                        <Button variant="secondary" onClick={() => alert('Función en construcción')}>
                                                            Desactivar
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
            const chartData = countRoles();
            return (
                <>
                    <header className="dashboard-header">
                        <h1>Reportes Reales Globales</h1>
                        <p>Visualiza el estado y demografía del sistema general</p>
                    </header>
                    <section className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))' }}>
                        <Card title="Composición de Usuarios por Rol">
                            <div style={{ width: '100%', height: 350, marginTop: '2rem' }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={120}
                                            innerRadius={60}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {chartData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS_BRAND[index % COLORS_BRAND.length]} />
                                            ))}
                                        </Pie>
                                        <ChartTooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                        <Card title="Asistencia Estimada Global">
                            <div style={{ width: '100%', height: 350, marginTop: '2rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                                <h3 style={{ color: '#1565C0', fontSize: '3rem', margin: 0 }}>{seminarios.length}</h3>
                                <p style={{ color: '#666' }}>Seminarios Disponibles</p>
                                
                                <h3 style={{ color: '#1565C0', fontSize: '3rem', margin: '1rem 0 0 0' }}>{usuarios.length}</h3>
                                <p style={{ color: '#666' }}>Entidades Creadas</p>
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
                    <h1>Panel de Control Global</h1>
                    <div className="user-profile">
                        <span>Bienvenido, {user?.nombre || 'Admin'}</span>
                    </div>
                </header>

                <section className="stats-grid">
                    <Card>
                        <p className="stat-label">Total Usuarios</p>
                        <p className="stat-number">{usuarios.length || 0}</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Seminarios Activos</p>
                        <p className="stat-number">{seminarios.length || 0}</p>
                    </Card>
                    <Card>
                        <p className="stat-label">Cuentas Administrativas</p>
                        <p className="stat-number">{usuarios.filter(u => u.rol==='administrador').length}</p>
                    </Card>
                </section>

                <section className="content-panel" style={{ marginTop: '2rem' }}>
                    <Card title="Acceso Rápido">
                        <p>Usa el menú lateral para navegar entre las funciones del sistema. Puedes crear nuevos usuarios, designar coordinadores y supervisar de forma general todos los seminarios.</p>
                    </Card>
                </section>
            </>
        );
    };

    return (
        <div className="dashboard-layout">
            <Sidebar
                tituloRol={user?.rol?.toUpperCase() || "ADMIN"}
                opciones={opcionesMenu}
                onCerrarSesion={handleCerrarSesion}
                onNavegar={(idVista) => setVistaActiva(idVista)}
            />

            <main className="dashboard-main">
                {renderVista()}
            </main>

            {/* Modal para Crear Usuario */}
            <Modal isOpen={modalUsuario} onClose={() => setModalUsuario(false)} title="Registrar Nuevo Usuario">
                <form onSubmit={handleSubmitUsuario}>
                    <InputText id="nu-nombre" label="Nombre Completo" name="nombre" value={formUsuario.nombre} onChange={(e) => setFormUsuario({...formUsuario, nombre: e.target.value})} required />
                    <InputText id="nu-documento" label="Documento (C.C.)" name="documento" value={formUsuario.documento} onChange={(e) => setFormUsuario({...formUsuario, documento: e.target.value})} required />
                    <InputText id="nu-email" label="Correo Electrónico" name="email" type="email" value={formUsuario.email} onChange={(e) => setFormUsuario({...formUsuario, email: e.target.value})} required />
                    <InputText id="nu-telefono" label="Teléfono" name="telefono" value={formUsuario.telefono} onChange={(e) => setFormUsuario({...formUsuario, telefono: e.target.value})} />
                    
                    <div className="input-group" style={{ marginBottom: '1rem' }}>
                        <label className="input-label">Rol del Usuario</label>
                        <select className="input-control" value={formUsuario.rol} onChange={(e) => setFormUsuario({...formUsuario, rol: e.target.value})} required>
                            <option value="participante">Participante</option>
                            <option value="coordinador">Coordinador</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>

                    <InputText id="nu-pass" label="Contraseña Temporal" name="password" type="password" value={formUsuario.password} onChange={(e) => setFormUsuario({...formUsuario, password: e.target.value})} placeholder="Mínimo 6 caracteres" required />
                    
                    <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '1rem', marginBottom: '1.5rem' }}>
                        Al crear el usuario, se enviará un correo automáticamente de bienvenida.
                    </p>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <Button type="button" variant="secondary" onClick={() => setModalUsuario(false)} disabled={isLoading}>Cancelar</Button>
                        <Button type="submit" variant="primary" disabled={isLoading}>{isLoading ? 'Guardando...' : 'Crear Usuario'}</Button>
                    </div>
                </form>
            </Modal>

            {/* Modales de Feedback */}
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