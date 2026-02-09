const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Importar rutas del servidor
const authRoutes = require('./routes/auth');
const residentesRoutes = require('./routes/residentes');
const habitacionesRoutes = require('./routes/habitaciones');
const apartamentosRoutes = require('./routes/apartamentos');
const reservasRoutes = require('./routes/reservas');
const pagosRoutes = require('./routes/pagos');
const configuracionRoutes = require('./routes/configuracion');
const festivosRoutes = require('./routes/festivos');
const backupsRoutes = require('./routes/backups');
const reportesRoutes = require('./routes/reportes');

// Rutas API
app.use('/api/auth', authRoutes);
app.use('/api/residentes', residentesRoutes);
app.use('/api/habitaciones', habitacionesRoutes);
app.use('/api/apartamentos', apartamentosRoutes);
app.use('/api/reservas', reservasRoutes);
app.use('/api/pagos', pagosRoutes);
app.use('/api/configuracion', configuracionRoutes);
app.use('/api/festivos', festivosRoutes);
app.use('/api/backups', backupsRoutes);
app.use('/api/reportes', reportesRoutes);

// Inicializar base de datos
const db = require('./database/connection');
const bcrypt = require('bcryptjs');

db.sequelize.sync()
    .then(async () => {
        console.log('Base de datos SQLite sincronizada');

        // Crear usuario admin por defecto si no hay usuarios
        const count = await db.Usuario.count();
        if (count === 0) {
            const passwordHash = await bcrypt.hash('admin123', 10);
            await db.Usuario.create({
                username: 'admin',
                password_hash: passwordHash,
                email: 'admin@residencia.com',
                rol: 'administrador',
                activo: true
            });
            console.log('Usuario administrador por defecto creado: admin / admin123');
        }

        app.listen(PORT, () => {
            console.log(`Servidor API corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error al inicializar base de datos:', err);
    });
