# Base stage
FROM oven/bun:1 AS builder

WORKDIR /app

# Copy all files
COPY . .

# Install dependencies
RUN bun install --frozen-lockfile

# Disable Nx Daemon for CI/Docker environment
ENV NX_DAEMON=false

# Build the application
# This assumes the build output resolves to dist/apps/api and generates a package.json
RUN bunx nx build api

# Production stage
FROM oven/bun:1-slim

WORKDIR /app

# Copy the built application from the builder stage
COPY --from=builder /app/dist/apps/api ./

# Install only production dependencies
# The generated package.json in dist/apps/api lists the necessary runtime deps
RUN bun install --production

# Set environment to production
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["bun", "main.js"]
