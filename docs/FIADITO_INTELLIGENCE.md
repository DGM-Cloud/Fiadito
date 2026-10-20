# Fiadito Intelligence

> **Responsable:** Arturo
>
> **Estado:** Propuesto para revisión del equipo
>
> **Última actualización:** 2026-10-19
> **MVP objetivo:** noviembre de 2026

## 1. Objetivo

Fiadito Intelligence convierte los datos confiables de Ventas e Inventario en información breve, explicable y accionable para una bodega peruana. Debe ayudar a responder qué se vende, qué puede agotarse, qué conviene revisar y por qué, sin tomar decisiones automáticamente por el negocio.

El resultado no es un tablero lleno de gráficos: es una lista priorizada de señales con periodo, evidencia y acción sugerida.

## 2. Problema

Registrar operaciones no garantiza que el bodeguero pueda interpretar lo ocurrido. En el día a día es difícil revisar muchos tickets y movimientos para detectar a tiempo:

- productos que concentran las ventas;
- horas y días de mayor movimiento;
- stock que podría agotarse;
- productos con poca salida y dinero inmovilizado;
- cambios frente a un periodo comparable;
- oportunidades estacionales que requieren preparación.

Si Intelligence usa datos incompletos o presenta una estimación como certeza, pierde credibilidad. Por eso cada resultado debe mostrar de dónde sale, qué periodo cubre y sus limitaciones.

## 3. Principios

1. **Explicable antes que sofisticado.** Toda cifra del MVP debe poder reproducirse con consultas o funciones determinísticas.
2. **Datos del negocio antes que supuestos generales.** Una regla estacional externa puede aportar contexto, pero debe distinguirse de la evidencia propia de la tienda.
3. **Acción sugerida, no automática.** El usuario confirma compras, promociones o cambios.
4. **Periodo visible.** No se muestra un porcentaje sin fecha inicial, fecha final y base de comparación.
5. **Calidad visible.** Si faltan datos o el historial es corto, se informa en lugar de inventar una conclusión.
6. **Privacidad mínima.** El MVP analiza operación; no necesita enviar datos personales de clientes a un modelo de IA.

## 4. Alcance del MVP — noviembre de 2026

### Incluye

- resumen de ventas de hoy y de la semana;
- comparación de ventas con el periodo anterior equivalente;
- ranking de productos por unidades e importe vendido;
- horas y días con mayor movimiento, cuando exista muestra suficiente;
- alertas por stock bajo y posible agotamiento;
- señal de baja rotación o exceso de cobertura;
- cantidad sugerida de reposición para un horizonte configurable de 7 días;
- contexto inicial de campaña navideña, separado del historial propio;
- bandeja de insights priorizada con explicación y acción sugerida;
- estados de carga, sin datos, datos insuficientes, error y resultado;
- pruebas con datasets pequeños cuyo resultado se conozca de antemano.

### Fuera del MVP

- machine learning entrenado con datos de varias tiendas;
- pronósticos probabilísticos avanzados;
- fijación automática de precios;
- compras o pedidos automáticos a proveedores;
- activación automática de promociones;
- evaluación automática de crédito o bloqueo de clientes;
- envío autónomo de mensajes;
- integración profunda con SUNAT, bancos, Yape, Plin o proveedores;
- garantías de demanda basadas solo en fechas comerciales.

El Copilot del demo actual usa respuestas simuladas. Un asistente conversacional productivo no forma parte del MVP hasta contar con contratos, seguridad, evaluación y datos suficientes.

## 5. Métricas determinísticas

Todas las métricas monetarias usan ventas válidas y no anuladas. Las fechas se calculan en la zona horaria configurada para la tienda; la propuesta inicial es `America/Lima`.

| Métrica | Definición inicial | Datos necesarios | Condición o nota |
| --- | --- | --- | --- |
| Venta neta | `Σ total de ventas válidas` | venta, estado, total, fecha | Mostrar moneda y periodo |
| Tickets | `conteo de ventas válidas` | `sale_id`, estado, fecha | No contar reintentos duplicados |
| Ticket promedio | `venta neta / tickets` | venta neta, tickets | No calcular si tickets = 0 |
| Unidades vendidas | `Σ quantity` | detalle de venta | Separar por producto y unidad |
| Producto más vendido | máximo de unidades; desempate por importe | detalle, producto, precio | Mostrar criterio del ranking |
| Participación por producto | `importe del producto / venta neta` | líneas y total | Porcentaje del periodo |
| Variación entre periodos | `(actual - anterior) / anterior × 100` | totales comparables | Si anterior = 0, mostrar “sin base comparable” |
| Velocidad diaria | `unidades vendidas / días observados` | ventas y periodo | Definir si días sin apertura cuentan |
| Cobertura estimada | `stock actual / velocidad diaria` | stock y velocidad | Si velocidad = 0, no afirmar agotamiento |
| Reposición sugerida | `max(0, demanda_horizonte + stock_seguridad - stock_actual - entradas_confirmadas)` | ventas, stock, mínimos, entradas | Redondear según unidad de compra |
| Margen bruto estimado | `Σ (precio_unitario - costo_vigente_definido) × cantidad` | precio, costo, cantidad | Acordar costo histórico vs. costo actual |
| Capital inmovilizado estimado | `stock_excedente × costo` | stock, costo, cobertura objetivo | Presentarlo como estimación |

