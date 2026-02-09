import { useState, useEffect } from 'react';
import PagoForm from '../components/pagos/PagoForm';

interface Pago {
    id: number;
    residente_id: number;
    reserva_id?: number | null;
    monto: number;
    metodo_pago: string;
    fecha_pago: string;
    concepto: string;
    estado: string;
    residente?: { nombre: string; apellidos: string; dni: string };
    reserva?: { id: number };
}

export default function Pagos() {
    const [pagos, setPagos] = useState<Pago[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingPago, setEditingPago] = useState<Pago | null>(null);
    const [filterEstado, setFilterEstado] = useState('todos');

    const fetchPagos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/pagos?estado=${filterEstado}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar pagos');
            const data = await response.json();
            setPagos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPagos();
    }, [filterEstado]);

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Eliminar registro de pago?')) return;
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/pagos/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al eliminar');
            fetchPagos();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleEstadoChange = async (id: number, nuevoEstado: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/pagos/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (!response.ok) throw new Error('Error al actualizar estado');
            fetchPagos();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSubmit = async (data: any) => {
        const token = localStorage.getItem('token');
        const url = editingPago
            ? `http://localhost:3001/api/pagos/${editingPago.id}`
            : 'http://localhost:3001/api/pagos';
        const method = editingPago ? 'PUT' : 'POST';

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
        fetchPagos();
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'completado': return 'bg-success-100 text-success-800';
            case 'pendiente': return 'bg-warning-100 text-warning-800';
            case 'cancelado': return 'bg-red-100 text-red-800';
            default: return 'bg-neutral-100 text-neutral-800';
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Pagos y Cobros</h1>
                    <p className="text-neutral-600">Registro de transacciones y facturación</p>
                </div>
                <button
                    onClick={() => { setEditingPago(null); setIsFormOpen(true); }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 font-medium"
                >
                    + Registrar Pago
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-neutral-200">
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-neutral-700">Filtrar por estado:</span>
                    <select
                        value={filterEstado}
                        onChange={(e) => setFilterEstado(e.target.value)}
                        className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                    >
                        <option value="todos">Todos</option>
                        <option value="completado">Completados</option>
                        <option value="pendiente">Pendientes</option>
                        <option value="cancelado">Cancelados</option>
                    </select>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Cargando pagos...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : pagos.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500">No hay pagos registrados.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-neutral-200">
                            <thead className="bg-neutral-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Fecha</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Estado</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Residente</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Concepto</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Método</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Monto</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider min-w-[200px]">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-neutral-200">
                                {pagos.map((pago) => (
                                    <tr key={pago.id} className="hover:bg-neutral-50">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                            {new Date(pago.fecha_pago).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button
                                                onClick={() => handleEstadoChange(pago.id, pago.estado === 'pendiente' ? 'completado' : 'pendiente')}
                                                title="Click para cambiar estado"
                                                className={`px-2.5 py-1 inline-flex text-xs leading-5 font-bold rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 transition-all ${getEstadoColor(pago.estado)} shadow-sm`}
                                            >
                                                {pago.estado.toUpperCase()}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900 border-l border-transparent">
                                            {pago.residente?.nombre} {pago.residente?.apellidos}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                            <div className="flex flex-col">
                                                <span>{pago.concepto}</span>
                                                {pago.reserva_id && <span className="text-[10px] text-blue-500 font-bold uppercase">Reserva #{pago.reserva_id}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 capitalize">
                                            {pago.metodo_pago}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-neutral-900">
                                            {pago.monto} €
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex justify-end items-center gap-4">
                                                <div className="flex gap-2 bg-neutral-50 p-1 rounded-lg border border-neutral-100">
                                                    <button
                                                        onClick={() => {
                                                            const token = localStorage.getItem('token');
                                                            window.open(`http://localhost:3001/api/pagos/${pago.id}/pdf?token=${token}`, '_blank');
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center text-red-500 hover:bg-white rounded-md transition-all shadow-sm hover:shadow"
                                                        title="Descargar PDF"
                                                    >
                                                        PDF
                                                    </button>
                                                    <button
                                                        onClick={async () => {
                                                            if (!window.confirm('¿Enviar recibo por email al residente?')) return;
                                                            try {
                                                                const token = localStorage.getItem('token');
                                                                const res = await fetch(`http://localhost:3001/api/pagos/${pago.id}/email`, {
                                                                    method: 'POST',
                                                                    headers: { 'Authorization': `Bearer ${token}` }
                                                                });
                                                                const data = await res.json();
                                                                alert(data.message);
                                                            } catch (e) {
                                                                alert('Error enviando email');
                                                            }
                                                        }}
                                                        className="w-8 h-8 flex items-center justify-center text-blue-500 hover:bg-white rounded-md transition-all shadow-sm hover:shadow"
                                                        title="Enviar Email"
                                                    >
                                                        📧
                                                    </button>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => { setEditingPago(pago); setIsFormOpen(true); }}
                                                        className="w-8 h-8 flex items-center justify-center text-neutral-600 hover:bg-neutral-100 rounded-md transition-all"
                                                        title="Editar"
                                                    >
                                                        ✏️
                                                    </button>

                                                    {pago.estado === 'pendiente' ? (
                                                        <button onClick={() => handleEstadoChange(pago.id, 'completado')} className="w-8 h-8 flex items-center justify-center text-success-600 hover:bg-success-50 rounded-md transition-all" title="Marcar como Completado">
                                                            ✅
                                                        </button>
                                                    ) : (
                                                        <button onClick={() => handleEstadoChange(pago.id, 'pendiente')} className="w-8 h-8 flex items-center justify-center text-warning-600 hover:bg-warning-50 rounded-md transition-all" title="Marcar como Pendiente">
                                                            ⏳
                                                        </button>
                                                    )}

                                                    <button onClick={() => handleDelete(pago.id)} className="w-8 h-8 flex items-center justify-center text-neutral-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-all" title="Eliminar">
                                                        🗑️
                                                    </button>
                                                </div>
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
                <PagoForm
                    initialData={editingPago}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
