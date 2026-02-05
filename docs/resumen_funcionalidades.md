# 📊 Resumen de Funcionalidades - Sistema de Gestión para Residencia

> **Versión:** 1.0  
> **Fecha:** 2026-02-05  
> **Propósito:** Resumen ejecutivo de todas las funcionalidades del sistema

---

## 🎯 Funcionalidades Principales

### 1. 📅 Calendario y Gestión de Tiempo

#### Cuadrante Mensual
- **Vista de calendario mensual** con visualización de ocupación
- **Navegación por meses y años** - Ajustable a cualquier año
- **Gestión de días festivos** - Marcar y configurar festivos nacionales/locales
- **Visualización de disponibilidad** por día
- **Código de colores** para estados (disponible, ocupado, mantenimiento)

**Casos de uso:**
- Ver ocupación del mes actual de un vistazo
- Planificar reservas futuras
- Identificar períodos de alta/baja ocupación
- Marcar festivos para ajustar precios o políticas

---

### 2. 🏨 Gestión de Habitaciones y Apartamentos

#### Habitaciones
- **Registro completo** - Número, nombre, características
- **Datos personalizables** - Tipo, capacidad, servicios
- **Estados dinámicos** - Disponible, ocupada, limpieza, mantenimiento
- **Precios configurables** - Por noche, descuentos

#### Apartamentos
- **Información detallada** - Habitaciones, baños, m²
- **Precios flexibles** - Por mes y por noche
- **Servicios incluidos** - Cocina, lavadora, etc.

**Casos de uso:**
- Registrar nuevo alojamiento
- Actualizar precios por temporada
- Cambiar estado después de limpieza
- Consultar características para informar a clientes

---

### 3. 👥 Gestión de Residentes

#### Datos de Residentes
- **Información personal** - Nombre, DNI, fecha de nacimiento
- **Contacto** - Teléfono, email, dirección
- **Contacto de emergencia** - Para seguridad
- **Número de personas** - Registro de acompañantes
- **Observaciones** - Notas especiales

#### Historial
- **Reservas previas** - Todas las estancias
- **Pagos realizados** - Historial financiero completo
- **Preferencias** - Notas sobre el residente

**Casos de uso:**
- Registrar nuevo residente
- Consultar historial antes de nueva reserva
- Verificar datos de contacto
- Revisar comportamiento de pago

---

### 4. 📧 Sistema de Comunicación

#### Emails Automáticos
- **Consulta de disponibilidad** - Respuesta automática sobre habitaciones libres
- **Confirmación de reserva** - Email al confirmar
- **Recordatorios** - Pagos pendientes, check-in próximo
- **Notificaciones al personal** - Alertas importantes

#### Generación de Documentos
- **PDF de disponibilidad** - Cuando NO hay habitación libre
  - Incluye alternativas
  - Datos de contacto
  - Información de la residencia
- **Facturas proforma** - Antes del pago
- **Recibos de pago** - Comprobantes

**Casos de uso:**
- Cliente pregunta por email si hay habitación → Sistema responde automáticamente
- No hay disponibilidad → Sistema genera PDF con información y alternativas
- Residente solicita factura antes de pagar → Generar proforma
- Registrar pago → Generar recibo automáticamente

---

### 5. 💰 Gestión Financiera

#### Facturas Proforma
- **Generación antes del pago** - Para que el cliente apruebe
- **Datos de empresa** - Logo, CIF, dirección
- **Desglose detallado** - Conceptos, IVA, total
- **Numeración automática** - Correlativa

#### Registro de Pagos
- **Múltiples métodos** - Efectivo, tarjeta, transferencia, Bizum
- **Asociación a reservas** - Vinculado automáticamente
- **Control de saldos** - Pendiente, pagado, parcial
- **Historial completo** - Todos los pagos del residente

#### Reportes Financieros
- **Ingresos mensuales** - Total y desglosado
- **Pagos pendientes** - Deudores
- **Ocupación vs. Ingresos** - Análisis de rentabilidad

**Casos de uso:**
- Residente pide presupuesto → Generar factura proforma
- Registrar pago en efectivo → Actualizar saldo y generar recibo
- Fin de mes → Generar reporte de ingresos
- Identificar deudores → Reporte de pagos pendientes

---

### 6. ⚙️ Panel de Administración (Rueda Dentada)

#### Gestión de Usuarios del Sistema
- **Crear usuarios** - Nuevos administradores/recepcionistas
- **Asignar roles** - Permisos diferenciados
- **Activar/Desactivar** - Control de acceso
- **Cambiar contraseñas** - Seguridad

#### Datos de Empresa
- **Información fiscal** - Nombre, CIF/NIF, dirección
- **Datos de contacto** - Teléfono, email, web
- **Logo** - Para facturas y documentos
- **Configuración de facturas** - Numeración, formato

#### Copias de Seguridad
- **Backup automático** - Programado (diario, semanal)
- **Backup manual** - A demanda
- **Restauración** - Recuperar datos
- **Ubicación configurable** - Dónde guardar backups

