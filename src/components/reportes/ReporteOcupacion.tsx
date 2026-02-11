import { useState, useEffect } from 'react';

export default function ReporteOcupacion() {
    const [data, setData] = useState<{ habitaciones: any[], apartamentos: any[] }>({ habitaciones: [], apartamentos: [] });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchOcupacion = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://127.0.0.1:3001/api/reportes/ocupacion', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const jsonData = await res.json();
                setData(jsonData);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchOcupacion();
    }, []);

    if (loading) return <div className="p-4 text-center">Cargando datos...</div>;

    // Calcular estadísticas
    const totalH = data.habitaciones.length;
    const ocupadasH = data.habitaciones.filter(h => h.estado === 'ocupada').length;

    const totalA = data.apartamentos.length;
    const ocupadosA = data.apartamentos.filter(a => a.estado === 'ocupado').length;

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="text-8xl">🛏️</span>
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Habitaciones</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-extrabold text-primary-600">{ocupadasH}</span>
                        <span className="text-2xl text-neutral-300 font-medium">/ {totalH} Totales</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-3 mb-4">
                        <div
                            className="bg-primary-500 h-3 rounded-full shadow-sm transition-all duration-1000"
                            style={{ width: `${totalH > 0 ? (ocupadasH / totalH) * 100 : 0}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-neutral-700">{totalH > 0 ? Math.round((ocupadasH / totalH) * 100) : 0}% Ocupación</span>
                        <span className="text-neutral-400">{totalH - ocupadasH} Libres</span>
                    </div>
                </div>

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="text-8xl">🏢</span>
                    </div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Apartamentos</h3>
                    <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-5xl font-extrabold text-purple-600">{ocupadosA}</span>
                        <span className="text-2xl text-neutral-300 font-medium">/ {totalA} Totales</span>
                    </div>
                    <div className="w-full bg-neutral-100 rounded-full h-3 mb-4">
                        <div
                            className="bg-purple-500 h-3 rounded-full shadow-sm transition-all duration-1000"
                            style={{ width: `${totalA > 0 ? (ocupadosA / totalA) * 100 : 0}%` }}
                        ></div>
                    </div>
                    <div className="flex justify-between items-center text-sm">
                        <span className="font-semibold text-neutral-700">{totalA > 0 ? Math.round((ocupadosA / totalA) * 100) : 0}% Ocupación</span>
                        <span className="text-neutral-400">{totalA - ocupadosA} Libres</span>
                    </div>
                </div>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                <h3 className="text-lg font-bold text-neutral-800 mb-6 flex items-center gap-2">
                    <span className="w-2 h-6 bg-neutral-800 rounded-full"></span>
                    Estado Detallado de Habitaciones
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[
                        { label: 'Disponible', key: 'disponible', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' },
                        { label: 'Ocupada', key: 'ocupada', color: 'bg-red-50 text-red-700 border-red-100' },
                        { label: 'Limpieza', key: 'limpieza', color: 'bg-blue-50 text-blue-700 border-blue-100' },
                        { label: 'Mantenimiento', key: 'mantenimiento', color: 'bg-amber-50 text-amber-700 border-amber-100' }
                    ].map(estado => (
                        <div key={estado.key} className={`p-6 rounded-xl border ${estado.color} transition-transform hover:scale-105`}>
                            <div className="text-xs font-bold uppercase tracking-wider opacity-70 mb-2">{estado.label}</div>
                            <div className="text-3xl font-black">
                                {data.habitaciones.filter(h => h.estado === estado.key).length}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
