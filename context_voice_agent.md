# Voice Agent – Context, Status, and Requirements

Last updated: 2025-08-22 (logging + real flow enabled by default)

## Purpose
Single source of truth for the voice agent work: goals, current status, what’s done, what’s broken, how to test, and what’s next.

## High-level goals / requirements
- Voice session lifecycle
  - Create session (backend) and return a session_id
  - Retrieve session by id
  - End session
- ElevenLabs integration
  - Start conversation with agent (support/sales)
  - End conversation
  - Webhook HMAC validation (planned)
- Frontend
  - Playground page to start/stop sessions and interact with agent
  - Clear status: idle, connecting, connected, speaking, listening, error
- Reliability & DX
  - Consistent local dev start (Next on :3000, backend on :8000)
  - Helpful error messages (frontend and Next API)
  - Minimal configuration: .env.local for ElevenLabs and URLs
  - Persistent logfile with diagnostics for ElevenLabs integration

## Architecture (current)
- Frontend: Next.js (App Router)
  - API routes
    - `src/app/api/voice/sessions/route.ts` (runtime=nodejs): always creates backend session, then calls `/api/elevenlabs`; logs to `logs/elevenlabs.log` (simulation bypass removed)
    - `src/app/api/elevenlabs/route.ts` (runtime=nodejs): wraps ElevenLabs REST (start/end conversation) with retries/variants and detailed logging
    - `src/app/api/logs/route.ts` (runtime=nodejs): POST to append client logs; GET to tail last N lines
  - Hooks
    - `src/hooks/useVoiceAgent.ts`: orchestrates UI state; posts lifecycle/errors to `/api/logs`
  - Pages
    - `src/app/playground/page.tsx`: UI to test the agent; ConvAI widget events send logs to server
- Backend: FastAPI (SQLite for dev)
  - Main app: `backend/app/main.py`
  - DB session: `backend/app/db.py`
  - Models: `backend/app/models.py` (includes VoiceSession)
  - Key endpoints
    - POST `/voice/sessions` – create session
    - GET `/voice/sessions/{id}` – fetch session
    - (Planned) PUT `/voice/sessions/{id}/end` – end session

## Environment & URLs
Set in `.env.local` (do not commit secrets):
- `ELEVENLABS_API_KEY` – required for ElevenLabs
- `ELEVENLABS_SUPPORT_AGENT_ID`, `ELEVENLABS_SALES_AGENT_ID` – required
- `ELEVENLABS_WEBHOOK_SECRET` – used for validating webhooks (planned)
- `NEXT_PUBLIC_BACKEND_URL` – e.g. `http://localhost:8000`
- `NEXT_PUBLIC_BASE_URL` – e.g. `http://localhost:3000` (used for internal server-side fetch)

Note: After editing `.env.local`, restart Next dev so variables load. API routes that log to disk require the Node.js runtime (configured).

## Status snapshot
- Backend (FastAPI)
  - Voice session model and endpoints implemented
  - DB session dependency fixed (generator dependency compatible with FastAPI)
  - Tested POST `/voice/sessions` successfully returns `session_id`
- Next API
  - `/api/voice/sessions` patched to use absolute URL when calling internal `/api/elevenlabs`
  - Calls backend successfully; starting ElevenLabs conversation depends on env
- ElevenLabs route
  - `/api/elevenlabs` implemented (start_conversation, end_conversation); logs all attempts and errors to `logs/elevenlabs.log`
  - Returns 500 if env is missing or remote API rejects request; details written to log file
- Frontend (Playground)
  - Hook `useVoiceAgent` exposes: `isListening`, `startListening`, `stopListening`, status, etc.; now posts client logs
  - ConvAI widget (voice/chat) posts onConnect/onDisconnect/onError to `/api/logs`

## Positives
- Core backend voice session flow works and persists sessions
- Clean separation: Frontend -> Next API -> Backend & ElevenLabs
- ElevenLabs wrapper route centralizes external calls and errors
- Clear env-driven configuration

## Known issues / flaws
- ElevenLabs env dependency
  - If `ELEVENLABS_API_KEY` or agent IDs are missing/invalid, `/api/elevenlabs` returns 500 and overall flow fails
- Next dev server occasionally not listening
  - If dev server isn’t active on :3000, requests fail with ECONNREFUSED; ensure dev is running and restarted after env changes
- Playground runtime errors
  - Fixed: variables renamed to `isListening/startListening/stopListening` and JSX corrected
- Prior backend issues (fixed)
  - Duplicate POST `/voice/sessions` handlers (removed)
  - DB session contextmanager misuse (replaced with FastAPI-compatible generator)

