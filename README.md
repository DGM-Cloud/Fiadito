# Fiadito 2.0

> **Fiadito — el copiloto inteligente de tu negocio.**

Demo frontend para bodegas y pequeños negocios peruanos. Convierte datos simulados de ventas, inventario y fiados en acciones concretas: qué comprar, cuánto reponer, qué promoción crear y a quién cobrar.

## Alcance del demo

Esta entrega es **solo frontend**. No incluye backend, base de datos, autenticación real, sincronización entre dispositivos ni modelos predictivos en producción. Los datos viven en `localStorage` y se pueden restablecer desde la interfaz.

El demo incluye:

- Ventas rápidas con efectivo, Yape, Plin y fiado.
- Precios por volumen, incluido el caso de panetones por caja de 12.
- Historial y resumen por productos, métodos de pago, día y hora.
- Inventario con costo, precio, margen, categorías, lotes, vencimientos, baja rotación y “plata dormida”.
- Sales Intelligence e Inventory Intelligence con recomendaciones accionables.
- Seasonal Intelligence para campañas peruanas: Navidad, octubre, Día de la Madre y Fiestas Patrias.
- Promotion Intelligence por baja rotación, vencimiento, asociaciones, temporada y compras mayoristas.
- Fiados/Credit Intelligence con clientes, deudas, abonos y sugerencias de cobranza.
- Fiadito Copilot con consultas simuladas en lenguaje natural y voz.
- Lista de compra inteligente, creación de promociones y registro de pagos con datos locales.

## Ejecutar localmente

Desde la carpeta del proyecto:

```bash
python3 -m http.server 4173 --directory dist
```

Luego visita [http://localhost:4173](http://localhost:4173).

No hay dependencias que instalar ni proceso de compilación. También puedes abrir `dist/index.html`, aunque un servidor local evita restricciones de módulos en algunos navegadores.

## Estructura

- `dist/index.html`: entrada y metadatos.
- `dist/styles.css`: sistema visual responsive.
- `dist/data-service.js`: datos mock y persistencia local, aislados para poder sustituirlos por una API.
- `dist/app.js`: vistas, navegación e interacciones del demo.

## Demo publicada

- Aplicación vigente: https://dgm-cloud.github.io/fiadito/
- Repositorio: https://github.com/DGM-Cloud/Fiadito

GitHub Pages publica directamente el contenido de `dist` mediante la rama `gh-pages`.

## Qué falta para producción

La siguiente etapa deberá definir e implementar API, base de datos, usuarios y permisos, seguridad, auditoría, sincronización, integración con comprobantes/pagos, entrenamiento o reglas de inteligencia y validación de predicciones. Ninguna recomendación del demo debe tratarse como una decisión automática de compra o crédito.
