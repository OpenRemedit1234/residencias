import { useState, useEffect } from 'react';

export default function AdminEmpresa() {
    const [config, setConfig] = useState({
        empresa_nombre: '',
        empresa_direccion: '',
        empresa_cif: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:3001/api/configuracion', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data) {
                setConfig({
                    empresa_nombre: data.empresa_nombre || '',
                    empresa_direccion: data.empresa_direccion || '',
                    empresa_cif: data.empresa_cif || ''
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setConfig(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:3001/api/configuracion', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });

            if (!res.ok) throw new Error('Error guardando datos');

            setMessage({ type: 'success', text: 'Datos de empresa guardados' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al guardar' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-neutral-100 overflow-hidden animate-in fade-in duration-500">
            <div className="p-8 border-b border-neutral-50 bg-neutral-50/30">
                <h2 className="text-xl font-black text-neutral-800">Identidad Corporativa</h2>
                <p className="text-sm text-neutral-400 mt-1 font-medium">Configure los datos legales y comerciales que aparecerán en sus documentos.</p>
            </div>

            <div className="p-8">
                {message && (
                    <div className={`p-4 mb-8 rounded-xl text-sm font-bold flex items-center gap-3 animate-in zoom-in duration-300 ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
                        <span>{message.type === 'success' ? '✅' : '❌'}</span>
                        {message.text}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Nombre Comercial del Centro</label>
                            <input
                                type="text"
                                name="empresa_nombre"
                                value={config.empresa_nombre}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-lg font-black text-neutral-800 focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all outline-none"
                                placeholder="Ej: Residencia Santa María"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">CIF / NIF Legal</label>
                            <input
                                type="text"
                                name="empresa_cif"
                                value={config.empresa_cif}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold text-neutral-800 focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all outline-none"
                                placeholder="B-12345678"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-black text-neutral-400 uppercase tracking-widest mb-3">Dirección de Facturación</label>
                            <input
                                type="text"
                                name="empresa_direccion"
                                value={config.empresa_direccion}
                                onChange={handleChange}
                                className="w-full px-5 py-4 bg-neutral-50 border border-neutral-100 rounded-2xl text-sm font-bold text-neutral-800 focus:ring-4 focus:ring-primary-500/10 focus:bg-white transition-all outline-none"
                                placeholder="Calle Mayor 1, 28001 Madrid"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-neutral-50">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-neutral-800 text-white px-10 py-4 rounded-2xl font-black text-sm hover:bg-black disabled:opacity-50 transition-all shadow-xl shadow-neutral-200 active:scale-95"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></span>
                                    Guardando cambios...
                                </span>
                            ) : 'Actualizar Perfil de Empresa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
