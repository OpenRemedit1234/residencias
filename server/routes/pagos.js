const express = require('express');
const router = express.Router();
const { Pago, Residente, Reserva } = require('../database/connection');
const { Op } = require('sequelize');
const { authMiddleware } = require('./auth');

// Listar pagos
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { residente_id, fecha_inicio, fecha_fin, estado } = req.query;
        const whereClause = {};

        if (residente_id) whereClause.residente_id = residente_id;
        if (estado && estado !== 'todos') whereClause.estado = estado;

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_pago = { [Op.between]: [fecha_inicio, fecha_fin] };
        }

        const pagos = await Pago.findAll({
            where: whereClause,
            include: [
                { model: Residente, as: 'residente', attributes: ['nombre', 'apellidos', 'dni'] },
                { model: Reserva, as: 'reserva', attributes: ['id', 'precio_total'] }
            ],
            order: [['fecha_pago', 'DESC']]
        });

        res.json(pagos);
    } catch (error) {
        console.error('Error al obtener pagos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener un pago
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id, {
            include: [
                { model: Residente, as: 'residente' },
                { model: Reserva, as: 'reserva' }
            ]
        });
        if (!pago) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }
        res.json(pago);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Crear pago
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { residente_id, reserva_id, monto, metodo_pago, fecha_pago, concepto, observaciones, estado } = req.body;

        if (!residente_id || !monto || !metodo_pago || !fecha_pago) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        const nuevoPago = await Pago.create({
            residente_id,
            reserva_id,
            monto,
            metodo_pago,
            fecha_pago,
            concepto,
            observaciones,
            estado: estado || 'completado'
        });

        res.status(201).json(nuevoPago);
    } catch (error) {
        console.error('Error al crear pago:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Actualizar pago
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id);
        if (!pago) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }
        await pago.update(req.body);
        res.json(pago);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Eliminar pago
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id);
        if (!pago) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }
        await pago.destroy();
        res.json({ message: 'Pago eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Generar PDF
router.get('/:id/pdf', authMiddleware, async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id, {
            include: [{ model: Residente, as: 'residente' }]
        });

        if (!pago) {
            return res.status(404).json({ message: 'Pago no encontrado' });
        }

        const { generateInvoicePDF } = require('../services/pdfGenerator');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=recibo_${pago.id}.pdf`);

        generateInvoicePDF(pago, res);
    } catch (error) {
        console.error('Error generando PDF:', error);
        res.status(500).json({ message: 'Error generando PDF' });
    }
});

// Enviar Email
router.post('/:id/email', authMiddleware, async (req, res) => {
    try {
        const pago = await Pago.findByPk(req.params.id, {
            include: [{ model: Residente, as: 'residente' }]
        });

        if (!pago) return res.status(404).json({ message: 'Pago no encontrado' });
        if (!pago.residente || !pago.residente.email) {
            // Asumimos que el modelo residente tiene email. Si no, habría que añadirlo.
            // Por ahora, si no tiene, error.
            if (!pago.residente.email) {
                // Vamos a simular que tiene email si no existe columna, para no romper.
                // En un caso real, añadir columna email a Residente
                return res.status(400).json({ message: 'El residente no tiene email registrado' });
            }
        }

        const { sendPaymentReceipt } = require('../services/mailer');
        await sendPaymentReceipt(pago, pago.residente);

        res.json({ message: 'Email enviado correctamente' });
    } catch (error) {
        console.error('Error enviando email:', error);
        res.status(500).json({ message: 'Error enviando email: ' + error.message });
    }
});

module.exports = router;
