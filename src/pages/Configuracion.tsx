import { useState } from 'react';
import ConfiguracionEmails from '../components/configuracion/ConfiguracionEmails';
import AdminUsuarios from '../components/configuracion/AdminUsuarios';
import AdminBackups from '../components/configuracion/AdminBackups';
import AdminEmpresa from '../components/configuracion/AdminEmpresa';
import ConnectivityInfo from '../components/configuracion/ConnectivityInfo';

export default function Configuracion() {
    const [activeTab, setActiveTab] = useState('empresa');

    const tabs = [
        { id: 'empresa', label: 'Empresa', component: <AdminEmpresa /> },
        { id: 'usuarios', label: 'Usuarios', component: <AdminUsuarios /> },
        { id: 'emails', label: 'Emails', component: <ConfiguracionEmails /> },
        { id: 'backups', label: 'Backups', component: <AdminBackups /> },
        { id: 'conectividad', label: 'Conectividad LAN', component: <ConnectivityInfo /> }
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-800">Configuración del Sistema</h1>
                <p className="text-neutral-600">Gestione los parámetros generales de la aplicación</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                <div className="flex border-b border-neutral-200">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 text-sm font-medium transition-colors
                                ${activeTab === tab.id
                                    ? 'border-b-2 border-primary-600 text-primary-600 bg-primary-50'
                                    : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'}
                            `}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="p-6 bg-neutral-50 min-h-[500px]">
                    {tabs.find(t => t.id === activeTab)?.component}
                </div>
            </div>
        </div>
    );
}
