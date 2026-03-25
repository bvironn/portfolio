# bairon.me

Portfolio personal. Astro + Tailwind CSS v4 + shadcn/ui.

## Stack

```
src/
├── components/     Astro + React components
├── layouts/        Base layout (dark mode, light spots)
├── lib/            DB, auth helpers
├── pages/
│   ├── api/        Contact form + notifications API
│   ├── sudo.astro  Admin panel (login + inbox)
│   └── index.astro Home
└── styles/         Tailwind + custom animations
```

- **Frontend:** Astro 6, React 19, Tailwind CSS v4, shadcn/ui
- **Backend:** Astro SSR (Node adapter), better-sqlite3
- **Auth:** bcrypt password hash + HttpOnly session cookie
- **Deploy:** Docker (Dockerfile included)

## Dev

```sh
bun install
bun run dev
```

## Build & Run

```sh
bun run build
node dist/server/entry.mjs
```

## Docker

```sh
docker build -t portfolio .
docker run -p 4321:4321 -v portfolio_data:/app/data portfolio
```

> Montar `/app/data` como volumen para persistir la base de datos SQLite.

## Env vars (opcionales)

| Variable | Default | Descripcion |
|---|---|---|
| `ADMIN_PASSWORD_HASH` | hash hardcoded | Hash bcrypt de la password de admin |
| `ADMIN_SESSION_TOKEN` | `bairon_admin_session` | Token de sesion para cookies |
| `PORT` | `4321` | Puerto del servidor |
| `HOST` | `0.0.0.0` | Host del servidor |

Generar hash:

```sh
bun -e "const b = require('bcryptjs'); console.log(b.hashSync('TU_PASSWORD', 10))"
```
