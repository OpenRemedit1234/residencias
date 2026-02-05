import { useState, useEffect } from 'react';

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

export default function Calendario() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [festivos, setFestivos] = useState<Festivo[]>([]);
    const [loading, setLoading] = useState(true);

    const getDaysInMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date: Date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        // Ajustar para que lunes sea 0, domingo 6 (en JS domingo es 0)
        let day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1;
    };

    const fetchReservas = async () => {
        try {
            const token = localStorage.getItem('token');
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth() + 1;

            // Obtener primer y último día para filtrar (backend soporta rango)
            const firstDay = `${year}-${month.toString().padStart(2, '0')}-01`;
            const lastDay = `${year}-${month.toString().padStart(2, '0')}-${getDaysInMonth(currentDate)}`;

            // Fetchear reservas que se solapen con este mes
            const res = await fetch(`http://localhost:3001/api/reservas?fecha_inicio=${firstDay}&fecha_fin=${lastDay}`, {
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
            const res = await fetch(`http://localhost:3001/api/festivos?anio=${currentDate.getFullYear()}`, {
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
    }, [currentDate]);

    const changeMonth = (offset: number) => {
        const newDate = new Date(currentDate);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentDate(newDate);
    };

    const isFestivo = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        return festivos.find(f => f.fecha === dateStr);
    };

    const getReservasForDay = (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const targetDate = new Date(dateStr);

        return reservas.filter(r => {
            const start = new Date(r.fecha_entrada);
            const end = new Date(r.fecha_salida);
            return targetDate >= start && targetDate <= end;
        });
    };

    const handleDayClick = async (day: number) => {
        const dateStr = `${currentDate.getFullYear()}-${(currentDate.getMonth() + 1).toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
        const festivo = isFestivo(day);

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
            const nombre = prompt("Nombre del festivo:");
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

    const renderCalendarDays = () => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        if (loading) {
            return <div className="col-span-7 bg-white p-8 text-center text-neutral-500">Cargando calendario...</div>;
        }

        // Días vacíos previos
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="bg-neutral-50 border border-neutral-100 min-h-[100px]"></div>);
        }

        // Días del mes
        for (let day = 1; day <= daysInMonth; day++) {
            const festivo = isFestivo(day);
            const dayReservas = getReservasForDay(day);
            const isToday = new Date().toDateString() === new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

            days.push(
                <div
                    key={day}
                    onClick={() => handleDayClick(day)}
                    className={`border border-neutral-200 min-h-[100px] p-2 relative hover:bg-neutral-50 cursor-pointer transition-colors
                        ${festivo ? 'bg-red-50' : 'bg-white'}
                        ${isToday ? 'ring-2 ring-primary-500 inset-0 z-10' : ''}
                    `}
                >
                    <div className="flex justify-between items-start">
                        <span className={`text-sm font-semibold rounded-full w-6 h-6 flex items-center justify-center
                            ${festivo ? 'text-red-700' : 'text-neutral-700'}
                            ${isToday ? 'bg-primary-600 text-white' : ''}
                        `}>
                            {day}
                        </span>
                        {festivo && (
                            <span className="text-xs text-red-600 font-medium truncate max-w-[80px]" title={festivo.nombre}>
                                {festivo.nombre}
                            </span>
                        )}
                    </div>

                    <div className="mt-2 space-y-1">
                        {dayReservas.slice(0, 3).map(r => (
                            <div
                                key={r.id}
                                className={`text-[10px] px-1 py-0.5 rounded truncate
                                    ${r.estado === 'activa' ? 'bg-success-100 text-success-800' :
                                        r.estado === 'pendiente' ? 'bg-warning-100 text-warning-800' : 'bg-neutral-100 text-neutral-600'}
                                `}
                                title={`${r.residente?.nombre} ${r.residente?.apellidos} - ${r.habitacion ? 'H' + r.habitacion.numero : 'A' + r.apartamento?.numero}`}
                            >
                                {r.habitacion ? `H${r.habitacion.numero}` : `A${r.apartamento?.numero}`} - {r.residente?.nombre}
                            </div>
                        ))}
                        {dayReservas.length > 3 && (
                            <div className="text-[10px] text-neutral-500 px-1">+ {dayReservas.length - 3} más</div>
                        )}
                    </div>
                </div>
            );
        }

        return days;
    };

    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];

    return (
        <div className="p-6 h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Calendario</h1>
                    <p className="text-neutral-600">Vista mensual de ocupación y festivos</p>
                </div>
                <div className="flex items-center gap-4 bg-white p-1 rounded-lg border border-neutral-200 shadow-sm">
                    <button onClick={() => changeMonth(-1)} className="p-2 hover:bg-neutral-100 rounded-md text-neutral-600">◀</button>
                    <span className="text-lg font-bold text-neutral-800 w-40 text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </span>
                    <button onClick={() => changeMonth(1)} className="p-2 hover:bg-neutral-100 rounded-md text-neutral-600">▶</button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 flex-1 flex flex-col overflow-hidden">
                {/* Cabecera días semana */}
                <div className="grid grid-cols-7 bg-neutral-50 border-b border-neutral-200">
                    {['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'].map(day => (
                        <div key={day} className="py-2 text-center text-sm font-semibold text-neutral-600 uppercase tracking-wide">
                            {day}
                        </div>
                    ))}
                </div>

                {/* Grid días */}
                <div className="grid grid-cols-7 flex-1 auto-rows-fr overflow-y-auto">
                    {renderCalendarDays()}
                </div>
            </div>

            <div className="mt-4 flex gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white border border-neutral-300"></div> Disponible</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-50 border border-red-200"></div> Festivo</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-success-100 rounded"></div> Reserva Activa</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 bg-warning-100 rounded"></div> Reserva Pendiente</div>
            </div>
        </div>
    );
}
