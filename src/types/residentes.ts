export interface Residente {
    id?: number;
    nombre: string;
    apellidos: string;
    dni: string;
    telefono: string;
    email?: string;
    fechaNacimiento?: string;
    nacionalidad?: string;
    contactoEmergenciaNombre?: string;
    contactoEmergenciaTelefono?: string;
    observaciones?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ApiResponse<T> {
    data: T[];
    pagination: {
        total: number;
        page: number;
        totalPages: number;
    };
}
