📘 NCERT.ai — RAGINI RAG System Documentation
1️⃣ Project Overview

NCERT.ai (RAGINI) is a Retrieval Augmented Generation (RAG) based AI system designed to answer questions strictly from NCERT textbooks. The system retrieves relevant content from NCERT PDFs using vector search and generates grounded answers using an LLM.

The goal is to reduce hallucinations and ensure answers are based only on textbook knowledge.

2️⃣ Problem Statement

Normal LLMs:

May hallucinate answers

Are not restricted to NCERT syllabus

Do not cite textbook context

This system solves that by:

Retrieving only NCERT content

Compressing context

Generating answers only from retrieved chunks

3️⃣ System Architecture
User Question
   ↓
Query Transformer
   ↓
Embedding Generator (Gemini)
   ↓
Pinecone Vector Search
   ↓
Top-K NCERT Chunks Retrieved
   ↓
ScaleDown Compression Layer
   ↓
LLM Answer Generation
   ↓
Grounded Answer

4️⃣ Tech Stack
Backend

Node.js

Express.js

Gemini API (Embeddings + Generation)

Vector Database

Pinecone (vector similarity search)

Storage

Supabase Storage (PDF hosting)

Frontend

Web UI (domain-ready)

API-connected chat interface

5️⃣ Data Pipeline
Step 1 — PDF Collection

NCERT books uploaded to Supabase storage

Step 2 — Text Extraction

PDFs downloaded by ingest script

Text extracted and cleaned

Step 3 — Semantic Chunking

Rule-based semantic chunking

Chunked by concept/section instead of fixed length

Prevents context breakage

Step 4 — Embedding Creation

Gemini embedding model used

Embedding dimension stored in Pinecone

Step 5 — Vector Upsert

Each chunk stored with:

embedding vector

text content

metadata (chapter/source)

6️⃣ Retrieval Flow

When user asks a question:

Query is embedded

Pinecone similarity search runs

Top K relevant chunks retrieved

Duplicate/noisy chunks filtered

Context passed to compression layer

7️⃣ ScaleDown Compression Layer (Unique Feature)

Before sending to LLM:

Removes redundant lines

Compresses long context

Keeps only high-signal sentences

Reduces token usage

Improves answer precision

Lowers cost and latency

8️⃣ Answer Generation

LLM receives:

User question

Compressed NCERT chunks

Instruction prompt:

Answer only from context

Say “Not found in NCERT” if missing

This ensures:

Hallucination-safe answers

Source-grounded output

9️⃣ Unique Features

✅ NCERT-only grounded answering
✅ Semantic chunking
✅ ScaleDown compression layer
✅ Gemini embeddings + generation
✅ Pinecone vector retrieval
✅ Supabase PDF pipeline
✅ Domain-ready deployment
✅ Hallucination control prompting

🔟 Deployment Structure
frontend/
backend/
ingest/
docs/
README.md
.env.example

Environment Variables
GEMINI_API_KEY=
PINECONE_API_KEY=
PINECONE_INDEX=
SUPABASE_URL=
SUPABASE_KEY=

1️⃣1️⃣ API Endpoints
Ask Question
POST /ask
body: { question }
response: grounded answer

1️⃣2️⃣ Scalability Notes

Pinecone handles high concurrency search

Stateless backend → horizontally scalable

Embedding + retrieval separated from generation

Ready for multi-user load

1️⃣3️⃣ Future Improvements

Chapter-aware filtering

Citation highlighting

Multi-book cross retrieval


1️⃣4️⃣ Testing Method

Asked NCERT factual questions

Compared with textbook answers

Verified chunk retrieval relevance

Tested hallucination guard prompts
