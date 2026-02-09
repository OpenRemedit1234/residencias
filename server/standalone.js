const express = require('express');
const cors = require('cors');
const path = require('path');
const { sequelize } = require('./database/connection');

// Importar rutas
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

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

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

// Inicializar DB y arrancar
sequelize.sync({ alter: true })
    .then(() => {
        console.log('✓ Base de datos sincronizada');
        app.listen(PORT, () => {
            console.log(`✓ Servidor API corriendo en http://localhost:${PORT}`);
        });
    })
    .catch(err => {
        console.error('✗ Error al sincronizar DB:', err);
    });
