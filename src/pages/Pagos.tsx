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

    const fetchPagos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/pagos`, {
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
    }, []);

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

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                {loading ? (
                    <div className="p-8 text-center text-neutral-500">Cargando pagos...</div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500">{error}</div>
                ) : pagos.length === 0 ? (
                    <div className="p-8 text-center text-neutral-500">No hay pagos registrados.</div>
                ) : (
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Residente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Concepto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Método</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Monto</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {pagos.map((pago) => (
                                <tr key={pago.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                        {new Date(pago.fecha_pago).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-neutral-900">
                                        {pago.residente?.nombre} {pago.residente?.apellidos}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600">
                                        {pago.concepto}
                                        {pago.reserva_id && <span className="ml-2 text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">Rsrv #{pago.reserva_id}</span>}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-600 capitalize">
                                        {pago.metodo_pago}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-neutral-900">
                                        {pago.monto} €
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                                        <button
                                            onClick={() => {
                                                const token = localStorage.getItem('token');
                                                window.open(`http://localhost:3001/api/pagos/${pago.id}/pdf?token=${token}`, '_blank');
                                            }}
                                            className="text-neutral-500 hover:text-neutral-800"
                                            title="Descargar PDF"
                                        >
                                            📄
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
                                            className="text-neutral-500 hover:text-blue-600"
                                            title="Enviar Email"
                                        >
                                            📧
                                        </button>
                                        <button onClick={() => handleDelete(pago.id)} className="text-neutral-400 hover:text-red-600" title="Eliminar">
                                            🗑️
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
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
