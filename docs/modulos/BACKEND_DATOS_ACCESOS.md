# Backend, datos y accesos

> **Responsable:** Sebastián
>
> **Estado:** Propuesto
> **MVP objetivo:** noviembre de 2026

## Objetivo

Conservar ventas e inventario sin duplicaciones, exponer contratos estables y asegurar que cada persona acceda únicamente a las acciones permitidas por su rol.

## Alcance inicial que debe detallarse

- usuarios, tiendas y roles mínimos;
- productos, ventas con detalle y movimientos de inventario;
- autenticación y autorización reales;
- API o capa de servicios para los módulos;
- validación, transacciones, idempotencia y auditoría;
- consulta estable para métricas de Intelligence;
- estrategia básica de errores, respaldo y recuperación.

## Contratos a cerrar

- Con Mario y George: contratos antes de depender de estructuras temporales del demo.
- Con Arturo: campos, agregaciones, periodos, zona horaria y frecuencia de actualización.
- Con Gabo: entorno desplegable, datos semilla, registros de error y procedimiento de recuperación.

## Decisiones que deben quedar explícitas

- tecnología y justificación;
- modelo y migraciones;
- formato/versionado de API;
- zona horaria de negocio (`America/Lima` como propuesta por validar);
- estrategia contra ventas duplicadas;
- permisos por rol;
- observabilidad y retención de datos;
- privacidad y tratamiento de información de clientes.

## Pendientes del responsable

- [ ] Proponer el modelo mínimo y revisarlo con Mario, George y Arturo.
- [ ] Publicar ejemplos de solicitud, respuesta y error por contrato.
- [ ] Definir transacciones e idempotencia del flujo venta–inventario.
- [ ] Proveer datos semilla y pasos reproducibles para Gabo.
- [ ] Registrar decisiones abiertas y responsables.

Completar las secciones restantes siguiendo [`../plantillas/MODULO.md`](../plantillas/MODULO.md).
