import jsPDF from 'jspdf';

/**
 * Genera un certificado PDF y lo descarga automáticamente en el navegador.
 * 
 * @param {string} nombreParticipante - Nombre completo del estudiante.
 * @param {string} nombreSeminario - Nombre del seminario cursado.
 * @param {string} fechaTexto - Fecha de finalización (ej: "25 de Abril de 2026").
 * @param {string} documento - Documento de identidad del estudiante.
 */
export const descargarCertificadoPDF = (nombreParticipante, nombreSeminario, fechaTexto, documento) => {
    // Inicializar el PDF en formato horizontal (landscape) y tamaño A4 ('a4')
    const doc = new jsPDF('landscape', 'mm', 'a4');

    // Dimensiones de la hoja A4 apaisada: 297mm ancho x 210mm alto
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // 1. DIBUJAR MARCOS Y FONDOS CORPORATIVOS
    // Marco exterior principal
    doc.setDrawColor(21, 101, 192); // Azul corporativo (#1565C0)
    doc.setLineWidth(3);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    // Marco secundario
    doc.setDrawColor(100, 150, 255);
    doc.setLineWidth(0.5);
    doc.rect(12, 12, pageWidth - 24, pageHeight - 24);

    // Banda superior decorativa
    doc.setFillColor(21, 101, 192);
    doc.rect(12, 12, pageWidth - 24, 25, 'F');

    // Encabezado blanco dentro de la banda azul
    doc.setTextColor(255, 255, 255);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(28);
    doc.text("SENA & SISWEB", pageWidth / 2, 29, { align: 'center' });

    // 2. TEXTOS CENTRALES (Cuerpo del Certificado)
    doc.setTextColor(50, 50, 50);
    
    // Título Central
    doc.setFontSize(36);
    doc.setFont("helvetica", "bold");
    doc.text("CERTIFICADO DE PARTICIPACIÓN", pageWidth / 2, 75, { align: 'center' });

    // Subtítulo
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text("Se otorga el presente documento a:", pageWidth / 2, 95, { align: 'center' });

    // Nombre del Estudiante (Destacado)
    doc.setFontSize(30);
    doc.setTextColor(21, 101, 192); // Azul corporativo
    doc.setFont("helvetica", "bolditalic");
    doc.text(nombreParticipante.toUpperCase(), pageWidth / 2, 115, { align: 'center' });
    
    // Documento de Identidad (Nuevo)
    if (documento) {
        doc.setFontSize(14);
        doc.setTextColor(100, 100, 100);
        doc.setFont("helvetica", "normal");
        doc.text(`Identificado(a) con C.C. No. ${documento}`, pageWidth / 2, 125, { align: 'center' });
    }

    // Razón del Certificado
    doc.setFontSize(16);
    doc.setTextColor(50, 50, 50);
    doc.setFont("helvetica", "normal");
    doc.text("Por haber aprobado y finalizado satisfactoriamente su participación en el seminario:", pageWidth / 2, 135, { align: 'center' });

    // Nombre del Seminario
    doc.setFontSize(20);
    doc.setFont("helvetica", "bold");
    doc.text(nombreSeminario, pageWidth / 2, 150, { align: 'center' });

    // Intensidad Horaria
    doc.setFontSize(14);
    doc.setFont("helvetica", "normal");
    doc.text("Cumpliendo con una intensidad académica total de 40 horas.", pageWidth / 2, 165, { align: 'center' });

    // 3. FIRMAS Y SELLOS
    // Líneas de firma
    doc.setDrawColor(150, 150, 150);
    doc.setLineWidth(0.5);
    doc.line(40, 185, 120, 185); // Firma izquierda
    doc.line(pageWidth - 120, 185, pageWidth - 40, 185); // Firma derecha

    // Textos debajo de firmas
    doc.setFontSize(12);
    doc.text("Director General SENA", 80, 192, { align: 'center' });
    doc.text("Coordinador Académico SISWEB", pageWidth - 80, 192, { align: 'center' });

    // Fecha de finalización (Esquina)
    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text(`Fecha de Emisión: ${fechaTexto}`, pageWidth - 15, pageHeight - 15, { align: 'right' });

    // Hash/Sello único simulado de validación
    const hashUnico = Math.random().toString(36).substring(2, 15).toUpperCase();
    doc.text(`Cód. Validación: SW-${hashUnico}`, 15, pageHeight - 15, { align: 'left' });

    // 4. GENERACIÓN Y DESCARGA
    // Guarda el archivo directamente en la computadora del usuario
    doc.save(`Certificado_${nombreSeminario.replace(/\s+/g, '_')}_${nombreParticipante.replace(/\s+/g, '_')}.pdf`);
};
