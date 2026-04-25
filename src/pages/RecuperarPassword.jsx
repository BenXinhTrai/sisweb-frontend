import React, { useState } from 'react';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import './Login.css'; // Reutilizamos los estilos del Login porque es la misma tarjeta flotante

import { authService } from '../services/authService';

export const RecuperarPassword = () => {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const data = await authService.solicitarRecuperacion(email);
            alert(data.message || `Se han enviado las instrucciones de recuperación al correo: ${email}`);
            window.location.href = '/login';
        } catch (err) {
            setError(err.message || 'Error al solicitar recuperación.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="login-wrapper">
            <section className="login-container">
                <header className="login-logo">
                    <h2>Recuperar Contraseña</h2>
                    <p>Ingrese su correo institucional</p>
                </header>

                <form onSubmit={handleSubmit}>
                    {error && (
                        <div className="error-message" style={{ 
                            backgroundColor: '#ffebee', 
                            color: '#c62828', 
                            padding: '10px', 
                            borderRadius: '6px', 
                            border: '1px solid #ef5350',
                            textAlign: 'center', 
                            marginBottom: '1rem',
                            fontSize: '0.9rem'
                        }}>
                            {error}
                        </div>
                    )}
                    
                    <InputText
                        id="recuperar-email"
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        placeholder="ejemplo@sena.edu.co"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Button type="submit" variant="primary" disabled={isLoading}>
                            {isLoading ? 'Enviando...' : 'Enviar Enlace'}
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => window.location.href = '/login'}>
                            Volver al Login
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    );
};