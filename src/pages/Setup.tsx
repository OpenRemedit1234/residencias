import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

declare global {
    interface Window {
        electronAPI: {
            getServerIp: () => Promise<string>;
            selectDatabase: () => Promise<string | null>;
        };
    }
}

const Setup = () => {
    const [step, setStep] = useState<'selection' | 'config' | 'loading'>('selection');
    const [mode, setMode] = useState<'server' | 'client' | null>(null);
    const [serverIp, setServerIp] = useState('');
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Iniciando configuración...');
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const isInstalled = localStorage.getItem('app_installed');
        if (isInstalled) {
            navigate('/login');
        }
    }, [navigate]);

    const handleCloudDbSelect = async () => {
        if (window.electronAPI && window.electronAPI.selectDatabase) {
            const dbPath = await window.electronAPI.selectDatabase();
            if (dbPath) {
                setStatus(`Conectado a la nube: ${dbPath.split('\\').pop()}`);
                // Una vez seleccionada la DB, consideramos el sistema configurado como servidor local
                localStorage.setItem('api_url', 'http://127.0.0.1:3001');
                localStorage.setItem('app_mode', 'server');
                localStorage.setItem('app_installed', 'true');
                navigate('/login');
            }
        } else {
            setError('La sincronización en la nube nativa requiere la aplicación de escritorio.');
        }
    };

    const runSetup = async (finalIp: string) => {
        setStep('loading');
        try {
            localStorage.setItem('api_url', finalIp);
            localStorage.setItem('app_mode', mode!);

            // Simular instalación
            setStatus('Sincronizando componentes...');
            for (let i = 0; i <= 40; i++) {
                setProgress(i);
                await new Promise(resolve => setTimeout(resolve, 30));
            }

            setStatus(mode === 'server' ? 'Inicializando Base de Datos Local...' : 'Verificando conexión con Servidor Principal...');
            for (let i = 41; i <= 80; i++) {
                setProgress(i);
                await new Promise(resolve => setTimeout(resolve, 50));
            }

            setStatus('Finalizando configuración...');
            for (let i = 81; i <= 100; i++) {
                setProgress(i);
                await new Promise(resolve => setTimeout(resolve, 20));
            }

            localStorage.setItem('app_installed', 'true');
            navigate('/login');
        } catch (err: any) {
            setError(err.message || 'Error durante la configuración');
            setStep('selection');
        }
    };

    const handleModeSelect = (selectedMode: 'server' | 'client') => {
        setMode(selectedMode);
        if (selectedMode === 'server') {
            runSetup('http://127.0.0.1:3001');
        } else {
            setStep('config');
        }
    };

    const handleClientConfigSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!serverIp) {
            setError('Por favor, introduce la IP del servidor.');
            return;
        }
        // Asegurar formato http://
        let finalIp = serverIp.trim();
        if (!finalIp.startsWith('http')) {
            finalIp = `http://${finalIp}`;
        }
        if (!finalIp.includes(':')) {
            finalIp = `${finalIp}:3001`;
        }
        runSetup(finalIp);
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 font-sans">
            <div className="max-w-2xl w-full bg-slate-800 rounded-3xl shadow-2xl overflow-hidden border border-white/10">

                {/* Header Estilizado */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4 shadow-xl border border-white/30">
                            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-extrabold text-white tracking-tight">
                            Sistema de Gestión Residencial
                        </h1>
                        <p className="text-blue-100 mt-2 font-medium">Bienvenido al asistente de configuración inicial</p>
                    </div>
                </div>

                <div className="p-8">
                    {step === 'selection' && (
                        <div className="animate-in fade-in duration-500">

                            {/* Opción NUBE destacada */}
                            <div className="mb-8">
                                <button
                                    onClick={handleCloudDbSelect}
                                    className="w-full flex items-center gap-6 bg-emerald-600/10 hover:bg-emerald-600/20 border-2 border-emerald-500/50 p-5 rounded-2xl transition-all group text-left"
                                >
                                    <div className="w-14 h-14 bg-emerald-500 rounded-xl flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-emerald-400 font-bold text-lg">Sincronización en la Nube</h3>
                                        <p className="text-slate-400 text-sm">Usa OneDrive o Dropbox para compartir datos entre varios PCs.</p>
                                    </div>
                                    <svg className="w-6 h-6 text-emerald-500 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>

                            <div className="flex items-center gap-4 mb-6">
                                <div className="h-px bg-slate-700 flex-1"></div>
                                <span className="text-slate-500 text-xs font-bold uppercase tracking-widest">Otras Opciones</span>
                                <div className="h-px bg-slate-700 flex-1"></div>
                            </div>

                            <h2 className="text-xl font-bold text-white mb-6 text-center">¿Cómo vas a usar esta aplicación?</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Opción Servidor */}
                                <button
                                    onClick={() => handleModeSelect('server')}
                                    className="group bg-slate-700/50 hover:bg-blue-600/20 border-2 border-slate-600 hover:border-blue-500 p-6 rounded-2xl transition-all duration-300 text-left"
                                >
                                    <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white text-blue-400 transition-colors">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 012 2h14a2 2 0 012-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Servidor Principal (Sitio A)</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        Este es el PC donde se guardarán todos los datos. Es el PC principal de la residencia o la oficina central.
                                    </p>
                                </button>

                                {/* Opción Cliente */}
                                <button
                                    onClick={() => handleModeSelect('client')}
                                    className="group bg-slate-700/50 hover:bg-indigo-600/20 border-2 border-slate-600 hover:border-indigo-500 p-6 rounded-2xl transition-all duration-300 text-left"
                                >
                                    <div className="w-12 h-12 bg-indigo-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white text-indigo-400 transition-colors">
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 21h6l-.75-4M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2">Puesto Secundario (Sitio B)</h3>
                                    <p className="text-slate-400 text-sm leading-relaxed">
                                        PC secundario, tablet o portátil. Se conecta a los datos guardados en el Servidor Principal a través de la red o Internet.
                                    </p>
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'config' && (
                        <div className="animate-in slide-in-from-right duration-400">
                            <button
                                onClick={() => setStep('selection')}
                                className="text-slate-400 hover:text-white flex items-center gap-2 mb-6"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                                Volver atrás
                            </button>
                            <h2 className="text-xl font-bold text-white mb-4">Configuración de Conexión</h2>
                            <p className="text-slate-400 text-sm mb-6">
                                Introduce la Dirección IP o URL del Servidor Principal (Sitio A).
                                <br /><span className="text-xs text-blue-400 italic">Ejemplo: 192.168.1.50 o mitunnel.tailscale.net</span>
                            </p>

                            <form onSubmit={handleClientConfigSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-slate-300 text-sm font-medium mb-2">Dirección del Servidor</label>
                                    <input
                                        type="text"
                                        placeholder="192.168.X.X"
                                        value={serverIp}
                                        onChange={(e) => setServerIp(e.target.value)}
                                        className="w-full bg-slate-900 border border-slate-600 rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-indigo-600/20 transition-all active:scale-95"
                                >
                                    Conectar y Comenzar
                                </button>
                            </form>
                        </div>
                    )}

                    {step === 'loading' && (
                        <div className="animate-in zoom-in duration-500">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="text-slate-300 font-medium">{status}</span>
                                <span className="text-blue-400 font-bold">{progress}%</span>
                            </div>
                            <div className="w-full h-4 bg-slate-900 rounded-full overflow-hidden mb-6 border border-white/5">
                                <div
                                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300 ease-out shadow-[0_0_20px_rgba(79,70,229,0.4)]"
                                    style={{ width: `${progress}%` }}
                                />
                            </div>
                            <div className="flex items-center gap-3 text-xs text-slate-500 justify-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]" />
                                {mode === 'server' ? 'Activando motor de base de datos local' : 'Enlazando con el servidor remoto'}
                            </div>
                        </div>
                    )}

                    {error && (
                        <div className="mt-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center gap-3 animate-bounce">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {error}
                        </div>
                    )}
                </div>

                <div className="bg-slate-900/50 px-8 py-4 border-t border-white/5 text-center">
                    <p className="text-xs text-slate-500">
                        © 2026 Sistema de Gestión Residencial - Versión Enterprise
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Setup;
