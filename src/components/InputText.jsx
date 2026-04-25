import React from 'react';
import PropTypes from 'prop-types';
import './InputText.css';

/**
 * Componente funcional InputText
 * Renderiza un campo de entrada de texto con su respectiva etiqueta y manejo de errores.
 * * @param {Object} props - Propiedades del componente.
 * @param {string} props.id - Identificador único para vincular el label con el input.
 * @param {string} props.label - Texto descriptivo que acompaña al campo.
 * @param {string} props.name - Nombre del campo, útil para el manejo de formularios.
 * @param {string} props.value - Valor actual del campo (componente controlado).
 * @param {function} props.onChange - Función que captura los cambios en el valor del input.
 * @param {string} props.placeholder - Texto de ayuda que se muestra cuando el campo está vacío.
 * @param {string} props.type - Tipo de entrada (por defecto 'text', puede ser 'email', 'password').
 * @param {string} props.error - Mensaje de error a mostrar si la validación falla.
 */
export const InputText = ({
    id,
    label,
    name,
    value,
    onChange,
    placeholder = '',
    type = 'text',
    error = '',
    ...props
}) => {
    return (
        <div className="input-group">
            {/* El atributo htmlFor vincula semánticamente la etiqueta con el input */}
            <label htmlFor={id} className="input-label">
                {label}
            </label>
            <input
                id={id}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                {...props}
                // Si existe un error, se añade una clase específica para el borde rojo
                className={`input-control ${error ? 'input-error' : ''}`}
                // Atributos de accesibilidad para indicar que el campo tiene un error
                aria-invalid={error ? 'true' : 'false'}
                aria-describedby={error ? `${id}-error` : undefined}
            />
            {/* Renderizado condicional: Solo se muestra si hay un mensaje de error */}
            {error && (
                <span id={`${id}-error`} className="error-message" role="alert">
                    {error}
                </span>
            )}
        </div>
    );
};

// Validaciones estrictas de las propiedades
InputText.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    onChange: PropTypes.func.isRequired,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    error: PropTypes.string,
};