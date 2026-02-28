import React from 'react';
import PropTypes from 'prop-types';
import './Button.css'; // Asegúrate de crear este archivo o integrar las clases en tu CSS global

/**
 * Componente funcional Button
 * Renderiza un botón semántico y accesible con soporte para múltiples variantes visuales.
 * * @param {Object} props - Propiedades del componente.
 * @param {React.ReactNode} props.children - El contenido interno del botón (texto o iconos).
 * @param {function} props.onClick - Función que se ejecuta al hacer clic.
 * @param {string} props.type - Tipo de botón ('button', 'submit', 'reset').
 * @param {string} props.variant - Variante visual ('primary', 'secondary', 'danger').
 * @param {boolean} props.disabled - Estado que deshabilita la interacción con el botón.
 */
export const Button = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    disabled = false
}) => {
    // Se asignan dinámicamente las clases CSS dependiendo de la variante elegida
    const buttonClass = `btn btn-${variant} ${disabled ? 'btn-disabled' : ''}`;

    return (
        <button
            type={type}
            className={buttonClass}
            onClick={onClick}
            disabled={disabled}
            // Atributo ARIA para mejorar la accesibilidad cuando el botón está deshabilitado
            aria-disabled={disabled}
        >
            {children}
        </button>
    );
};

// Validación de los tipos de propiedades (PropTypes) para evitar errores en tiempo de desarrollo
Button.propTypes = {
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
    type: PropTypes.oneOf(['button', 'submit', 'reset']),
    variant: PropTypes.oneOf(['primary', 'secondary', 'danger']),
    disabled: PropTypes.bool,
};