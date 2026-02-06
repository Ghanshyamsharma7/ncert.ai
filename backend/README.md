# Backend

Node.js Express server providing `/ask` and `/ingest` endpoints.

Setup
1. Copy `.env.example` to `.env` and fill keys.
2. `cd backend && npm install`.
3. `npm start` to run server.

Ingest
- Place NCERT PDFs into a Supabase storage bucket named `ncert-pdfs`.
- Run `node ingest.js` or `npm run ingest`.

Notes
- Configure `GEMINI_URL` to point to your Gemini embedding/generation endpoints.
