# Revisión de integraciones del MVP de Fiadito

> **Participantes:** Mario, George, Sebastián, Gabo y Arturo
>
> **Estado:** Propuesto para revisión; no aprobado
>
> **Fecha objetivo del MVP:** noviembre de 2026
>
> **Propósito:** acordar cómo se conectarán Ventas, Inventario, Backend e Intelligence antes de implementar contratos incompatibles.

## 1. Resultado esperado de la reunión

Al terminar, el equipo debería decidir:

1. qué datos produce una venta;
2. cómo esa venta descuenta stock sin duplicarse;
3. qué campos conserva Backend como fuente de verdad;
4. qué consultas o endpoints necesita cada módulo;
5. qué datos puede usar Intelligence y con qué frecuencia;
6. qué datasets utilizará Gabo para comprobar el flujo completo;
7. qué puntos se aceptan, cuáles cambian y quién resuelve cada pendiente.

Esta reunión no busca elegir todas las tecnologías ni diseñar la versión final. Busca cerrar el contrato mínimo para construir una primera integración confiable.

## 2. Flujo integrado propuesto

```text
Mario / Ventas
    │
    │ POST venta + clave de idempotencia
    ▼
Sebastián / Backend
    ├── valida usuario, productos, precios y cantidades
    ├── guarda venta y detalle
    ├── genera movimientos de inventario
    └── confirma todo en una sola transacción
            │
            ├──► George / saldo e historial de stock
            ├──► Arturo / métricas e insights
            └──► Gabo / prueba y evidencia extremo a extremo
```

Resultado mínimo: cuando una venta se confirma, queda registrada una sola vez, el stock cambia exactamente una vez y Intelligence puede leer los mismos datos persistidos.

## 3. Reglas transversales propuestas

| Tema | Propuesta para revisar | Motivo |
| --- | --- | --- |
| Fuente de verdad | Backend y base de datos; el frontend no calcula el saldo definitivo | Evita diferencias entre dispositivos |
| Moneda | `PEN` y montos decimales de dos posiciones | Operación en soles |
| Tiempo | Guardar instantes en UTC y configurar la tienda con `America/Lima` | Comparaciones correctas por día y hora |
| Identificadores | UUID o identificador equivalente generado por Backend | Evita depender de números visibles del demo |
| Idempotencia | Cada intento de venta lleva `idempotency_key` | Evita ventas duplicadas por doble toque o reintento |
| Atomicidad | Venta, detalle y movimientos se confirman o revierten juntos | No debe existir venta sin descuento de stock |
| Historial | No borrar ventas ni movimientos confirmados; anular con registro inverso | Conserva auditoría |
| Stock negativo | Bloqueado por defecto en el MVP | Evita vender unidades inexistentes sin advertencia |
| Precio y costo | Guardar una copia del precio y costo utilizados en cada línea | El margen histórico no cambia al editar el producto |
| Separación por tienda | Toda consulta operativa se limita a `store_id` | Evita mezclar información |
| Estados | Usar valores controlados, no texto libre | Facilita API, pruebas e Intelligence |
| Datos personales | No incluir datos reales de clientes en datasets | Reduce riesgo de privacidad |

## 4. Modelo mínimo de datos

Los nombres son propuestas. Sebastián confirmará tipos y convenciones finales después de escuchar a los demás responsables.

### 4.1 Tienda

| Campo | Tipo conceptual | Obligatorio | Uso |
| --- | --- | --- | --- |
| `store_id` | ID | Sí | Separar información de cada negocio |
| `name` | Texto | Sí | Nombre visible |
| `timezone` | Texto IANA | Sí | Día y hora local; propuesta `America/Lima` |
| `currency` | Texto | Sí | Propuesta `PEN` |
| `status` | Enum | Sí | `active` o `inactive` |

### 4.2 Usuario y rol

| Campo | Tipo conceptual | Obligatorio | Uso |
| --- | --- | --- | --- |
| `user_id` | ID | Sí | Autor de venta o ajuste |
| `store_id` | ID | Sí | Tienda autorizada |
| `display_name` | Texto | Sí | Identificación en historial |
| `role` | Enum | Sí | Propuesta: `admin` o `seller` |
| `status` | Enum | Sí | Controlar acceso |

Propuesta inicial: el vendedor registra ventas y consulta lo necesario para atender; el administrador gestiona productos, precios, stock y ajustes. Sebastián debe confirmar la autorización en Backend, no solo ocultar botones.

### 4.3 Producto

