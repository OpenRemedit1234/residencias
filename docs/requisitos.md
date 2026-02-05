# 📋 Documento de Requisitos - Sistema de Gestión para Residencia

> **Versión:** 1.0  
> **Fecha:** 2026-02-05  
> **Estado:** En construcción - Recopilando información

---

## 1. Información General del Proyecto

### 1.1 Tipo de Residencia

**Tipo:** Residencia tipo pensión con apartamentos

**Características:**
- ✅ Habitaciones tipo pensión (estancias cortas/medias)
- ✅ Apartamentos (estancias medias/largas)
- 📝 [PENDIENTE: Número total de habitaciones]
- 📝 [PENDIENTE: Número total de apartamentos]

---

## 2. Datos de la Residencia

### 2.1 Información Básica

| Campo | Valor |
|-------|-------|
| **Nombre** | [PENDIENTE] |
| **Dirección** | [PENDIENTE] |
| **Teléfono** | [PENDIENTE] |
| **Email** | [PENDIENTE] |
| **CIF/NIF** | [PENDIENTE] |
| **Sitio Web** | [PENDIENTE] |

### 2.2 Horarios de Operación

| Concepto | Horario |
|----------|---------|
| **Check-in** | [PENDIENTE: ej. 14:00 - 20:00] |
| **Check-out** | [PENDIENTE: ej. 08:00 - 12:00] |
| **Recepción** | [PENDIENTE: ej. 24h / 08:00 - 22:00] |

---

## 3. Inventario de Alojamientos

### 3.1 Habitaciones

| Número | Tipo | Capacidad | Precio/Noche | Servicios |
|--------|------|-----------|--------------|-----------|
| [PENDIENTE] | [Individual/Doble/Triple] | [1-3] | [€] | [WiFi, TV, etc.] |

**Tipos de habitación disponibles:**
- 📝 [PENDIENTE: Individual, Doble, Triple, etc.]

### 3.2 Apartamentos

| Número | Habitaciones | Baños | m² | Precio/Mes | Precio/Noche | Servicios |
|--------|--------------|-------|-----|------------|--------------|-----------|
| [PENDIENTE] | [1-3] | [1-2] | [30-80] | [€] | [€] | [Cocina, etc.] |

**Tipos de apartamento disponibles:**
- 📝 [PENDIENTE: Estudio, 1 habitación, 2 habitaciones, etc.]

---

## 4. Estructura de Precios

### 4.1 Tarifas de Habitaciones

| Tipo de Habitación | Precio Base/Noche | Descuentos |
|-------------------|-------------------|------------|
| [PENDIENTE] | [€] | [PENDIENTE: por semana, mes] |

### 4.2 Tarifas de Apartamentos

| Tipo de Apartamento | Precio/Mes | Precio/Noche | Descuentos |
|--------------------|------------|--------------|------------|
| [PENDIENTE] | [€] | [€] | [PENDIENTE] |

### 4.3 Servicios Adicionales

| Servicio | Precio | Frecuencia |
|----------|--------|------------|
| [PENDIENTE: Desayuno] | [€] | [Por día/persona] |
| [PENDIENTE: Limpieza extra] | [€] | [Por servicio] |
| [PENDIENTE: Lavandería] | [€] | [Por carga] |
| [PENDIENTE: Parking] | [€] | [Por día/mes] |

### 4.4 Depósitos y Garantías

- **Depósito de garantía:** [PENDIENTE: € o no aplica]
- **Política de devolución:** [PENDIENTE]
- **Pago anticipado requerido:** [PENDIENTE: % o monto]

---\n\n### 9.4 Requisitos de Diseño UI/UX\n\n- **Paleta de colores:** ✅ **COLORES CLAROS** - Interfaz luminosa y limpia\n- **Estilo visual:** Moderno, profesional, fácil de usar\n- **Accesibilidad:** Texto legible, contraste adecuado\n- **Idioma:** Español (principal)\n- **Iconografía:** Iconos claros e intuitivos\n- **Responsive:** Adaptable a diferentes resoluciones de pantalla\n\n**Sugerencias de paleta:**\n- Fondos: Blancos, grises muy claros, azules pastel\n- Acentos: Azul claro, verde menta, tonos suaves\n- Textos: Gris oscuro sobre fondos claros\n- Estados: Verde claro (disponible), rojo suave (ocupado), amarillo claro (pendiente)\n\n---

