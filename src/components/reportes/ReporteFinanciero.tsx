import { useState, useEffect } from 'react';

export default function ReporteFinanciero() {
    const [pagos, setPagos] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [year, setYear] = useState(new Date().getFullYear());

    useEffect(() => {
        fetchData();
    }, [year]);

    const fetchData = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://127.0.0.1:3001/api/reportes/financiero?year=${year}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const jsonData = await res.json();
            setPagos(jsonData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const formatCurrency = (val: number) => {
        return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(val);
    };

    const totalAnual = pagos.reduce((acc, curr) => acc + (curr.total || 0), 0);

    const handleExport = () => {
        // Simple CSV export
        const csvContent =
            "data:text/csv;charset=utf-8," +
            "Mes,Total\n" +
            pagos.map(p => `${meses[parseInt(p.mes) - 1]},${p.total}`).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `reporte_financiero_${year}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="space-y-8 animate-in slide-in-from-bottom duration-500">
            <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-neutral-100">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-neutral-400 uppercase tracking-widest">Periodo:</span>
                        <select
                            value={year}
                            onChange={(e) => setYear(Number(e.target.value))}
                            className="bg-neutral-50 border-0 rounded-xl px-4 py-2 font-bold text-neutral-800 focus:ring-2 focus:ring-primary-500 transition-all cursor-pointer shadow-inner"
                        >
                            {[2024, 2025, 2026, 2027].map(y => (
                                <option key={y} value={y}>{y}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <button
                    onClick={handleExport}
                    className="bg-emerald-50 text-emerald-700 px-6 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-emerald-100 transition-colors shadow-sm"
                >
                    <span className="text-lg">📊</span> Exportar Datos CSV
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -top-4 -right-4 w-32 h-32 bg-emerald-50 rounded-full opacity-50 group-hover:scale-110 transition-transform duration-500"></div>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-neutral-400 mb-6">Recaudación Total Anual</h3>
                    <div className="text-5xl font-black text-emerald-600 mb-4 tracking-tight">
                        {formatCurrency(totalAnual)}
                    </div>
                    <p className="text-neutral-400 text-sm font-medium leading-relaxed">
                        Total acumulado de cobros registrados durante el ejercicio fiscal {year}.
                    </p>
                    <div className="mt-8 pt-8 border-t border-neutral-50 flex items-center gap-3 text-emerald-700 font-bold text-sm">
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500"></span>
                        Cierre de año proyectado
                    </div>
                </div>

                <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                    <h3 className="text-lg font-bold text-neutral-800 mb-8 flex items-center gap-3">
                        <span className="w-8 h-8 bg-neutral-800 rounded-lg flex items-center justify-center text-white text-xs">📈</span>
                        Desempeño Mensual
                    </h3>
                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 gap-4">
                            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-600 rounded-full animate-spin"></div>
                            <span className="text-neutral-400 font-bold text-sm animate-pulse">Analizando finanzas...</span>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {pagos.map((p) => {
                                const mesNombre = meses[parseInt(p.mes) - 1];
                                const porcentaje = totalAnual > 0 ? (p.total / totalAnual) * 100 : 0;
                                return (
                                    <div key={p.mes} className="group">
                                        <div className="flex justify-between items-center mb-2">
                                            <span className="text-sm font-bold text-neutral-700">{mesNombre}</span>
                                            <span className="text-sm font-black text-neutral-900">{formatCurrency(p.total)}</span>
                                        </div>
                                        <div className="w-full bg-neutral-50 rounded-full h-3 overflow-hidden shadow-inner">
                                            <div
                                                className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-1000 shadow-sm"
                                                style={{ width: `${porcentaje}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                );
                            })}
                            {pagos.length === 0 && (
                                <div className="text-center py-20 bg-neutral-50 rounded-3xl border-2 border-dashed border-neutral-100">
                                    <span className="text-4xl block mb-4">😶‍🌫️</span>
                                    <p className="text-neutral-400 font-bold uppercase tracking-widest text-xs">Sin registros financieros para este periodo</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
