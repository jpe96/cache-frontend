# cache-frontend

Angular-App für [cache.ch](https://cache.ch): öffentliche Seite und Redaktions-CMS (`/admin`).

Dokumentation, Status und Backlog liegen im Repo **cache-resources** (`docs/frontend.md`).

## Entwicklung

```bash
npm ci                 # .npmrc setzt legacy-peer-deps (nötig für jodit-angular)
npx ng serve           # development: spricht gegen das Docker-Mockup aus cache-backend/dev/ (http://localhost:8080)
npm run lint           # ESLint
```

Das Mockup startet man im Repo `cache-backend` mit `docker compose -f dev/docker-compose.yml up -d`
(Details: `cache-backend/dev/README.md`). CMS-Login im Mockup: `dev` / `dev`.

## Build für Produktion

```bash
npx ng build           # production (Default) -> environment.prod.ts -> https://cache.ch, Ausgabe: dist/dashboard/
```

Die Backend-Adressen stehen in `src/environments/environment*.ts`.
