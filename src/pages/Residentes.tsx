import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Residente, ApiResponse } from '../types/residentes';
import ResidenteForm from '../components/residentes/ResidenteForm';

const Residentes: React.FC = () => {
    const { token } = useAuth();
    const [residentes, setResidentes] = useState<Residente[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [currentResidente, setCurrentResidente] = useState<Residente | undefined>(undefined);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Fetch residentes
    const fetchResidentes = async () => {
        try {
            setLoading(true);
            const response = await axios.get<ApiResponse<Residente>>(
                `http://localhost:3001/api/residentes?page=${page}&limit=10&search=${search}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setResidentes(response.data.data);
            setTotalPages(response.data.pagination.totalPages);
            setError('');
        } catch (err) {
            setError('Error al cargar residentes');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResidentes();
    }, [page, search, token]);

    // Handlers
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page on search
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('¿Estás seguro de eliminar este residente?')) return;

        try {
            await axios.delete(`http://localhost:3001/api/residentes/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchResidentes();
        } catch (err) {
            alert('Error al eliminar residente');
            console.error(err);
        }
    };

    const handleEdit = (residente: Residente) => {
        setCurrentResidente(residente);
        setShowModal(true);
    };

    const handleCreate = () => {
        setCurrentResidente(undefined);
        setShowModal(true);
    };

    const handleSubmit = async (data: Residente) => {
        try {
            setIsSubmitting(true);
            if (currentResidente?.id) {
                // Update
                await axios.put(`http://localhost:3001/api/residentes/${currentResidente.id}`, data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            } else {
                // Create
                await axios.post('http://localhost:3001/api/residentes', data, {
                    headers: { Authorization: `Bearer ${token}` }
                });
            }
            setShowModal(false);
            fetchResidentes();
        } catch (err) {
            console.error(err);
            alert('Error al guardar residente. Verifique que el DNI no esté duplicado.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-neutral-800">Residentes</h1>
                <button
                    onClick={handleCreate}
                    className="bg-primary-500 text-white px-4 py-2 rounded-md hover:bg-primary-600 transition-colors"
                >
                    + Nuevo Residente
                </button>
            </div>

            {/* Filtros */}
            <div className="mb-6 bg-white p-4 rounded-lg shadow-sm border border-neutral-200">
                <input
                    type="text"
                    placeholder="Buscar por nombre, apellidos o DNI..."
                    value={search}
                    onChange={handleSearch}
                    className="w-full px-4 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
            </div>

            {/* Tabla */}
            {loading ? (
                <div className="text-center py-10">Cargando...</div>
            ) : error ? (
                <div className="text-red-500 text-center py-10">{error}</div>
            ) : (
                <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                    <table className="min-w-full divide-y divide-neutral-200">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Residente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">DNI</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Contacto</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Fecha Nac.</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-neutral-500 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-neutral-200">
                            {residentes.map((residente) => (
                                <tr key={residente.id} className="hover:bg-neutral-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-neutral-900">{residente.nombre} {residente.apellidos}</div>
                                        <div className="text-sm text-neutral-500">{residente.nacionalidad}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {residente.dni}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-neutral-900">{residente.telefono}</div>
                                        <div className="text-sm text-neutral-500">{residente.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500">
                                        {residente.fechaNacimiento ? new Date(residente.fechaNacimiento).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(residente)}
                                            className="text-primary-600 hover:text-primary-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => residente.id && handleDelete(residente.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {residentes.length === 0 && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                                        No se encontraron residentes
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                    {/* Paginación */}
                    <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-neutral-200 sm:px-6">
                        <div className="flex-1 flex justify-between sm:hidden">
                            <button
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
                            >
                                Anterior
                            </button>
                            <button
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="ml-3 relative inline-flex items-center px-4 py-2 border border-neutral-300 text-sm font-medium rounded-md text-neutral-700 bg-white hover:bg-neutral-50 disabled:opacity-50"
                            >
                                Siguiente
                            </button>
                        </div>
                        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                            <div>
                                <p className="text-sm text-neutral-700">
                                    Página <span className="font-medium">{page}</span> de <span className="font-medium">{totalPages}</span>
                                </p>
                            </div>
                            <div>
                                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                                    <button
                                        onClick={() => setPage(1)}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
                                    >
                                        Primera
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.max(1, p - 1))}
                                        disabled={page === 1}
                                        className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
                                    >
                                        Anterior
                                    </button>
                                    <button
                                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                        disabled={page === totalPages}
                                        className="relative inline-flex items-center px-4 py-2 border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
                                    >
                                        Siguiente
                                    </button>
                                    <button
                                        onClick={() => setPage(totalPages)}
                                        disabled={page === totalPages}
                                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-neutral-300 bg-white text-sm font-medium text-neutral-500 hover:bg-neutral-50 disabled:opacity-50"
                                    >
                                        Última
                                    </button>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                            <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowModal(false)}></div>
                        </div>
                        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="sm:flex sm:items-start">
                                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                                        <h3 className="text-lg leading-6 font-medium text-neutral-900 mb-4" id="modal-title">
                                            {currentResidente ? 'Editar Residente' : 'Nuevo Residente'}
                                        </h3>
                                        <ResidenteForm
                                            initialData={currentResidente}
                                            onSubmit={handleSubmit}
                                            onCancel={() => setShowModal(false)}
                                            isLoading={isSubmitting}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Residentes;
