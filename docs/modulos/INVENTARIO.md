# Productos e inventario

> **Responsable:** George
>
> **Estado:** Propuesto
> **MVP objetivo:** noviembre de 2026

## Objetivo

Mantener un catálogo y un saldo de stock confiables, donde cada cambio pueda explicarse mediante una venta, entrada o ajuste con motivo.

## Alcance inicial que debe detallarse

- alta y edición de productos;
- stock actual y stock mínimo;
- entradas, salidas por venta y ajustes controlados;
- historial de movimientos;
- alertas simples de reposición;
- validación de unidades, costos, precios y permisos.

## Contratos a cerrar

- Con Mario: disponibilidad durante la venta y saldo posterior a la confirmación.
- Con Sebastián: transacciones, validaciones, movimientos persistidos y fuente de verdad del saldo.
- Con Arturo: stock actual, mínimo, costo, entradas, ajustes e historial para rotación y reposición.
- Con Gabo: conteos y escenarios para comparar stock esperado contra stock registrado.

## Datos mínimos a documentar

Producto, unidad de medida, costo, precio, stock actual, stock mínimo y estado; cada movimiento debe incluir identificador, producto, tipo, cantidad, fecha/hora, motivo, usuario y referencia a la venta o ajuste cuando corresponda.

## Pendientes del responsable

- [ ] Definir qué evento modifica el saldo y cómo se evita aplicarlo dos veces.
- [ ] Definir si se permitirá stock negativo y cómo se corrige un error.
- [ ] Especificar las reglas de mínimo, lote y vencimiento incluidas en el MVP.
- [ ] Escribir criterios de aceptación y datasets de prueba.
- [ ] Registrar decisiones abiertas y responsables.

Completar las secciones restantes siguiendo [`../plantillas/MODULO.md`](../plantillas/MODULO.md).
