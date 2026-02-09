import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isBackingUp, setIsBackingUp] = useState(false);

    const handleLogout = async () => {
        try {
            setIsBackingUp(true);
            const token = localStorage.getItem('token');

            // Intentar realizar backup antes de salir
            if (token) {
                await fetch('http://localhost:3001/api/backups', {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }
        } catch (error) {
            console.error("Error al realizar backup automático en logout:", error);
        } finally {
            logout();
            setIsBackingUp(false);
            navigate('/login');
        }
    };

    return (
        <>
            {isBackingUp && (
                <div className="fixed inset-0 bg-neutral-900/80 backdrop-blur-sm z-[100] flex items-center justify-center">
                    <div className="bg-white p-8 rounded-2xl shadow-2xl text-center max-w-xs w-full animate-in fade-in zoom-in duration-300">
                        <div className="w-16 h-16 border-4 border-primary-100 border-t-primary-600 rounded-full animate-spin mx-auto mb-6"></div>
                        <h3 className="text-xl font-bold text-neutral-800 mb-2">Cerrando sistema</h3>
                        <p className="text-neutral-500 text-sm">
                            Por favor, espere. Estamos realizando una <span className="text-primary-600 font-bold">copia de seguridad automática</span> de sus datos antes de salir.
                        </p>
                    </div>
                </div>
            )}
            <header className="bg-white border-b border-neutral-200 px-6 py-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-neutral-800">
                            Bienvenido, {user?.username}
                        </h2>
                        <p className="text-sm text-neutral-600 capitalize">
                            Rol: {user?.rol}
                        </p>
                    </div>

                    <button
                        onClick={handleLogout}
                        disabled={isBackingUp}
                        className={`btn-secondary flex items-center gap-2 ${isBackingUp ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        <span>🔒</span>
                        Cerrar Sesión
                    </button>
                </div>
            </header>
        </>
    );
}
