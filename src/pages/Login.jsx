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
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación de campos vacíos
        if (!email || !password) {
            setError('Por favor complete todos los campos obligatorios.');
            return;
        }

        setError(''); // Limpiamos errores previos

        try {
            // Petición POST a tu API de Login
            const response = await fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            // =========================================================
            // REQUERIMIENTO SENA: VALIDACIÓN DE MENSAJES EXACTOS
            // =========================================================
            if (response.ok && data.mensaje === 'autenticación satisfactoria') {
                // Mostramos el mensaje de éxito requerido
                alert(data.mensaje);

                // Extraemos el rol directamente desde la base de datos
                const rolReal = data.usuario.rol;

                // Redirección dinámica según el rol del usuario en la BD
                if (rolReal === 'participante') {
                    window.location.href = '/dashboard-participante';
                } else if (rolReal === 'coordinador') {
                    window.location.href = '/dashboard-coordinador-seminarios';
                } else if (rolReal === 'administrador') {
                    window.location.href = '/dashboard-administrador';
                } else {
                    window.location.href = '/dashboard-participante'; // Ruta por defecto
                }
            } else {
                // Mostramos el mensaje de error exacto requerido por el SENA
                setError(data.mensaje || 'error en la autenticación');
            }
        } catch (error) {
            console.error("Error de conexión:", error);
            setError('error en la autenticación'); // Fallback de error requerido
        }
    };

    // ========================================================
    // FUNCIONES SECUNDARIAS (Navegación)
    // ========================================================
    const handleRecuperarPassword = () => {
        // Nos lleva a la página de recuperar contraseña
        window.location.href = '/recuperar-password';
    };

    const handleRegistro = () => {
        // Nos lleva a la página de registro
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