const express = require('express');
const router = express.Router();
const { Festivo } = require('../database/connection');
const { Op } = require('sequelize');
const { authMiddleware } = require('./auth');

// Listar festivos por año
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { anio } = req.query;
        const whereClause = {};

        if (anio) {
            whereClause.anio = anio;
        } else {
            // Por defecto el año actual
            whereClause.anio = new Date().getFullYear();
        }

        const festivos = await Festivo.findAll({
            where: whereClause,
            order: [['fecha', 'ASC']]
        });

        res.json(festivos);
    } catch (error) {
        console.error('Error al obtener festivos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Crear festivo
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { fecha, nombre, tipo } = req.body;

        if (!fecha || !nombre) {
            return res.status(400).json({ message: 'Fecha y nombre son obligatorios' });
        }

        const anio = new Date(fecha).getFullYear();

        const nuevoFestivo = await Festivo.create({
            fecha,
            nombre,
            tipo: tipo || 'personalizado',
            anio
        });

        res.status(201).json(nuevoFestivo);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'Ya existe un festivo en esa fecha' });
        }
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Eliminar festivo
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const festivo = await Festivo.findByPk(req.params.id);
        if (!festivo) {
            return res.status(404).json({ message: 'Festivo no encontrado' });
        }
        await festivo.destroy();
        res.json({ message: 'Festivo eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
