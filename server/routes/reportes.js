const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Residente, Habitacion, Apartamento, Pago, Reserva, sequelize } = require('../database/connection');
const { authMiddleware } = require('./auth');
const { startOfMonth, endOfMonth, startOfYear, endOfYear, subMonths } = require('date-fns');

// KPI Generales para Dashboard
router.get('/general', authMiddleware, async (req, res) => {
    try {
        const totalResidentes = await Residente.count();

        // Calcular ocupación
        const totalHabitaciones = await Habitacion.count();
        const habitacionesOcupadas = await Habitacion.count({ where: { estado: 'ocupada' } });

        const totalApartamentos = await Apartamento.count();
        const apartamentosOcupados = await Apartamento.count({ where: { estado: 'ocupado' } });

        const ocupacionTotal = totalHabitaciones + totalApartamentos > 0
            ? Math.round(((habitacionesOcupadas + apartamentosOcupados) / (totalHabitaciones + totalApartamentos)) * 100)
            : 0;

        // Ingresos mes actual
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const ingresosMes = await Pago.sum('monto', {
            where: {
                fecha_pago: {
                    [Op.between]: [firstDay, lastDay]
                }
            }
        });

        // Cálculo de Deuda Pendiente por Residente (Evita duplicados si el pago no está vinculado a la reserva)
        const residentes = await Residente.findAll({
            include: [
                {
                    model: Reserva,
                    as: 'reservas',
                    where: { estado: ['activa', 'pendiente'] },
                    required: false
                },
                {
                    model: Pago,
                    as: 'pagos',
                    required: false
                }
            ]
        });

        let totalDeudaCalculada = 0;
        let sumaPagosPendientesGlobal = 0;

        // 1. Sumamos todos los pagos marcados como 'pendiente' (estén o no vinculados a una reserva)
        const pagosPendientesRaw = await Pago.findAll({ where: { estado: 'pendiente' } });
        sumaPagosPendientesGlobal = pagosPendientesRaw.reduce((acc, p) => acc + Number(p.monto), 0);

        // 2. Sumamos la deuda de reservas que aún no ha sido registrada ni como pago pendiente ni completado
        let deudaReservasNoRegistrada = 0;
        residentes.forEach(res => {
            const totalReservas = (res.reservas || []).reduce((acc, r) => acc + Number(r.precio_total), 0);
            const totalPagosRegistrados = (res.pagos || []).reduce((acc, p) => {
                if (p.estado === 'cancelado') return acc;
                return acc + Number(p.monto);
            }, 0);

            // Si el residente tiene reservas por valor de 500€ pero solo hay pagos (vencidos o no) por 100€,
            // faltan 400€ por "facturar" o registrar.
            if (totalReservas > totalPagosRegistrados) {
                deudaReservasNoRegistrada += (totalReservas - totalPagosRegistrados);
            }
        });

        totalDeudaCalculada = sumaPagosPendientesGlobal + deudaReservasNoRegistrada;

        // Próximas reservas (próximos 7 días)
        const next7Days = new Date();
        next7Days.setDate(next7Days.getDate() + 7);

        const proximasReservas = await Reserva.findAll({
            where: {
                fecha_entrada: {
                    [Op.between]: [now, next7Days]
                },
                estado: 'pendiente'
            },
            include: [{ model: Residente, as: 'residente' }],
            limit: 5,
            order: [['fecha_entrada', 'ASC']]
        });

        res.json({
            residentes: totalResidentes,
            ocupacion: ocupacionTotal,
            ingresos_mes: ingresosMes || 0,
            pagos_pendientes: Math.round(totalDeudaCalculada * 100) / 100,
            proximas_llegadas: proximasReservas
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error obteniendo estadisticas generales' });
    }
});

// Reporte Financiero (Por meses)
router.get('/financiero', authMiddleware, async (req, res) => {
    try {
        // Por defecto últimos 12 meses
        const { year } = req.query;
        const currentYear = year || new Date().getFullYear();

        const startDate = new Date(currentYear, 0, 1);
        const endDate = new Date(currentYear, 11, 31);

        const pagos = await Pago.findAll({
            where: {
                fecha_pago: {
                    [Op.between]: [startDate, endDate]
                }
            },
            attributes: [
                [sequelize.fn('strftime', '%m', sequelize.col('fecha_pago')), 'mes'],
                [sequelize.fn('sum', sequelize.col('monto')), 'total']
            ],
            group: [sequelize.fn('strftime', '%m', sequelize.col('fecha_pago'))],
            order: [[sequelize.col('mes'), 'ASC']]
        });

        res.json(pagos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error en reporte financiero' });
    }
});

// Reporte Ocupación (Detalle actual)
router.get('/ocupacion', authMiddleware, async (req, res) => {
    try {
        const habitaciones = await Habitacion.findAll({
            attributes: ['numero', 'tipo', 'estado']
        });
        const apartamentos = await Apartamento.findAll({
            attributes: ['nombre', 'estado']
        });

        res.json({ habitaciones, apartamentos });
    } catch (error) {
        res.status(500).json({ message: 'Error en reporte ocupacion' });
    }
});

module.exports = router;
