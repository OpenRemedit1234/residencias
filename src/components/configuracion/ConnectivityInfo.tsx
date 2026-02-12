import { useState, useEffect } from 'react';

declare global {
    interface Window {
        electronAPI: {
            getServerIp: () => Promise<string>;
        };
    }
}

const ConnectivityInfo = () => {
    const [ip, setIp] = useState<string>('Cargando...');
    const [status, setStatus] = useState<'online' | 'offline'>('offline');

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

    return (
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
                <h3 className="text-lg font-bold text-neutral-800 mb-4 flex items-center gap-2">
                    <span className={`w-3 h-3 rounded-full ${status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                    Estado de la Red Local (LAN)
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-100">
                        <p className="text-sm text-neutral-500 mb-1">Dirección IP del Servidor</p>
                        <p className="text-2xl font-mono font-bold text-primary-700">{ip}</p>
                        <p className="text-xs text-neutral-400 mt-2">
                            Usa esta IP para conectar otros dispositivos en la misma red.
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
        </div>
    );
};

export default ConnectivityInfo;
