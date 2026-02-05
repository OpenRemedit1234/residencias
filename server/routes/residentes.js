const express = require('express');
const router = express.Router();
const { Residente } = require('../database/connection');
const { Op } = require('sequelize');
const { authMiddleware } = require('./auth');

// Listar residentes
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '' } = req.query;
        const offset = (page - 1) * limit;

        const whereClause = {};
        if (search) {
            whereClause[Op.or] = [
                { nombre: { [Op.like]: `%${search}%` } },
                { apellidos: { [Op.like]: `%${search}%` } },
                { dni: { [Op.like]: `%${search}%` } }
            ];
        }

        const { count, rows } = await Residente.findAndCountAll({
            where: whereClause,
            limit: parseInt(limit),
            offset: parseInt(offset),
            order: [['apellidos', 'ASC'], ['nombre', 'ASC']]
        });

        res.json({
            data: rows,
            pagination: {
                total: count,
                page: parseInt(page),
                totalPages: Math.ceil(count / limit)
            }
        });
    } catch (error) {
        console.error('Error al obtener residentes:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener un residente por ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const residente = await Residente.findByPk(req.params.id);
        if (!residente) {
            return res.status(404).json({ message: 'Residente no encontrado' });
        }
        res.json(residente);
    } catch (error) {
        console.error('Error al obtener residente:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Crear nuevo residente
router.post('/', authMiddleware, async (req, res) => {
    try {
        const nuevoResidente = await Residente.create(req.body);
        res.status(201).json(nuevoResidente);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El DNI ya existe' });
        }
        console.error('Error al crear residente:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Actualizar residente
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const residente = await Residente.findByPk(req.params.id);
        if (!residente) {
            return res.status(404).json({ message: 'Residente no encontrado' });
        }
        await residente.update(req.body);
        res.json(residente);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El DNI ya existe' });
        }
        console.error('Error al actualizar residente:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Eliminar residente
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const residente = await Residente.findByPk(req.params.id);
        if (!residente) {
            return res.status(404).json({ message: 'Residente no encontrado' });
        }
        await residente.destroy();
        res.json({ message: 'Residente eliminado' });
    } catch (error) {
        console.error('Error al eliminar residente:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
