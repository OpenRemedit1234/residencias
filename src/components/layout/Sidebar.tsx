import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Sidebar() {
    const location = useLocation();
    const [companyName, setCompanyName] = useState('Residencia');

    useEffect(() => {
        const fetchCompany = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) return;
                const res = await fetch('http://localhost:3001/api/configuracion', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    if (data.empresa_nombre) setCompanyName(data.empresa_nombre);
                }
            } catch (e) {
                console.error("Error loading company name in sidebar");
            }
        };
        fetchCompany();
    }, []);

    const menuItems = [
        { path: '/dashboard', icon: '📊', label: 'Dashboard' },
        { path: '/calendario', icon: '📅', label: 'Calendario' },
        { path: '/residentes', icon: '👥', label: 'Residentes' },
        { path: '/habitaciones', icon: '🛏️', label: 'Habitaciones' },
        { path: '/apartamentos', icon: '🏢', label: 'Apartamentos' },
        { path: '/reservas', icon: '📋', label: 'Reservas' },
        { path: '/pagos', icon: '💳', label: 'Pagos' },
        { path: '/reportes', icon: '📈', label: 'Reportes' },
        { path: '/configuracion', icon: '⚙️', label: 'Configuración' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col shadow-xl z-20">
            <div className="p-8 border-b border-neutral-100 bg-gradient-to-br from-white to-neutral-50">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-black text-xl shadow-lg shadow-primary-200">
                        {companyName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <h1 className="text-lg font-black text-neutral-800 leading-none truncate w-32" title={companyName}>
                            {companyName}
                        </h1>
                        <span className="text-[10px] font-bold text-primary-600 uppercase tracking-widest mt-1 block">Gestión Pro</span>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar pt-6">
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex items-center gap-4 px-5 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                ? 'bg-primary-600 text-white shadow-lg shadow-primary-100 scale-[1.02]'
                                : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                                }`}
                        >
                            <span className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                {item.icon}
                            </span>
                            <span className="font-semibold text-sm mr-auto">{item.label}</span>
                            {isActive && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>}
                        </Link>
                    );
                })}
            </nav>

            <div className="p-6 border-t border-neutral-100 bg-neutral-50/50">
                <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                    <span>Versión 1.0.0</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" title="Sistema Online"></span>
                </div>
            </div>
        </aside>
    );
}
