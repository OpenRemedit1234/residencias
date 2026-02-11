import { useState, useEffect } from 'react';

interface Usuario {
    id: number;
    username: string;
    rol: string;
    activo: boolean;
    last_login?: string;
}

export default function AdminUsuarios() {
    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ username: '', password: '', rol: 'recepcionista' });

    useEffect(() => {
        fetchUsuarios();
    }, []);

    const fetchUsuarios = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:3001/api/auth/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setUsuarios(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && usuarios.length === 0) {
        return <div className="text-center p-4 text-neutral-500">Cargando usuarios...</div>;
    }

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Eliminar usuario?')) return;
        try {
            const token = localStorage.getItem('token');
            await fetch(`http://127.0.0.1:3001/api/auth/users/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            fetchUsuarios();
        } catch (error) {
            alert('Error eliminando usuario');
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            });

            if (res.ok) {
                setShowForm(false);
                setFormData({ username: '', password: '', rol: 'recepcionista' });
                fetchUsuarios();
            } else {
                alert('Error creando usuario');
            }
        } catch (error) {
            alert('Error creando usuario');
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-neutral-50 flex justify-between items-center bg-neutral-50/30">
                <div>
                    <h2 className="text-xl font-black text-neutral-800">Cuentas de Acceso</h2>
                    <p className="text-sm text-neutral-400 mt-1 font-medium">Gestione quién tiene acceso al sistema y sus permisos.</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="bg-primary-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-primary-200 hover:bg-primary-700 hover:scale-105 transition-all"
                    >
                        + Crear Nuevo Usuario
                    </button>
                )}
            </div>

            {showForm && (
                <div className="p-8 bg-neutral-50/50 border-b border-neutral-100 animate-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleCreate} className="max-w-4xl grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Nombre de Usuario</label>
                            <input
                                type="text"
                                value={formData.username}
                                onChange={e => setFormData({ ...formData, username: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                placeholder="Ej: jsmith"
                                required
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Contraseña Temporal</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-2">Nivel de Acceso</label>
                            <select
                                value={formData.rol}
                                onChange={e => setFormData({ ...formData, rol: e.target.value })}
                                className="w-full px-4 py-3 bg-white border border-neutral-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-primary-500 transition-all outline-none cursor-pointer"
                            >
                                <option value="administrador">Administrador</option>
                                <option value="recepcionista">Recepcionista</option>
                                <option value="mantenimiento">Mantenimiento</option>
                                <option value="contable">Contable</option>
                            </select>
                        </div>
                        <div className="flex gap-3">
                            <button type="submit" className="flex-1 bg-neutral-800 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-black transition-colors shadow-lg shadow-neutral-200">
                                Guardar Acceso
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="px-4 py-3 text-neutral-400 font-bold text-sm hover:text-neutral-600">
                                Cancelar
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-neutral-100">
                    <thead className="bg-neutral-50/50">
                        <tr>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">Estado</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">Usuario</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">Permisos</th>
                            <th className="px-8 py-4 text-left text-[10px] font-black text-neutral-400 uppercase tracking-widest">Última Entrada</th>
                            <th className="px-8 py-4 text-right text-[10px] font-black text-neutral-400 uppercase tracking-widest">Opciones</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-50">
                        {usuarios.map(user => (
                            <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group">
                                <td className="px-8 py-5 flex items-center gap-2">
                                    <span className={`w-2 h-2 rounded-full ${user.activo ? 'bg-emerald-500 animate-pulse' : 'bg-neutral-300'}`}></span>
                                    <span className="text-xs font-bold text-neutral-500">{user.activo ? 'Activo' : 'Inactivo'}</span>
                                </td>
                                <td className="px-8 py-5 text-sm font-black text-neutral-800">{user.username}</td>
                                <td className="px-8 py-5">
                                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${user.rol === 'administrador' ? 'bg-primary-100 text-primary-700' :
                                            user.rol === 'recepcionista' ? 'bg-blue-100 text-blue-700' : 'bg-neutral-100 text-neutral-600'
                                        }`}>
                                        {user.rol}
                                    </span>
                                </td>
                                <td className="px-8 py-5 text-sm font-medium text-neutral-400">
                                    {user.last_login ? new Date(user.last_login).toLocaleString('es-ES', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : 'Nunca ha entrado'}
                                </td>
                                <td className="px-8 py-5 text-right opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => handleDelete(user.id)} className="text-red-400 hover:text-red-600 font-bold text-xs flex items-center gap-1 ml-auto">
                                        <span>🗑️</span> Desactivar Cuenta
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
