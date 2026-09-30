# Fiadito V1

Frontend funcional para registrar ventas, productos e inventario con datos locales. Incluye historial por fecha, impresión de tickets y cuadre diario de caja por método de pago.

## Ejecutar

Abre `dist/index.html` directamente o, desde la carpeta `fiadito`, ejecuta:

```bash
python3 -m http.server 4173 --directory dist
```

Luego visita `http://localhost:4173`. No requiere instalación ni backend.

## Datos

La aplicación usa `localStorage`. El botón “Restablecer demo” devuelve los productos, ventas y cuadres a su estado inicial. `data-service.js` concentra modelos, datos mock y operaciones para que luego pueda sustituirse por un servicio API.

En el cuadre, el efectivo esperado se calcula como `fondo inicial + ventas en efectivo`. Los pagos mediante Yape, Plin u otros métodos aparecen en el resumen diario, pero no se suman a la caja física.
