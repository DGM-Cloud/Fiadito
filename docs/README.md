# Documentación de Fiadito

Este directorio organiza las decisiones del MVP de Fiadito para que el equipo pueda trabajar en paralelo sin duplicar reglas ni confundir el demo con una implementación productiva.

## Estado actual

- `dist/` contiene una demo frontend estática con datos simulados en `localStorage`.
- La demo sirve para validar flujos, lenguaje y experiencia visual.
- Todavía no existen backend, base de datos, autenticación real, sincronización ni modelos predictivos en producción.
- Los documentos de este directorio definen el trabajo propuesto; no prueban que una función ya esté implementada.

## Frentes y responsables

| Responsable | Frente | Documento | Resultado principal |
| --- | --- | --- | --- |
| Mario | Ventas y experiencia del vendedor | [`modulos/VENTAS.md`](./modulos/VENTAS.md) | Una venta rápida, verificable y conectada con stock e historial |
| George | Productos e inventario | [`modulos/INVENTARIO.md`](./modulos/INVENTARIO.md) | Catálogo, movimientos y stock explicable |
| Sebastián | Backend, datos y accesos | [`modulos/BACKEND_DATOS_ACCESOS.md`](./modulos/BACKEND_DATOS_ACCESOS.md) | Persistencia, contratos, roles y trazabilidad |
| Gabo | Integración, calidad y pilotos | [`modulos/INTEGRACION_CALIDAD_PILOTOS.md`](./modulos/INTEGRACION_CALIDAD_PILOTOS.md) | Flujo integrado probado y evidencia del piloto |
| Arturo | Fiadito Intelligence | [`FIADITO_INTELLIGENCE.md`](./FIADITO_INTELLIGENCE.md) | Métricas e insights explicables basados en ventas e inventario |

## Flujo común del producto

```text
Venta confirmada
      │
      ├── se guarda con detalle, fecha, hora, medio y usuario
      ├── genera movimientos de inventario
      └── alimenta métricas e insights de Intelligence

Inventario ── stock, mínimos, costos, entradas y ajustes ──► Intelligence
Backend ───── persistencia, contratos, roles y auditoría ──► todos los módulos
Calidad ───── escenarios, evidencia e incidencias ─────────► versión integrada
```

La regla central es simple: una venta confirmada debe producir un registro persistente, un movimiento de stock y datos utilizables por Intelligence. Si uno de esos resultados falla, el flujo no está integrado.

## Revisión antes de implementar

La propuesta de API, campos, reglas de stock, eventos y datasets que el equipo debe revisar está en [`REVISION_INTEGRACIONES_MVP.md`](./REVISION_INTEGRACIONES_MVP.md). Todo su contenido permanece en estado `Propuesto` hasta que Mario, George, Sebastián, Gabo y Arturo registren sus observaciones y acuerdos.

## Qué debe contener cada documento

Cada responsable mantiene un documento con:

1. objetivo y problema;
2. alcance y fuera de alcance;
3. flujos y reglas del negocio;
4. datos que produce y consume;
5. contratos con otros módulos;
6. estados de interfaz y errores;
7. criterios de aceptación;
8. casos de prueba y evidencia;
9. decisiones abiertas y riesgos;
10. historial breve de cambios relevantes.

Para crear un frente nuevo o completar una ficha, usar [`plantillas/MODULO.md`](./plantillas/MODULO.md). No copiar dentro de cada módulo la definición completa de otro frente: enlazar su documento y registrar únicamente el contrato compartido.

## Reglas para trabajar en paralelo

- **Una fuente de verdad por decisión.** La fórmula de un insight vive en Intelligence; la regla de descuento de stock vive en Inventario; el formato persistido y el contrato de API viven en Backend.
- **Cambios de contrato se coordinan.** Si cambia un campo compartido, quien lo propone actualiza su documento e identifica a los módulos afectados antes de integrarlo.
- **Ejemplo no equivale a contrato.** Los objetos de `dist/data-service.js` son datos mock del demo. Pueden orientar la conversación, pero no fijan por sí solos el modelo productivo.
- **Hecho requiere evidencia.** Marcar una tarea como terminada solo cuando tenga criterio de aceptación y prueba reproducible.
- **Conservar decisiones útiles.** Corregir o ampliar una sección antes que reemplazarla; si una decisión cambia, explicar el motivo en el historial.
- **No guardar secretos.** Tokens, contraseñas, datos personales reales y credenciales no pertenecen al repositorio.

## Contratos que el equipo debe cerrar primero

| Contrato | Responsables principales | Consumidores |
| --- | --- | --- |
| Producto y precio vigente | George + Sebastián | Mario, Arturo |
| Venta y detalle de venta | Mario + Sebastián | George, Arturo, Gabo |
| Movimiento y saldo de inventario | George + Sebastián | Mario, Arturo, Gabo |
| Usuario, rol y auditoría | Sebastián | Mario, George, Gabo |
| Salida de métricas e insights | Arturo + Sebastián | Interfaz y Gabo |
| Escenarios y evidencia de aceptación | Gabo + dueño del frente | Todo el equipo |

Hasta que se cierre un contrato, documentarlo como `Por definir`; no presentar una propuesta como decisión aprobada.

## Definition of Done documental

Un módulo está listo para integrarse cuando:

- el alcance y los límites están escritos;
- los datos de entrada y salida tienen nombre, tipo, obligatoriedad y ejemplo;
- los errores y estados sin datos están definidos;
- sus dependencias fueron revisadas con los responsables afectados;
- existen pruebas con resultado esperado conocido;
- Gabo puede reproducir el flujo en la versión integrada;
- el documento distingue claramente entre `Propuesto`, `En implementación`, `Verificado` y `Fuera del MVP`.

## Convención de estados

- `Propuesto`: requiere revisión del equipo.
- `Acordado`: decisión aceptada, aún no demuestra implementación.
- `En implementación`: existe trabajo activo.
- `Verificado`: se comprobó con evidencia reproducible.
- `Fuera del MVP`: no se construirá para noviembre de 2026.