### Decisiones de cálculo por cerrar

- días calendario frente a días en que la tienda estuvo abierta;
- costo histórico de la venta frente a último costo registrado;
- tratamiento de anulaciones y devoluciones;
- unidad de compra y tamaño de paquete para redondear reposición;
- umbral mínimo de tickets/días para declarar un patrón;
- definición de stock de seguridad por producto o categoría;
- fuente y aprobación de entradas de mercadería pendientes.

Estas decisiones se cierran con Sebastián y George antes de marcar las fórmulas como `Acordadas`.

## 6. Modelo de insight

Cada insight debe ser un objeto trazable, no solo una frase escrita en la interfaz.

| Campo | Propósito |
| --- | --- |
| `insight_id` | Identificador estable |
| `type` | `sales_summary`, `top_product`, `peak_time`, `low_stock`, `reorder`, `low_rotation`, `period_change` o `seasonal_context` |
| `store_id` | Tienda a la que pertenece |
| `period_start` / `period_end` | Ventana analizada |
| `generated_at` | Momento de generación |
| `severity` | Informativo, atención o urgente |
| `title` | Qué ocurrió en lenguaje breve |
| `evidence` | Cifras que sustentan el mensaje |
| `explanation` | Cómo se interpretó la evidencia |
| `suggested_action` | Acción que el usuario puede evaluar |
| `confidence_label` | Suficiente, limitado o insuficiente según reglas explícitas |
| `source_version` | Versión de fórmula o regla aplicada |

Ejemplo conceptual:

```json
{
  "type": "low_stock",
  "period_start": "2026-10-13T00:00:00-05:00",
  "period_end": "2026-10-20T00:00:00-05:00",
  "severity": "urgent",
  "title": "La leche podría agotarse pronto",
  "evidence": {
    "current_stock": 8,
    "units_sold": 42,
    "observed_days": 7,
    "estimated_days_of_cover": 1.3
  },
  "suggested_action": "Revisa el stock físico y considera agregar leche a tu próxima compra.",
  "confidence_label": "limited",
  "source_version": "low_stock_v1"
}
```

El texto usa “podría” y pide revisar el stock físico porque la cobertura es una estimación, no una certeza.

## 7. Insights del MVP

### 7.1 Resumen del periodo

- venta neta, tickets, unidades y ticket promedio;
- comparación con el periodo anterior equivalente;
- explicación cuando no existe base comparable.

### 7.2 Productos destacados

- top 3 por unidades;
- top 3 por importe;
- producto con mayor variación solo si supera el umbral de datos acordado.

### 7.3 Momentos de venta

- distribución por hora y día;
- destacar una franja únicamente con muestra suficiente;
- sugerir preparación operativa, no afirmar causalidad.

### 7.4 Inventario y reposición

- stock igual o menor al mínimo;
- cobertura estimada por debajo del horizonte acordado;
- cantidad sugerida y costo estimado;
- productos que no conviene reponer por exceso de cobertura.

### 7.5 Baja rotación

- identificar productos sin ventas o con velocidad baja en una ventana acordada;
- mostrar stock, costo estimado inmovilizado y última venta;
- sugerir revisar, exhibir o evaluar una promoción; nunca activar una automáticamente.

### 7.6 Contexto estacional

- para noviembre de 2026, incluir una tarjeta de preparación navideña;
- separar “historial de tu tienda” de “regla general de campaña”;
- no mostrar porcentajes de demanda si no provienen de una fuente documentada o de datos propios suficientes.

## 8. Alertas

Las alertas deben evitar ruido y repetición.