| Campo | Tipo conceptual | Obligatorio | Uso |
| --- | --- | --- | --- |
| `product_id` | ID | Sí | Identificador estable |
| `store_id` | ID | Sí | Propietario del catálogo |
| `name` | Texto | Sí | Nombre visible |
| `sku` | Texto | No | Código interno |
| `barcode` | Texto | No | Búsqueda o escaneo futuro |
| `category_id` | ID | No | Agrupación |
| `unit` | Enum | Sí | `unit`, `kg`, `liter` u opciones acordadas |
| `purchase_pack_size` | Decimal | No | Redondear reposición por caja o paquete |
| `current_cost` | Decimal | Sí | Costo vigente |
| `sale_price` | Decimal | Sí | Precio vigente |
| `minimum_stock` | Decimal | Sí | Alerta básica |
| `active` | Booleano | Sí | Disponible sin borrar historial |
| `created_at` / `updated_at` | Fecha-hora | Sí | Auditoría |

Pregunta para George y Mario: ¿el MVP venderá únicamente unidades enteras o también cantidades decimales por peso/volumen? Esa decisión afecta `quantity`, stock y validaciones.

### 4.4 Venta

| Campo | Tipo conceptual | Obligatorio | Lo produce o valida |
| --- | --- | --- | --- |
| `sale_id` | ID | Backend | Sebastián |
| `idempotency_key` | Texto único por tienda | Sí | Mario envía; Sebastián valida |
| `store_id` | ID | Sí | Sesión/Backend |
| `seller_id` | ID | Sí | Sesión/Backend |
| `sold_at` | Fecha-hora | Sí | Backend; no confiar solo en reloj del cliente |
| `status` | Enum | Sí | `confirmed` o `cancelled` para el MVP |
| `payment_method` | Enum | Sí | `cash`, `yape`, `plin` o `credit` si el equipo lo incluye |
| `subtotal` | Decimal | Sí | Backend recalcula |
| `discount` | Decimal | Sí | Cero si no aplica |
| `total` | Decimal | Sí | Backend recalcula |
| `currency` | Texto | Sí | `PEN` |
| `created_at` / `updated_at` | Fecha-hora | Sí | Auditoría |

### 4.5 Detalle de venta

| Campo | Tipo conceptual | Obligatorio | Motivo |
| --- | --- | --- | --- |
| `sale_item_id` | ID | Sí | Trazabilidad |
| `sale_id` | ID | Sí | Relación con venta |
| `product_id` | ID | Sí | Producto vendido |
| `quantity` | Decimal | Sí | Unidades vendidas |
| `unit_price` | Decimal | Sí | Copia del precio aplicado |
| `unit_cost_snapshot` | Decimal | Sí | Margen histórico reproducible |
| `discount` | Decimal | Sí | Descuento de la línea |
| `line_total` | Decimal | Sí | Total recalculado por Backend |

Mario puede enviar producto, cantidad y descuento permitido. Backend debe recalcular precio y totales; no debe aceptar como verdad un total modificado desde el navegador.

### 4.6 Movimiento de inventario

| Campo | Tipo conceptual | Obligatorio | Uso |
| --- | --- | --- | --- |
| `movement_id` | ID | Sí | Auditoría |
| `store_id` | ID | Sí | Separación por tienda |
| `product_id` | ID | Sí | Producto afectado |
| `movement_type` | Enum | Sí | `sale`, `purchase`, `adjustment`, `sale_cancellation` |
| `quantity_delta` | Decimal con signo | Sí | Salida negativa, entrada positiva |
| `reason` | Enum/texto controlado | Sí | Explicar el cambio |
| `reference_type` | Enum | Sí | Venta, compra o ajuste |
| `reference_id` | ID | Sí | Volver al origen |
| `occurred_at` | Fecha-hora | Sí | Orden cronológico |
| `actor_id` | ID | Sí | Usuario o proceso responsable |
| `resulting_stock` | Decimal | Por decidir | Facilita auditoría, pero puede derivarse |

### 4.7 Insight

La salida de Intelligence conservará como mínimo:

- `insight_id`, `store_id` y `type`;
- `period_start`, `period_end` y `generated_at`;
- `severity`, `title` y `suggested_action`;
- evidencia estructurada;
- calidad o suficiencia del dato;
- versión de la regla utilizada;
- estado: activo, descartado o resuelto.

La fórmula pertenece a [`FIADITO_INTELLIGENCE.md`](./FIADITO_INTELLIGENCE.md); la forma de persistirla y exponerla se acuerda con Sebastián.

## 5. API propuesta para conversar con Sebastián

