import { useState, useEffect } from 'react';
import HabitacionForm from '../components/habitaciones/HabitacionForm';

interface Habitacion {
    id: number;
    numero: string;
    nombre: string;
    tipo: string;
    capacidad: number;
    precio_noche: number;
    estado: string;
    descripcion: string;
    servicios: string;
}

export default function Habitaciones() {
    const [habitaciones, setHabitaciones] = useState<Habitacion[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingHabitacion, setEditingHabitacion] = useState<Habitacion | null>(null);
    const [filterEstado, setFilterEstado] = useState('todos');

    const fetchHabitaciones = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:3001/api/habitaciones`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar habitaciones');
            const data = await response.json();
            setHabitaciones(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHabitaciones();
    }, []);

    const handleEstadoChange = async (id: number, nuevoEstado: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://127.0.0.1:3001/api/habitaciones/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (!response.ok) throw new Error('Error al cambiar estado');
            fetchHabitaciones();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSubmit = async (data: any) => {
        const token = localStorage.getItem('token');
        const url = editingHabitacion
            ? `http://127.0.0.1:3001/api/habitaciones/${editingHabitacion.id}`
            : 'http://127.0.0.1:3001/api/habitaciones';
        const method = editingHabitacion ? 'PUT' : 'POST';

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
        fetchHabitaciones();
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'disponible': return 'bg-success-100 text-success-800 border-success-200';
            case 'ocupada': return 'bg-danger-100 text-danger-800 border-danger-200';
            case 'limpieza': return 'bg-warning-100 text-warning-800 border-warning-200';
            case 'mantenimiento': return 'bg-neutral-200 text-neutral-800 border-neutral-300';
            default: return 'bg-neutral-100 text-neutral-800';
        }
    };

    const filteredHabitaciones = habitaciones.filter(h =>
        filterEstado === 'todos' || h.estado === filterEstado
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Habitaciones</h1>
                    <p className="text-neutral-600">Gestión de habitaciones y estados</p>
                </div>
                <button
                    onClick={() => { setEditingHabitacion(null); setIsFormOpen(true); }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 font-medium"
                >
                    + Nueva Habitación
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-4 rounded-lg shadow-sm mb-6 border border-neutral-200 flex items-center gap-4">
                <span className="text-sm font-medium text-neutral-700">Filtrar por estado:</span>
                <select
                    value={filterEstado}
                    onChange={(e) => setFilterEstado(e.target.value)}
                    className="border border-neutral-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                    <option value="todos">Todos</option>
                    <option value="disponible">Disponibles</option>
                    <option value="ocupada">Ocupadas</option>
                    <option value="limpieza">Limpieza</option>
                    <option value="mantenimiento">Mantenimiento</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center p-8 text-neutral-500">Cargando habitaciones...</div>
            ) : error ? (
                <div className="text-center p-8 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredHabitaciones.map((habitacion) => (
                        <div key={habitacion.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
                            <div className={`px-4 py-2 border-b flex justify-between items-center ${getEstadoColor(habitacion.estado)}`}>
                                <span className="font-bold">Hab. {habitacion.numero}</span>
                                <span className="text-xs uppercase font-semibold tracking-wide">{habitacion.estado}</span>
                            </div>

                            <div className="p-4 flex-1">
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-medium text-neutral-900">{habitacion.nombre || `Habitación ${habitacion.numero}`}</h3>
                                    <span className="text-sm font-bold text-primary-700">{habitacion.precio_noche}€/n</span>
                                </div>

                                <div className="space-y-1 text-sm text-neutral-600 mb-4">
                                    <div className="flex items-center gap-2">
                                        <span>👥</span> {habitacion.tipo} ({habitacion.capacidad} pers.)
                                    </div>
                                    <div className="flex items-center gap-2" title={habitacion.servicios}>
                                        <span>📶</span> {habitacion.servicios ? habitacion.servicios.substring(0, 25) + (habitacion.servicios.length > 25 ? '...' : '') : 'Sin servicios'}
                                    </div>
                                </div>

                                <div className="flex gap-2 mt-auto">
                                    <button
                                        onClick={() => { setEditingHabitacion(habitacion); setIsFormOpen(true); }}
                                        className="flex-1 px-3 py-1.5 bg-white border border-neutral-300 text-neutral-700 text-sm rounded hover:bg-neutral-50"
                                    >
                                        Editar
                                    </button>
                                    <select
                                        value={habitacion.estado}
                                        onChange={(e) => handleEstadoChange(habitacion.id, e.target.value)}
                                        className="flex-1 px-2 py-1.5 border border-neutral-300 text-sm rounded focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    >
                                        <option value="disponible">Disponible</option>
                                        <option value="ocupada">Ocupada</option>
                                        <option value="limpieza">Limpieza</option>
                                        <option value="mantenimiento">Mantenimiento</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {habitaciones.length === 0 && !loading && (
                <div className="text-center p-8 text-neutral-500 border-2 border-dashed border-neutral-200 rounded-lg">
                    No hay habitaciones registradas.
                </div>
            )}

            {isFormOpen && (
                <HabitacionForm
                    initialData={editingHabitacion}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
