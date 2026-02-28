import React from 'react';
import PropTypes from 'prop-types';
import './Modal.css';

/**
 * Componente funcional Modal
 * Muestra una ventana emergente sobre el contenido actual.
 * * MANEJO DE ESTADOS (En el componente padre):
 * Para usar este modal, el componente padre (ej. DashboardAdmin) debe tener un estado:
 * const [isOpen, setIsOpen] = useState(false);
 * * @param {Object} props - Propiedades del componente.
 * @param {boolean} props.isOpen - Define si el modal es visible o no.
 * @param {function} props.onClose - Función para cerrar el modal (ej. setIsOpen(false)).
 * @param {string} props.title - Título en el encabezado del modal.
 * @param {React.ReactNode} props.children - El contenido interno (formularios, textos).
 */
export const Modal = ({ isOpen, onClose, title, children }) => {
    // Si isOpen es falso, no renderizamos absolutamente nada en el DOM
    if (!isOpen) return null;

    // Función para evitar que clics dentro del contenido cierren el modal
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        /* Fondo oscuro superpuesto (Overlay) que también permite cerrar al hacer clic */
        <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true">

            {/* Contenedor principal de la ventana modal */}
            <div className="modal-container" onClick={handleContentClick}>

                <header className="modal-header">
                    <h3 className="modal-title">{title}</h3>
                    <button
                        className="modal-close-btn"
                        onClick={onClose}
                        aria-label="Cerrar modal"
                    >
                        &times; {/* Entidad HTML para el símbolo de "X" */}
                    </button>
                </header>

                <div className="modal-body">
                    {children}
                </div>

            </div>
        </div>
    );
};

Modal.propTypes = {
    isOpen: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
};