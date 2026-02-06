# ncert.ai — NCERT History Assistant

Retrieval-Augmented Generation assistant that answers *only* from NCERT History textbooks (Class 6–12).

Structure
- `frontend/` — static dark UI
- `backend/` — Node.js + Express RAG server and ingestion pipeline

Quick start
1. Copy `.env.example` to `.env` and fill keys.
2. Install backend deps: `cd backend && npm install`.
3. Run ingest (optional): `node backend/ingest.js`.
4. Run server: `node backend/server.js`.
5. Serve `frontend/` from any static host.

See `backend/README.md` for details and deploy instructions.
