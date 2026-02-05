# 📜 Reglas y Directrices del Proyecto - Sistema de Gestión para Residencia

> **Versión:** 1.0  
> **Fecha de creación:** 2026-02-05  
> **Propósito:** Documento de reglas y directrices establecidas por el cliente antes de iniciar el desarrollo

---

## ⚠️ IMPORTANTE

Este documento contiene **todas las reglas, restricciones y directrices** que deben seguirse durante el desarrollo del sistema. Ningún desarrollo debe iniciarse sin tener este documento completo y aprobado.

---

## 📋 Estado del Documento

- [/] **Reglas definidas** - En progreso (Workflow, técnicas y UI completadas)
- [ ] **Reglas revisadas** - Pendiente
- [ ] **Reglas aprobadas** - Pendiente
- [ ] **Listo para desarrollo** - NO

---

## 1. Reglas Generales del Proyecto

### 1.1 Reglas de Workflow (CRÍTICAS - SIEMPRE SEGUIR)

> [!CAUTION]
> **ESTAS REGLAS DEBEN SEGUIRSE SIEMPRE, SIN EXCEPCIÓN**

#### Regla #1: Leer Documento Técnico Antes de Trabajar
**OBLIGATORIO:** Antes de empezar cualquier trabajo de desarrollo, el programador DEBE leer completamente el archivo `documento_tecnico.md` para entender la arquitectura, tecnologías y especificaciones del sistema.

**Archivo:** `C:\Users\usuario\Desktop\residencias\docs\documento_tecnico.md`

---

#### Regla #2: Leer Manual de Usuario Antes de Trabajar
**OBLIGATORIO:** Antes de empezar cualquier trabajo de desarrollo, el programador DEBE leer completamente el archivo `manual_usuario.md` para entender cómo funcionará el sistema desde la perspectiva del usuario final.

**Archivo:** `C:\Users\usuario\Desktop\residencias\docs\manual_usuario.md`

---

#### Regla #3: Mensaje de Finalización (SIEMPRE LA ÚLTIMA)
**OBLIGATORIO:** Cuando se haya completado TODO el trabajo solicitado, el programador DEBE responder con el mensaje exacto:

**"Listo, esperando instrucciones"**

Este mensaje indica que:
- ✅ Todo el trabajo está completado
- ✅ Todos los archivos están guardados
- ✅ Todas las pruebas están hechas (si aplica)
- ✅ El sistema está listo para la siguiente instrucción

> [!IMPORTANT]
> Esta regla SIEMPRE debe ser la última acción. No se debe decir "Listo, esperando instrucciones" hasta que absolutamente todo esté terminado.

---

### 1.2 Reglas de Negocio

[PENDIENTE: El cliente proporcionará las reglas de negocio]

**Ejemplo de reglas a definir:**
- Reglas sobre reservas
- Reglas sobre pagos
- Reglas sobre cancelaciones
- Reglas sobre ocupación
- Etc.

---

### 1.3 Reglas Técnicas

#### Arquitectura de la Aplicación

**OBLIGATORIO:** La aplicación debe ser **INSTALABLE PARA EL CLIENTE**

- ✅ **Tipo:** Aplicación de escritorio empaquetada
- ✅ **Plataforma principal:** Windows
- ✅ **Base de datos:** Local (SQLite o PostgreSQL embebido)
- ✅ **Instalador:** Debe incluir instalador completo (.exe o similar)
- ✅ **Funcionamiento offline:** Debe funcionar sin conexión a internet (excepto envío de emails)
- ✅ **Persistencia:** Crítico - Debe soportar cientos de usuarios/residentes

#### Stack Tecnológico Sugerido

**Frontend:**
- Electron + React (para aplicación de escritorio)
- O alternativa: Tauri + React (más ligero)

**Backend:**
- Node.js (embebido en la aplicación)
- Express para API interna

**Base de Datos:**
- SQLite (recomendado para instalable)
- O PostgreSQL embebido

**Empaquetado:**
- Electron Builder o Tauri
- Instalador para Windows (.exe)
- Incluir todas las dependencias

#### Requisitos de Rendimiento

- ✅ **Velocidad:** Respuesta rápida en consultas y búsquedas
- ✅ **Capacidad:** Soportar cientos de residentes en base de datos
- ✅ **Escalabilidad:** Diseñado para crecer con el negocio

---

### 1.4 Reglas de Interfaz de Usuario

#### Diseño Visual

**OBLIGATORIO:** La interfaz debe usar **COLORES CLAROS**

