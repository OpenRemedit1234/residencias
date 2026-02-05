const express = require('express');
const router = express.Router();
const { Configuracion } = require('../database/connection');
const { authMiddleware } = require('./auth');
const { reloadConfig } = require('../services/mailer');

// Obtener configuración (si no existe, crea una por defecto)
router.get('/', authMiddleware, async (req, res) => {
    try {
        let config = await Configuracion.findOne();
        if (!config) {
            config = await Configuracion.create({});
        }
        res.json(config);
    } catch (error) {
        console.error('Error obteniendo configuración:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Actualizar configuración
router.put('/', authMiddleware, async (req, res) => {
    try {
        let config = await Configuracion.findOne();
        if (!config) {
            config = await Configuracion.create({});
        }

        await config.update(req.body);

        // Recargar configuración del mailer si cambiaron parámetros SMTP
        reloadConfig();

        res.json(config);
    } catch (error) {
        console.error('Error actualizando configuración:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

module.exports = router;
