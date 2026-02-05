const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const { authMiddleware } = require('./auth');

const BACKUP_DIR = path.join(__dirname, '../backups');
const DB_PATH = path.join(__dirname, '../database.sqlite'); // Asumiendo ubicación

// Asegurar que existe dir
if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Listar backups
router.get('/', authMiddleware, (req, res) => {
    try {
        const files = fs.readdirSync(BACKUP_DIR)
            .filter(file => file.endsWith('.sqlite'))
            .map(file => {
                const stats = fs.statSync(path.join(BACKUP_DIR, file));
                return {
                    name: file,
                    size: stats.size,
                    created_at: stats.birthtime
                };
            })
            .sort((a, b) => b.created_at - a.created_at);

        res.json(files);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error listando backups' });
    }
});

// Crear backup
router.post('/', authMiddleware, (req, res) => {
    try {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const filename = `backup-${timestamp}.sqlite`;
        const dest = path.join(BACKUP_DIR, filename);

        fs.copyFileSync(DB_PATH, dest);

        res.json({ message: 'Backup creado correctamente', filename });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creando backup' });
    }
});

// Descargar backup
router.get('/download/:filename', authMiddleware, (req, res) => {
    const filePath = path.join(BACKUP_DIR, req.params.filename);
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ message: 'Archivo no encontrado' });
    }
});

// Restaurar backup (PELIGROSO)
router.post('/restore/:filename', authMiddleware, (req, res) => {
    try {
        const source = path.join(BACKUP_DIR, req.params.filename);
        if (!fs.existsSync(source)) {
            return res.status(404).json({ message: 'Backup no encontrado' });
        }

        // Hacemos backup automático del actual antes de restaurar por seguridad
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        fs.copyFileSync(DB_PATH, path.join(BACKUP_DIR, `pre-restore-${timestamp}.sqlite`));

        // Copiar encima
        fs.copyFileSync(source, DB_PATH);

        res.json({ message: 'Base de datos restaurada. Se recomienda reiniciar el servidor.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error restaurando backup' });
    }
});

module.exports = router;
