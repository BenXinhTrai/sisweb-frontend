import React from 'react';
import PropTypes from 'prop-types';
import './Table.css';

/**
 * Componente funcional Table
 * Renderiza una tabla dinámica basándose en las columnas y datos proporcionados.
 * * @param {Object} props - Propiedades del componente.
 * @param {Array} props.columns - Arreglo de objetos definiendo las columnas [{ key: 'id', label: 'Nombre' }].
 * @param {Array} props.data - Arreglo de objetos con los datos de cada fila.
 */
export const Table = ({ columns, data }) => {
    // Si no hay datos, mostramos un mensaje amigable en lugar de una tabla vacía
    if (!data || data.length === 0) {
        return <div className="table-empty-message">No hay registros para mostrar.</div>;
    }

    return (
        <div className="table-wrapper">
            <table className="custom-table" role="grid">
                <thead>
                    <tr role="row">
                        {/* Iteramos sobre el arreglo de columnas para generar el encabezado */}
                        {columns.map((col) => (
                            <th key={col.key} role="columnheader">
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {/* Doble iteración: Primero por cada fila de datos... */}
                    {data.map((row, rowIndex) => (
                        <tr key={rowIndex} role="row">
                            {/* ... y luego por cada columna para asegurar el orden correcto */}
                            {columns.map((col) => (
                                <td key={`${rowIndex}-${col.key}`} role="cell">
                                    {/* row[col.key] accede al valor exacto (ej. row.nombre) */}
                                    {row[col.key]}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

// Validación estricta de los datos esperados
Table.propTypes = {
    columns: PropTypes.arrayOf(
        PropTypes.shape({
            key: PropTypes.string.isRequired,
            label: PropTypes.string.isRequired,
        })
    ).isRequired,
    data: PropTypes.arrayOf(PropTypes.object).isRequired,
};