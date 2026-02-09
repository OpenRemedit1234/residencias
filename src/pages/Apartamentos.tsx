import { useState, useEffect } from 'react';
import ApartamentoForm from '../components/apartamentos/ApartamentoForm';

interface Apartamento {
    id: number;
    numero: string;
    nombre: string;
    habitaciones: number;
    banos: number;
    capacidad: number; // Añadido
    metros_cuadrados: number;
    precio_mes: number;
    precio_noche: number;
    estado: string;
    descripcion: string;
    servicios: string;
}

export default function Apartamentos() {
    const [apartamentos, setApartamentos] = useState<Apartamento[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingApartamento, setEditingApartamento] = useState<Apartamento | null>(null);
    const [filterEstado, setFilterEstado] = useState('todos');

    const fetchApartamentos = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/apartamentos`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Error al cargar apartamentos');
            const data = await response.json();
            setApartamentos(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApartamentos();
    }, []);

    const handleEstadoChange = async (id: number, nuevoEstado: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`http://localhost:3001/api/apartamentos/${id}/estado`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (!response.ok) throw new Error('Error al cambiar estado');
            fetchApartamentos();
        } catch (err: any) {
            alert(err.message);
        }
    };

    const handleSubmit = async (data: any) => {
        const token = localStorage.getItem('token');
        const url = editingApartamento
            ? `http://localhost:3001/api/apartamentos/${editingApartamento.id}`
            : 'http://localhost:3001/api/apartamentos';
        const method = editingApartamento ? 'PUT' : 'POST';

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
        fetchApartamentos();
    };

    const getEstadoColor = (estado: string) => {
        switch (estado) {
            case 'disponible': return 'bg-success-100 text-success-800 border-success-200';
            case 'ocupado': return 'bg-danger-100 text-danger-800 border-danger-200';
            case 'limpieza': return 'bg-warning-100 text-warning-800 border-warning-200';
            case 'mantenimiento': return 'bg-neutral-200 text-neutral-800 border-neutral-300';
            default: return 'bg-neutral-100 text-neutral-800';
        }
    };

    const filteredApartamentos = apartamentos.filter(a =>
        filterEstado === 'todos' || a.estado === filterEstado
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-neutral-800">Apartamentos</h1>
                    <p className="text-neutral-600">Gestión de apartamentos completos</p>
                </div>
                <button
                    onClick={() => { setEditingApartamento(null); setIsFormOpen(true); }}
                    className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 font-medium"
                >
                    + Nuevo Apartamento
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
                    <option value="ocupado">Ocupados</option>
                    <option value="limpieza">Limpieza</option>
                    <option value="mantenimiento">Mantenimiento</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center p-8 text-neutral-500">Cargando apartamentos...</div>
            ) : error ? (
                <div className="text-center p-8 text-red-500">{error}</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredApartamentos.map((apartamento) => (
                        <div key={apartamento.id} className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden flex flex-col">
                            <div className={`px-4 py-3 border-b flex justify-between items-center ${getEstadoColor(apartamento.estado)}`}>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-lg">{apartamento.numero}</span>
                                    {apartamento.nombre && (
                                        <span className="text-sm opacity-80">- {apartamento.nombre}</span>
                                    )}
                                </div>
                                <span className="text-xs uppercase font-semibold tracking-wide bg-white bg-opacity-30 px-2 py-0.5 rounded">
                                    {apartamento.estado}
                                </span>
                            </div>

                            <div className="p-5 flex-1 flex flex-col gap-4">
                                <div className="grid grid-cols-4 gap-2 text-center text-sm border-b pb-3">
                                    <div className="bg-neutral-50 p-2 rounded">
                                        <span className="block font-bold text-lg">{apartamento.habitaciones}</span>
                                        <span className="text-neutral-500 text-xs">Habit.</span>
                                    </div>
                                    <div className="bg-neutral-50 p-2 rounded">
                                        <span className="block font-bold text-lg">{apartamento.banos}</span>
                                        <span className="text-neutral-500 text-xs">Baños</span>
                                    </div>
                                    <div className="bg-neutral-50 p-2 rounded">
                                        <span className="block font-bold text-lg">{apartamento.capacidad}</span>
                                        <span className="text-neutral-500 text-xs">Cap.</span>
                                    </div>
                                    <div className="bg-neutral-50 p-2 rounded">
                                        <span className="block font-bold text-lg">{apartamento.metros_cuadrados}</span>
                                        <span className="text-neutral-500 text-xs">m²</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <div className="text-2xl font-bold text-primary-700">{apartamento.precio_mes}€<span className="text-sm font-normal text-neutral-500">/mes</span></div>
                                        {apartamento.precio_noche > 0 && (
                                            <div className="text-sm text-neutral-500">{apartamento.precio_noche}€/noche</div>
                                        )}
                                    </div>
                                </div>

                                <div className="text-sm text-neutral-600">
                                    <div className="flex items-center gap-2">
                                        <span>🛠️</span> {apartamento.servicios ? apartamento.servicios : 'Sin servicios registrados'}
                                    </div>
                                    {apartamento.descripcion && (
                                        <p className="mt-2 text-neutral-500 italic text-xs">{apartamento.descripcion}</p>
                                    )}
                                </div>

                                <div className="flex gap-2 mt-auto pt-2">
                                    <button
                                        onClick={() => { setEditingApartamento(apartamento); setIsFormOpen(true); }}
                                        className="flex-1 px-3 py-2 bg-white border border-neutral-300 text-neutral-700 text-sm rounded-md hover:bg-neutral-50 font-medium"
                                    >
                                        Editar
                                    </button>
                                    <select
                                        value={apartamento.estado}
                                        onChange={(e) => handleEstadoChange(apartamento.id, e.target.value)}
                                        className="flex-1 px-2 py-2 border border-neutral-300 text-sm rounded-md focus:outline-none focus:ring-1 focus:ring-primary-500"
                                    >
                                        <option value="disponible">Disponible</option>
                                        <option value="ocupado">Ocupado</option>
                                        <option value="limpieza">Limpieza</option>
                                        <option value="mantenimiento">Mantenimiento</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {apartamentos.length === 0 && !loading && (
                <div className="text-center p-8 text-neutral-500 border-2 border-dashed border-neutral-200 rounded-lg">
                    No hay apartamentos registrados.
                </div>
            )}

            {isFormOpen && (
                <ApartamentoForm
                    initialData={editingApartamento}
                    onSubmit={handleSubmit}
                    onCancel={() => setIsFormOpen(false)}
                />
            )}
        </div>
    );
}
