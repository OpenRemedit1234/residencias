import { useState, useEffect } from 'react';

declare global {
    interface Window {
        electronAPI: {
            getServerIp: () => Promise<string>;
            selectDatabase: () => Promise<string | null>;
        };
    }
}

const ConnectivityInfo = () => {
    const [ip, setIp] = useState<string>('Cargando...');
    const [currentApiUrl, setCurrentApiUrl] = useState<string>(localStorage.getItem('api_url') || '');
    const [status, setStatus] = useState<'online' | 'offline'>('offline');
    const [isEditing, setIsEditing] = useState(false);
    const [tempUrl, setTempUrl] = useState(currentApiUrl);

    const handleDatabaseChange = async () => {
        if (window.electronAPI && window.electronAPI.selectDatabase) {
            const path = await window.electronAPI.selectDatabase();
            if (path) {
                alert(`Cambiado a: ${path}\nLa aplicación se reiniciará para aplicar los cambios.`);
                window.location.reload();
            }
        }
    };

    useEffect(() => {
        const fetchIp = async () => {
            if (window.electronAPI) {
                const serverIp = await window.electronAPI.getServerIp();
                setIp(serverIp);
                setStatus('online');
            }
        };
        fetchIp();
    }, []);

    const handleSave = () => {
        localStorage.setItem('api_url', tempUrl);
        setCurrentApiUrl(tempUrl);
        setIsEditing(false);
        window.location.reload(); // Recargar para aplicar cambios en el servicio API
    };

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-neutral-800 flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                        Estado de la Red Local (LAN)
                    </h3>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className="text-primary-600 text-sm font-bold hover:underline"
                    >
                        {isEditing ? 'Cancelar' : 'Cambiar IP del Servidor'}
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                        <p className="text-sm text-neutral-500 mb-1">
                            {localStorage.getItem('app_mode') === 'client' ? 'Conectado al Servidor' : 'Esta Dirección IP (Local)'}
                        </p>

                        {isEditing ? (
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={tempUrl}
                                    onChange={(e) => setTempUrl(e.target.value)}
                                    className="flex-1 bg-white border border-neutral-300 rounded px-2 py-1 font-mono text-sm"
                                />
                                <button
                                    onClick={handleSave}
                                    className="bg-primary-600 text-white px-3 py-1 rounded text-sm font-bold"
                                >
                                    Guardar
                                </button>
                            </div>
                        ) : (
                            <p className="text-2xl font-mono font-bold text-primary-700">{currentApiUrl || ip}</p>
                        )}

                        <p className="text-xs text-neutral-400 mt-2">
                            {localStorage.getItem('app_mode') === 'client'
                                ? 'Dirección actual del servidor de datos.'
                                : 'Usa esta IP para conectar otros dispositivos en la misma red.'}
                        </p>
                    </div>

                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                        <p className="text-sm text-neutral-500 mb-1">Puerto de Comunicación</p>
                        <p className="text-2xl font-mono font-bold text-neutral-700">3001</p>
                        <p className="text-xs text-neutral-400 mt-2">
                            Asegúrate de que el firewall de Windows permita tráfico por este puerto.
                        </p>
                    </div>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-6">
                <h4 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    ¿Cómo conectar otros dispositivos?
                </h4>
                <ul className="text-sm text-blue-700 space-y-2 list-disc list-inside">
                    <li>Asegúrate de que el otro dispositivo esté conectado al mismo Wi-Fi o red de cable.</li>
                    <li>Abre el navegador en el otro dispositivo (móvil, tablet u otro PC).</li>
                    <li>Escribe en la barra de direcciones: <code className="bg-blue-100 px-1 rounded font-bold">http://{ip}:3001</code></li>
                    <li>¡Listo! Podrás ver y gestionar los datos de la residencia desde cualquier lugar de tu oficina o local.</li>
                </ul>
            </div>

            <div className="bg-amber-50 border border-amber-100 rounded-xl p-6">
                <h4 className="font-bold text-amber-800 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Sincronización de Archivos
                </h4>
                <p className="text-sm text-amber-700">
                    Los cambios se sincronizan en tiempo real porque todos los dispositivos atacan a la misma base de datos central en este PC. No es necesario realizar importaciones manuales para trabajar en red.
                </p>
            </div>

            {/* Nueva sección para base de datos en la nube */}
            <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-6 shadow-sm">
                <div className="flex justify-between items-start mb-3">
                    <div>
                        <h4 className="font-bold text-emerald-800 flex items-center gap-2">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                            </svg>
                            Base de Datos en la Nube
                        </h4>
                        <p className="text-xs text-emerald-600 mt-1">Sincroniza tus datos entre varios PCs usando OneDrive, Dropbox o Google Drive.</p>
                    </div>
                    <button
                        onClick={handleDatabaseChange}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-md shadow-emerald-600/20"
                    >
                        Cambiar Archivo DB
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConnectivityInfo;
