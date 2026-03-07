import React, { useState } from 'react';
import { InputText } from '../components/InputText';
import { Button } from '../components/Button';
import './Login.css'; // Reutilizamos los estilos del Login porque es la misma tarjeta flotante

export const RecuperarPassword = () => {
    const [email, setEmail] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        alert(`Se han enviado las instrucciones de recuperación al correo: ${email}`);
        window.location.href = '/login';
    };

    return (
        <main className="login-wrapper">
            <section className="login-container">
                <header className="login-logo">
                    <h2>Recuperar Contraseña</h2>
                    <p>Ingrese su correo institucional</p>
                </header>

                <form onSubmit={handleSubmit}>
                    <InputText
                        id="recuperar-email"
                        label="Correo Electrónico"
                        name="email"
                        type="email"
                        placeholder="ejemplo@univalle.edu.co"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <Button type="submit" variant="primary">
                            Enviar Enlace
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