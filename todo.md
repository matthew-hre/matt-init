# TODO

## Mandatory Per Project

- [x] Eslint Config
- [x] Custom default app.tsx
- [x] Zod-validated env variables
- [x] VSCode Config
- [ ] Setup Github Actions for Linting
- [-] Husky / lint-staged
  - This ain't working. My assumption is that when Husky gets installed, it talks with the git config of whoever ran the command, so when it's installed with execa, it doesn't work for the user. Circle back here later.

## Min. Optional Flags

- [x] Setup Nix?
- [x] Database Options
  - [x] Turso (SQLite)
  - [x] None
- [x] ORM Options
  - [x] Drizzle
  - [x] None
- [ ] Auth Provider Options
  - [ ] BetterAuth
  - [ ] None
- [ ] UI Library Options
  - [ ] Shadcn
  - [ ] None
- [x] Install Dependencies?
- [x] Setup Git / Stage?

## Roadmap

- [ ] Database Options
  - [ ] Postgres w/ Docker
  - [ ] Neon (Postgres)
- [ ] UI Library Options
  - [ ] DaisyUI
- [ ] Alternate Package Managers
  - [ ] npm
  - [ ] Bun
  - [ ] Yarn
