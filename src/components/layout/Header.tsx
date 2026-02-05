import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Header() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
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
                    className="btn-secondary"
                >
                    Cerrar Sesión
                </button>
            </div>
        </header>
    );
}