- ✅ **Paleta:** Colores claros, luminosos y profesionales
- ✅ **Fondos:** Blancos, grises muy claros, azules pastel
- ✅ **Acentos:** Azul claro, verde menta, tonos suaves
- ✅ **Textos:** Gris oscuro sobre fondos claros (buen contraste)
- ✅ **Estados:**
  - Verde claro: Disponible
  - Rojo suave: Ocupado
  - Amarillo claro: Pendiente
  - Naranja claro: Mantenimiento

#### Usabilidad

- ✅ **Intuitivo:** Fácil de aprender y usar
- ✅ **Iconografía:** Iconos claros y reconocibles
- ✅ **Responsive:** Adaptable a diferentes resoluciones
- ✅ **Accesibilidad:** Texto legible, contraste adecuado
- ✅ **Idioma:** Español

---

## 2. Restricciones y Limitaciones

### 2.1 Restricciones de Presupuesto

[PENDIENTE]

---

### 2.2 Restricciones de Tiempo

[PENDIENTE]

---

### 2.3 Restricciones Técnicas

[PENDIENTE]

---

## 3. Prioridades del Proyecto

### 3.1 Funcionalidades Críticas (Imprescindibles)

[PENDIENTE: El cliente definirá qué funcionalidades son absolutamente necesarias]

---

### 3.2 Funcionalidades Importantes (Deseables)

[PENDIENTE: El cliente definirá qué funcionalidades son importantes pero no críticas]

---

### 3.3 Funcionalidades Opcionales (Futuras)

[PENDIENTE: El cliente definirá qué puede dejarse para versiones futuras]

---

## 4. Reglas de Validación de Datos

### 4.1 Validaciones de Residentes

[PENDIENTE]

**Ejemplo:**
- DNI debe ser único
- Teléfono debe tener formato válido
- Email debe ser válido
- Etc.

---

### 4.2 Validaciones de Reservas

[PENDIENTE]

**Ejemplo:**
- No permitir reservas en fechas pasadas
- No permitir doble reserva de la misma habitación
- Fecha de salida debe ser posterior a fecha de entrada
- Etc.

---

### 4.3 Validaciones de Pagos

[PENDIENTE]

**Ejemplo:**
- Monto debe ser positivo
- No permitir pagos mayores al saldo pendiente
- Etc.

---

## 5. Reglas de Seguridad

### 5.1 Autenticación

[PENDIENTE]

**Ejemplo:**
- Requisitos de contraseña
- Tiempo de sesión
- Intentos de login permitidos
- Etc.

---

### 5.2 Autorización

[PENDIENTE]

**Ejemplo:**
- Qué puede hacer cada rol
- Restricciones de acceso
- Etc.

---

### 5.3 Protección de Datos

[PENDIENTE]

**Ejemplo:**
- Datos sensibles que deben encriptarse
- Cumplimiento RGPD
- Retención de datos
- Etc.

---

## 6. Reglas de Operación

### 6.1 Horarios y Tiempos

[PENDIENTE]

**Ejemplo:**
- Horario de check-in
- Horario de check-out
- Tiempo mínimo de reserva
- Tiempo máximo de reserva
- Etc.

---

### 6.2 Políticas de Cancelación

[PENDIENTE]

**Ejemplo:**
- Plazo para cancelación sin cargo
- Penalizaciones por cancelación tardía
- Política de no-show
- Etc.

---

### 6.3 Políticas de Pago

[PENDIENTE]

**Ejemplo:**
- Métodos de pago aceptados
- Cuándo se debe pagar
- Política de reembolsos
- Recargos por mora
- Etc.

---

## 7. Reglas de Reportes

### 7.1 Reportes Obligatorios

[PENDIENTE: Qué reportes son imprescindibles]

---

### 7.2 Frecuencia de Reportes

[PENDIENTE: Con qué frecuencia se generan]

---

### 7.3 Destinatarios de Reportes

[PENDIENTE: Quién debe recibir cada reporte]

---

## 8. Reglas de Mantenimiento

### 8.1 Backups

[PENDIENTE]

**Ejemplo:**
- Frecuencia de backups
- Retención de backups
- Ubicación de backups
- Etc.

---

### 8.2 Actualizaciones

[PENDIENTE]

**Ejemplo:**
- Ventana de mantenimiento permitida
- Notificación previa requerida
- Etc.

---

## 9. Reglas de Comunicación

### 9.1 Notificaciones al Personal

[PENDIENTE]

**Ejemplo:**
- Qué eventos generan notificaciones
- Cómo se notifica (email, SMS, en app)
- Etc.

---

### 9.2 Comunicación con Residentes

[PENDIENTE]

**Ejemplo:**
- Confirmaciones de reserva
- Recordatorios de pago
- Etc.

