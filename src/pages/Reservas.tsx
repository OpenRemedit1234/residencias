import { useState, useEffect } from 'react';
import ReservaForm from '../components/reservas/ReservaForm';

interface Reserva {
    id: number;
    residente_id: number;
    habitacion_id?: number | null;
    apartamento_id?: number | null;
    fecha_entrada: string;
    fecha_salida: string;
    numero_personas: number;
    precio_total: number;
    observaciones?: string;
    estado: string;
    residente?: { nombre: string; apellidos: string };
    habitacion?: { numero: string; nombre: string };
    apartamento?: { numero: string; nombre: string };
}

export default function Reservas() {
    const [reservas, setReservas] = useState<Reserva[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingReserva, setEditingReserva] = useState<Reserva | null>(null);
    const [filterEstado, setFilterEstado] = useState('todas');

    const fetchReservas = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/reservas?estado=${filterEstado}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar reservas');
            const data = await response.json();
            setReservas(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReservas();
    }, [filterEstado]);

    const handleEstadoChange = async (id: number, nuevoEstado: string) => {
        if (!window.confirm(`¿Cambiar estado a ${nuevoEstado}?`)) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/reservas/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (!response.ok) throw new Error('Error al cambiar estado');
            fetchReservas();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Eliminar reserva permanentemente?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/reservas/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al eliminar');
            fetchReservas();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSubmit = async (data: any) => {
        const token = localStorage.getItem('token');
        const url = editingReserva
            ? `http://localhost:3001/api/reservas/${editingReserva.id}`
            : 'http://localhost:3001/api/reservas';
        const method = editingReserva ? 'PUT' : 'POST';

        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Error al guardar');
        }

        setIsFormOpen(false);
        fetchReservas();
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'activa': return 'bg-success-100 text-success-800';
            case 'pendiente': return 'bg-warning-100 text-warning-800';
            case 'completada': return 'bg-neutral-200 text-neutral-800';
            case 'cancelada': return 'bg-red-100 text-red-800';
            default: return 'bg-neutral-100';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Reservas</h1>
                    <p className="text-neutral-600">Gestión de reservas y estancias</p>
                </div>
                <button
                    onClick={() => { setEditingReserva(null); setIsFormOpen(true); }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 font-medium"
                >
                    + Nueva Reserva
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-neutral-200">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-neutral-700">Estado:</span>
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="todas">Todas</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="activa">Activas</option>
                        <option value="completada">Completadas</option>
                        <option value="cancelada">Canceladas</option>
                    </select>
                </div>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Cargando reservas...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : reservas.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500">No hay reservas registradas.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Residente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Alojamiento</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Fechas</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Precio Total</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id} className="hover:bg-neutral-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getEstadoColor(reserva.estado)}`}>
                                                {reserva.estado}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900 font-medium">
                                            {reserva.residente?.nombre} {reserva.residente?.apellidos}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                            {reserva.habitacion ? `Hab. ${reserva.habitacion.numero}` :
                                                reserva.apartamento ? `Apt. ${reserva.apartamento.numero}` : '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                            {formatDate(reserva.fecha_entrada)} - {formatDate(reserva.fecha_salida)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-neutral-900">
                                            {reserva.precio_total}€
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => {
                                                        const token = localStorage.getItem('token');
                                                        window.open(`http://localhost:3001/api/reservas/${reserva.id}/proforma?token=${token}`, '_blank');
                                                    }}
                                                    className="text-neutral-500 hover:text-blue-600"
                                                    title="Descargar Proforma"
                                                >
                                                    📄
                                                </button>
                                                {reserva.estado === 'pendiente' && (
                                                    <button onClick={() => handleEstadoChange(reserva.id, 'activa')} className="text-success-600 hover:text-success-900" title="Activar Check-in">
                                                        ✅
                                                    </button>
                                                )}
                                                {reserva.estado === 'activa' && (
                                                    <button onClick={() => handleEstadoChange(reserva.id, 'completada')} className="text-neutral-600 hover:text-neutral-900" title="Completar Check-out">
                                                        🏁
                                                    </button>
                                                )}
                                                {(reserva.estado === 'pendiente' || reserva.estado === 'activa') && (
                                                    <button onClick={() => handleEstadoChange(reserva.id, 'cancelada')} className="text-red-400 hover:text-red-700" title="Cancelar">
                                                        🚫
                                                    </button>
                                                )}
                                                <button onClick={() => handleDelete(reserva.id)} className="text-neutral-400 hover:text-red-600" title="Eliminar">
                                                    🗑️
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {isFormOpen && (
                <ReservaForm
                    initialData={editingReserva}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
