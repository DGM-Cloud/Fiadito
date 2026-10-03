# Fiadito

Frontend funcional para registrar ventas, productos e inventario con datos locales. Incluye roles de administrador y vendedor, turnos de caja, búsqueda por código de barras, impresión de tickets, anulaciones autorizadas, historial por fecha y registro de actividad.

## Requisitos

- Un navegador moderno.
- Python 3 (opcional, recomendado para levantar un servidor local).

## Ejecutar localmente

Abre `dist/index.html` directamente o, desde la carpeta `fiadito`, ejecuta:

```bash
python3 -m http.server 4173 --directory dist
```

Luego visita `http://localhost:4173`.

El proyecto no usa paquetes externos, por lo que no es necesario instalar dependencias. También puedes abrir `dist/index.html` directamente, aunque el servidor local evita restricciones de algunos navegadores al cargar módulos JavaScript.

## Datos

La aplicación usa `localStorage`. `data-service.js` concentra modelos, datos mock y operaciones para que luego pueda sustituirse por un servicio API.

## Accesos de demostración

- Administrador Carlos: PIN `1234`
- Vendedora Rosa: PIN `2468`

El administrador puede crear o editar productos, revisar la actividad del equipo, filtrar ventas por vendedor y autorizar anulaciones o retiros. El vendedor puede vender, consultar productos sin modificarlos y cerrar su propio turno. Para iniciar una venta, cada usuario debe abrir su turno indicando el fondo inicial.

En el cierre de turno, el efectivo esperado se calcula como `fondo inicial + ventas en efectivo + ingresos - retiros`. Los pagos mediante Yape, Plin u otros métodos no se suman a la caja física. Las ventas anuladas tampoco forman parte de los totales.

> Esta versión demuestra permisos y flujos usando únicamente el navegador. Para evitar fraudes en producción, los PIN, permisos, precios, anulaciones y auditoría deben validarse en un backend y una base de datos protegida.
