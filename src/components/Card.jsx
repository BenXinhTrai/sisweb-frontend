import React from 'react';
import PropTypes from 'prop-types';
import './Card.css';

/**
 * Componente funcional Card
 * Contenedor visual para agrupar información relacionada (ej. detalles de un seminario).
 * * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Título principal de la tarjeta.
 * @param {React.ReactNode} props.children - Contenido principal (cuerpo de la tarjeta).
 * @param {React.ReactNode} props.footer - Contenido opcional para la parte inferior (ej. botones de acción).
 */
export const Card = ({ title, children, footer }) => {
    return (
        // Uso de etiqueta semántica article para contenido independiente
        <article className="card-container">
            {title && (
                <header className="card-header">
                    <h3 className="card-title">{title}</h3>
                </header>
            )}

            <main className="card-body">
                {children}
            </main>

            {/* Renderizado condicional del footer si se pasan elementos como prop */}
            {footer && (
                <footer className="card-footer">
                    {footer}
                </footer>
            )}
        </article>
    );
};

// Validación de propiedades
Card.propTypes = {
    title: PropTypes.string,
    children: PropTypes.node.isRequired,
    footer: PropTypes.node,
};