## 5. Políticas de la Residencia

### 5.1 Reservas

- **Cancelación gratuita:** [PENDIENTE: hasta X días antes]
- **Modificación de reservas:** [PENDIENTE: política]
- **No-show:** [PENDIENTE: cargo o política]

### 5.2 Pagos

- **Métodos aceptados:** [PENDIENTE: Efectivo, Tarjeta, Transferencia, Bizum]
- **Frecuencia de pago (apartamentos):** [PENDIENTE: Mensual, Quincenal]
- **Día de vencimiento:** [PENDIENTE: día del mes]
- **Recargos por mora:** [PENDIENTE: % o monto]

### 5.3 Normas de Convivencia

- **Horario de silencio:** [PENDIENTE]
- **Visitas permitidas:** [PENDIENTE: Sí/No, horarios]
- **Mascotas:** [PENDIENTE: Permitidas/No permitidas]
- **Fumadores:** [PENDIENTE: Permitido/No permitido]

---

## 6. Usuarios del Sistema

### 6.1 Roles y Permisos

| Rol | Cantidad | Permisos Principales |
|-----|----------|---------------------|
| **Administrador** | [PENDIENTE] | Acceso total |
| **Recepcionista** | [PENDIENTE] | Reservas, check-in/out |
| **Contable** | [PENDIENTE] | Pagos, reportes |
| **Mantenimiento** | [PENDIENTE] | Estado de habitaciones |

### 6.2 Usuarios Iniciales

| Nombre | Email | Rol |
|--------|-------|-----|
| [PENDIENTE] | [PENDIENTE] | [PENDIENTE] |

---

## 7. Funcionalidades Requeridas

### 7.1 Funcionalidades Básicas (MVP)

#### ✅ Gestión de Datos
- [x] Gestión de residentes (nombre, datos personales, contacto)
- [x] Gestión de habitaciones (número, nombre, características)
- [x] Gestión de apartamentos
- [x] Registro del número de personas por reserva
- [x] Datos persistentes para cientos de usuarios

#### ✅ Sistema de Reservas y Calendario
- [x] **Cuadrante mensual** - Calendario visual mensual
- [x] **Gestión de días festivos** - Marcar y gestionar festivos
- [x] **Ajuste por año** - Configurar calendario para diferentes años
- [x] Sistema de reservas
- [x] Check-in / Check-out
- [x] Visualización de disponibilidad

#### ✅ Gestión Financiera
- [x] Registro de pagos
- [x] **Generación de facturas proforma** - Crear facturas antes del pago
- [x] Reportes financieros básicos

#### ✅ Comunicación y Documentos
- [x] **Sistema de emails** - Enviar correos sobre disponibilidad
- [x] **Generación de PDF** - Crear PDF cuando no hay habitación libre
- [x] Notificaciones automáticas

#### ✅ Panel de Administración (Rueda Dentada ⚙️)
- [x] **Gestión de usuarios del sistema** - Dar de alta usuarios administradores
- [x] **Datos de empresa** - Configurar datos para facturas
- [x] **Copias de seguridad** - Sistema de backup automático y manual
- [x] Configuración general del sistema

### 7.2 Funcionalidades Adicionales (Futuras)

- [ ] Portal para residentes
- [ ] Integración con pasarela de pago online
- [ ] App móvil nativa
- [ ] Sistema de mensajería interna
- [ ] Control de accesos físico
- [ ] Gestión de inventario de suministros
- [ ] Gestión de mantenimiento preventivo

---

## 8. Integraciones Necesarias

### 8.1 Sistemas Externos

| Sistema | Propósito | Prioridad |
|---------|-----------|-----------|
| **SMTP/Email** | Envío de correos sobre disponibilidad | ✅ ALTA |
| **Generador PDF** | Crear documentos cuando no hay disponibilidad | ✅ ALTA |
| **Generador PDF Facturas** | Crear facturas proforma | ✅ ALTA |
| [PENDIENTE: Email] | Notificaciones | [Alta/Media/Baja] |
| [PENDIENTE: Pasarela pago] | Pagos online | [Alta/Media/Baja] |
| [PENDIENTE: Contabilidad] | Exportar datos | [Alta/Media/Baja] |