## API contracts (current)
- Backend: POST `/voice/sessions`
  - Request: `{ customer_id: string, direction: "inbound" | "outbound", locale: string, simulation: boolean }`
  - Response: `{ session_id: string, status: string, customer_id: string, created_at: string }`
- Next: POST `/api/voice/sessions`
  - Request: `{ agentType: "support" | "sales", customerId: string }`
  - Behavior: calls backend to create session, then calls `/api/elevenlabs` to start conversation
  - Response: `{ backend_session: {...}, elevenlabs_conversation: {...}, agent_type: string }` (when both steps succeed)
- Next: POST `/api/elevenlabs`
  - Request: `{ action: "start_conversation" | "end_conversation", agentType?: "support" | "sales", sessionId?: string }`
  - Uses `ELEVENLABS_API_KEY` + agent IDs; returns ElevenLabs JSON or `{ success: true }` on end

## How to run (local)
- Backend
  - Ensure Python env with FastAPI/uvicorn installed (project has `.venv312`)
  - Start: uvicorn `app.main:app` on port 8000 (reload for dev)
- Frontend
  - Start Next dev on port 3000: `npm run dev`
  - Confirm Next logs show `Environments: .env.local`

Tip: Always restart Next after changing `.env.local`.

## Quick test checklist
- Backend direct
  - POST `/voice/sessions` returns 200 with `session_id`
- ElevenLabs availability
  - POST `/api/elevenlabs` with `action=start_conversation` returns 200; if 500, check env and remote error; inspect `logs/elevenlabs.log`
- Full flow
  - POST `/api/voice/sessions` returns combined payload (backend + elevenlabs). If 500, check `logs/elevenlabs.log` and ensure backend is running on :8000.
  - Check `GET /api/logs?tail=200` for latest diagnostics
- Frontend
  - Playground loads without runtime errors and can toggle listening/connect

## Recent fixes (changelog)
- 2025-08-22
  - Backend: removed duplicate voice session route; fixed DB session dependency; verified session creation works
  - Next: `/api/voice/sessions` now uses absolute URL for internal `/api/elevenlabs`
  - Diagnosis: confirmed `.env.local` exists with ELEVENLABS_* vars; emphasized server restart requirement
- 2025-08-20 to 2025-08-21
  - Implemented `VoiceSession` model and endpoints; added initial integration path from frontend

## To-do / next steps (prioritized)
1) Frontend playground
   - Rename variables to match hook: `isRecording` → `isListening`, `startRecording` → `startListening`, `stopRecording` → `stopListening`
   - Fix JSX parse error in `return (...)`
2) ElevenLabs stability
  - Ensure `.env.local` is loaded (restart Next) and keys are valid
  - Improve error surface from `/api/elevenlabs` to `/api/voice/sessions` (include remote error text for UX)
  - Review `logs/elevenlabs.log` for 405/404 patterns and adjust endpoint/method accordingly
3) Session lifecycle
   - Implement end session route in backend and wire from frontend when leaving/ending
4) Testing & DX
   - Add integration tests for Next API calling backend and ElevenLabs (mock)
   - Add health checks: `/healthz` for both Next (simple route) and backend (exists)
5) Reliability
  - Add retries/backoff around ElevenLabs calls; timeouts and clear user-visible errors; continue logging key events
   - Consider background job for cleanup of stale sessions
6) Security & prod
   - Don’t log secrets; verify webhook secret path and HMAC validation when adding webhooks
   - Containerize (Docker) and use `docker-compose.yml`

## Troubleshooting
- “Not connected” in UI
  - Check browser console and Next dev logs for `/api/voice/sessions` and `/api/elevenlabs` errors
  - Inspect `GET /api/logs?tail=200` output or open `logs/elevenlabs.log`
  - Ensure backend (FastAPI) is running: http://localhost:8000/healthz should return ok
  - Verify Next dev is listening on :3000 and was restarted after env changes
  - Validate `ELEVENLABS_API_KEY` and agent IDs are set; test `/api/elevenlabs` directly
- 500 on `/api/voice/sessions`
  - Usually from `/api/elevenlabs` failing; print response text and check `logs/elevenlabs.log`
- Backend errors
  - Verify FastAPI is running on :8000 and POST `/voice/sessions` works directly
  - Ensure SQLite file is writable and models are up to date

## Ownership
- Frontend: Next app routes, hook, and playground UI
- Backend: FastAPI voice session routes and models
- External: ElevenLabs API and webhook integration

## Requirements coverage
- Voice session endpoints (backend): Done
- Next API absolute URL for `/api/elevenlabs`: Done
- ElevenLabs env config: Provided; requires valid keys and Next restart
- Playground variable mismatch fix: Pending
- Full “start conversation” end-to-end test (real ElevenLabs): Pending (after env confirm)
