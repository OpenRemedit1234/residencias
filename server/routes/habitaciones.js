const express = require('express');
const router = express.Router();
const { Habitacion } = require('../database/connection');
const { Op } = require('sequelize');
const { authMiddleware } = require('./auth');

// Listar habitaciones
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { estado, tipo, search } = req.query;
        const whereClause = {};

        if (estado && estado !== 'todos') whereClause.estado = estado;
        if (tipo && tipo !== 'todos') whereClause.tipo = tipo;

        if (search) {
            whereClause[Op.or] = [
                { numero: { [Op.like]: `%${search}%` } },
                { nombre: { [Op.like]: `%${search}%` } }
            ];
        }

        const habitaciones = await Habitacion.findAll({
            where: whereClause,
            order: [['numero', 'ASC']]
        });

        res.json(habitaciones);
    } catch (error) {
        console.error('Error al obtener habitaciones:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener una habitación
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const habitacion = await Habitacion.findByPk(req.params.id);
        if (!habitacion) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }
        res.json(habitacion);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Crear habitación
router.post('/', authMiddleware, async (req, res) => {
    try {
        const nuevaHabitacion = await Habitacion.create(req.body);
        res.status(201).json(nuevaHabitacion);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El número de habitación ya existe' });
        }
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Actualizar habitación
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const habitacion = await Habitacion.findByPk(req.params.id);
        if (!habitacion) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }
        await habitacion.update(req.body);
        res.json(habitacion);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El número de habitación ya existe' });
        }
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Cambiar estado
router.patch('/:id/estado', authMiddleware, async (req, res) => {
    try {
        const { estado } = req.body;
        const habitacion = await Habitacion.findByPk(req.params.id);
        if (!habitacion) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }
        await habitacion.update({ estado });
        res.json(habitacion);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Eliminar habitación
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const habitacion = await Habitacion.findByPk(req.params.id);
        if (!habitacion) {
            return res.status(404).json({ message: 'Habitación no encontrada' });
        }
        await habitacion.destroy();
        res.json({ message: 'Habitación eliminada' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