| Alerta | Disparador inicial propuesto | Severidad | Acción sugerida |
| --- | --- | --- | --- |
| Stock bajo | `stock_actual <= stock_mínimo` | Atención | Verificar saldo y preparar reposición |
| Posible quiebre | cobertura estimada menor o igual a 2 días y velocidad válida | Urgente | Revisar stock físico y próxima compra |
| Baja rotación | ventas por debajo del umbral en la ventana acordada | Atención | Revisar exhibición, compra o promoción |
| Datos incompletos | campos requeridos ausentes o periodo insuficiente | Informativa | Corregir registros; no emitir recomendación fuerte |
| Cambio relevante | variación supera umbral acordado y base mínima | Informativa/Atención | Revisar productos que explican el cambio |

Reglas operativas:

- deduplicar la misma alerta por producto y regla;
- conservar `primera detección`, `última evaluación` y estado;
- permitir descartar o posponer sin borrar la evidencia;
- cerrar automáticamente solo cuando la condición deje de cumplirse y quede registrada la reevaluación;
- no usar color como único indicador de severidad.

## 9. Recomendaciones

Una recomendación del MVP se compone de:

1. **Qué pasó:** “El stock de leche está por debajo del mínimo”.
2. **Evidencia:** “Quedan 8 unidades; se vendieron 42 en los últimos 7 días”.
3. **Interpretación:** “La cobertura estimada es de 1.3 días”.
4. **Acción sugerida:** “Revisa el stock físico y considera 24 unidades para 7 días”.
5. **Límite:** “La cantidad no considera pedidos aún no registrados”.

La prioridad propuesta combina severidad, proximidad temporal, impacto económico y calidad de datos. La fórmula de prioridad debe versionarse y probarse; no se ajustará silenciosamente desde la interfaz.

## 10. Cálculos determinísticos e IA

### Debe resolverse con reglas, consultas o código

- totales, conteos, promedios y rankings;
- comparación de periodos;
- velocidad, cobertura y reposición;
- márgenes y capital inmovilizado estimado;
- evaluación de umbrales;
- severidad, deduplicación y orden inicial;
- evidencia y trazabilidad.

### Uso posible de IA después de validar la base

- redactar una explicación más natural a partir de evidencia estructurada;
- resumir varios insights sin cambiar cifras ni prioridad;
- responder preguntas usando únicamente métricas autorizadas de la tienda;
- adaptar el nivel de detalle al usuario.

### Límites de IA

- no calcular ni inventar cifras;
- no crear promociones, pedidos o créditos sin confirmación;
- no recibir secretos ni datos personales innecesarios;
- no afirmar causalidad a partir de correlaciones;
- no ocultar el periodo, la evidencia o la calidad del dato;
- validar salidas contra un esquema y conservar la versión del prompt/modelo;
- ofrecer una salida determinística si el servicio de IA falla.

Para noviembre, la IA generativa es opcional. El MVP puede considerarse completo con mensajes plantillados y cálculos correctos.

## 11. Datos y dependencias

### Ventas — Mario y Sebastián

| Dato | Uso en Intelligence |
| --- | --- |
| Identificador y estado | Evitar duplicados y excluir anulaciones |
| Fecha/hora y zona horaria | Periodos, días y horas fuertes |
| Tienda y usuario | Aislamiento y trazabilidad |
| Producto y cantidad | Ranking, velocidad y asociaciones futuras |
| Precio, descuento y total | Venta neta, participación y ticket promedio |
| Medio de pago | Resumen operativo; no define por sí solo rentabilidad |

### Inventario — George y Sebastián

| Dato | Uso en Intelligence |
| --- | --- |
| Stock actual y mínimo | Alertas y reposición |
| Unidad y tamaño de compra | Redondeo de cantidades |
| Costo y vigencia | Inversión y margen estimados |
| Entradas confirmadas | Evitar sugerir compra duplicada |
| Movimientos con motivo | Explicar diferencias y calidad del saldo |
| Lote y vencimiento, si entran al MVP | Alertas de vencimiento y prioridad |

### Requisitos de calidad

- identificadores estables;
- fechas con zona horaria;
- separación por tienda;
- estados de venta y movimiento explícitos;
- cantidades y montos no ambiguos;
- ausencia de duplicados por reintento;
- registro de correcciones en vez de sobrescritura silenciosa.

Si un requisito falla, el insight afectado debe degradarse a `datos limitados` o no generarse.

## 12. Arquitectura propuesta

La propuesta evita acoplar las fórmulas a la interfaz y no obliga todavía a elegir una tecnología específica.

