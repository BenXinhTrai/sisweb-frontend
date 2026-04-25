import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import './Login.css'; // Usamos los mismos estilos del login para mantener cohesión

export const RestablecerPassword = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get('token');

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    if (!token) {
        return (
            <main className="login-wrapper">
                <section className="login-container">
                    <div className="error-message">Error: Falta el token de seguridad en la URL. Vuelva a hacer clic en el enlace de su correo.</div>
                </section>
            </main>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.');
            return;
        }

        setIsLoading(true);
        try {
            const data = await authService.resetPassword(token, password);
            setMessage(data.message || 'Contraseña actualizada con éxito');
            // Redirigir al login después de 3 segundos
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.message || 'Error al cambiar la contraseña.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-wrapper">
            <section className="login-container">
                <header className="login-header">
                    <h2>Restablecer Contraseña</h2>
                    <p>Por favor, ingrese su nueva clave.</p>
                </header>

                {error && <div className="error-message" style={{ textAlign: 'center', marginBottom: '1rem' }}>{error}</div>}
                {message && <div style={{ color: 'green', textAlign: 'center', marginBottom: '1rem', backgroundColor: '#e6ffe6', padding: '10px', borderRadius: '5px' }}>{message}</div>}

                <form onSubmit={handleSubmit} className="login-form">
                    <InputText
                        id="password"
                        label="Nueva Contraseña"
                        name="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    <InputText
                        id="confirmPassword"
                        label="Confirmar Contraseña"
                        name="confirmPassword"
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />

                    <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Guardando...' : 'Guardar Nueva Contraseña'}
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    );
};
