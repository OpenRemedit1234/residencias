import { useState } from 'react';
import ReporteOcupacion from '../components/reportes/ReporteOcupacion';
import ReporteFinanciero from '../components/reportes/ReporteFinanciero';

export default function Reportes() {
    const [activeTab, setActiveTab] = useState('ocupacion');

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-neutral-800">Reportes y Estadísticas</h1>
                <p className="text-neutral-600">Consulte el rendimiento de la residencia</p>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-neutral-200 overflow-hidden">
                <div className="flex border-b border-neutral-200">
                    <button
                        onClick={() => setActiveTab('ocupacion')}
                        className={`px-6 py-3 text-sm font-medium transition-colors
                            ${activeTab === 'ocupacion'
                                ? 'border-b-2 border-primary-600 text-primary-600 bg-primary-50'
                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'}
                        `}
                    >
                        📊 Ocupación
                    </button>
                    <button
                        onClick={() => setActiveTab('financiero')}
                        className={`px-6 py-3 text-sm font-medium transition-colors
                            ${activeTab === 'financiero'
                                ? 'border-b-2 border-primary-600 text-primary-600 bg-primary-50'
                                : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50'}
                        `}
                    >
                        💰 Financiero
                    </button>
                </div>

                <div className="p-6 bg-neutral-50 min-h-[500px]">
                    {activeTab === 'ocupacion' ? <ReporteOcupacion /> : <ReporteFinanciero />}
                </div>
            </div>
        </div>
    );
}
