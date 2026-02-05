const bcrypt = require('bcryptjs');
const {
    Usuario,
    Habitacion,
    Apartamento,
    ConfiguracionEmpresa,
    ConfiguracionSistema,
    Festivo
} = require('./connection');

async function seed() {
    try {
        console.log('Iniciando seeds...');

        // Crear usuario administrador por defecto
        const passwordHash = await bcrypt.hash('admin123', 10);

        await Usuario.findOrCreate({
            where: { username: 'admin' },
            defaults: {
                username: 'admin',
                password_hash: passwordHash,
                email: 'admin@residencia.com',
                rol: 'administrador',
                activo: true
            }
        });
        console.log('✓ Usuario admin creado');

        // Crear habitaciones de ejemplo
        const habitaciones = [
            { numero: '101', nombre: 'Habitación 101', tipo: 'Individual', capacidad: 1, precio_noche: 25.00, estado: 'disponible', descripcion: 'Habitación individual con baño privado', servicios: 'WiFi, TV, Baño privado' },
            { numero: '102', nombre: 'Habitación 102', tipo: 'Doble', capacidad: 2, precio_noche: 40.00, estado: 'disponible', descripcion: 'Habitación doble con dos camas', servicios: 'WiFi, TV, Baño privado' },
            { numero: '201', nombre: 'Habitación 201', tipo: 'Individual', capacidad: 1, precio_noche: 25.00, estado: 'disponible', descripcion: 'Habitación individual', servicios: 'WiFi, TV' },
            { numero: '202', nombre: 'Habitación 202', tipo: 'Triple', capacidad: 3, precio_noche: 55.00, estado: 'disponible', descripcion: 'Habitación triple', servicios: 'WiFi, TV, Baño privado' },
            { numero: '301', nombre: 'Habitación 301', tipo: 'Doble', capacidad: 2, precio_noche: 40.00, estado: 'disponible', descripcion: 'Habitación doble', servicios: 'WiFi, TV, Baño privado' },
        ];

        for (const hab of habitaciones) {
            await Habitacion.findOrCreate({
                where: { numero: hab.numero },
                defaults: hab
            });
        }
        console.log('✓ Habitaciones de ejemplo creadas');

        // Crear apartamentos de ejemplo
        const apartamentos = [
            { numero: 'A1', nombre: 'Apartamento A1', habitaciones: 1, banos: 1, metros_cuadrados: 45, precio_mes: 450.00, precio_noche: 35.00, estado: 'disponible', descripcion: 'Estudio con cocina equipada', servicios: 'WiFi, Cocina, Lavadora' },
            { numero: 'A2', nombre: 'Apartamento A2', habitaciones: 2, banos: 1, metros_cuadrados: 65, precio_mes: 650.00, precio_noche: 50.00, estado: 'disponible', descripcion: 'Apartamento de 2 habitaciones', servicios: 'WiFi, Cocina, Lavadora, Salón' },
        ];

        for (const apt of apartamentos) {
            await Apartamento.findOrCreate({
                where: { numero: apt.numero },
                defaults: apt
            });
        }
        console.log('✓ Apartamentos de ejemplo creados');

        // Crear configuración de empresa
        await ConfiguracionEmpresa.findOrCreate({
            where: { id: 1 },
            defaults: {
                nombre: 'Residencia Ejemplo',
                cif: 'B12345678',
                direccion: 'Calle Principal, 123, 28001 Madrid',
                telefono: '+34 912 345 678',
                email: 'info@residencia.com',
                logo_path: null
            }
        });
        console.log('✓ Configuración de empresa creada');

        // Crear configuración del sistema
        const configuraciones = [
            { clave: 'backup_automatico', valor: 'true', tipo: 'boolean', descripcion: 'Activar backups automáticos' },
            { clave: 'backup_frecuencia', valor: 'diario', tipo: 'string', descripcion: 'Frecuencia de backups: diario, semanal, mensual' },
            { clave: 'backup_hora', valor: '02:00', tipo: 'string', descripcion: 'Hora de ejecución de backup automático' },
            { clave: 'backup_retencion_dias', valor: '30', tipo: 'number', descripcion: 'Días de retención de backups' },
            { clave: 'email_habilitado', valor: 'false', tipo: 'boolean', descripcion: 'Habilitar envío de emails' },
            { clave: 'smtp_host', valor: '', tipo: 'string', descripcion: 'Servidor SMTP' },
            { clave: 'smtp_port', valor: '587', tipo: 'number', descripcion: 'Puerto SMTP' },
            { clave: 'smtp_user', valor: '', tipo: 'string', descripcion: 'Usuario SMTP' },
            { clave: 'smtp_password', valor: '', tipo: 'string', descripcion: 'Contraseña SMTP' },
            { clave: 'idioma', valor: 'es', tipo: 'string', descripcion: 'Idioma del sistema' },
            { clave: 'formato_fecha', valor: 'DD/MM/YYYY', tipo: 'string', descripcion: 'Formato de fecha' },
        ];

        for (const config of configuraciones) {
            await ConfiguracionSistema.findOrCreate({
                where: { clave: config.clave },
                defaults: config
            });
        }
        console.log('✓ Configuración del sistema creada');

        // Crear festivos nacionales 2026
        const festivos2026 = [
            { fecha: '2026-01-01', nombre: 'Año Nuevo', tipo: 'nacional', anio: 2026 },
            { fecha: '2026-01-06', nombre: 'Reyes Magos', tipo: 'nacional', anio: 2026 },
            { fecha: '2026-04-03', nombre: 'Viernes Santo', tipo: 'nacional', anio: 2026 },
            { fecha: '2026-05-01', nombre: 'Día del Trabajador', tipo: 'nacional', anio: 2026 },
            { fecha: '2026-08-15', nombre: 'Asunción de la Virgen', tipo: 'nacional', anio: 2026 },
            { fecha: '2026-10-12', nombre: 'Fiesta Nacional de España', tipo: 'nacional', anio: 2026 },
            { fecha: '2026-11-01', nombre: 'Todos los Santos', tipo: 'nacional', anio: 2026 },
            { fecha: '2026-12-06', nombre: 'Día de la Constitución', tipo: 'nacional', anio: 2026 },
            { fecha: '2026-12-08', nombre: 'Inmaculada Concepción', tipo: 'nacional', anio: 2026 },
            { fecha: '2026-12-25', nombre: 'Navidad', tipo: 'nacional', anio: 2026 },
        ];

        for (const festivo of festivos2026) {
            await Festivo.findOrCreate({
                where: { fecha: festivo.fecha },
                defaults: festivo
            });
        }
        console.log('✓ Festivos nacionales 2026 creados');

        console.log('\n✅ Seeds completados exitosamente');
    } catch (error) {
        console.error('❌ Error al ejecutar seeds:', error);
    }
}

module.exports = seed;

// Ejecutar si se llama directamente
if (require.main === module) {
    const { sequelize } = require('./connection');
    sequelize.sync({ alter: true })
        .then(() => seed())
        .then(() => process.exit(0))
        .catch(err => {
            console.error(err);
            process.exit(1);
        });
}
