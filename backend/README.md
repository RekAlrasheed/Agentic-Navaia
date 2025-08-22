## Navaia Backend (FastAPI)

Run locally with Docker Compose:

```bash
cd backend
```

Using Docker compose at repo root:

```bash
# from repo root
docker compose up --build -d
# API at http://localhost:8000
# Swagger at http://localhost:8000/docs
```

Environment variables (docker-compose sets sane defaults):
- `DB_URL`
- `REDIS_URL`
- `JWT_SECRET`

- `ELEVENLABS_HMAC_SECRET`
- `TENANT_ID`

Healthcheck:
```bash
curl http://localhost:8000/healthz
``` 