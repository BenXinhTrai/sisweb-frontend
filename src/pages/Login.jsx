import React, { useState } from 'react';
// Importamos los componentes base que creamos anteriormente
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import './Login.css';

/**
 * Componente funcional Login (Página)
 * Maneja la autenticación de los usuarios del sistema SISWEB
 * redirigiéndolos a su respectivo dashboard según su rol.
 */
export const Login = () => {
    // ========================================================
    // 1. ESTADOS LOCALES (Hooks useState)
    // ========================================================
    // Guardan el valor de los inputs en tiempo real. 
    // Inician como strings vacíos ('').
    const [tipoUsuario, setTipoUsuario] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Estado adicional para manejar mensajes de error en la validación
    const [error, setError] = useState('');

    // ========================================================
    // 2. FUNCIONES MANEJADORAS (Handlers)
    // ========================================================

    /**
     * handleSubmit: Se ejecuta al presionar el botón "Ingresar".
     * Explica la lógica de validación y redirección basada en roles.
     * @param {Event} e - Evento nativo del formulario
     */
    const handleSubmit = (e) => {
        // PASO 1: Prevenir el comportamiento por defecto del HTML (recargar la página)
        e.preventDefault();

        // PASO 2: Validación básica de campos obligatorios
        if (!tipoUsuario || !email || !password) {
            setError('Por favor complete todos los campos obligatorios.');
            return; // Detiene la ejecución si faltan datos
        }

        // Limpiamos los errores si todo está correcto
        setError('');

        // PASO 3: Simulación de petición al Backend
        console.log('Autenticando usuario con datos:', { tipoUsuario, email, password });

        // PASO 4: Lógica de redirección (Enrutamiento según el rol)
        switch (tipoUsuario) {
            case 'participante':
                // Dirige al catálogo e inscripciones
                window.location.href = '/dashboard-participante';
                break;
            case 'coordinador_seminarios':
                // Dirige a la gestión de eventos y ponentes
                window.location.href = '/dashboard-coordinador-seminarios';
                break;
            case 'coordinador_recursos':
                // Dirige al módulo de inventario de recursos físicos/audiovisuales
                window.location.href = '/dashboard-coordinador-recursos';
                break;
            case 'administrador':
                // Dirige al control total del sistema y usuarios
                window.location.href = '/dashboard-administrador';
                break;
            default:
                setError('El rol seleccionado no es válido.');
        }
    };

    // Funciones secundarias para los enlaces
    const handleRecuperarPassword = () => {
        alert('Redirigiendo a recuperación de contraseña...');
    };

    const handleRegistro = () => {
        window.location.href = '/registro';
    };

    // ========================================================
    // 3. RENDERIZADO (JSX)
    // ========================================================
    return (
        <main className="login-wrapper">
            <section className="login-container">

                {/* Encabezado con el Logo */}
                <header className="login-logo">
                    <h1>SISWEB</h1>
                    <p>Sistema de Información de Seminarios WEB</p>
                </header>

                {/* Renderizado Condicional del Error: Solo aparece si hay un error */}
                {error && <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}

                {/* Formulario conectado a la función handleSubmit */}
                <form onSubmit={handleSubmit} noValidate>

                    {/* Selector de Tipo de Usuario */}
                    {/* Se usa HTML estándar con clases similares al InputText ya que es un <select> */}
                    <div className="select-group">
                        <label htmlFor="tipoUsuario" className="select-label">
                            Tipo de Usuario
                        </label>
                        <select
                            id="tipoUsuario"
                            className="select-control"
                            value={tipoUsuario}
                            onChange={(e) => setTipoUsuario(e.target.value)} // Actualiza el estado
                            required
                        >
                            <option value="" disabled>Seleccione su rol...</option>
                            <option value="participante">Participante</option>
                            <option value="coordinador_seminarios">Coordinador de Seminarios</option>
                            <option value="coordinador_recursos">Coordinador de Recursos</option>
                            <option value="administrador">Administrador del Sistema</option>
                        </select>
                    </div>

                    {/* Componente Personalizado: InputText (Email) */}
                    <InputText
                        id="email"
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        placeholder="ejemplo@univalle.edu.co"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} // Actualiza el estado
                    />

                    {/* Componente Personalizado: InputText (Contraseña) */}
                    <InputText
                        id="password"
                        label="Contraseña"
                        name="password"
                        type="password"
                        placeholder="Ingrese su contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} // Actualiza el estado
                    />

                    {/* Componente Personalizado: Button */}
                    <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                        <Button type="submit" variant="primary">
                            Ingresar al Sistema
                        </Button>
                    </div>
                </form>

                {/* Enlaces de acciones secundarias */}
                <footer className="login-links">
                    <button type="button" className="link-button" onClick={handleRecuperarPassword}>
                        ¿Olvidó su contraseña?
                    </button>
                    <button type="button" className="link-button" onClick={handleRegistro}>
                        ¿No tiene cuenta? Regístrese aquí
                    </button>
                </footer>

            </section>
        </main>
    );
};