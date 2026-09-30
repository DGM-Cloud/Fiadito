# Fiadito V1

Frontend funcional para registrar ventas, productos e inventario con datos locales.

## Ejecutar

Abre `dist/index.html` directamente o, desde la carpeta `fiadito`, ejecuta:

```bash
python3 -m http.server 4173 --directory dist
```

Luego visita `http://localhost:4173`. No requiere instalación ni backend.

## Datos

La aplicación usa `localStorage`. El botón “Restablecer demo” devuelve los productos y ventas a su estado inicial. `data-service.js` concentra modelos, datos mock y operaciones para que luego pueda sustituirse por un servicio API.
