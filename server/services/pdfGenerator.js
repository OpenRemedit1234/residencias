const PDFDocument = require('pdfkit');

const generateInvoicePDF = (pago, res) => {
    const doc = new PDFDocument({ margin: 50 });

    // Stream directamente a la respuesta
    doc.pipe(res);

    // Cabecera
    doc.fontSize(20).text('RECIBO DE PAGO', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.text(`Recibo N°: ${String(pago.id).padStart(6, '0')}`, { align: 'right' });
    doc.moveDown();

    // Datos de la empresa (mock)
    doc.fontSize(10).text('Residencias App', 50, 100);
    doc.text('Calle Ejemplo 123', 50, 115);
    doc.text('Ciudad, 28000', 50, 130);

    // Datos del cliente
    const startY = 160;
    doc.fontSize(12).text('Pagador:', 50, startY);
    doc.font('Helvetica-Bold').text(`${pago.residente?.nombre} ${pago.residente?.apellidos}`, 50, startY + 20);
    if (pago.residente?.dni) {
        doc.font('Helvetica').text(`DNI: ${pago.residente.dni}`, 50, startY + 35);
    }

    // Tabla de detalles
    const tableTop = 250;
    doc.font('Helvetica-Bold');
    doc.text('Concepto', 50, tableTop);
    doc.text('Importe', 450, tableTop, { align: 'right' });
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    doc.font('Helvetica');
    doc.text(pago.concepto, 50, tableTop + 30);
    doc.text(`${pago.monto} €`, 450, tableTop + 30, { align: 'right' });

    // Totales
    const totalTop = tableTop + 60;
    doc.moveTo(350, totalTop).lineTo(550, totalTop).stroke();
    doc.font('Helvetica-Bold');
    doc.text('TOTAL', 350, totalTop + 15);
    doc.text(`${pago.monto} €`, 450, totalTop + 15, { align: 'right' });

    // Pie de página
    doc.fontSize(10).font('Helvetica').text('Gracias por su pago.', 50, 700, { align: 'center', width: 500 });
    doc.end();
};

const generateProformaPDF = (reserva, res) => {
    const doc = new PDFDocument({ margin: 50 });
    doc.pipe(res);

    doc.fontSize(20).text('FACTURA PROFORMA', { align: 'center' });
    doc.moveDown();
    doc.fontSize(10).text(`Fecha: ${new Date().toLocaleDateString()}`, { align: 'right' });
    doc.text(`Referencia: PRF-${String(reserva.id).padStart(6, '0')}`, { align: 'right' });
    doc.moveDown();

    doc.fontSize(10).text('Residencias S.A.', 50, 100);
    doc.text('CIF: B12345678', 50, 115);
    doc.text('Calle Ficticia 456, Madrid', 50, 130);

    const startY = 160;
    doc.fontSize(12).text('Cliente:', 50, startY);
    doc.font('Helvetica-Bold').text(`${reserva.residente?.nombre} ${reserva.residente?.apellidos}`, 50, startY + 20);
    if (reserva.residente?.dni) doc.font('Helvetica').text(`DNI: ${reserva.residente.dni}`, 50, startY + 35);

    const tableTop = 250;
    doc.font('Helvetica-Bold');
    doc.text('Concepto / Alojamiento', 50, tableTop);
    doc.text('Fechas', 300, tableTop);
    doc.text('Total', 450, tableTop, { align: 'right' });
    doc.moveTo(50, tableTop + 15).lineTo(550, tableTop + 15).stroke();

    doc.font('Helvetica');
    const concepto = reserva.habitacion ? `Reserva Habitación ${reserva.habitacion.numero}` : `Reserva Apartamento ${reserva.apartamento.numero}`;
    doc.text(concepto, 50, tableTop + 30);
    doc.text(`${reserva.fecha_entrada} al ${reserva.fecha_salida}`, 300, tableTop + 30);
    doc.text(`${reserva.precio_total} €`, 450, tableTop + 30, { align: 'right' });

    const totalTop = tableTop + 80;
    doc.moveTo(350, totalTop).lineTo(550, totalTop).stroke();
    doc.font('Helvetica-Bold').fontSize(14);
    doc.text('TOTAL A PAGAR', 250, totalTop + 15);
    doc.text(`${reserva.precio_total} €`, 450, totalTop + 15, { align: 'right' });

    doc.fontSize(9).font('Helvetica').text('Este documento no tiene validez legal como factura final. Solo informativa.', 50, 700, { align: 'center', width: 500 });
    doc.end();
};

module.exports = { generateInvoicePDF, generateProformaPDF };
