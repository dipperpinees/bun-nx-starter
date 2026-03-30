# AGENTS.md

Project-specific rules for Codex in this repository.

## 1) Package Manager (Strict)
- Use `bun` only for dependency management.
- Allowed install commands:
  - `bun install`
  - `bun add <pkg>`
  - `bun add -d <pkg>`
  - `bun remove <pkg>`
- Do not use `npm`, `yarn`, or `pnpm` for install/remove/update.
- If dependency changes are made, commit both `package.json` and `bun.lock`.

## 2) Script & Task Execution
- Use `bun run <script>` for package scripts.
- For Nx commands, prefer Bun-based execution:
  - `bunx nx ...` (one-off)
  - or `bun run nx ...` if a script is defined.
- Avoid `npx nx ...` in commands or generated docs.

## 3) Monorepo Workflow (Nx)
- Prefer scoped commands to keep feedback fast:
  - `bunx nx lint <project>`
  - `bunx nx test <project>`
  - `bunx nx build <project>`
- Use affected commands when relevant:
  - `bunx nx affected -t lint,test,build`

## 4) Code Change Guardrails
- Keep changes minimal and focused on the request.
- Do not introduce new frameworks/tools without explicit request.
- Preserve existing architecture: Nx monorepo, NestJS API, React + Vite frontend, Drizzle ORM.

## 5) Validation Before Handoff
- Run the narrowest useful checks first (project-level lint/test/build).
- If dependencies or config changed, run at least one end-to-end sanity command (for example `bunx nx build <project>`).
- Report what was run and what was not run.
