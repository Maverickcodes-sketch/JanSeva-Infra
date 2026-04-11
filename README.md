# Civic Issue Reporting System

## Prerequisites

- Node.js (LTS recommended)
- npm (bundled with Node.js)

## Install dependencies

```bash
npm install
```

## Environment variables

Create a `.env` file in the project root:

```bash
VITE_API_BASE_URL=http://localhost:5000/api
VITE_GEMINI_API_KEY=YOUR_GEMINI_KEY
```

- `VITE_API_BASE_URL` is optional (defaults to `http://localhost:5000/api`).
- `VITE_GEMINI_API_KEY` is required for AI priority prediction on the **Report Issue** page.

## Run (development)

```bash
npm run dev
```

Vite will print the local URL (typically `http://localhost:5173`).

### Windows note (PowerShell)

If `npm` fails with "running scripts is disabled", run via `cmd`:

```bat
cmd /c npm install
cmd /c npm run dev
```