---

## 9. Requisitos Técnicos

### 9.1 Infraestructura

- **Tipo de despliegue:** ✅ **INSTALABLE PARA EL CLIENTE** (Aplicación empaquetada)
- **Tipo de aplicación:** Aplicación de escritorio/local instalable
- **Empaquetado:** Debe incluir instalador completo
- **Base de datos:** Local (SQLite o PostgreSQL embebido)
- **Backup automático:** ✅ Sí - Configurable desde panel de administración
- **Persistencia de datos:** ✅ Crítico - Cientos de usuarios

### 9.2 Acceso

- **Usuarios concurrentes estimados:** Múltiples usuarios del personal
- **Dispositivos de acceso:** PC (Windows principalmente)
- **Navegadores soportados:** Chrome, Firefox, Edge (si es web local)
- **Modo offline:** Debe funcionar sin conexión a internet (excepto emails)

### 9.3 Requisitos de Rendimiento

- **Capacidad:** Soportar cientos de residentes en la base de datos
- **Velocidad:** Respuesta rápida en consultas y búsquedas
- **Escalabilidad:** Diseñado para crecer con el negocio

---

## 10. Datos a Recopilar

### 10.1 Checklist de Información Pendiente

#### Sobre la Residencia
- [ ] Nombre oficial
- [ ] Dirección completa
- [ ] Datos de contacto
- [ ] Logo (para documentos)
- [ ] Horarios de operación

#### Sobre Alojamientos
- [ ] Lista completa de habitaciones (número, tipo, precio)
- [ ] Lista completa de apartamentos (número, características, precio)
- [ ] Servicios incluidos en cada tipo
- [ ] Fotos de habitaciones/apartamentos

#### Sobre Precios
- [ ] Tarifas actuales
- [ ] Política de descuentos
- [ ] Servicios adicionales y precios
- [ ] Depósitos requeridos

#### Sobre Políticas
- [ ] Política de cancelación
- [ ] Política de pagos
- [ ] Normas de la residencia
- [ ] Horarios de check-in/out

#### Sobre Usuarios
- [ ] Número de usuarios del sistema
- [ ] Roles necesarios
- [ ] Datos de usuarios iniciales

#### Sobre Funcionalidades
- [ ] Prioridades de desarrollo
- [ ] Integraciones necesarias
- [ ] Requisitos especiales

---

## 11. Cronograma Estimado

| Fase | Duración Estimada | Entregables |
|------|-------------------|-------------|
| **Recopilación de datos** | [PENDIENTE] | Requisitos completos |
| **Diseño** | [PENDIENTE] | Mockups, base de datos |
| **Desarrollo MVP** | [PENDIENTE] | Sistema funcional básico |
| **Pruebas** | [PENDIENTE] | Sistema validado |
| **Capacitación** | [PENDIENTE] | Personal entrenado |
| **Despliegue** | [PENDIENTE] | Sistema en producción |

---

## 12. Notas y Observaciones

### 12.1 Notas del Cliente

[PENDIENTE: Agregar notas específicas del cliente]

### 12.2 Consideraciones Especiales

[PENDIENTE: Requisitos especiales, restricciones, preferencias]

---

## 13. Próximos Pasos

1. ✅ Crear documentos base (técnico, manual, requisitos)
2. 📋 Recopilar información detallada del cliente
3. 📋 Completar inventario de habitaciones y apartamentos
4. 📋 Definir estructura de precios
5. 📋 Validar funcionalidades requeridas
6. 📋 Iniciar diseño de base de datos
7. 📋 Crear mockups de interfaz
8. 📋 Comenzar desarrollo

---

**Última actualización:** 2026-02-05  
**Responsable:** Programador Jefe  
**Estado:** Esperando información del cliente

---

> [!NOTE]
> Este documento se irá completando conforme se reciba información del cliente. Las secciones marcadas con [PENDIENTE] requieren datos específicos.
