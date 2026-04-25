import React, { useState } from 'react';
import { InputText } from './InputText';
import { Button } from './Button';
import { Modal } from './Modal';
import { apiFetch } from '../services/api';

/**
 * Componente Reutilizable ProfileView
 * Permite gestionar información personal y cambio de contraseña para cualquier rol.
 */
export const ProfileView = ({ user, onUserUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [modalExito, setModalExito] = useState({ isOpen: false, mensaje: '' });
    const [modalError, setModalError] = useState({ isOpen: false, mensaje: '' });

    // Estado para el formulario de perfil
    const [perfilForm, setPerfilForm] = useState({
        nombre: user?.nombre || '',
        documento: user?.documento || '',
        telefono: user?.telefono || ''
    });

    // Estado para el cambio de contraseña
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const handleUpdatePerfil = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const res = await apiFetch(`/usuarios/${user.id_usuario}`, {
                method: 'PUT',
                body: JSON.stringify(perfilForm)
            });
            
            const updatedUser = { ...user, ...perfilForm };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            if (onUserUpdate) onUserUpdate(updatedUser);
            
            setModalExito({ 
                isOpen: true, 
                mensaje: res.mensaje || 'Información de perfil actualizada exitosamente.' 
            });
        } catch (error) {
            setModalError({ isOpen: true, mensaje: error.message || 'Error al actualizar perfil' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdatePassword = async (e) => {
        e.preventDefault();
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setModalError({ isOpen: true, mensaje: 'Las nuevas contraseñas no coinciden.' });
            return;
        }
        if (passwordForm.newPassword.length < 6) {
            setModalError({ isOpen: true, mensaje: 'La contraseña debe tener al menos 6 caracteres.' });
            return;
        }

        setIsLoading(true);
        try {
            const res = await apiFetch('/cambiar-password', {
                method: 'POST',
                body: JSON.stringify({
                    id_usuario: user.id_usuario,
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            });
            setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
            setModalExito({ isOpen: true, mensaje: res.mensaje || 'Tu contraseña ha sido actualizada con éxito.' });
        } catch (error) {
            setModalError({ isOpen: true, mensaje: error.message || 'Error al procesar el cambio de clave.' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <header className="dashboard-header">
                <h1>Mi Perfil</h1>
                <p>Gestione su información personal y seguridad de la cuenta</p>
            </header>
            
            <div className="profile-container">
                <div className="profile-card">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#1565C0' }}>Información Personal</h2>
                    <form onSubmit={handleUpdatePerfil}>
                        <InputText
                            id="perfil-nombre"
                            label="Nombre Completo"
                            name="nombre"
                            value={perfilForm.nombre}
                            onChange={(e) => setPerfilForm({...perfilForm, nombre: e.target.value})}
                            required
                        />
                        <InputText
                            id="perfil-documento"
                            label="Documento de Identidad (C.C.)"
                            name="documento"
                            value={perfilForm.documento}
                            onChange={(e) => setPerfilForm({...perfilForm, documento: e.target.value})}
                            required
                        />
                        <InputText
                            id="perfil-telefono"
                            label="Número Celular / Teléfono"
                            name="telefono"
                            value={perfilForm.telefono}
                            onChange={(e) => setPerfilForm({...perfilForm, telefono: e.target.value})}
                        />
                        <div style={{ marginTop: '1rem', color: '#666', fontSize: '0.85rem' }}>
                            <p><strong>Correo Institucional:</strong> {user?.email}</p>
                            <p style={{ marginTop: '0.3rem' }}>El correo institucional no puede ser modificado.</p>
                        </div>
                        <div style={{ marginTop: '2rem' }}>
                            <Button type="submit" variant="primary" disabled={isLoading}>
                                {isLoading ? 'Guardando...' : 'Guardar Cambios'}
                            </Button>
                        </div>
                    </form>
                </div>

                <div className="profile-card">
                    <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', color: '#1565C0' }}>Seguridad de la Cuenta</h2>
                    <form onSubmit={handleUpdatePassword}>
                        <InputText
                            id="current-pass"
                            label="Contraseña Actual"
                            name="currentPassword"
                            type="password"
                            value={passwordForm.currentPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, currentPassword: e.target.value})}
                            required
                        />
                        <InputText
                            id="new-pass"
                            label="Nueva Contraseña"
                            name="newPassword"
                            type="password"
                            value={passwordForm.newPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, newPassword: e.target.value})}
                            placeholder="Mínimo 6 caracteres"
                            required
                        />
                        <InputText
                            id="confirm-pass"
                            label="Confirmar Nueva Contraseña"
                            name="confirmPassword"
                            type="password"
                            value={passwordForm.confirmPassword}
                            onChange={(e) => setPasswordForm({...passwordForm, confirmPassword: e.target.value})}
                            required
                        />
                        <div style={{ marginTop: '2rem' }}>
                            <Button type="submit" variant="primary" disabled={isLoading}>
                                {isLoading ? 'Actualizando...' : 'Cambiar Contraseña'}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>

            <Modal
                isOpen={modalExito.isOpen}
                onClose={() => setModalExito({ isOpen: false, mensaje: '' })}
                title="Aviso del Sistema"
            >
                <div style={{ textAlign: 'center' }}>
                    <p>{modalExito.mensaje}</p>
                    <div style={{ marginTop: '2rem' }}>
                        <Button variant="primary" onClick={() => setModalExito({ isOpen: false, mensaje: '' })}>
                            Entendido
                        </Button>
                    </div>
                </div>
            </Modal>

            <Modal
                isOpen={modalError.isOpen}
                onClose={() => setModalError({ isOpen: false, mensaje: '' })}
                title="Error"
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
        </>
    );
};
