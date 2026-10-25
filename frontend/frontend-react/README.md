# Frontend React

## Objetivo

Implementar el mismo producto que en `frontend-vanilla`, pero con React, manteniendo el mismo contrato con el backend.

## Sprint cubierto

- `docs/sprint-4/`: SPA con React (Vite) + React Router DOM + rutas protegidas + deploy + Demo Day.

## Consigna (React)

- Consumir la misma API del backend (mismos endpoints).
- Implementar los mismos flujos principales (pantallas y operaciones).
- Comportamiento equivalente en:
  - loading
  - errores del backend
  - estados vacíos (sin datos)

## Estructura sugerida

Orientativa (adapten al template que usen, por ejemplo Vite):

- `src/`
  - `main.jsx`
  - `App.jsx` (rutas/navegación)
  - `api/` o `services/` (cliente para consumir endpoints)
  - `pages/` (pantallas)
  - `components/` (componentes reutilizables)
  - `styles/` (estilos)
  - `utils/` (helpers)

## Configuración

La URL del backend se define con la variable `VITE_API_URL` (se usa en `src/services/api.js`).

1. Copiar `.env.example` como `.env`.
2. En local dejar `VITE_API_URL=http://localhost:4000/api`.
3. En producción (Vercel) cargar `VITE_API_URL` con la URL pública del backend.

El archivo `.env` no se sube al repositorio.

## Ejecución

Requiere el backend corriendo en el puerto 4000 (`cd backend && npm run dev`).

```bash
cd frontend/frontend-react
npm install
npm run dev      # servidor de desarrollo en http://localhost:5173
npm run build    # build de producción en dist/
npm run lint     # ESLint + Stylelint
```

## Checklist

- [ ] La UI refleja el estado de la API (loading/error/empty).
- [ ] La navegación cubre el flujo completo.
- [ ] Se mantiene paridad con `frontend-vanilla` (mismo comportamiento funcional).

## Criterios clave (según el enunciado)

- React Router DOM (SPA sin recargas al navegar).
- Componentización (Navbar, ProductCard, Footer, etc.).
- Rutas protegidas para admin (solo si el usuario tiene rol).
