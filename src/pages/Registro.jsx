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
        confirmPassword: ''
    });

    const [error, setError] = useState('');

    // Función genérica para actualizar el estado cuando el usuario escribe
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // 1. Validación de contraseñas coincidentes
        if (formData.password !== formData.confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        try {
            // 2. Petición POST a tu Backend usando el servicio
            const data = await authService.registro(formData.email, formData.password, formData.tipoUsuario);

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

                {error && <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

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
                    <InputText id="documento" label="Documento de Identidad" name="documento" value={formData.documento} onChange={handleChange} required />
                    <InputText id="email" label="Correo Electrónico" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    <InputText id="telefono" label="Teléfono" name="telefono" value={formData.telefono} onChange={handleChange} required />
                    <InputText id="password" label="Contraseña" name="password" type="password" value={formData.password} onChange={handleChange} required />
                    <InputText id="confirmPassword" label="Confirmar Contraseña" name="confirmPassword" type="password" value={formData.confirmPassword} onChange={handleChange} required />

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Button type="submit" variant="primary">Registrarse</Button>
                        <Button type="button" variant="secondary" onClick={() => window.location.href = '/login'}>Cancelar</Button>
                    </div>
                </form>
            </section>
        </main>
    );
};