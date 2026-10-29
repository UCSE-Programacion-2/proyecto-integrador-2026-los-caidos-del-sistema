# Los Caídos del Sistema - Programación II 2026

Tienda online de **Balbi Home**, comercio de artículos para el hogar de San Salvador de Jujuy.

## 🚀 Producción (Sprint 4)

| | Enlace |
| --- | --- |
| **Tienda (frontend)** | https://balbi-home.vercel.app |
| **API (backend)** | https://balbi-home-backend.onrender.com/api |
| **Tablero de GitHub Projects** | [Ver tablero](https://github.com/orgs/UCSE-Programacion-2/projects/34) |
| **Video de respaldo** | _Pendiente_ |
| **Video Sprint Review final** | _Pendiente_ |

> El backend está en el plan gratuito de Render: si no recibió visitas por un rato, la primera carga puede tardar unos 30 segundos mientras el servidor "despierta". La tienda muestra un aviso mientras tanto.

## 👥 Integrantes

| Integrante | Rol Scrum | GitHub |
| --- | --- | --- |
| **Copa, Elina Luisana de los Angeles** | Dev Team | [@luisanaacopa](https://github.com/luisanaacopa) |
| **Perez, Lucas Santiago** | Product Owner | [@lucassperezz](https://github.com/lucassperezz) |
| **Valdez, Melani Agustina** | Scrum Master | [@agustinavaldezz](https://github.com/agustinavaldezz) |

## 🏢 Cliente real

- **Nombre:** Balbi Home.
- **Rubro:** comercio minorista (retail) de artículos para el hogar: electrodomésticos, bazar, blanco y decoración.
- **Dirección:** Belgrano 970, San Salvador de Jujuy. Lunes a sábado de 9 a 21 hs.
- **Redes sociales:** [Instagram](https://www.instagram.com/balbihome_jujuy) · [Facebook](https://www.facebook.com/share/18gMqwsBkf/)
- **Justificación:** su catálogo variado, con varias categorías y productos con precio, stock e imagen, justifica un sistema para mostrar los productos online y administrar su alta, modificación y baja.

## 🛍️ Qué se puede hacer en la tienda

- **Catálogo** de 40 productos con fotos reales, en 4 categorías (Bazar, Decoración, Blanco y Electrodomésticos), con búsqueda, filtros por categoría, precio y disponibilidad, y ordenamiento.
- **Detalle** de cada producto, con su stock disponible.
- **Carrito** que se guarda en el navegador (persiste al cerrarlo y volver a abrirlo) y no permite superar el stock.
- **Compra simulada** con validación de los datos de envío (no se realiza ningún pago real).
- **Registro e inicio de sesión** con contraseña cifrada y token JWT.
- **Panel de administración** (solo usuarios con rol `admin`): alta, edición y baja de productos.

### Flujo del Demo Day

1. Crear un usuario nuevo en **Ingresar → Registrate**.
2. Buscar un producto en el **Catálogo**.
3. Agregarlo al **carrito**.
4. **Finalizar compra** completando los datos de envío.
5. Cerrar el navegador, volver a abrir la tienda y comprobar que el carrito se mantiene.

## 🧱 Tecnologías

| Capa | Tecnologías | Carpeta | Deploy |
| --- | --- | --- | --- |
| Frontend | React 18, Vite, React Router DOM, Context API (sesión y carrito) | `frontend/frontend-react` | Vercel |
| Backend | Node.js, Express, Mongoose, JWT, bcrypt | `backend` | Render |
| Base de datos | MongoDB Atlas | — | Atlas |

La versión anterior en HTML, CSS y JavaScript (Sprints 1 a 3) está en `frontend/frontend-vanilla`.

## 💻 Cómo ejecutarlo en local

Requisitos: Node.js 18 o superior y una base de MongoDB (local o Atlas).

**1. Backend** (puerto 4000)

```bash
cd backend
npm install
cp .env.example .env    # completar MONGO_URI y JWT_SECRET
npm run seed            # carga los 40 productos de ejemplo
npm run dev
```

**2. Frontend** (puerto 5173)

```bash
cd frontend/frontend-react
npm install
cp .env.example .env    # VITE_API_URL=http://localhost:4000/api
npm run dev
```

Abrir http://localhost:5173.

### Calidad del código

En `frontend/frontend-react` y en `backend`:

```bash
npm run lint            # ESLint (y Stylelint en el frontend)
npm run format:check    # Prettier
```

## 📝 Reglas de contribución

- Git Flow: una rama por historia de usuario (`feat/...`, `fix/...`, `docs/...`).
- Commits con [Conventional Commits](docs/convencional-commits.md) (`tipo(alcance): descripción`).
- Todo cambio tiene un issue asociado y entra por Pull Request con `Closes #N`.
- Los PR requieren **2 aprobaciones** antes del merge.
- Guía para alumnos (commits y protecciones de PR): `docs/como-ejecutar.md`.

## 📚 Documentación

- Consignas por sprint: `docs/sprint-0` a `docs/sprint-4`.
- Checklist de deploy: `docs/sprint-4/deploy-checklist.md`.
- Sprint Review: `docs/sprint-review/README.md` (guía, plantilla, rúbrica y checklists).
- Video Sprint 1: [Ver video](https://drive.google.com/file/d/10bVB7FOf-0jUOWL69lmlVWlyws2D_j94/view?usp=drivesdk)
