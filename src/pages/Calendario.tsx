import { useState, useEffect, useMemo } from 'react';

interface Reserva {
    id: number;
    residente_id: number;
    habitacion_id?: number | null;
    apartamento_id?: number | null;
    fecha_entrada: string;
    fecha_salida: string;
    estado: string;
    residente?: { nombre: string; apellidos: string };
    habitacion?: { numero: string };
    apartamento?: { numero: string };
}

interface Festivo {
    id: number;
    fecha: string;
    nombre: string;
    tipo: string;
}

type ViewType = 'mes' | 'anio';

export default function Calendario() {
    const [viewType, setViewType] = useState<ViewType>('mes');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [festivos, setFestivos] = useState<Festivo[]>([]);
    const [loading, setLoading] = useState(true);

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const getDaysInMonth = (y: number, m: number) => new Date(y, m + 1, 0).getDate();
    const getFirstDayOfMonth = (y: number, m: number) => {
        let day = new Date(y, m, 1).getDay();
        return day === 0 ? 6 : day - 1; // Lunes = 0
    };

    const fetchReservas = async () => {
        try {
            const token = localStorage.getItem('token');
            // Si es vista anual, pedimos todo el año. Si es mensual, pedimos el mes.
            const startStr = viewType === 'anio' ? `${year}-01-01` : `${year}-${(month + 1).toString().padStart(2, '0')}-01`;
            const endStr = viewType === 'anio' ? `${year}-12-31` : `${year}-${(month + 1).toString().padStart(2, '0')}-${getDaysInMonth(year, month)}`;

            const res = await fetch(`http://localhost:3001/api/reservas?fecha_inicio=${startStr}&fecha_fin=${endStr}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setReservas(data);
        } catch (error) {
            console.error("Error fetching reservas", error);
        }
    };

    const fetchFestivos = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`http://localhost:3001/api/festivos?anio=${year}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setFestivos(data);
        } catch (error) {
            console.error("Error fetching festivos", error);
        }
    };

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchReservas(), fetchFestivos()]).finally(() => setLoading(false));
    }, [currentDate, viewType]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const changeYear = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setFullYear(newDate.getFullYear() + offset);
        setCurrentDate(newDate);
    };

    // Indexar festivos y reservas para búsqueda rápida
    const festivosMap = useMemo(() => {
        const map: Record<string, Festivo> = {};
        festivos.forEach(f => map[f.fecha] = f);
        return map;
    }, [festivos]);

    const getDayKey = (y: number, m: number, d: number) =>
        `${y}-${(m + 1).toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;

    const getReservasForDay = (y: number, m: number, d: number) => {
        const dateStr = getDayKey(y, m, d);
        const target = new Date(dateStr);
        target.setHours(0, 0, 0, 0);

        return reservas.filter(r => {
            const start = new Date(r.fecha_entrada);
            const end = new Date(r.fecha_salida);
            start.setHours(0, 0, 0, 0);
            end.setHours(0, 0, 0, 0);
            return target >= start && target <= end;
        });
    };

    const handleDayClick = async (y: number, m: number, d: number) => {
        const dateStr = getDayKey(y, m, d);
        const festivo = festivosMap[dateStr];

        if (festivo) {
            if (window.confirm(`¿Eliminar festivo "${festivo.nombre}"?`)) {
                try {
                    const token = localStorage.getItem('token');
                    await fetch(`http://localhost:3001/api/festivos/${festivo.id}`, {
                        method: 'DELETE',
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    fetchFestivos();
                } catch (e) {
                    alert("Error eliminando festivo");
                }
            }
        } else {
            const nombre = prompt(`Evento/Festivo para el ${d}/${m + 1}/${y}:`);
            if (nombre) {
                try {
                    const token = localStorage.getItem('token');
                    await fetch(`http://localhost:3001/api/festivos`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        },
                        body: JSON.stringify({ fecha: dateStr, nombre })
                    });
                    fetchFestivos();
                } catch (e) {
                    alert("Error creando festivo");
                }
            }
        }
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dayNames = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    // Renderizado Vista Mensual
    const renderMonthlyView = () => {
        const daysInMonth = getDaysInMonth(year, month);
        const firstDay = getFirstDayOfMonth(year, month);
        const days = [];

        // Huecos mes anterior
        const prevMonth = month === 0 ? 11 : month - 1;
        const prevYear = month === 0 ? year - 1 : year;
        const daysInPrev = getDaysInMonth(prevYear, prevMonth);
        for (let i = firstDay - 1; i >= 0; i--) {
            days.push(<div key={`prev-${i}`} className="bg-neutral-50/50 border border-neutral-100 min-h-[100px] p-2 opacity-30 text-xs">{daysInPrev - i}</div>);
        }

        // Días actuales
        for (let d = 1; d <= daysInMonth; d++) {
            const dateStr = getDayKey(year, month, d);
            const festivo = festivosMap[dateStr];
            const dayReservas = getReservasForDay(year, month, d);
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
            const isWeekend = new Date(year, month, d).getDay() === 0 || new Date(year, month, d).getDay() === 6;

            days.push(
                <div
                    key={d}
                    onClick={() => handleDayClick(year, month, d)}
                    className={`border border-neutral-200 min-h-[100px] p-1.5 relative hover:bg-neutral-50 cursor-pointer transition-all
                        ${festivo ? 'bg-red-50/40' : isWeekend ? 'bg-neutral-50/40' : 'bg-white'}
                        ${isToday ? 'ring-2 ring-primary-500 z-10' : ''}
                    `}
                >
                    <div className="flex justify-between items-start mb-1">
                        <span className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full
                            ${isToday ? 'bg-primary-600 text-white' : festivo ? 'text-red-600 bg-red-100' : 'text-neutral-500'}
                        `}>
                            {d}
                        </span>
                        {festivo && <span className="text-[9px] bg-red-100 text-red-700 px-1 rounded truncate max-w-[50px]">{festivo.nombre}</span>}
                    </div>
                    <div className="space-y-0.5 max-h-[70px] overflow-y-auto custom-scrollbar">
                        {dayReservas.map(r => (
                            <div key={r.id} className={`text-[9px] px-1 py-0.5 rounded border-l-2 truncate shadow-sm
                                ${r.estado === 'activa' ? 'bg-emerald-50 text-emerald-800 border-emerald-500' : 'bg-amber-50 text-amber-800 border-amber-500'}
                            `}>
                                {r.habitacion ? `H${r.habitacion.numero}` : `A${r.apartamento?.numero}`} - {r.residente?.nombre.split(' ')[0]}
                            </div>
                        ))}
                    </div>
                </div>
            );
        }

        // Huecos mes siguiente (rellenar hasta 42 para grid constante)
        const totalSlots = 42;
        const nextSlots = totalSlots - days.length;
        for (let i = 1; i <= nextSlots; i++) {
            days.push(<div key={`next-${i}`} className="bg-neutral-50/50 border border-neutral-100 min-h-[100px] p-2 opacity-30 text-xs">{i}</div>);
        }

        return (
            <div className="flex-1 flex flex-col min-h-0">
                <div className="grid grid-cols-7 bg-white border-b border-neutral-200">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map((d, i) => (
                        <div key={d} className={`py-2 text-center text-[10px] font-bold uppercase tracking-widest ${i > 4 ? 'text-primary-600 bg-primary-50/30' : 'text-neutral-400'}`}>
                            {d}
                        </div>
                    ))}
                </div>
                <div className="grid grid-cols-7 flex-1 overflow-y-auto bg-neutral-100/10">
                    {days}
                </div>
            </div>
        );
    };

    // Renderizado Vista Anual
    const renderYearlyView = () => {
        return (
            <div className="flex-1 overflow-y-auto p-4 bg-neutral-50/30">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {monthNames.map((mName, mIdx) => {
                        const daysInM = getDaysInMonth(year, mIdx);
                        const firstD = getFirstDayOfMonth(year, mIdx);
                        const days = [];

                        // Celdas vacías
                        for (let i = 0; i < firstD; i++) days.push(<div key={`e-${i}`} className="h-6"></div>);

                        // Días
                        for (let d = 1; d <= daysInM; d++) {
                            const dateStr = getDayKey(year, mIdx, d);
                            const hasFestivo = festivosMap[dateStr];
                            const reservs = getReservasForDay(year, mIdx, d);
                            const count = reservs.length;
                            const isToday = new Date().toDateString() === new Date(year, mIdx, d).toDateString();

                            days.push(
                                <div
                                    key={d}
                                    onClick={() => handleDayClick(year, mIdx, d)}
                                    className={`h-7 w-full flex items-center justify-center text-[10px] rounded-md cursor-pointer transition-all border
                                        ${count > 0 ? 'bg-primary-100 border-primary-200 text-primary-900 font-bold' : 'border-transparent text-neutral-500 hover:bg-neutral-100'}
                                        ${hasFestivo ? 'bg-red-50 !border-red-200 !text-red-700' : ''}
                                        ${isToday ? 'ring-2 ring-primary-500 z-10 scale-110 !font-black shadow-sm' : ''}
                                    `}
                                    title={hasFestivo ? hasFestivo.nombre : `${count} reservas`}
                                >
                                    {d}
                                    {count > 0 && !hasFestivo && <span className="absolute bottom-0 w-1 h-1 bg-primary-600 rounded-full"></span>}
                                </div>
                            );
                        }

                        return (
                            <div key={mName} className="bg-white p-4 rounded-xl border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                                <h3 className="text-sm font-bold text-neutral-800 mb-3 border-b pb-2 text-center uppercase tracking-tighter">{mName}</h3>
                                <div className="grid grid-cols-7 gap-1 text-center">
                                    {dayNames.map(dn => <div key={dn} className="text-[8px] font-black text-neutral-300 mb-1">{dn}</div>)}
                                    {days}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="p-6 h-full flex flex-col bg-neutral-50 max-w-[1600px] mx-auto overflow-hidden">
            <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-black text-neutral-900 tracking-tight">Calendario de Ocupación</h1>
                    <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">{viewType === 'mes' ? 'Vista Mensual' : 'Vista Anual'}</span>
                        <div className="h-1 w-8 bg-primary-500 rounded-full"></div>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-neutral-200 shadow-sm self-stretch sm:self-auto">
                    {/* Selector de tipo de vista */}
                    <div className="flex p-1 bg-neutral-100 rounded-lg mr-2">
                        <button
                            onClick={() => setViewType('mes')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewType === 'mes' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            Mes
                        </button>
                        <button
                            onClick={() => setViewType('anio')}
                            className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${viewType === 'anio' ? 'bg-white text-primary-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
                        >
                            Año
                        </button>
                    </div>

                    <div className="w-[1px] h-6 bg-neutral-200 mx-1 hidden sm:block"></div>

                    {/* Navegación temporal */}
                    <button onClick={() => viewType === 'mes' ? changeMonth(-1) : changeYear(-1)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" /></svg>
                    </button>

                    <span className="text-sm font-black text-neutral-800 w-32 text-center uppercase tracking-tighter">
                        {viewType === 'mes' ? `${monthNames[month]} ${year}` : year}
                    </span>

                    <button onClick={() => viewType === 'mes' ? changeMonth(1) : changeYear(1)} className="p-2 hover:bg-neutral-100 rounded-lg text-neutral-400 transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 5l7 7-7 7" /></svg>
                    </button>
                </div>
            </header>

            <div className="hidden lg:flex gap-6 mb-4 px-2">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-100 border border-emerald-500 rounded-sm"></div> <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Activa</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-amber-100 border border-amber-500 rounded-sm"></div> <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Pendiente</span></div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-100 border border-red-300 rounded-sm"></div> <span className="text-[10px] font-bold text-neutral-500 uppercase tracking-wider">Festivo</span></div>
                <div className="flex items-center gap-2 ml-auto"><span className="text-[10px] italic text-neutral-400">* Haz clic en un día para añadir eventos</span></div>
            </div>

            <main className="flex-1 bg-white rounded-2xl border border-neutral-200 shadow-xl shadow-neutral-200/40 flex flex-col min-h-0 overflow-hidden">
                {loading ? (
                    <div className="flex-1 flex flex-col items-center justify-center space-y-4">
                        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-sm font-bold text-neutral-400 uppercase tracking-widest animate-pulse">Sincronizando calendario...</p>
                    </div>
                ) : (
                    viewType === 'mes' ? renderMonthlyView() : renderYearlyView()
                )}
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #e5e5e5; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4d4d4; }
            `}</style>
        </div>
    );
}
