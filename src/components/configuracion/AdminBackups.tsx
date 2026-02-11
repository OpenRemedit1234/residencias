import { useState, useEffect } from 'react';

interface Backup {
    name: string;
    size: number;
    created_at: string;
}

export default function AdminBackups() {
    const [backups, setBackups] = useState<Backup[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchBackups();
    }, []);

    const fetchBackups = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:3001/api/backups', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setBackups(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleCreateBackup = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:3001/api/backups', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Backup creado correctamente');
                fetchBackups();
            } else {
                alert('Error creando backup');
            }
        } catch (error) {
            alert('Error conectando con servidor');
        } finally {
            setLoading(false);
        }
    };

    const handleRestore = async (filename: string) => {
        if (!window.confirm('⚠️ ADVERTENCIA: Restaurar un backup sobrescribirá los datos actuales. Se recomienda crear un backup antes. ¿Continuar?')) return;

        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:3001/api/backups/restore/${filename}`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                alert('Sistema restaurado con éxito. Por favor reinicie la aplicación si es necesario.');
            } else {
                alert('Error al restaurar');
            }
        } catch (error) {
            alert('Error de conexión');
        }
    };

    const handleDownload = (filename: string) => {
        const token = localStorage.getItem('token');
        window.open(`http://127.0.0.1:3001/api/backups/download/${filename}?token=${token}`, '_blank');
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h2 className="text-lg font-bold text-neutral-800">Copias de Seguridad</h2>
                    <p className="text-sm text-neutral-500">Gestione los backups de la base de datos (SQLite)</p>
                </div>
                <button
                    onClick={handleCreateBackup}
                    disabled={loading}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                >
                    {loading ? 'Creando...' : 'Crear Backup Ahora'}
                </button>
            </div>

            <div className="space-y-2">
                {backups.length === 0 ? (
                    <div className="text-neutral-500 text-center py-4">No hay backups disponibles</div>
                ) : (
                    backups.map(backup => (
                        <div key={backup.name} className="flex justify-between items-center p-3 bg-neutral-50 rounded border border-neutral-100 hover:bg-neutral-100">
                            <div>
                                <div className="font-medium text-neutral-800">{backup.name}</div>
                                <div className="text-xs text-neutral-500">
                                    {(backup.size / 1024).toFixed(2)} KB • {new Date(backup.created_at).toLocaleString()}
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleDownload(backup.name)}
                                    className="text-blue-600 text-sm hover:underline"
                                >
                                    Descargar
                                </button>
                                <button
                                    onClick={() => handleRestore(backup.name)}
                                    className="text-red-600 text-sm hover:underline ml-2"
                                >
                                    Restaurar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
