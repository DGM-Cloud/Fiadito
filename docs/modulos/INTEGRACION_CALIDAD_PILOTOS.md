# Integración, calidad y pilotos

> **Responsable:** Gabo
>
> **Estado:** Propuesto
> **MVP objetivo:** noviembre de 2026

## Objetivo

Demostrar que el flujo completo funciona con datos nuevos, detectar fallas reproducibles y recoger evidencia de uso real antes de ampliar el producto.

## Alcance inicial que debe detallarse

- plan de pruebas de venta, stock, roles, historial e Intelligence;
- matriz de dispositivos, navegadores y perfiles;
- datos semilla y resultados esperados;
- registro y priorización de incidencias;
- verificación posterior a cada corrección;
- preparación de versión desplegable y procedimiento de recuperación;
- guía breve de onboarding y protocolo del piloto;
- registro de feedback sin exponer datos personales innecesarios.

## Contratos a cerrar

- Con Sebastián: entorno, datos semilla, logs y recuperación.
- Con Mario y George: escenarios reales y permisos usando estados recién creados.
- Con Arturo: datasets con resultado conocido y pruebas de comprensión de cada insight.

## Evidencia mínima por prueba

Cada caso debe registrar versión o commit probado, ambiente, rol, datos iniciales, pasos, resultado esperado, resultado observado, evidencia, severidad y estado de la corrección.

## Pendientes del responsable

- [ ] Crear matriz de escenarios críticos y responsables.
- [ ] Definir severidades y condición de salida del piloto.
- [ ] Preparar una prueba de extremo a extremo: venta → stock → Intelligence.
- [ ] Definir cómo se recopilará feedback y consentimiento del piloto.
- [ ] Registrar decisiones abiertas y responsables.

Completar las secciones restantes siguiendo [`../plantillas/MODULO.md`](../plantillas/MODULO.md).