Las rutas son ilustrativas. No se consideran aprobadas hasta revisar tecnología, seguridad y convenciones del backend.

### 5.1 Operaciones principales

| Método y ruta propuesta | Responsable/consumidor | Propósito |
| --- | --- | --- |
| `POST /api/v1/auth/login` | Sebastián / interfaces | Iniciar sesión y obtener contexto autorizado |
| `GET /api/v1/products` | George → Mario | Consultar productos activos y precios |
| `POST /api/v1/products` | George | Crear producto como administrador |
| `PATCH /api/v1/products/{id}` | George | Actualizar datos permitidos |
| `GET /api/v1/inventory` | George, Mario | Consultar saldo y mínimos |
| `POST /api/v1/inventory/movements` | George | Registrar entrada o ajuste autorizado |
| `GET /api/v1/inventory/movements` | George, Gabo | Auditar movimientos |
| `POST /api/v1/sales` | Mario | Confirmar venta y descontar stock |
| `GET /api/v1/sales` | Mario, Gabo | Consultar historial con filtros |
| `GET /api/v1/sales/{id}` | Mario, Gabo | Ver venta y detalle |
| `POST /api/v1/sales/{id}/cancel` | Rol por definir | Anular y revertir stock |
| `GET /api/v1/intelligence/summary` | Arturo / interfaz | Métricas de un periodo |
| `GET /api/v1/intelligence/insights` | Arturo / interfaz | Insights activos o históricos |
| `GET /api/v1/intelligence/insights/{id}` | Arturo / Gabo | Evidencia y explicación completa |

### 5.2 Ejemplo de solicitud de venta

```json
{
  "idempotency_key": "POS-01-20261020-000123",
  "payment_method": "yape",
  "items": [
    {
      "product_id": "prod-leche",
      "quantity": 2
    },
    {
      "product_id": "prod-inca",
      "quantity": 3
    }
  ]
}
```

El frontend no necesita enviar `store_id`, `seller_id`, precios ni totales si Backend puede obtenerlos de la sesión y del catálogo vigente. Si se permite descuento, se debe acordar el campo, límite y rol autorizado.

### 5.3 Ejemplo de respuesta confirmada

```json
{
  "sale_id": "sale-1001",
  "status": "confirmed",
  "sold_at": "2026-10-20T15:30:00Z",
  "local_time": "2026-10-20T10:30:00-05:00",
  "payment_method": "yape",
  "subtotal": "19.50",
  "discount": "0.00",
  "total": "19.50",
  "currency": "PEN",
  "items": [
    {
      "product_id": "prod-leche",
      "quantity": "2",
      "unit_price": "4.50",
      "line_total": "9.00",
      "remaining_stock": "28"
    },
    {
      "product_id": "prod-inca",
      "quantity": "3",
      "unit_price": "3.50",
      "line_total": "10.50",
      "remaining_stock": "9"
    }
  ]
}
```

### 5.4 Errores mínimos

La API debe devolver un código estable, un mensaje entendible y detalles seguros. Casos mínimos:

- sesión vencida o sin permiso;
- producto inexistente o inactivo;
- stock insuficiente;
- cantidad inválida;
- precio cambiado desde que se abrió la pantalla;
- clave de idempotencia ya procesada;
- venta ya anulada;
- conflicto de actualización;
- error interno recuperable.

Propuesta de formato:

```json
{
  "error": {
    "code": "INSUFFICIENT_STOCK",
    "message": "No hay stock suficiente para completar la venta.",
    "details": {
      "product_id": "prod-inca",
      "available": "2",
      "requested": "3"
    }
  }
}
```

## 6. Qué datos genera cada venta

Una venta confirmada debería producir, como mínimo:

1. una cabecera de venta;
2. una línea por producto;
3. un movimiento negativo por cada producto;
4. un saldo de inventario actualizado;
5. un registro de auditoría con usuario y fecha;
6. datos disponibles para métricas de Intelligence;
7. una respuesta única al frontend, incluso si el usuario reintenta la misma solicitud.

### Datos que podrá calcular Intelligence

| Datos producidos por venta | Métrica o insight posible |
| --- | --- |
| Fecha/hora local | Ventas por día y franja |
| Producto y cantidad | Ranking y velocidad |
| Precio, descuento y total | Venta neta y ticket promedio |
| Costo copiado en la línea | Margen histórico estimado |
| Stock y movimientos | Cobertura y reposición |
| Estado de venta | Exclusión de anulaciones |
| Tienda | Aislamiento de resultados |

No se generará una recomendación fuerte si faltan campos indispensables o no existe historial suficiente.

