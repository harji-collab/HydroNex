# HydroNex

HydroNex is a React/Vite demo frontend for rainfall–surface-water response analysis. It is intentionally running in **Demo Mode** until the FastAPI + Google Earth Engine backend is connected.

## Run locally

```bash
npm install
npm run dev
```

The app listens on port 3000.

## Environment

Copy `.env.example` to `.env`:

- `VITE_DEMO_MODE=true` uses the local demonstration service layer.
- `VITE_DEMO_MODE=false` calls the FastAPI base configured by `VITE_API_BASE_URL`.
- `VITE_API_BASE_URL=http://localhost:8000/api`

## API contracts

Expected future endpoints:

- `GET /health`
- `GET /waterbodies`
- `GET /waterbodies/{id}`
- `GET /waterbodies/{id}/water-extent`
- `GET /waterbodies/{id}/rainfall`
- `GET /waterbodies/{id}/response`
- `GET /waterbodies/{id}/vulnerability`
- `GET /waterbodies/{id}/insights`
- `GET /map/waterbodies`
- `GET /map/vulnerability`
- `GET /regions`
- `GET /analysis/status`

Replace the implementations in `src/api/client.js` or the service wrappers in `src/api/services.js`; UI components do not make direct fetch calls.

## Demo-data note

Numbers, coordinates, status labels, and recommendations in this preview are demonstration values. They are not live Earth Engine output, government instructions, or guaranteed outcomes.
