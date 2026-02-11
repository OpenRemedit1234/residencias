import { useEffect, useState } from 'react';

export default function Dashboard() {
    const [stats, setStats] = useState({
        residentes: 0,
        ocupacion: 0,
        ingresos_mes: 0,
        pagos_pendientes: 0,
        proximas_llegadas: [] as any[],
        deudas: [] as any[]
    });
    const [loading, setLoading] = useState(true);

    const fetchStats = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:3001/api/reportes/general', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const resDeudas = await fetch('http://127.0.0.1:3001/api/pagos?estado=pendiente', {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (res.ok && resDeudas.ok) {
                const data = await res.json();
                const deudas = await resDeudas.json();
                setStats({ ...data, deudas });
            }
        } catch (error) {
            console.error('Error cargando stats dashboard');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleCompletarPago = async (id: number) => {
        if (!window.confirm('¿Confirmar que el pago ha sido recibido?')) return;
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:3001/api/pagos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: 'completado' })
            });

            if (res.ok) {
                fetchStats();
            }
        } catch (err) {
            alert('Error al actualizar pago');
        }
    };

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
    };

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-3xl font-bold text-neutral-800 mb-2">Resumen General</h1>
                <p className="text-neutral-600 italic">Estado actual de la residencia en tiempo real.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="card hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1 uppercase tracking-wider">Ocupación</p>
                            <p className="text-3xl font-bold text-neutral-800">
                                {loading ? '-' : `${stats.ocupacion}%`}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-primary-50 rounded-xl flex items-center justify-center text-primary-600">
                            <span className="text-2xl">🏨</span>
                        </div>
                    </div>
                    <div className="mt-4 bg-neutral-100 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-primary-500 h-full transition-all duration-1000" style={{ width: `${stats.ocupacion}%` }}></div>
                    </div>
                </div>

                <div className="card hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1 uppercase tracking-wider">Residentes</p>
                            <p className="text-3xl font-bold text-neutral-800">
                                {loading ? '-' : stats.residentes}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
                            <span className="text-2xl">👥</span>
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-md transition-shadow border-l-4 border-l-amber-400">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-500 mb-1 uppercase tracking-wider">Deuda Pendiente</p>
                            <p className="text-3xl font-bold text-amber-600">
                                {loading ? '-' : formatCurrency(stats.pagos_pendientes)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                            <span className="text-2xl">⚠️</span>
                        </div>
                    </div>
                </div>

                <div className="card hover:shadow-md transition-shadow bg-neutral-800 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-neutral-400 mb-1 uppercase tracking-wider">Ventas Mes</p>
                            <p className="text-3xl font-bold">
                                {loading ? '-' : formatCurrency(stats.ingresos_mes)}
                            </p>
                        </div>
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center">
                            <span className="text-2xl">💰</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Lista de Próximas Llegadas */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="card p-0 overflow-hidden">
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50">
                            <h2 className="text-lg font-bold text-neutral-800">Próximas Llegadas</h2>
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-bold rounded uppercase">Próximos 7 días</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-neutral-100">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-400 uppercase">Residente</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-400 uppercase">Fecha Entrada</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-400 uppercase">Alojamiento</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-400 uppercase">Importe</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {stats.proximas_llegadas.length === 0 ? (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-neutral-500 italic">No hay llegadas programadas para esta semana</td>
                                        </tr>
                                    ) : (
                                        stats.proximas_llegadas.map((r) => (
                                            <tr key={r.id} className="hover:bg-neutral-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-800">
                                                    {r.residente?.nombre} {r.residente?.apellidos}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    {new Date(r.fecha_entrada).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    {r.habitacion_id ? `Habitación ${r.habitacion_id}` : `Apt. ${r.apartamento_id}`}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-neutral-800">
                                                    {formatCurrency(r.precio_total)}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* NUEVA SECCIÓN: Pagos Pendientes (Deudas) */}
                    <div className="card p-0 overflow-hidden border-t-4 border-t-amber-400">
                        <div className="p-6 border-b border-neutral-100 flex justify-between items-center bg-amber-50/30">
                            <div>
                                <h2 className="text-lg font-bold text-neutral-800">Control de Deudas Pendientes</h2>
                                <p className="text-xs text-amber-600 font-medium">Pagos registrados que aún no se han cobrado</p>
                            </div>
                            <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded uppercase">
                                {stats.deudas.length} Pendientes
                            </span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-neutral-100">
                                <thead className="bg-neutral-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-400 uppercase">Residente</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-400 uppercase">Concepto</th>
                                        <th className="px-6 py-3 text-left text-xs font-bold text-neutral-400 uppercase">Vencimiento</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-400 uppercase">Monto</th>
                                        <th className="px-6 py-3 text-right text-xs font-bold text-neutral-400 uppercase">Acción</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-100">
                                    {stats.deudas.length === 0 ? (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-neutral-500 italic">No hay pagos pendientes de cobro ✨</td>
                                        </tr>
                                    ) : (
                                        stats.deudas.map((p) => (
                                            <tr key={p.id} className="hover:bg-amber-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-neutral-800">
                                                    {p.residente?.nombre} {p.residente?.apellidos}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                                    {p.concepto}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 font-medium">
                                                    {new Date(p.fecha_pago).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-amber-600">
                                                    {formatCurrency(p.monto)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleCompletarPago(p.id)}
                                                        className="px-3 py-1 bg-success-600 text-white text-xs font-bold rounded hover:bg-success-700 shadow-sm transition-colors"
                                                    >
                                                        Cobrar ✅
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

                {/* Accesos rápidos / Recursos */}
                <div className="space-y-6">
                    <div className="card bg-gradient-to-br from-primary-600 to-primary-800 text-white border-0">
                        <h3 className="text-xl font-bold mb-2">Centro de Ayuda</h3>
                        <p className="text-primary-100 text-sm mb-6 leading-relaxed">
                            ¿Necesita ayuda con la gestión de apartamentos o el cierre de caja? Consulte el manual oficial.
                        </p>
                        <button className="w-full py-3 bg-white text-primary-700 font-bold rounded-lg shadow-lg hover:bg-neutral-50 transition-colors">
                            Ver Manual de Usuario
                        </button>
                    </div>

                    <div className="card">
                        <h3 className="font-bold text-neutral-800 mb-4 flex items-center gap-2">
                            <span>🛠️</span> Atajos del Sistema
                        </h3>
                        <div className="grid grid-cols-2 gap-3 text-xs">
                            <button className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 hover:border-primary-200 transition-colors text-left group">
                                <span className="block font-bold text-neutral-800 group-hover:text-primary-600">Nueva Reserva</span>
                                <span className="text-neutral-500">Crear entrada</span>
                            </button>
                            <button className="p-3 bg-neutral-50 rounded-lg border border-neutral-100 hover:border-primary-200 transition-colors text-left group">
                                <span className="block font-bold text-neutral-800 group-hover:text-primary-600">Cargar Pago</span>
                                <span className="text-neutral-500">Registrar cobro</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
