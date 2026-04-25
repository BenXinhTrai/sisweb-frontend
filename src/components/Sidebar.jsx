import React from 'react';
import PropTypes from 'prop-types';
import './Sidebar.css';

/**
 * Componente funcional Sidebar
 * Renderiza el menú de navegación lateral para los diferentes dashboards.
 * * @param {Object} props - Propiedades del componente.
 * @param {string} props.tituloRol - El rol del usuario que se mostrará en la parte superior (ej. "Administrador").
 * @param {Array} props.opciones - Arreglo de objetos con las opciones del menú { id, texto }.
 * @param {function} props.onCerrarSesion - Función que se ejecuta al presionar el botón de salir.
 */
export const Sidebar = ({ tituloRol, opciones, onCerrarSesion, onNavegar }) => {
    return (
        <aside className="sidebar-container">
            <header className="sidebar-header">
                <h2>SISWEB</h2>
                <p className="rol-texto">{tituloRol}</p>
            </header>

            <nav className="sidebar-nav">
                <ul>
                    {/* Iteramos sobre las opciones pasadas por props para generar los enlaces */}
                    {opciones.map((opcion) => (
                        <li key={opcion.id} className="nav-item">
                            <a 
                                href={`#${opcion.id}`} 
                                className="nav-link"
                                onClick={(e) => {
                                    if (onNavegar) {
                                        e.preventDefault();
                                        onNavegar(opcion.id);
                                    }
                                }}
                            >
                                {opcion.texto}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <footer className="sidebar-footer">
                {/* Botón semántico para cerrar sesión usando la clase global o estilo nativo */}
                <button
                    type="button"
                    className="btn-logout"
                    onClick={onCerrarSesion}
                    aria-label="Cerrar sesión del sistema"
                >
                    Cerrar Sesión
                </button>
            </footer>
        </aside>
    );
};

// Validación de propiedades
Sidebar.propTypes = {
    tituloRol: PropTypes.string.isRequired,
    opciones: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            texto: PropTypes.string.isRequired
        })
    ).isRequired,
    onCerrarSesion: PropTypes.func.isRequired,
};