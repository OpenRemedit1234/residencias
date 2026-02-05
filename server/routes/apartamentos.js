const express = require('express');
const router = express.Router();
const { Apartamento } = require('../database/connection');
const { Op } = require('sequelize');
const { authMiddleware } = require('./auth');

// Listar apartamentos
router.get('/', authMiddleware, async (req, res) => {
    try {
        const { estado, search } = req.query;
        const whereClause = {};

        if (estado && estado !== 'todos') whereClause.estado = estado;

        if (search) {
            whereClause[Op.or] = [
                { numero: { [Op.like]: `%${search}%` } },
                { nombre: { [Op.like]: `%${search}%` } }
            ];
        }

        const apartamentos = await Apartamento.findAll({
            where: whereClause,
            order: [['numero', 'ASC']]
        });

        res.json(apartamentos);
    } catch (error) {
        console.error('Error al obtener apartamentos:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Obtener un apartamento
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const apartamento = await Apartamento.findByPk(req.params.id);
        if (!apartamento) {
            return res.status(404).json({ message: 'Apartamento no encontrado' });
        }
        res.json(apartamento);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Crear apartamento
router.post('/', authMiddleware, async (req, res) => {
    try {
        const nuevoApartamento = await Apartamento.create(req.body);
        res.status(201).json(nuevoApartamento);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El número de apartamento ya existe' });
        }
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Actualizar apartamento
router.put('/:id', authMiddleware, async (req, res) => {
    try {
        const apartamento = await Apartamento.findByPk(req.params.id);
        if (!apartamento) {
            return res.status(404).json({ message: 'Apartamento no encontrado' });
        }
        await apartamento.update(req.body);
        res.json(apartamento);
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: 'El número de apartamento ya existe' });
        }
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Cambiar estado
router.patch('/:id/estado', authMiddleware, async (req, res) => {
    try {
        const { estado } = req.body;
        const apartamento = await Apartamento.findByPk(req.params.id);
        if (!apartamento) {
            return res.status(404).json({ message: 'Apartamento no encontrado' });
        }
        await apartamento.update({ estado });
        res.json(apartamento);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Eliminar apartamento
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const apartamento = await Apartamento.findByPk(req.params.id);
        if (!apartamento) {
            return res.status(404).json({ message: 'Apartamento no encontrado' });
        }
        await apartamento.destroy();
        res.json({ message: 'Apartamento eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