---

## 10. Excepciones y Casos Especiales

### 10.1 Casos Especiales a Considerar

[PENDIENTE: El cliente definirá situaciones especiales que el sistema debe manejar]

**Ejemplo:**
- Descuentos especiales
- Residentes VIP
- Grupos grandes
- Estancias muy largas
- Etc.

---

## 11. Criterios de Aceptación

### 11.1 ¿Cuándo se considera que el sistema está listo?

[PENDIENTE: El cliente definirá los criterios de aceptación]

**Ejemplo:**
- Todas las funcionalidades críticas implementadas
- Pruebas completadas sin errores críticos
- Personal capacitado
- Datos migrados (si aplica)
- Etc.

---

## 12. Prohibiciones y Restricciones Absolutas

### 12.1 Qué NO debe hacer el sistema

[PENDIENTE: El cliente definirá qué está absolutamente prohibido]

**Ejemplo:**
- No eliminar datos históricos
- No permitir modificar pagos ya registrados
- No permitir reservas sin residente asociado
- Etc.

---

## 13. Reglas de Migración de Datos (Si aplica)

### 13.1 Datos Existentes

[PENDIENTE: Si hay datos previos que migrar]

**Preguntas:**
- ¿Hay un sistema anterior?
- ¿Hay datos en Excel/papel que migrar?
- ¿Qué datos históricos se deben conservar?

---

## 14. Checklist de Reglas Pendientes

### 14.1 Información que el Cliente Debe Proporcionar

- [x] **Reglas de workflow** - ✅ COMPLETADO
- [x] **Restricciones técnicas** - ✅ COMPLETADO (Instalable, base de datos local, empaquetado)
- [x] **Reglas de interfaz de usuario** - ✅ COMPLETADO (Colores claros, usabilidad)
- [ ] Reglas de negocio principales
- [ ] Prioridades de funcionalidades
- [ ] Validaciones requeridas
- [ ] Políticas de seguridad
- [ ] Horarios y tiempos de operación
- [ ] Políticas de cancelación y pago
- [ ] Reportes necesarios
- [ ] Casos especiales a considerar
- [ ] Criterios de aceptación
- [ ] Prohibiciones absolutas

---

## 15. Notas Adicionales

### 15.1 Observaciones del Cliente

[PENDIENTE: Espacio para notas adicionales del cliente]

---

### 15.2 Preguntas Pendientes de Resolver

[PENDIENTE: Preguntas que surjan durante la definición de reglas]

---

## 16. Aprobación

### 16.1 Confirmación de Reglas

Una vez completado este documento:

- [ ] Cliente ha revisado todas las reglas
- [ ] Cliente confirma que las reglas están completas
- [ ] Cliente aprueba iniciar desarrollo con estas reglas
- [ ] Programador confirma comprensión de todas las reglas

**Firma del Cliente:** ___________________  
**Fecha:** ___________________

**Firma del Programador Jefe:** ___________________  
**Fecha:** ___________________

---

## 📝 Historial de Cambios

| Fecha | Versión | Cambios | Autor |
|-------|---------|---------|-------|
| 2026-02-05 | 1.0 | Creación del documento | Programador Jefe |
| 2026-02-05 | 1.1 | Agregadas 3 reglas de workflow críticas | Cliente + Programador Jefe |
| 2026-02-05 | 1.2 | Agregadas reglas técnicas (instalable, empaquetado) y UI (colores claros) | Cliente + Programador Jefe |

---

**Estado actual:** � **EN PROGRESO - 3 reglas de workflow definidas, esperando más reglas del cliente**

---

> [!IMPORTANT]
> **NO SE DEBE INICIAR EL DESARROLLO** hasta que este documento esté completo y aprobado por el cliente.

> [!NOTE]
> Este documento es un **contrato de entendimiento** entre el cliente y el equipo de desarrollo. Cualquier cambio posterior debe ser documentado y aprobado.

---

## 🎯 Próximo Paso

**Cliente:** Por favor, proporciona las reglas y directrices que consideres necesarias. Puedes hacerlo en el orden que prefieras. Iré completando este documento conforme me las vayas indicando.

**Áreas principales a cubrir:**
1. ✅ Reglas de negocio (cómo debe funcionar el sistema)
2. ✅ Restricciones técnicas (limitaciones o requisitos técnicos)
3. ✅ Prioridades (qué es más importante)
4. ✅ Políticas operativas (horarios, pagos, cancelaciones)
5. ✅ Casos especiales (situaciones particulares a considerar)

---

**Última actualización:** 2026-02-05  
**Responsable:** Programador Jefe  
**Estado:** Esperando input del cliente
