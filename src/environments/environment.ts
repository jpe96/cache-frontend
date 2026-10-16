// Lokale Entwicklung: spricht gegen das Docker-Mockup aus cache-backend/dev/ (docker compose ... up).
// `ng build` (production) ersetzt diese Datei durch environment.prod.ts.
export const environment = {
  production: false,
  apiUrl: 'http://localhost:8080/backend/api/',
  fileBaseUrl: 'http://localhost:8080'
};
