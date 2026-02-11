const db = require('./server/database/connection');
const bcrypt = require('bcryptjs');

async function checkAdmin() {
    try {
        await db.sequelize.sync();
        const user = await db.Usuario.findOne({ where: { username: 'admin' } });
        if (user) {
            console.log('Usuario admin encontrado:', user.username);
            const valid = await bcrypt.compare('admin123', user.password_hash);
            console.log('Contraseña admin123 válida:', valid);
        } else {
            console.log('Usuario admin NO encontrado. Creándolo...');
            const passwordHash = await bcrypt.hash('admin123', 10);
            await db.Usuario.create({
                username: 'admin',
                password_hash: passwordHash,
                email: 'admin@residencia.com',
                rol: 'administrador',
                activo: true
            });
            console.log('Usuario admin creado con éxito.');
        }
    } catch (err) {
        console.error('Error verificando admin:', err);
    } finally {
        process.exit();
    }
}

checkAdmin();
