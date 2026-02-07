📘 RAGINI — NCERT.ai

Retrieval Augmented Generation Intelligent NCERT Interface

Tagline: Connecting the Dots

RAGINI is a production-ready Retrieval Augmented Generation (RAG) based AI assistant designed to answer questions strictly from NCERT textbooks (Class 6–12) using semantic search + vector retrieval + LLM generation.

Instead of hallucinating like a normal chatbot, RAGINI retrieves verified textbook context first — then generates grounded answers.


🔗 Live : https://ncert-rag.onrender.com/


🧠 What Makes RAGINI Unique (USP)

✅ Answers grounded strictly in NCERT content

✅ Semantic chunking of textbook content

✅ Vector search using Pinecone

✅ Context compression using ScaleDown API

✅ Token reduction → lower cost + faster responses

✅ OCR-ready pipeline for scanned PDFs

✅ Multi-LLM compatible architecture

✅ Fallback system if LLM fails

✅ Scalable backend deployment ready

✅ Source-aware answers

No blind LLM guessing — retrieval first, generation second.

🏗 System Architecture
User Question
    ↓
Semantic Embedding
    ↓
Pinecone Vector Search
    ↓
Top-K Context Retrieval
    ↓
ScaleDown Context Compression
    ↓
LLM Generation (Gemini / compatible)
    ↓
Grounded Answer + Sources

⚙️ Tech Stack
Frontend

HTML / CSS / JS UI

RAG mode interface

Query panel + source view


Backend

Node.js

Express.js API server

REST endpoints

AI / RAG Stack

Gemini LLM (pluggable)

Pinecone Vector Database

Semantic Chunking

Embedding Model

ScaleDown Context Compression

Supabase Storage (PDF bucket)

📦 Core Features
🔍 Semantic Retrieval

Chapter & concept-aware chunking

Vector similarity search

Top-K retrieval pipeline

🧾 Grounded Answering

Prompt forces answer only from retrieved context

If not found → returns: “Not in NCERT text”


Supports:

Text PDFs

OCR converted PDFs

Concept-level chunk metadata

Supabase bucket ingestion

Run:

npm run ingest

🔐 Environment Variables

Create .env in backend:

GEMINI_API_KEY=

PINECONE_API_KEY=

PINECONE_HOST=

SUPABASE_URL=

SUPABASE_KEY=

SCALEDOWN_API_KEY=

▶️ Run Locally

Backend

cd backend

npm install

npm start


Server runs on:

http://localhost:3001


Health check:

/health

Frontend

npx serve frontend


Runs on:

http://localhost:3000



📊 Performance Optimization

Using ScaleDown compression:

📉 Token usage reduced

⚡ Faster generation

💰 Lower LLM cost

🧠 Better context density


Out-of-scope test: successful


🔮 Future Roadmap

Multi-subject NCERT support

Chapter-wise filtering

OCR automation pipeline

User login + history

Citation highlighting

Answer confidence scoring

Multi-language support

Offline embedding generation

👨‍💻 Author

Ghanshyam Sharma (BTech CSE 4th Sem)
AI + RAG Developer
Project: NCERT.ai — RAGINI
Tagline: Connecting the Dots

🤝 Contributions & Feedback

Suggestions, improvements, and critiques are welcome.

Open an issue or start a discussion
