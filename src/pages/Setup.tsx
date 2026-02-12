import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Setup = () => {
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Iniciando configuración...');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const runSetup = async () => {
            try {
                // Simular descarga de Backend
                setStatus('Descargando Backend y API...');
                for (let i = 0; i <= 30; i++) {
                    setProgress(i);
                    await new Promise(resolve => setTimeout(resolve, 50));
                }

                // Simular descarga de Assets y Recursos
                setStatus('Sincronizando Assets y Archivos Multimedia...');
                for (let i = 31; i <= 60; i++) {
                    setProgress(i);
                    await new Promise(resolve => setTimeout(resolve, 30));
                }

                // Simular configuración de Base de Datos
                setStatus('Instalando Modelos y Base de Datos Local...');
                for (let i = 61; i <= 90; i++) {
                    setProgress(i);
                    await new Promise(resolve => setTimeout(resolve, 40));
                }

                // Finalizando
                setStatus('Finalizando instalación offline...');
                for (let i = 91; i <= 100; i++) {
                    setProgress(i);
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                setStatus('¡Instalación completada!');
                setTimeout(() => {
                    localStorage.setItem('app_installed', 'true');
                    navigate('/login');
                }, 1000);

            } catch (err: any) {
                setError(err.message || 'Error durante la descarga');
            }
        };

        const isInstalled = localStorage.getItem('app_installed');
        if (isInstalled) {
            navigate('/login');
        } else {
            runSetup();
        }
    }, [navigate]);

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="max-w-md w-full bg-slate-800 rounded-2xl shadow-2xl p-8 border border-slate-700">
                <div className="flex justify-center mb-6">
                    <div className="w-20 h-20 bg-blue-600 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10" />
                        </svg>
                    </div>
                </div>

                <h1 className="text-2xl font-bold text-white text-center mb-2">
                    Configurando tu Residencia
                </h1>
                <p className="text-slate-400 text-center text-sm mb-8">
                    Estamos descargando los recursos necesarios para que la aplicación funcione sin internet.
                </p>

                {error ? (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm mb-4">
                        {error}
                        <button
                            onClick={() => window.location.reload()}
                            className="block mt-2 font-bold underline"
                        >
                            Reintentar
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="flex justify-between text-sm mb-2">
                            <span className="text-slate-300 font-medium">{status}</span>
                            <span className="text-blue-400 font-bold">{progress}%</span>
                        </div>
                        <div className="w-full h-3 bg-slate-700 rounded-full overflow-hidden mb-6">
                            <div
                                className="h-full bg-blue-500 transition-all duration-300 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 justify-center">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                            Conexión segura establecida con el servidor
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Setup;