## 7. Reglas de stock para discutir con George

1. El stock se descuenta únicamente cuando Backend confirma la venta.
2. Abrir el carrito no reserva stock en el MVP, salvo que el equipo decida lo contrario.
3. Si dos ventas compiten por las últimas unidades, solo se confirma la que Backend pueda completar de forma atómica.
4. Una anulación genera movimientos inversos; no elimina los originales.
5. Un ajuste manual exige motivo y usuario con permiso.
6. Un producto inactivo conserva su historial.
7. El mínimo de stock genera una alerta; no cambia el saldo.
8. La reposición sugerida no realiza compras ni crea entradas automáticamente.
9. Las entradas se consideran disponibles solo en el estado acordado: propuesta inicial, cuando hayan sido recibidas y confirmadas.
10. Lotes y vencimientos deben entrar al MVP únicamente si George puede mantenerlos sin romper el flujo básico.

## 8. Datasets para validar con Gabo

Los datasets deben almacenarse sin datos reales y con un resultado manual conocido.

### Dataset A — venta, stock e Intelligence

Estado inicial:

| Producto | Stock | Mínimo | Costo | Precio |
| --- | ---: | ---: | ---: | ---: |
| Leche | 30 | 10 | S/ 3.50 | S/ 4.50 |
| Inca Kola | 12 | 8 | S/ 2.20 | S/ 3.50 |
| Arroz | 15 | 5 | S/ 4.00 | S/ 5.50 |

Ventas válidas del periodo:

| Venta | Detalle | Total |
| --- | --- | ---: |
| V-001 | 2 leches + 3 Inca Kolas | S/ 19.50 |
| V-002 | 4 leches + 1 arroz | S/ 23.50 |
| V-003 | 2 Inca Kolas + 2 arroces | S/ 18.00 |

Resultados esperados:

- venta neta: `S/ 61.00`;
- tickets: `3`;
- ticket promedio: `S/ 20.33`;
- unidades: `14`;
- más vendido por unidades: Leche, `6`;
- stock final: Leche `24`, Inca Kola `7`, Arroz `12`;
- alerta: Inca Kola está por debajo de su mínimo de `8`;
- con un periodo anterior de `S/ 50.00`, la variación es `+22%`;
- una cuarta solicitud con la misma `idempotency_key` de V-003 no cambia ventas ni stock.

La reposición esperada se completará después de acordar horizonte, stock de seguridad y tamaño de compra.

### Dataset B — datos insuficientes

- tienda nueva con dos tickets;
- debe mostrar totales y productos vendidos;
- no debe declarar una hora o día fuerte;
- debe indicar que todavía no existe historial suficiente.

### Dataset C — anulación

- confirmar una venta de dos unidades;
- verificar la salida de inventario;
- anularla con un usuario autorizado;
- verificar movimiento inverso y exclusión del total neto;
- conservar venta, detalle, movimientos y auditoría.

### Dataset D — aislamiento entre tiendas

- cargar ventas y productos con nombres similares en dos tiendas;
- comprobar que stock, historial e insights nunca se mezclan;
- intentar consultar un identificador de otra tienda y esperar denegación.

### Dataset E — concurrencia y reintento

- iniciar con dos unidades disponibles;
- enviar dos ventas simultáneas de dos unidades;
- confirmar solamente una;
- reintentar la confirmada con la misma clave y devolver el mismo resultado sin nuevo movimiento.

## 9. Preguntas para cada integrante

### Mario — Ventas

- ¿Estos campos se pueden producir sin volver lento el registro de venta?
- ¿Qué medios de pago entrarán realmente en noviembre?
- ¿Habrá descuentos, anulaciones y devoluciones? ¿Quién puede realizarlos?
- ¿Cómo debe reaccionar la pantalla si el precio o el stock cambió?
- ¿Se venderán fracciones o solo unidades enteras?

### George — Inventario

- ¿El stock negativo estará completamente prohibido?
- ¿Qué tipos de movimiento y motivos necesita el MVP?
- ¿Cómo se registra una entrada y cuándo se vuelve disponible?
- ¿El mínimo será manual por producto?
- ¿Lotes, vencimientos y cajas entran en noviembre o en una etapa posterior?
- ¿Qué dato representa la unidad de compra para reposición?

### Sebastián — Backend, datos y accesos

