# Backend (Node.js + Express + Mongoose)

## Objetivo

Construir el backend de la app como una API (idealmente REST) que el frontend consumirá.

## Qué se espera que exista (mínimo)

1. **Conexión a MongoDB** (Mongoose).
2. **Modelos** (colecciones + esquemas) para cada entidad del negocio.
3. **Rutas/endpoints** para crear/leer/actualizar/eliminar (o lo necesario según la app).
4. **Manejo de errores consistente** (status codes y mensajes claros).
5. **Validación** de datos (por ejemplo, validaciones a nivel Mongoose y/o en request).
6. **Variables de entorno** documentadas.

## Estructura de carpetas sugerida

Para el Proyecto Integrador, se recomienda seguir esta organización MVC **directamente dentro de `/backend`**:

- `config/` (conexión a DB y carga de variables de entorno)
- `models/` (schemas de Mongoose)
- `controllers/` (lógica de las acciones del dominio)
- `routes/` (definición de endpoints)
- `middlewares/` (validaciones, seguridad y manejo de errores)
- `server.js` (entrypoint del servidor) o el entrypoint que usen en su implementación

## Endpoints y documentación

- Documenten los endpoints (por ejemplo en `docs/endpoints.md` o en un archivo dentro de `backend/`).
- Para cada endpoint, aclarar:
  - método HTTP (`GET/POST/...`)
  - ruta
  - qué recibe y qué devuelve (ejemplos)
  - status codes relevantes (`200`, `201`, `400`, `401`, `404`, `500`, etc.)

## Checklist

- [ ] Se puede ejecutar el backend con `npm install` y `npm run dev` (o el comando equivalente).
- [ ] Hay al menos 1 modelo Mongoose implementado (y con validaciones).
- [ ] Hay endpoints funcionales (al menos un flujo completo end-to-end con el frontend).
- [ ] Los errores devuelven respuestas claras.

## Variables de entorno (ejemplo)

Creá un `.env.example` (no suban el `.env` real):

- `MONGO_URL`
- `PORT`
