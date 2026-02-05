import React, { useState, useEffect } from 'react';
import { Residente } from '../../types/residentes';

interface ResidenteFormProps {
    initialData?: Residente;
    onSubmit: (data: Residente) => Promise<void>;
    onCancel: () => void;
    isLoading?: boolean;
}

const ResidenteForm: React.FC<ResidenteFormProps> = ({
    initialData,
    onSubmit,
    onCancel,
    isLoading = false
}) => {
    const [formData, setFormData] = useState<Residente>({
        nombre: '',
        apellidos: '',
        dni: '',
        telefono: '',
        email: '',
        fechaNacimiento: '',
        nacionalidad: 'Española',
        contactoEmergenciaNombre: '',
        contactoEmergenciaTelefono: '',
        observaciones: ''
    });

    useEffect(() => {
        if (initialData) {
            setFormData(initialData);
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Datos Personales */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-neutral-800 border-b pb-2">Datos Personales</h3>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Nombre *</label>
                        <input
                            type="text"
                            name="nombre"
                            value={formData.nombre}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Apellidos *</label>
                        <input
                            type="text"
                            name="apellidos"
                            value={formData.apellidos}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">DNI/NIE *</label>
                        <input
                            type="text"
                            name="dni"
                            value={formData.dni}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Fecha de Nacimiento</label>
                        <input
                            type="date"
                            name="fechaNacimiento"
                            value={formData.fechaNacimiento ? new Date(formData.fechaNacimiento).toISOString().split('T')[0] : ''}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Nacionalidad</label>
                        <input
                            type="text"
                            name="nacionalidad"
                            value={formData.nacionalidad}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </div>
                </div>

                {/* Contacto y Otros */}
                <div className="space-y-4">
                    <h3 className="text-lg font-medium text-neutral-800 border-b pb-2">Contacto</h3>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Teléfono *</label>
                        <input
                            type="tel"
                            name="telefono"
                            value={formData.telefono}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                        />
                    </div>

                    <div className="pt-4">
                        <h4 className="text-sm font-medium text-neutral-800 mb-2">Contacto de Emergencia</h4>
                        <div className="space-y-3">
                            <div>
                                <label className="block text-xs text-neutral-600 mb-1">Nombre</label>
                                <input
                                    type="text"
                                    name="contactoEmergenciaNombre"
                                    value={formData.contactoEmergenciaNombre}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-neutral-600 mb-1">Teléfono</label>
                                <input
                                    type="tel"
                                    name="contactoEmergenciaTelefono"
                                    value={formData.contactoEmergenciaTelefono}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-medium text-neutral-800 border-b pb-2">Observaciones</h3>
                <textarea
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-neutral-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                    disabled={isLoading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-primary-500 rounded-md hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    disabled={isLoading}
                >
                    {isLoading ? 'Guardando...' : initialData ? 'Actualizar Residente' : 'Guardar Residente'}
                </button>
            </div>
        </form>
    );
};

export default ResidenteForm;