```text
Ventas ─────────┐
                ├──► almacenamiento transaccional
Inventario ─────┘              │
                               ▼
                    consultas/agregaciones
                               │
                               ▼
                    motor de reglas versionado
                    ├─ métricas
                    ├─ alertas
                    └─ recomendaciones
                               │
                               ▼
                       API de Intelligence
                               │
                   ┌───────────┴───────────┐
                   ▼                       ▼
             UI Intelligence       redacción con IA
                                    (opcional y acotada)
```

### Componentes

- **Agregador:** obtiene métricas por tienda y periodo.
- **Motor de reglas:** aplica fórmulas versionadas y genera evidencia estructurada.
- **Repositorio de insights:** conserva resultado, versión, estado y evaluación.
- **API:** entrega resumen, lista y detalle; sus contratos pertenecen a Backend.
- **Presentación:** renderiza evidencia y acciones sin recalcular reglas críticas.
- **Redactor con IA opcional:** transforma estructuras aprobadas en texto; nunca es fuente de verdad.

Para el volumen del MVP, el cálculo puede ejecutarse al solicitar el resumen o mediante una tarea periódica sencilla. Sebastián y Arturo deben decidirlo según el backend elegido y medir antes de introducir infraestructura adicional.

## 13. UI/UX

### Jerarquía propuesta

1. resumen del periodo con fecha visible;
2. máximo tres acciones prioritarias;
3. métricas de ventas;
4. productos y momentos destacados;
5. historial de insights y filtros.

### Anatomía de una tarjeta

- categoría y severidad;
- título en lenguaje cotidiano;
- evidencia numérica;
- periodo analizado;
- acción sugerida;
- enlace “¿Cómo se calculó?”;
- indicador de datos limitados cuando corresponda.

### Estados obligatorios

- **Primera vez:** explicar qué datos se necesitan para empezar.
- **Sin ventas:** no mostrar ceros como si fueran una tendencia.
- **Historial insuficiente:** mostrar métricas disponibles y omitir patrones débiles.
- **Cargando:** conservar contexto y evitar acciones duplicadas.
- **Error:** mensaje recuperable, última actualización válida y opción de reintento.
- **Desactualizado:** mostrar fecha/hora de la última generación.
- **Sin permiso:** no filtrar datos de otra tienda ni revelar totales restringidos.

### Lenguaje para bodegas peruanas

- usar soles como `S/ 120.50`;
- preferir “unidades”, “stock”, “venta” y “reponer” a términos estadísticos;
- explicar “comparado con la semana anterior” y no solo `+12%`;
- usar “podría agotarse” para estimaciones;
- evitar culpabilizar al vendedor por datos faltantes;
- probar lectura en celular y no depender únicamente de gráficos.

## 14. Casos de uso

### Caso 1: reposición antes de un quiebre

Una bodega de barrio registra ventas de leche durante una semana. Intelligence detecta stock bajo y cobertura estimada menor a dos días, muestra los datos usados y propone revisar una cantidad para siete días. La dueña confirma el stock físico antes de agregarlo a su lista.

### Caso 2: preparación para la hora fuerte

Con varias semanas de tickets, el sistema identifica que la franja de 6 p. m. a 8 p. m. concentra ventas. Sugiere preparar caja y bebidas frías antes de esa hora, indicando cantidad de tickets y periodo observado.

### Caso 3: evitar una compra innecesaria

Un producto de campaña mantiene muchas unidades y tuvo poca salida reciente. Intelligence muestra días de cobertura o ausencia de ventas y recomienda no reponer todavía. No aplica descuentos ni crea promociones sin aprobación.

### Caso 4: comparación semanal justa

El bodeguero revisa si vendió más que la semana anterior. El sistema compara intervalos equivalentes en hora local. Si la semana actual está incompleta, compara contra el mismo tramo de la semana anterior o lo advierte explícitamente.

### Caso 5: campaña navideña con evidencia separada

La interfaz recuerda revisar panetones, chocolate y leche, pero separa los resultados históricos de la tienda de una recomendación general de calendario. Si la tienda aún no tiene historial navideño, no inventa un porcentaje de crecimiento.

### Caso 6: información insuficiente

Una tienda recién creada tiene dos ventas. Intelligence muestra el total y los tickets, pero no declara una hora fuerte ni una tendencia. Explica cuántos datos faltan según el umbral acordado.

## 15. Casos de prueba iniciales

