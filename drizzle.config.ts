import { defineConfig } from 'drizzle-kit';

export default defineConfig({
    schema: './libs/database/src/schema/index.ts',
    out: './libs/database/src/migrations',
    dialect: 'postgresql',
    dbCredentials: {
        url: process.env.DATABASE_URL || 'postgres://localhost:5432/bun_nx',
    },
    verbose: true,
    strict: true,
});
