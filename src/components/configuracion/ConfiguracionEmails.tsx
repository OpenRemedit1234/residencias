import { useState, useEffect } from 'react';

export default function ConfiguracionEmails() {
    const [config, setConfig] = useState({
        smtp_host: '',
        smtp_port: 587,
        smtp_user: '',
        smtp_pass: '',
        smtp_secure: false,
        smtp_from: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    useEffect(() => {
        fetchConfig();
    }, []);

    const fetchConfig = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:3001/api/configuracion', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (data) {
                setConfig({
                    smtp_host: data.smtp_host || '',
                    smtp_port: data.smtp_port || 587,
                    smtp_user: data.smtp_user || '',
                    smtp_pass: data.smtp_pass || '',
                    smtp_secure: data.smtp_secure || false,
                    smtp_from: data.smtp_from || ''
                });
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        setConfig(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        try {
            const token = localStorage.getItem('token');
            const res = await fetch('http://127.0.0.1:3001/api/configuracion', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(config)
            });

            if (!res.ok) throw new Error('Error guardando configuración');

            setMessage({ type: 'success', text: 'Configuración guardada correctamente' });
        } catch (error) {
            setMessage({ type: 'error', text: 'Error al guardar configuración' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 max-w-2xl">
            <h2 className="text-lg font-bold text-neutral-800 mb-4">Configuración de Email (SMTP)</h2>

            {message && (
                <div className={`p-4 mb-4 rounded text-sm ${message.type === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message.text}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Host SMTP</label>
                        <input
                            type="text"
                            name="smtp_host"
                            value={config.smtp_host}
                            onChange={handleChange}
                            placeholder="ej: smtp.gmail.com"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Puerto</label>
                        <input
                            type="number"
                            name="smtp_port"
                            value={config.smtp_port}
                            onChange={handleChange}
                            placeholder="587"
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Usuario</label>
                        <input
                            type="text"
                            name="smtp_user"
                            value={config.smtp_user}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-neutral-700 mb-1">Contraseña</label>
                        <input
                            type="password"
                            name="smtp_pass"
                            value={config.smtp_pass}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-neutral-700 mb-1">Email Remitente (From)</label>
                    <input
                        type="text"
                        name="smtp_from"
                        value={config.smtp_from}
                        onChange={handleChange}
                        placeholder='"Mi Residencia" <noreply@residencia.com>'
                        className="w-full px-3 py-2 border border-neutral-300 rounded-md"
                    />
                </div>

                <div className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        id="smtp_secure"
                        name="smtp_secure"
                        checked={config.smtp_secure}
                        onChange={handleChange}
                        className="rounded border-neutral-300 text-primary-600 focus:ring-primary-500"
                    />
                    <label htmlFor="smtp_secure" className="text-sm text-neutral-700">Usar conexión segura (SSL/TLS)</label>
                </div>

                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 disabled:opacity-50"
                    >
                        {loading ? 'Guardando...' : 'Guardar Configuración'}
                    </button>
                </div>
            </form>
        </div>
    );
}
