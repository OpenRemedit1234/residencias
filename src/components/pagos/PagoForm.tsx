import { useState, useEffect } from 'react';

interface Pago {
    id?: number;
    residente_id: number;
    reserva_id?: number | null;
    monto: number;
    metodo_pago: string;
    fecha_pago: string;
    concepto: string;
    estado: string;
    observaciones?: string;
}

interface Residente {
    id: number;
    nombre: string;
    apellidos: string;
}

interface Reserva {
    id: number;
    precio_total: number;
    fecha_entrada: string;
    fecha_salida: string;
}

interface PagoFormProps {
    initialData?: Pago | null;
    onSubmit: (data: Pago) => Promise<void>;
    onCancel: () => void;
}

export default function PagoForm({ initialData, onSubmit, onCancel }: PagoFormProps) {
    const [formData, setFormData] = useState<Pago>({
        residente_id: 0,
        reserva_id: null,
        monto: 0,
        metodo_pago: 'efectivo',
        fecha_pago: new Date().toISOString().split('T')[0],
        concepto: '',
        estado: 'completado',
        observaciones: ''
    });

    const [residentes, setResidentes] = useState<Residente[]>([]);
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchResidentes = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await fetch('http://127.0.0.1:3001/api/residentes?limit=100', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                setResidentes(data.data || []);
            } catch (err) {
                console.error("Error cargando residentes", err);
            }
        };
        fetchResidentes();
    }, []);

    useEffect(() => {
        if (formData.residente_id) {
            const token = localStorage.getItem('token');

            // Cargar reservas del residente seleccionado
            const fetchReservas = async () => {
                try {
                    const res = await fetch(`http://127.0.0.1:3001/api/reservas?limit=50`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    setReservas(data.filter((r: any) => r.residente_id === Number(formData.residente_id)));
                } catch (err) {
                    console.error("Error cargando reservas", err);
                }
            };

            // Verificar pagos pendientes
            const checkPendingPayments = async () => {
                try {
                    const res = await fetch(`http://127.0.0.1:3001/api/pagos?residente_id=${formData.residente_id}&estado=pendiente`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    const data = await res.json();
                    // Si estamos editando un pago que ya es pendiente, no lo contamos como "adicional"
                    const count = data.filter((p: any) => p.id !== initialData?.id).length;
                    setPendingPaymentsCount(count);
                } catch (err) {
                    console.error("Error verificando pagos pendientes", err);
                }
            };

            fetchReservas();
            checkPendingPayments();
        } else {
            setReservas([]);
            setPendingPaymentsCount(0);
        }
    }, [formData.residente_id, initialData]);

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReservaChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const reservaId = Number(e.target.value);
        if (reservaId) {
            const reserva = reservas.find(r => r.id === reservaId);
            if (reserva) {
                setFormData(prev => ({
                    ...prev,
                    reserva_id: reservaId,
                    monto: reserva.precio_total,
                    concepto: `Alquiler ${reserva.fecha_entrada} a ${reserva.fecha_salida}`
                }));
            }
        } else {
            setFormData(prev => ({ ...prev, reserva_id: null }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        try {
            await onSubmit(formData);
        } catch (err: any) {
            setError(err.message || 'Error al guardar');
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-lg">
                <div className="p-6 border-b border-neutral-200 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-neutral-800">
                        {initialData ? 'Editar Pago' : 'Nuevo Pago'}
                    </h2>
                    <button onClick={onCancel} className="text-neutral-500 hover:text-neutral-700">✕</button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">{error}</div>
                    )}

                    {pendingPaymentsCount > 0 && (
                        <div className="p-3 bg-warning-50 border border-warning-200 rounded-md flex items-start gap-3 animate-pulse">
                            <span className="text-xl">⚠️</span>
                            <div>
                                <p className="text-sm font-bold text-warning-800">Pagos acumulados</p>
                                <p className="text-xs text-warning-700">
                                    Este residente tiene <strong>{pendingPaymentsCount}</strong> pago(s) pendiente(s) adicional(es).
                                </p>
                            </div>
                        </div>
                    )}

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

                    {reservas.length > 0 && (
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Vincular a Reserva (Opcional)</label>
                            <select
                                name="reserva_id"
                                value={formData.reserva_id || ''}
                                onChange={handleReservaChange}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-neutral-50"
                            >
                                <option value="">Sin vinculación</option>
                                {reservas.map(r => (
                                    <option key={r.id} value={r.id}>
                                        Reserva #{r.id} ({r.fecha_entrada} - {r.precio_total}€)
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Monto (€) *</label>
                            <input
                                type="number"
                                name="monto"
                                value={formData.monto}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                required
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 text-lg font-bold text-neutral-800"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Fecha Pago *</label>
                            <input
                                type="date"
                                name="fecha_pago"
                                value={formData.fecha_pago}
                                onChange={handleChange}
                                required
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Concepto *</label>
                        <input
                            type="text"
                            name="concepto"
                            value={formData.concepto}
                            onChange={handleChange}
                            required
                            placeholder="Ej: Mensualidad Enero, Fianza..."
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Método de Pago</label>
                            <select
                                name="metodo_pago"
                                value={formData.metodo_pago}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="efectivo">Efectivo 💵</option>
                                <option value="tarjeta">Tarjeta 💳</option>
                                <option value="transferencia">Transferencia 🏦</option>
                                <option value="bizum">Bizum 📱</option>
                                <option value="otro">Otro</option>
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 mb-1">Estado del Pago</label>
                            <div className="flex gap-2">
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, estado: 'completado' }))}
                                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${formData.estado === 'completado' ? 'bg-success-50 border-success-500 text-success-700 shadow-sm' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                                >
                                    Completado ✅
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, estado: 'pendiente' }))}
                                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${formData.estado === 'pendiente' ? 'bg-warning-50 border-warning-500 text-warning-700 shadow-sm' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                                >
                                    Pendiente ⏳
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setFormData(prev => ({ ...prev, estado: 'cancelado' }))}
                                    className={`flex-1 py-2 px-3 text-sm font-medium rounded-md border transition-colors ${formData.estado === 'cancelado' ? 'bg-red-50 border-red-500 text-red-700 shadow-sm' : 'bg-white border-neutral-200 text-neutral-600 hover:bg-neutral-50'}`}
                                >
                                    Cancelado 🚫
                                </button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Observaciones</label>
                        <textarea
                            name="observaciones"
                            value={formData.observaciones}
                            onChange={handleChange}
                            rows={2}
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
                            {loading ? 'Guardando...' : 'Registrar Pago'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