| ID | Escenario | Resultado esperado |
| --- | --- | --- |
| INT-001 | 10 ventas válidas y 1 anulada | Totales excluyen la anulada |
| INT-002 | Reintento con el mismo identificador/idempotency key | La venta se cuenta una sola vez |
| INT-003 | Periodo anterior con venta cero | Muestra “sin base comparable”; no infinito |
| INT-004 | Producto con stock 8, velocidad 6/día | Cobertura aproximada 1.3 días, con redondeo documentado |
| INT-005 | Producto sin ventas en la ventana | No divide entre cero ni asegura fecha de agotamiento |
| INT-006 | Datos de dos tiendas | Ningún total mezcla tiendas |
| INT-007 | Fecha cerca de medianoche en Lima | Se asigna al día local correcto |
| INT-008 | Historial menor al umbral | Omite patrón y muestra datos insuficientes |
| INT-009 | Entrada confirmada pendiente de recepción | La regla usa únicamente el estado acordado |
| INT-010 | Servicio de IA no disponible | Las métricas y mensajes determinísticos siguen funcionando |

Gabo y Arturo deben convertir estos casos en datasets reproducibles y añadir evidencia de ejecución.

## 16. Criterios de aceptación del MVP

- Las métricas de un dataset conocido coinciden con el cálculo manual acordado.
- Cada insight muestra periodo, evidencia, acción y versión de regla.
- Ventas anuladas, duplicadas o de otra tienda no contaminan resultados.
- El sistema no emite tendencias fuertes con historial insuficiente.
- Una actualización válida de ventas o inventario se refleja dentro de la frecuencia acordada.
- El usuario puede entender por qué recibió una alerta sin leer código.
- Las acciones de compra o promoción siempre requieren confirmación.
- La experiencia funciona en celular y contempla carga, vacío, error y datos limitados.
- Gabo puede reproducir al menos un flujo venta → stock → insight con resultado esperado.

## 17. Roadmap v2

El orden depende de evidencia de pilotos, no solo de interés técnico.

### Datos y análisis

- pronóstico por producto con intervalos de incertidumbre;
- estacionalidad aprendida de historial suficiente;
- asociaciones de productos con soporte y confianza visibles;
- detección de anomalías en ventas y movimientos;
- evaluación de precisión de recomendaciones frente a resultados reales.

### Operación

- calendario y pedidos a proveedores;
- unidades de compra, tiempos de entrega y múltiples locales;
- vencimientos y lotes con prioridad dinámica;
- promociones medibles y análisis posterior;
- configuración de reglas por tienda.

### IA y Copilot

- preguntas en lenguaje natural sobre métricas autorizadas;
- resúmenes adaptados por rol;
- evaluación automática contra conjuntos de preguntas y respuestas esperadas;
- protección contra fuga de datos y respuestas fuera del alcance;
- registro de fuentes, versión y feedback del usuario.

### Aprendizaje del piloto

- medir qué insights se abren, comprenden y convierten en una acción;
- registrar cuándo una recomendación fue útil, ignorada o incorrecta;
- ajustar umbrales por evidencia sin ocultar cambios de versión;
- decidir si una capacidad avanzada justifica su costo y complejidad.

## 18. Coordinación y próximos pasos

1. Arturo propone fórmulas, umbrales y datasets con resultado conocido.
2. Mario confirma los campos que Ventas puede producir de forma confiable.
3. George confirma stock, movimientos, unidades y reglas de reposición.
4. Sebastián cierra nombres, tipos, zona horaria, API y frecuencia de actualización.
5. Gabo ejecuta casos de extremo a extremo y valida comprensión con usuarios.
6. El equipo marca cada decisión como `Acordada` antes de tratarla como contrato.

## 19. Decisiones abiertas

| Tema | Responsables | Estado |
| --- | --- | --- |
| Umbral mínimo para patrones de hora/día | Arturo + Gabo | Por definir |
| Horizonte y stock de seguridad | Arturo + George | Por definir |
| Costo histórico o vigente para margen | George + Sebastián | Por definir |
| Días abiertos vs. calendario | Arturo + Sebastián | Por definir |
| Frecuencia de actualización | Arturo + Sebastián | Por definir |
| Inclusión de lotes/vencimientos en noviembre | George + equipo | Por definir |
| Uso de IA generativa en el MVP | Equipo | Opcional; no requerido |

## 20. Relación con el demo actual

La interfaz de `dist/app.js` ya presenta ejemplos de Sales, Inventory, Seasonal, Promotion y Credit Intelligence, y `dist/data-service.js` aporta datos mock. Esos ejemplos son valiosos para diseñar la experiencia, pero varias cifras y textos están escritos directamente en el frontend. Antes de afirmar que Intelligence está implementado, cada mensaje debe conectarse con datos persistidos, una fórmula versionada y una prueba reproducible.