#### Configuración General
- **Días festivos** - Calendario de festivos
- **Precios por defecto** - Tarifas base
- **Horarios** - Check-in, check-out
- **Políticas** - Cancelación, pagos

**Casos de uso:**
- Contratar nuevo recepcionista → Crear usuario con permisos limitados
- Cambio de razón social → Actualizar datos de empresa
- Antes de actualización → Hacer backup manual
- Inicio de año → Configurar festivos del nuevo año

---

### 7. 💾 Persistencia de Datos

#### Base de Datos Robusta
- **Capacidad** - Cientos de residentes
- **Rendimiento** - Búsquedas rápidas
- **Integridad** - Sin pérdida de datos
- **Relaciones** - Datos conectados correctamente

#### Búsqueda y Filtros
- **Búsqueda rápida** - Por nombre, DNI, teléfono
- **Filtros avanzados** - Por fechas, estado, tipo
- **Ordenamiento** - Por diferentes criterios
- **Exportación** - A Excel, PDF

**Casos de uso:**
- Buscar residente por nombre parcial
- Filtrar reservas del último mes
- Exportar lista de residentes activos
- Consultar historial de hace 2 años

---

## 🎨 Diseño de Interfaz

### Colores Claros
- **Paleta luminosa** - Blancos, grises claros, azules pastel
- **Contraste adecuado** - Texto legible
- **Estados visuales** - Verde claro (disponible), rojo suave (ocupado)
- **Profesional** - Aspecto moderno y limpio

### Usabilidad
- **Intuitivo** - Fácil de aprender
- **Iconografía clara** - Símbolos reconocibles
- **Responsive** - Adaptable a diferentes pantallas
- **Accesible** - Para todo el personal

---

## 📦 Empaquetado e Instalación

### Aplicación Instalable
- **Instalador completo** - Todo incluido
- **Base de datos local** - No requiere servidor externo
- **Funcionamiento offline** - Excepto emails
- **Actualizaciones** - Sistema de actualización

### Requisitos del Sistema
- **Sistema operativo** - Windows (principalmente)
- **Espacio en disco** - Mínimo para app + datos
- **RAM** - Suficiente para operación fluida
- **Permisos** - Escritura para backups

**Casos de uso:**
- Instalar en PC de recepción
- Instalar en PC de administración
- Actualizar a nueva versión
- Mover a nuevo equipo (con backup)

---

## 🔄 Flujos de Trabajo Principales

### Flujo 1: Nueva Reserva
1. Cliente consulta disponibilidad (email/teléfono)
2. Sistema verifica disponibilidad en calendario
3. **SI hay disponibilidad:**
   - Registrar residente (si es nuevo)
   - Crear reserva
   - Generar factura proforma
   - Enviar email de confirmación
4. **SI NO hay disponibilidad:**
   - Generar PDF con información
   - Enviar por email
   - Ofrecer fechas alternativas

### Flujo 2: Check-In
1. Residente llega
2. Verificar reserva en sistema
3. Confirmar datos personales
4. Registrar pago inicial (si aplica)
5. Realizar check-in
6. Cambiar estado de habitación a "Ocupada"
7. Entregar llaves

### Flujo 3: Check-Out
1. Residente se va
2. Verificar pagos pendientes
3. Registrar pagos finales
4. Generar factura/recibo final
5. Realizar check-out
6. Cambiar estado de habitación a "Limpieza"
7. Actualizar calendario

### Flujo 4: Fin de Mes
1. Generar reporte de ocupación
2. Generar reporte de ingresos
3. Revisar pagos pendientes
4. Enviar recordatorios a deudores
5. Hacer backup mensual
6. Planificar siguiente mes

---

## 📊 Métricas y Reportes

### Reportes Disponibles
- **Ocupación** - Porcentaje, tendencias
- **Ingresos** - Total, desglosado, comparativas
- **Deudores** - Pagos pendientes
- **Reservas** - Futuras, pasadas, canceladas
- **Habitaciones** - Uso, rentabilidad

### Formatos de Exportación
- **PDF** - Para imprimir y archivar
- **Excel** - Para análisis adicional
- **Email** - Envío directo

---

## 🔐 Seguridad

### Autenticación
- **Login seguro** - Usuario y contraseña
- **Roles diferenciados** - Permisos por usuario
- **Sesiones** - Control de tiempo

### Protección de Datos
- **Backups automáticos** - Prevención de pérdida
- **Datos sensibles** - Protegidos
- **Auditoría** - Registro de acciones críticas

---

## 🚀 Ventajas del Sistema

✅ **Todo en uno** - Gestión completa centralizada  
✅ **Instalable** - No depende de internet  
✅ **Fácil de usar** - Interfaz clara e intuitiva  
✅ **Automático** - Emails y PDFs automáticos  
✅ **Seguro** - Backups y protección de datos  
✅ **Escalable** - Crece con el negocio  
✅ **Profesional** - Facturas y documentos de calidad  
✅ **Eficiente** - Ahorra tiempo en tareas repetitivas  

---

**Última actualización:** 2026-02-05  
**Versión:** 1.0
