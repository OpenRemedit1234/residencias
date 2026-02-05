const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Usuario } = require('../database/connection');

const JWT_SECRET = process.env.JWT_SECRET || 'secret-key-change-in-production';

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Buscar usuario
        const usuario = await Usuario.findOne({ where: { username, activo: true } });

        if (!usuario) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Verificar contraseña
        const passwordValida = await bcrypt.compare(password, usuario.password_hash);

        if (!passwordValida) {
            return res.status(401).json({ message: 'Usuario o contraseña incorrectos' });
        }

        // Actualizar último login
        await usuario.update({ last_login: new Date() });

        // Generar token
        const token = jwt.sign(
            { id: usuario.id, username: usuario.username, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: usuario.id,
                username: usuario.username,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        console.error('Error en login:', error);
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Middleware de autenticación
const authMiddleware = (req, res, next) => {
    let token = req.headers.authorization?.split(' ')[1];

    // Soporte para token por query param (útil para window.open en PDFs)
    if (!token && req.query.token) {
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'No autorizado' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido' });
    }
};

// Obtener usuario actual
router.get('/me', authMiddleware, async (req, res) => {
    try {
        const usuario = await Usuario.findByPk(req.user.id, {
            attributes: ['id', 'username', 'email', 'rol']
        });

        res.json(usuario);
    } catch (error) {
        res.status(500).json({ message: 'Error en el servidor' });
    }
});

// Registro de usuarios (Protegido, solo admin debería poder)
router.post('/register', authMiddleware, async (req, res) => {
    try {
        const { username, password, email, rol } = req.body;

        // Verificar si existe
        const existe = await Usuario.findOne({ where: { username } });
        if (existe) {
            return res.status(400).json({ message: 'El usuario ya existe' });
        }

        const password_hash = await bcrypt.hash(password, 10);

        const nuevoUsuario = await Usuario.create({
            username,
            password_hash,
            email,
            rol: rol || 'recepcionista'
        });

        res.status(201).json({
            message: 'Usuario creado',
            user: { id: nuevoUsuario.id, username: nuevoUsuario.username }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando usuario' });
    }
});

// Listar usuarios
router.get('/users', authMiddleware, async (req, res) => {
    try {
        const usuarios = await Usuario.findAll({
            attributes: ['id', 'username', 'email', 'rol', 'activo', 'last_login']
        });
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error obteniendo usuarios' });
    }
});

// Eliminar usuario
router.delete('/users/:id', authMiddleware, async (req, res) => {
    try {
        if (req.user.id == req.params.id) {
            return res.status(400).json({ message: 'No puedes eliminarte a ti mismo' });
        }
        await Usuario.destroy({ where: { id: req.params.id } });
        res.json({ message: 'Usuario eliminado' });
    } catch (error) {
        res.status(500).json({ message: 'Error eliminando usuario' });
    }
});

module.exports = router;
module.exports.authMiddleware = authMiddleware;
