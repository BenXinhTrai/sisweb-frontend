import React, { useState } from 'react';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import { authService } from '../services/authService';
import './Registro.css';

/**
 * Componente funcional Registro
 * Permite a nuevos usuarios solicitar acceso al sistema SISWEB.
 */
export const Registro = () => {
    // Estado unificado para manejar todos los campos del formulario
    const [formData, setFormData] = useState({
        tipoUsuario: '',
        nombre: '',
        documento: '',
        email: '',
        telefono: '',
        password: '',
        confirmPassword: '',
        aceptaPoliticas: false
    });

    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validación de contraseñas coincidentes y políticas
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        if (!formData.aceptaPoliticas) {
            setError('Debe aceptar la política de privacidad para registrarse.');
            return;
        }

        try {
            // 2. Petición POST a tu Backend usando el servicio
            const data = await authService.registro(formData);

            // 3. Manejo de la respuesta
            alert('¡Registro exitoso! Ya puedes iniciar sesión.');
            window.location.href = '/login'; // Redirige al login
        } catch (error) {
            console.error("Error de conexión:", error);
            // Mostrar Error explícito del authService
            setError(error.message || 'Error de conexión con el servidor.');
        }
    };

    return (
        <main className="registro-wrapper">
            <section className="registro-container">
                <header className="registro-header">
                    <h2>Crear Cuenta SISWEB</h2>
                    <p>Complete sus datos para solicitar acceso</p>
                </header>

                {error && (
                    <div className="error-message" style={{ 
                        backgroundColor: '#ffebee', 
                        color: '#c62828', 
                        padding: '12px', 
                        borderRadius: '6px', 
                        border: '1px solid #ef5350',
                        textAlign: 'center', 
                        marginBottom: '1rem',
                        fontWeight: 'bold'
                    }}>
                        ⚠️ {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="registro-form">
                    <div className="select-group">
                        <label className="select-label">Tipo de Usuario Solicitado</label>
                        <select
                            name="tipoUsuario"
                            className="select-control"
                            value={formData.tipoUsuario}
                            onChange={handleChange}
                            required
                        >
                            <option value="" disabled>Seleccione...</option>
                            <option value="participante">Participante</option>
                            <option value="coordinador">Coordinador</option>
                            <option value="administrador">Administrador</option>
                        </select>
                    </div>

                    <InputText id="nombre" label="Nombre Completo" name="nombre" value={formData.nombre} onChange={handleChange} required />
                    <InputText id="documento" label="Documento de Identidad (Opcional)" name="documento" value={formData.documento} onChange={handleChange} />
                    <InputText id="email" label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <InputText id="telefono" label="Teléfono (Opcional)" name="telefono" value={formData.telefono} onChange={handleChange} />
                    <InputText id="password" label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} required />
                    <InputText id="confirmPassword" label="Confirmar Contraseña" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />

                    <div className="checkbox-group" style={{ margin: '1rem 0', textAlign: 'left', fontSize: '0.9rem' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                name="aceptaPoliticas"
                                checked={formData.aceptaPoliticas}
                                onChange={handleChange}
                                required
                            />
                            Acepto política de privacidad
                        </label>
                    </div>

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Button type="submit" variant="primary">Registrarse</Button>
                        <Button type="button" variant="secondary" onClick={() => window.location.href = '/login'}>Cancelar</Button>
                    </div>
                </form>
            </section>
        </main>
    );
};