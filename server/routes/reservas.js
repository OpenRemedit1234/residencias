const express = require('express');
const router = express.Router();
const { Reserva, Residente, Habitacion, Apartamento } = require('../database/connection');
const { Op } = require('sequelize');
const { authMiddleware } = require('./auth');

// Listar reservas
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { estado, fecha_inicio, fecha_fin, search } = req.query;
        const whereClause = {};

        if (estado && estado !== 'todas') whereClause.estado = estado;

        if (fecha_inicio && fecha_fin) {
            whereClause.fecha_entrada = { [Op.gte]: fecha_inicio };
            whereClause.fecha_salida = { [Op.lte]: fecha_fin };
        }

        const includeOptions = [
            { model: Residente, as: 'residente' },
            { model: Habitacion, as: 'habitacion' },
            { model: Apartamento, as: 'apartamento' }
        ];

        // Filtro de búsqueda por nombre de residente
        if (search) {
            includeOptions[0].where = {
                [Op.or]: [
                    { nombre: { [Op.like]: `%${search}%` } },
                    { apellidos: { [Op.like]: `%${search}%` } }
                ]
            };
        }

        const reservas = await Reserva.findAll({
            where: whereClause,
            include: includeOptions,
            order: [['fecha_entrada', 'ASC']]
        });

        res.json(reservas);
    } catch (error) {
        console.error('Error al obtener reservas:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener una reserva
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id, {
            include: [
                { model: Residente, as: 'residente' },
                { model: Habitacion, as: 'habitacion' },
                { model: Apartamento, as: 'apartamento' }
            ]
        });
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Función para verificar disponibilidad
async function verificarDisponibilidad(fechaEntrada, fechaSalida, tipo, idAlojamiento, excludeReservaId = null) {
    const whereClause = {
        estado: { [Op.notIn]: ['cancelada', 'completada'] }, // Solo considerar activas o pendientes
        [Op.or]: [
            {
                fecha_entrada: { [Op.between]: [fechaEntrada, fechaSalida] }
            },
            {
                fecha_salida: { [Op.between]: [fechaEntrada, fechaSalida] }
            },
            {
                [Op.and]: [
                    { fecha_entrada: { [Op.lte]: fechaEntrada } },
                    { fecha_salida: { [Op.gte]: fechaSalida } }
                ]
            }
        ]
    };

    if (tipo === 'habitacion') {
        whereClause.habitacion_id = idAlojamiento;
    } else {
        whereClause.apartamento_id = idAlojamiento;
    }

    if (excludeReservaId) {
        whereClause.id = { [Op.ne]: excludeReservaId };
    }

    const solapamientos = await Reserva.count({ where: whereClause });
    return solapamientos === 0;
}

// Crear reserva
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { residente_id, habitacion_id, apartamento_id, fecha_entrada, fecha_salida, numero_personas, precio_total, observaciones } = req.body;

        // Validaciones básicas
        if (!residente_id || (!habitacion_id && !apartamento_id) || !fecha_entrada || !fecha_salida) {
            return res.status(400).json({ message: 'Faltan campos obligatorios' });
        }

        if (new Date(fecha_entrada) >= new Date(fecha_salida)) {
            return res.status(400).json({ message: 'La fecha de entrada debe ser anterior a la de salida' });
        }

        // Verificar disponibilidad
        const tipo = habitacion_id ? 'habitacion' : 'apartamento';
        const idAlojamiento = habitacion_id || apartamento_id;

        const disponible = await verificarDisponibilidad(fecha_entrada, fecha_salida, tipo, idAlojamiento);

        if (!disponible) {
            return res.status(409).json({ message: 'El alojamiento no está disponible en las fechas seleccionadas' });
        }

        // Verificar capacidad máxima
        let capacidadMaxima = 0;
        if (habitacion_id) {
            const h = await Habitacion.findByPk(habitacion_id);
            capacidadMaxima = h ? h.capacidad : 0;
        } else if (apartamento_id) {
            const a = await Apartamento.findByPk(apartamento_id);
            capacidadMaxima = a ? a.capacidad : 0;
        }

        if (numero_personas > capacidadMaxima) {
            return res.status(400).json({ message: `La capacidad máxima de este alojamiento es de ${capacidadMaxima} personas` });
        }

        const nuevaReserva = await Reserva.create({
            residente_id,
            habitacion_id,
            apartamento_id,
            fecha_entrada,
            fecha_salida,
            numero_personas,
            precio_total,
            observaciones,
            estado: 'pendiente'
        });

        res.status(201).json(nuevaReserva);
    } catch (error) {
        console.error('Error al crear reserva:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Actualizar reserva
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        const { fecha_entrada, fecha_salida, habitacion_id, apartamento_id, numero_personas } = req.body;

        // Si cambia el número de personas, verificar capacidad
        if (numero_personas !== undefined || habitacion_id !== undefined || apartamento_id !== undefined) {
            const nPersonas = numero_personas !== undefined ? numero_personas : reserva.numero_personas;
            const hId = habitacion_id !== undefined ? habitacion_id : reserva.habitacion_id;
            const aId = apartamento_id !== undefined ? apartamento_id : reserva.apartamento_id;

            let capacidadMax = 0;
            if (hId) {
                const h = await Habitacion.findByPk(hId);
                capacidadMax = h ? h.capacidad : 0;
            } else if (aId) {
                const a = await Apartamento.findByPk(aId);
                capacidadMax = a ? a.capacidad : 0;
            }

            if (nPersonas > capacidadMax) {
                return res.status(400).json({ message: `La capacidad máxima de este alojamiento es de ${capacidadMax} personas` });
            }
        }

        // Si cambian fechas o alojamiento, verificar disponibilidad
        if (fecha_entrada || fecha_salida || habitacion_id !== undefined || apartamento_id !== undefined) {
            const nuevaEntrada = fecha_entrada || reserva.fecha_entrada;
            const nuevaSalida = fecha_salida || reserva.fecha_salida;
            const nuevoHabId = habitacion_id !== undefined ? habitacion_id : reserva.habitacion_id;
            const nuevoAptId = apartamento_id !== undefined ? apartamento_id : reserva.apartamento_id;

            const tipo = nuevoHabId ? 'habitacion' : 'apartamento';
            const idAlojamiento = nuevoHabId || nuevoAptId;

            if (new Date(nuevaEntrada) >= new Date(nuevaSalida)) {
                return res.status(400).json({ message: 'La fecha de entrada debe ser anterior a la de salida' });
            }

            const disponible = await verificarDisponibilidad(nuevaEntrada, nuevaSalida, tipo, idAlojamiento, reserva.id);
            if (!disponible) {
                return res.status(409).json({ message: 'El alojamiento no está disponible en las nuevas fechas' });
            }
        }

        await reserva.update(req.body);
        res.json(reserva);
    } catch (error) {
        console.error('Error al actualizar reserva:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Cambiar estado
router.patch('/:id/estado', authMiddleware, async (req, res) => {
    try {
        const { estado } = req.body;
        const reserva = await Reserva.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        await reserva.update({ estado });
        res.json(reserva);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Eliminar reserva
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id);
        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }
        await reserva.destroy();
        res.json({ message: 'Reserva eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Generar Proforma PDF
router.get('/:id/proforma', authMiddleware, async (req, res) => {
    try {
        const reserva = await Reserva.findByPk(req.params.id, {
            include: [
                { model: Residente, as: 'residente' },
                { model: Habitacion, as: 'habitacion' },
                { model: Apartamento, as: 'apartamento' }
            ]
        });

        if (!reserva) {
            return res.status(404).json({ message: 'Reserva no encontrada' });
        }

        const { generateProformaPDF } = require('../services/pdfGenerator');

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=proforma_${reserva.id}.pdf`);

        generateProformaPDF(reserva, res);
    } catch (error) {
        console.error('Error generando Proforma PDF:', error);
        res.status(500).json({ message: 'Error generando PDF' });
    }
});

module.exports = router;