- ¿Qué tecnología y convención de API propone?
- ¿Cómo garantizará transacción e idempotencia?
- ¿Qué campos deben venir del cliente y cuáles del contexto autenticado?
- ¿Cómo se versionarán contratos y migraciones?
- ¿Cómo se almacenarán montos, cantidades y fechas?
- ¿Cómo leerá Intelligence las agregaciones sin afectar la operación?
- ¿Qué logs y recuperación estarán disponibles para Gabo?

### Gabo — Integración, calidad y pilotos

- ¿Los datasets cubren los riesgos principales?
- ¿Qué navegadores, dispositivos y roles deben probarse?
- ¿Qué evidencia debe acompañar cada caso?
- ¿Cuál será la severidad que impide iniciar el piloto?
- ¿Cómo se repetirá una prueba después de una corrección?

### Arturo — Intelligence

- ¿Qué métricas son indispensables para noviembre?
- ¿Cuántos días o tickets se exigirán antes de declarar un patrón?
- ¿Cuál será el horizonte y stock de seguridad para reposición?
- ¿Cada cuánto se actualizarán resumen e insights?
- ¿Qué mensaje se mostrará cuando falten datos?
- ¿Puede el MVP funcionar completamente sin IA generativa? Propuesta: sí.

## 10. Decisiones que deben registrarse

Durante la reunión, completar esta tabla. No cambiar `Propuesto` por `Acordado` sin confirmación de los responsables afectados.

| ID | Decisión | Propuesta inicial | Respuesta del equipo | Responsable final | Estado |
| --- | --- | --- | --- | --- | --- |
| D-01 | Unidad de venta | Entera; decimal solo si el MVP lo necesita | Pendiente | Mario + George | Propuesto |
| D-02 | Stock negativo | Bloqueado | Pendiente | George + Sebastián | Propuesto |
| D-03 | Medios de pago | Efectivo, Yape y Plin; fiado por confirmar | Pendiente | Mario + equipo | Propuesto |
| D-04 | Anulación | Movimiento inverso y auditoría | Pendiente | Mario + George + Sebastián | Propuesto |
| D-05 | Costo histórico | Copia en detalle de venta | Pendiente | George + Sebastián | Propuesto |
| D-06 | Zona horaria | UTC almacenado, `America/Lima` para negocio | Pendiente | Sebastián + Arturo | Propuesto |
| D-07 | Reposición | Horizonte de 7 días; seguridad por definir | Pendiente | George + Arturo | Propuesto |
| D-08 | Actualización de insights | Al consultar o tarea sencilla; por decidir | Pendiente | Sebastián + Arturo | Propuesto |
| D-09 | Datos mínimos de patrones | Umbral por definir con dataset | Pendiente | Arturo + Gabo | Propuesto |
| D-10 | IA generativa | No requerida para noviembre | Pendiente | Equipo | Propuesto |
| D-11 | Lotes y vencimientos | Solo si no bloquean el flujo básico | Pendiente | George + equipo | Propuesto |
| D-12 | Rol que anula ventas | Por definir | Pendiente | Mario + Sebastián | Propuesto |

## 11. Agenda sugerida — 50 minutos

1. **5 min:** objetivo y regla venta → stock → Intelligence.
2. **10 min:** Mario explica el flujo de venta y sus excepciones.
3. **10 min:** George revisa productos, movimientos y stock.
4. **10 min:** Sebastián revisa campos, API, transacción, roles e idempotencia.
5. **8 min:** Arturo revisa métricas y datos necesarios.
6. **5 min:** Gabo valida datasets, evidencias y riesgos.
7. **2 min:** asignar pendientes, responsables y fecha de respuesta.

## 12. Guion breve para presentar la propuesta

> No estamos aprobando todavía una arquitectura definitiva. Esta propuesta busca que una venta registrada por Mario se guarde una sola vez, descuente correctamente el stock de George y entregue datos confiables para Intelligence. Sebastián revisará si los campos y endpoints son correctos; Gabo comprobará el flujo con datasets cuyo resultado ya conocemos. Necesito que cada uno indique qué acepta, qué cambiaría y qué dato no puede producir. Después actualizaremos el documento con los acuerdos y recién empezaremos la integración.

## 13. Condición para empezar a implementar

La integración puede iniciar cuando estén acordados como mínimo:

- campos de producto, venta, detalle y movimiento;
- política de stock negativo y anulación;
- contrato de creación de venta y errores;
- zona horaria y tratamiento de montos;
- dataset A con resultados esperados;
- datos mínimos que consumirá Intelligence;
- responsable de cada cambio pendiente.

Hasta entonces, cada integrante puede revisar o crear prototipos aislados, pero no debe presentar los nombres de campos, rutas o reglas de este documento como contratos definitivos.
