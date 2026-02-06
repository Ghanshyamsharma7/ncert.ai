// const fetch = require('node-fetch');
// require('dotenv').config();

// // This module calls an external chunking API (semantic chunking) — mandatory per spec.
// // The chunking API must implement strategy = chapter_section_concept and return an array of structured chunks.

// const CHUNK_API_URL = process.env.CHUNK_API_URL || 'https://api.chunker.example.com/chunk';

// async function chunkText(text, opts = { strategy: 'chapter_section_concept' }) {
//   const resp = await fetch(CHUNK_API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ text, strategy: opts.strategy }) });
//   if (!resp.ok) throw new Error('chunk_api_failed');
//   const j = await resp.json();
//   // expected: [{ chapter, section, concept, text }]
//   return j.chunks || j;
// }

// module.exports = { chunkText };

// require('dotenv').config();
// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// async function chunkText(text) {
//   const prompt = `
// You are a semantic document chunker.

// Split the following NCERT text into meaningful chunks by:
// - chapter
// - section
// - concept

// Return JSON array like:
// [
//  { "chapter": "...", "section": "...", "concept": "...", "text": "..." }
// ]

// TEXT:
// ${text}
// `;

//   const res = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: prompt
//   });

//   const out = res.text;

//   try {
//     return JSON.parse(out);
//   } catch {
//     // fallback if model wraps text
//     const match = out.match(/\[.*\]/s);
//     if (match) return JSON.parse(match[0]);
//     throw new Error("chunk_parse_failed");
//   }
// }

// module.exports = { chunkText };


// rule-based chunker — no API, no quota needed

function cleanText(t) {
  return t
    .replace(/\r/g, "")
    .replace(/\t/g, " ")
    .replace(/ +/g, " ")
    .trim();
}


// -----------------------------
// detect chapter / section lines
// -----------------------------
function detectHeading(line) {
  const l = line.trim();

  if (/^chapter\s+\d+/i.test(l)) return { chapter: l };
  if (/^unit\s+\d+/i.test(l)) return { chapter: l };
  if (/^\d+\.\d+/.test(l)) return { section: l };
  if (/^[A-Z][A-Z\s]{6,}$/.test(l)) return { section: l };

  return null;
}


// -----------------------------
// main chunker
// -----------------------------
async function chunkText(text, opts = {}) {
  text = cleanText(text);

  const lines = text.split("\n").filter(Boolean);

  const chunks = [];
  let buffer = "";
  let meta = { chapter: null, section: null, concept: null };

  const MAX = opts.maxChars || 1200;

  for (const line of lines) {
    const heading = detectHeading(line);

    if (heading) {
      // flush existing buffer
      if (buffer.length > 200) {
        chunks.push({
          ...meta,
          concept: meta.section || meta.chapter || "concept",
          text: buffer.trim()
        });
        buffer = "";
      }

      meta = { ...meta, ...heading };
      continue;
    }

    buffer += " " + line;

    if (buffer.length >= MAX) {
      chunks.push({
        ...meta,
        concept: meta.section || meta.chapter || "concept",
        text: buffer.trim()
      });
      buffer = "";
    }
  }

  if (buffer.length > 200) {
    chunks.push({
      ...meta,
      concept: meta.section || meta.chapter || "concept",
      text: buffer.trim()
    });
  }

  console.log(`🧩 Rule chunks created: ${chunks.length}`);

  return chunks;
}

module.exports = { chunkText };
