const nodemailer = require('nodemailer');
const { Configuracion } = require('../database/connection'); // Asumimos que existirá el modelo

let transporter = null;

const createTransporter = async () => {
    // Intentar obtener config de la BD
    try {
        const config = await Configuracion.findOne();
        if (config && config.smtp_host) {
            transporter = nodemailer.createTransport({
                host: config.smtp_host,
                port: config.smtp_port,
                secure: config.smtp_secure, // true for 465, false for other ports
                auth: {
                    user: config.smtp_user,
                    pass: config.smtp_pass,
                },
            });
            console.log('Transporter SMTP configurado desde BD');
        } else {
            console.log('No hay configuración SMTP en BD');
        }
    } catch (error) {
        console.error('Error al configurar transporter:', error);
    }
};

// Inicializar al arranque
createTransporter();

const sendEmail = async (to, subject, html, attachments = []) => {
    if (!transporter) {
        await createTransporter();
        if (!transporter) {
            throw new Error('Servidor SMTP no configurado');
        }
    }

    try {
        const config = await Configuracion.findOne();
        const from = config?.smtp_from || '"Residencias" <noreply@residencias.com>';

        const info = await transporter.sendMail({
            from,
            to,
            subject,
            html,
            attachments
        });
        return info;
    } catch (error) {
        console.error('Error enviando email:', error);
        throw error;
    }
};

const sendPaymentReceipt = async (pago, residente) => {
    const subject = `Recibo de Pago #${pago.id}`;
    const html = `
        <h1>Recibo de Pago</h1>
        <p>Hola ${residente.nombre},</p>
        <p>Adjuntamos el recibo de su pago reciente.</p>
        <p><strong>Monto:</strong> ${pago.monto}€</p>
        <p><strong>Concepto:</strong> ${pago.concepto}</p>
        <p>Gracias por su confianza.</p>
    `;
    // Aquí podríamos adjuntar el PDF generado
    return sendEmail(residente.email, subject, html); // Asumimos que residente tiene email
};

module.exports = {
    sendEmail,
    reloadConfig: createTransporter,
    sendPaymentReceipt
};
