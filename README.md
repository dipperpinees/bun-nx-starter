# Bun NX API

A high-performance, modern backend monorepo built with **NestJS**, **Nx**, and **Bun**. This project leverages **Drizzle ORM** for database interactions and **Fastify** for the underlying HTTP framework.

## 🚀 Key Features

- **Monorepo Architecture**: Managed by [Nx](https://nx.dev) for efficient build and test pipelines.
- **Runtime**: Powered by [Bun](https://bun.sh) for lightning-fast package installation and script execution.
- **Framework**: [NestJS](https://nestjs.com) with the **Fastify** adapter for high-performance Node.js server applications.
- **Database**:
  - **Drizzle ORM**: Type-safe automated SQL generation and schema management.
  - **PostgreSQL**: Robust, relational database system.
- **Documentation**:
  - **Swagger/OpenAPI**: Auto-generated API specs.
  - **Scalar**: Modern, interactive API reference UI.
- **Logging**: **pino** via `nestjs-pino` for fast, structured JSON logging.
- **Validation**: `class-validator` and `class-transformer` for robust request payload validation.

## 🛠️ Tech Stack

| Category         | Technology    |
| ---------------- | ------------- |
| **Runtime**      | Bun           |
| **Monorepo**     | Nx            |
| **Framework**    | NestJS        |
| **HTTP Adapter** | Fastify       |
| **ORM**          | Drizzle ORM   |
| **Database**     | PostgreSQL    |
| **API Docs**     | Scalar / Swagger |

## 📦 Prerequisites

Before you begin, ensure you have the following installed:

- **[Bun](https://bun.sh/)** (v1.0 or higher)
- **PostgreSQL** (Running locally or in Docker)

## 🏁 Getting Started

### 1. Install Dependencies

```bash
bun install
```

### 2. Configure Environment

Copy the example environment file and configure your database creation.

```bash
cp .env.example .env
```

Update `.env` with your PostgreSQL credentials:

```ini
DATABASE_URL=postgres://user:password@localhost:5432/db_name
```

### 3. Database Migration

Manage your database schema using Drizzle Kit.

- **Generate migrations:**
  ```bash
  bun run db:generate
  ```

- **Run migrations:**
  ```bash
  bun run db:migrate
  ```

- **Open Drizzle Studio (Database GUI):**
  ```bash
  bun run db:studio
  ```

### 4. Run the Application

Start the API development server:

```bash
bun nx serve api
```

The server will start on `http://localhost:3000`.

## 📚 Documentation

Once the application is running, you can access the API documentation:

- **Interactive API Docs (Scalar)**: [http://localhost:3000/docs](http://localhost:3000/docs)
- **OpenAPI JSON Spec**: [http://localhost:3000/api/openapi](http://localhost:3000/api/openapi)

## 🏗️ Project Structure

```
.
├── apps
│   └── api          # Main NestJS Application
├── libs
│   ├── database     # Drizzle ORM schema and connection setup
│   └── shared       # Shared DTOs, responses, and utilities
├── .env             # Environment variables
├── bun.lockb        # Bun lockfile
└── package.json     # Project scripts and dependencies
```

## 🤝 Contributing

1. Fork the repository.
2. Create feature branch (`git checkout -b feature/amazing-feature`).
3. Commit changes (`git commit -m 'Add amazing feature'`).
4. Push to branch (`git push origin feature/amazing-feature`).
5. Open a Pull Request.

---

Built with ❤️ using [Bun](https://bun.sh) and [Nx](https://nx.dev).
