# Bun NX Starter

A high-performance, modern monorepo built with **Nx** and **Bun**. Includes a **NestJS** API backend and a **React + Vite + Tailwind CSS** frontend.

## 🚀 Key Features

- **Monorepo Architecture**: Managed by [Nx](https://nx.dev) for efficient build and test pipelines.
- **Runtime**: Powered by [Bun](https://bun.sh) for lightning-fast package installation and script execution.
- **API Backend**: [NestJS](https://nestjs.com) with the **Fastify** adapter.
- **Web Frontend**: React + Vite + Tailwind CSS v4.
- **Database**: Drizzle ORM + PostgreSQL.
- **API Docs**: Swagger/OpenAPI with Scalar UI.
- **Logging**: pino via `nestjs-pino`.

## 🛠️ Tech Stack

| Category         | Technology                      |
| ---------------- | ------------------------------- |
| **Runtime**      | Bun                             |
| **Monorepo**     | Nx                              |
| **API**          | NestJS + Fastify                |
| **Web**          | React + Vite + Tailwind CSS v4  |
| **ORM**          | Drizzle ORM                     |
| **Database**     | PostgreSQL                      |
| **API Docs**     | Scalar / Swagger                |

## 📦 Prerequisites

- **[Bun](https://bun.sh/)** (v1.0 or higher)
- **PostgreSQL** (Running locally or in Docker)
- **Docker** (for Authentik demo)

## 🏁 Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:

```ini
DATABASE_URL=postgres://user:password@localhost:5432/db_name
```

### 3. Start Authentik (Demo)

```bash
docker compose up -d authentik-server authentik-worker
```

Authentik is available at `http://localhost:9100`.

When running for the first time, complete the initial Authentik setup flow and create your own admin/user account.

### 4. Create/Recover Authentik Admin User

- First-time setup URL: `http://localhost:9100/if/flow/initial-setup/`
- Optional auto-bootstrap via `.env`:
  - `AUTHENTIK_BOOTSTRAP_PASSWORD`
  - `AUTHENTIK_BOOTSTRAP_EMAIL`
  - `AUTHENTIK_BOOTSTRAP_TOKEN`
- If you lose admin permissions, restore with:

```bash
docker compose exec authentik-worker ak create_admin_group <username>
```

Note: bootstrap env vars are applied on first initialization of Authentik DB. If DB is already initialized, use recovery command above.

## 🏗️ Project Structure

```
.
├── apps/
│   ├── api/             # NestJS API (Fastify)
│   └── web/             # React + Vite + Tailwind CSS
├── libs/
│   ├── database/        # Drizzle ORM schema & connection
│   ├── nest/            # Shared NestJS utilities (decorators, filters, responses)
│   └── ui/              # Shared React UI components
├── .env                 # Environment variables
├── nx.json              # Nx workspace configuration
├── tsconfig.base.json   # Base TypeScript configuration
└── package.json         # Root dependencies & scripts
```

## 📋 Nx Commands

### Serve (Development)

```bash
# Start API server (http://localhost:3000)
bunx nx serve api

# Start Web dev server (http://localhost:4200)
bunx nx serve web

# Start both API and Web in parallel
bunx nx run-many -t serve -p api web
```

### Build

```bash
# Build API
bunx nx build api

# Build Web
bunx nx build web

# Build all projects
bunx nx run-many -t build
```

### Lint

```bash
# Lint a specific project
bunx nx lint api
bunx nx lint web
bunx nx lint ui

# Lint all projects
bunx nx run-many -t lint
```

### Test

```bash
# Test a specific project
bunx nx test api

# Test all projects
bunx nx run-many -t test
```

### Generate

```bash
# Generate a new React app
bunx nx g @nx/react:app --directory=apps/<name> --bundler=vite

# Generate a new React library
bunx nx g @nx/react:lib --directory=libs/<name> --importPath=@<name>

# Generate a new NestJS app
bunx nx g @nx/nest:app --directory=apps/<name>

# Generate a React component in a lib
bunx nx g @nx/react:component --directory=libs/ui/src/components/<name>
```

### Dependency Graph

```bash
# Visualize project dependency graph
bunx nx graph
```

### Other Useful Commands

```bash
# Show details of a project
bunx nx show project <name> --web

# List all projects
bunx nx show projects

# Run affected targets only (based on git changes)
bunx nx affected -t build
bunx nx affected -t lint
bunx nx affected -t test
```

## 🗄️ Database Commands

```bash
# Generate migrations
bun run db:generate

# Run migrations
bun run db:migrate

# Push schema changes (dev only)
bun run db:push

# Open Drizzle Studio (Database GUI)
bun run db:studio
```

## 📚 API Documentation

Once the API is running:

- **Interactive API Docs (Scalar)**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **OpenAPI JSON Spec**: [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi)

## 🔐 Authentik Demo Flow

1. Start API + Web:

```bash
bunx nx run-many -t serve -p api web
```

2. Open Web app at `http://localhost:4200`.
3. Click **Login With Authentik** and sign in with your Authentik user.
4. Click **Call /auth/me** to call protected API endpoint `GET /api/v1/auth/me`.

## 🔗 Path Aliases

Configured in `tsconfig.base.json`:

| Alias         | Path                          | Description                     |
| ------------- | ----------------------------- | ------------------------------- |
| `@database`   | `libs/database/src/index.ts`  | Database schema & connection    |
| `@nest/*`     | `libs/nest/src/*`             | Shared NestJS utilities         |
| `@ui`         | `libs/ui/src/index.ts`        | Shared React UI components      |

## 🤝 Contributing

1. Fork the repository.
2. Create feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add amazing feature'`).
4. Push to branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

Built with ❤️ using [Bun](https://bun.sh) and [Nx](https://nx.dev).
