import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Setup from './pages/Setup';
import Dashboard from './pages/Dashboard';
import Residentes from './pages/Residentes';
import Layout from './components/layout/Layout';

import Habitaciones from './pages/Habitaciones';

import Apartamentos from './pages/Apartamentos';
import Reservas from './pages/Reservas';
import Calendario from './pages/Calendario';
import Pagos from './pages/Pagos';
import Configuracion from './pages/Configuracion';
import Reportes from './pages/Reportes';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/setup" element={<Setup />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/" element={<Layout />}>
                        <Route index element={<Navigate to="/setup" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />
                        <Route path="residentes" element={<Residentes />} />
                        <Route path="habitaciones" element={<Habitaciones />} />
                        <Route path="apartamentos" element={<Apartamentos />} />
                        <Route path="reservas" element={<Reservas />} />
                        <Route path="calendario" element={<Calendario />} />
                        <Route path="pagos" element={<Pagos />} />
                        <Route path="reportes" element={<Reportes />} />
                        <Route path="configuracion" element={<Configuracion />} />
                        {/* Más rutas se agregarán en siguientes fases */}
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
