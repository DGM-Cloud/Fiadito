# Ventas y experiencia del vendedor

> **Responsable:** Mario
>
> **Estado:** Propuesto
> **MVP objetivo:** noviembre de 2026

## Objetivo

Permitir que un vendedor registre una operación con pocos pasos, vea el total antes de confirmar y pueda comprobarla después en el historial.

## Alcance inicial que debe detallarse

- selección de productos y cantidades;
- precio aplicable y total visible;
- medio de pago básico;
- confirmación sin duplicar la operación;
- historial con fecha, total, usuario y detalle;
- respuesta clara ante falta de stock, error o pérdida de conexión;
- experiencia responsive para celular y computadora.

## Contratos a cerrar

- Con George: disponibilidad, stock insuficiente y descuento al confirmar.
- Con Sebastián: solicitud, respuesta, idempotencia, errores y persistencia de la venta.
- Con Arturo: fecha/hora, productos, cantidades, precio, descuentos, medio y usuario necesarios para analizar ventas.
- Con Gabo: escenarios de prueba para vendedor, administrador, móvil y escritorio.

## Datos mínimos que debe producir una venta

`sale_id`, `sold_at`, `timezone`, `seller_id`, `store_id`, `payment_method`, `subtotal`, `discount`, `total` y detalle por producto con `product_id`, `quantity`, `unit_price` y `line_total`.

Los nombres y tipos definitivos se acuerdan con Backend. No tomar los objetos mock del demo como contrato productivo.

## Pendientes del responsable

- [ ] Describir el flujo nominal y los flujos de error.
- [ ] Definir reglas de precio, descuento, anulación y devolución para el MVP.
- [ ] Escribir criterios de aceptación medibles.
- [ ] Agregar casos de prueba con resultados esperados.
- [ ] Registrar decisiones abiertas y responsables.

Completar las secciones restantes siguiendo [`../plantillas/MODULO.md`](../plantillas/MODULO.md).
