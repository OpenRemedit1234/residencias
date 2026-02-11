import { useState, useEffect } from 'react';

interface Reserva {
    id?: number;
    residente_id: number;
    habitacion_id?: number | null;
    apartamento_id?: number | null;
    fecha_entrada: string;
    fecha_salida: string;
    numero_personas: number;
    precio_total: number;
    observaciones?: string;
    estado?: string;
}

interface Residente {
    id: number;
    nombre: string;
    apellidos: string;
}

interface Alojamiento {
    id: number;
    numero: string;
    nombre: string;
    tipo?: string; // Solo habitaciones
    capacidad: number; // Añadido para validación
    precio_noche?: number; // Ambos (puede ser undefined si es mensual)
    precio_mes?: number; // Solo apartamentos
    estado: string;
}

interface ReservaFormProps {
    initialData?: Reserva | null;
    onSubmit: (data: Reserva) => Promise<void>;
    onCancel: () => void;
}

export default function ReservaForm({ initialData, onSubmit, onCancel }: ReservaFormProps) {
    const [formData, setFormData] = useState<Reserva>({
        residente_id: 0,
        habitacion_id: null,
        apartamento_id: null,
        fecha_entrada: '',
        fecha_salida: '',
        numero_personas: 1,
        precio_total: 0,
        observaciones: ''
    });

    const [tipoAlojamiento, setTipoAlojamiento] = useState<'habitacion' | 'apartamento'>('habitacion');
    const [residentes, setResidentes] = useState<Residente[]>([]);
    const [alojamientos, setAlojamientos] = useState<Alojamiento[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoadingData(true);
                const token = localStorage.getItem('token');
                const headers = { 'Authorization': `Bearer ${token}` };

                // Cargar residentes (limitando a 200 por rendimiento inicial, idealmente usar búsqueda dinámica)
                const resResidentes = await fetch('http://127.0.0.1:3001/api/residentes?limit=200', { headers });
                const dataResidentes = await resResidentes.json();
                setResidentes(dataResidentes.data || []);

                // Cargar alojamientos según selección
                const endpoint = tipoAlojamiento === 'habitacion' ? 'habitaciones' : 'apartamentos';
                const resAlojamientos = await fetch(`http://127.0.0.1:3001/api/${endpoint}?estado=disponible`, { headers });
                const dataAlojamientos = await resAlojamientos.json();
                setAlojamientos(dataAlojamientos);

            } catch (err) {
                console.error("Error cargando datos:", err);
            } finally {
                setLoadingData(false);
            }
        };

        fetchData();
    }, [tipoAlojamiento]);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
            if (initialData.habitacion_id) setTipoAlojamiento('habitacion');
            if (initialData.apartamento_id) setTipoAlojamiento('apartamento');
        }
    }, [initialData]);

    // Calcular precio estimado al cambiar fechas o alojamiento
    useEffect(() => {
        if (formData.fecha_entrada && formData.fecha_salida) {
            const start = new Date(formData.fecha_entrada);
            const end = new Date(formData.fecha_salida);
            const diffTime = Math.abs(end.getTime() - start.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays > 0) {
                const alojamientoId = tipoAlojamiento === 'habitacion' ? formData.habitacion_id : formData.apartamento_id;
                const alojamiento = alojamientos.find(a => a.id === Number(alojamientoId));

                if (alojamiento) {
                    let precio = 0;
                    if (tipoAlojamiento === 'habitacion' && alojamiento.precio_noche) {
                        precio = alojamiento.precio_noche * diffDays;
                    } else if (tipoAlojamiento === 'apartamento') {
                        // Lógica simplificada: usar precio noche si existe, sino prorratear mes (muy básico)
                        if (alojamiento.precio_noche) {
                            precio = alojamiento.precio_noche * diffDays;
                        } else if (alojamiento.precio_mes) {
                            precio = (alojamiento.precio_mes / 30) * diffDays;
                        }
                    }
                    setFormData(prev => ({ ...prev, precio_total: parseFloat(precio.toFixed(2)) }));
                }
            }
        }
    }, [formData.fecha_entrada, formData.fecha_salida, formData.habitacion_id, formData.apartamento_id, tipoAlojamiento, alojamientos]);


    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validaciones manuales
        if (!formData.residente_id) {
            setError("Debe seleccionar un residente");
            setLoading(false);
            return;
        }

        const alojamientoId = tipoAlojamiento === 'habitacion' ? formData.habitacion_id : formData.apartamento_id;
        if (!alojamientoId) {
            setError(`Debe seleccionar ${tipoAlojamiento === 'habitacion' ? 'una habitación' : 'un apartamento'}`);
            setLoading(false);
            return;
        }

        // Validación de capacidad
        const alojamiento = alojamientos.find(a => a.id === Number(alojamientoId));
        if (alojamiento && formData.numero_personas > alojamiento.capacidad) {
            setError(`La capacidad máxima de este alojamiento es de ${alojamiento.capacidad} personas`);
            setLoading(false);
            return;
        }

        // Limpiar ID del otro tipo de alojamiento
        const payload = { ...formData };
        if (tipoAlojamiento === 'habitacion') payload.apartamento_id = null;
        else payload.habitacion_id = null;

        try {
            await onSubmit(payload);
        } catch (err: any) {
            setError(err.message || 'Error al guardar');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-neutral-800">
                        {initialData ? 'Editar Reserva' : 'Nueva Reserva'}
                    </h2>
                    <button onClick={onCancel} className="text-neutral-500 hover:text-neutral-700">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 text-red-700 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    {/* Residente y Tipo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Residente *</label>
                            <select
                                name="residente_id"
                                value={formData.residente_id}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="">Seleccione un residente...</option>
                                {residentes.map(r => (
                                    <option key={r.id} value={r.id}>{r.nombre} {r.apellidos}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Tipo de Alojamiento</label>
                            <div className="flex rounded-md shadow-sm" role="group">
                                <button
                                    type="button"
                                    onClick={() => { setTipoAlojamiento('habitacion'); setFormData(prev => ({ ...prev, habitacion_id: null, apartamento_id: null })); }}
                                    className={`px-4 py-2 text-sm font-medium border rounded-l-lg flex-1 ${tipoAlojamiento === 'habitacion' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'}`}
                                >
                                    Habitación
                                </button>
                                <button
                                    type="button"
                                    onClick={() => { setTipoAlojamiento('apartamento'); setFormData(prev => ({ ...prev, habitacion_id: null, apartamento_id: null })); }}
                                    className={`px-4 py-2 text-sm font-medium border rounded-r-lg flex-1 ${tipoAlojamiento === 'apartamento' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-neutral-700 border-neutral-300 hover:bg-neutral-50'}`}
                                >
                                    Apartamento
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Selección de Alojamiento */}
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">
                            {tipoAlojamiento === 'habitacion' ? 'Habitación Disponible *' : 'Apartamento Disponible *'}
                        </label>
                        <select
                            name={tipoAlojamiento === 'habitacion' ? 'habitacion_id' : 'apartamento_id'}
                            value={tipoAlojamiento === 'habitacion' ? (formData.habitacion_id || '') : (formData.apartamento_id || '')}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            disabled={loadingData}
                        >
                            <option value="">Seleccione...</option>
                            {alojamientos.map(a => (
                                <option key={a.id} value={a.id}>
                                    {a.numero} - {a.nombre} (Cap: {a.capacidad} | {a.precio_noche ? `${a.precio_noche}€/n` : `${a.precio_mes}€/m`})
                                </option>
                            ))}
                        </select>
                        {loadingData && <p className="text-xs text-neutral-500 mt-1">Cargando disponibilidad...</p>}
                    </div>

                    {/* Fechas */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Fecha Entrada *</label>
                            <input
                                type="date"
                                name="fecha_entrada"
                                value={formData.fecha_entrada}
                                onChange={handleChange}
                                required
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Fecha Salida *</label>
                            <input
                                type="date"
                                name="fecha_salida"
                                value={formData.fecha_salida}
                                onChange={handleChange}
                                required
                                min={formData.fecha_entrada}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    {/* Detalles */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Nº Personas *</label>
                            <input
                                type="number"
                                name="numero_personas"
                                value={formData.numero_personas}
                                onChange={handleChange}
                                min="1"
                                required
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Precio Total (€) *</label>
                            <input
                                type="number"
                                name="precio_total"
                                value={formData.precio_total}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                            />
                            <p className="text-xs text-neutral-500 mt-1">Calculado automáticamente (puede modificarse)</p>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Observaciones</label>
                        <textarea
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-neutral-200">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50"
                            disabled={loading}
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 disabled:opacity-50"
                            disabled={loading}
                        >
                            {loading ? 'Guardando...' : 'Guardar Reserva'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
