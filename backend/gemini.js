
// require('dotenv').config();
// const { GoogleGenAI } = require("@google/genai");

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY missing in .env");
// }

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// });


// // EMBEDDING

// async function getEmbedding(text) {
//   const res = await ai.models.embedContent({
//     model: "text-embedding-001",
//     contents: text
//   });

//   return res.embeddings[0].values;
// }


// //  GENERATION

// async function generateAnswer(prompt, opts = {}) {
//   const res = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//     generationConfig: {
//       temperature: opts.temperature ?? 0.3,
//       maxOutputTokens: opts.max_tokens ?? 200
//     }
//   });

//   return res.text;
// }

// module.exports = {
//   getEmbedding,
//   generateAnswer
// };

// require('dotenv').config();
// const { GoogleGenAI } = require("@google/genai");

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY missing in .env");
// }

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// });


// // =============================
// // ✅ EMBEDDING — FIXED METHOD
// // =============================

// async function getEmbedding(text) {
//   console.log("✅ Using embeddings.embed with text-embedding-004");

//   const res = await ai.embeddings.embed({
//     model: "text-embedding-004",
//     input: text
//   });

//   return res.data[0].embedding;
// }


// // =============================
// // ✅ GENERATION — OK ALREADY
// // =============================

// async function generateAnswer(prompt, opts = {}) {
//   const res = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//     generationConfig: {
//       temperature: opts.temperature ?? 0.3,
//       maxOutputTokens: opts.max_tokens ?? 200
//     }
//   });

//   return res.text;
// }


// module.exports = {
//   getEmbedding,
//   generateAnswer
// };


// require('dotenv').config();
// const { GoogleGenAI } = require("@google/genai");

// if (!process.env.GEMINI_API_KEY) {
//   throw new Error("GEMINI_API_KEY missing in .env");
// }

// const ai = new GoogleGenAI({
//   apiKey: process.env.GEMINI_API_KEY
// });


// // =======================
// // ✅ EMBEDDING — FIXED
// // =======================

// async function getEmbedding(text) {
//   console.log("✅ Using models.embedContent → text-embedding-004");

//   const res = await ai.models.embedContent({
//     model: "text-embedding-004",
//     contents: [{ role: "user", parts: [{ text }] }]
//   });

//   return res.embedding.values;
// }


// // =======================
// // ✅ GENERATION — OK
// // =======================

// async function generateAnswer(prompt, opts = {}) {
//   const res = await ai.models.generateContent({
//     model: "gemini-2.5-flash",
//     contents: prompt,
//     generationConfig: {
//       temperature: opts.temperature ?? 0.3,
//       maxOutputTokens: opts.max_tokens ?? 200
//     }
//   });

//   return res.text;
// }

// module.exports = {
//   getEmbedding,
//   generateAnswer
// };

require('dotenv').config();
const { GoogleGenAI } = require("@google/genai");

if (!process.env.GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY missing in .env");
}

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});


// =========================
// EMBEDDING
// =========================

async function getEmbedding(text) {
  const res = await ai.models.embedContent({
    model: "gemini-embedding-001",   // ✅ FIXED
    contents: text
  });

  return res.embeddings[0].values;
}


// =========================
// GENERATION
// =========================

async function generateAnswer(prompt, opts = {}) {
  const res = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    generationConfig: {
      temperature: opts.temperature ?? 0.3,
      maxOutputTokens: opts.max_tokens ?? 200
    }
  });

  return res.text;
}

module.exports = {
  getEmbedding,
  generateAnswer
};
