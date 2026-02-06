// // const fetch = require('node-fetch');
// // require('dotenv').config();

// // const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
// // const PINECONE_HOST = process.env.PINECONE_HOST || 'https://index.pinecone.io';

// // async function upsertChunks(items) {
// //   if (!PINECONE_API_KEY) throw new Error('Pinecone env missing');
// //   const vectors = items.map((it, i) => ({ id: `${Date.now()}-${i}`, metadata: it.metadata, values: it.embedding }));
// //   const resp = await fetch(`${PINECONE_HOST}/vectors/upsert`, {
// //     method: 'POST',
// //     headers: { 'api-key': PINECONE_API_KEY, 'Content-Type': 'application/json' },
// //     body: JSON.stringify({ vectors })
// //   });
// //   if (!resp.ok) throw new Error('upsert_failed');
// //   return resp.json();
// // }

// // async function queryPinecone(queryText, topK = 20) {
// //   if (!PINECONE_API_KEY) throw new Error('Pinecone env missing');
// //   const { getEmbedding } = require('./gemini');
// //   const emb = await getEmbedding(queryText);
// //   const resp = await fetch(`${PINECONE_HOST}/query`, {
// //     method: 'POST',
// //     headers: { 'api-key': PINECONE_API_KEY, 'Content-Type': 'application/json' },
// //     body: JSON.stringify({ vector: emb, topK, includeMetadata: true, includeValues: false })
// //   });
// //   if (!resp.ok) throw new Error('query_failed');
// //   const j = await resp.json();
// //   return j.matches || [];
// // }

// // module.exports = { upsertChunks, queryPinecone };

// const fetch = require('node-fetch');
// require('dotenv').config();

// const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
// const PINECONE_HOST = process.env.PINECONE_HOST;

// if (!PINECONE_HOST) {
//   console.warn("⚠️ PINECONE_HOST missing in .env");
// }

// // ============================
// // ✅ UPSERT VECTORS
// // ============================
// async function upsertChunks(items) {
//   if (!PINECONE_API_KEY || !PINECONE_HOST) {
//     throw new Error('Pinecone env missing');
//   }

//   const vectors = items.map((it, i) => ({
//     id: `vec-${Date.now()}-${i}`,
//     values: it.embedding,
//     metadata: it.metadata
//   }));

//   const resp = await fetch(`${PINECONE_HOST}/vectors/upsert`, {
//     method: 'POST',
//     headers: {
//       'Api-Key': PINECONE_API_KEY,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       vectors: vectors,
//       namespace: "default"
//     })
//   });

//   if (!resp.ok) {
//     const errText = await resp.text();
//     console.error("❌ Pinecone upsert error:", errText);
//     throw new Error('upsert_failed');
//   }

//   const data = await resp.json();
//   console.log(`✅ Upserted ${vectors.length} vectors`);
//   return data;
// }


// // ============================
// // ✅ QUERY VECTORS
// // ============================
// async function queryPinecone(queryText, topK = 20) {
//   if (!PINECONE_API_KEY || !PINECONE_HOST) {
//     throw new Error('Pinecone env missing');
//   }

//   const { getEmbedding } = require('./gemini');
//   const emb = await getEmbedding(queryText);

//   const resp = await fetch(`${PINECONE_HOST}/query`, {
//     method: 'POST',
//     headers: {
//       'Api-Key': PINECONE_API_KEY,
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify({
//       vector: emb,
//       topK,
//       includeMetadata: true,
//       includeValues: false,
//       namespace: "default"
//     })
//   });

//   if (!resp.ok) {
//     const errText = await resp.text();
//     console.error("❌ Pinecone query error:", errText);
//     throw new Error('query_failed');
//   }

//   const j = await resp.json();
//   return j.matches || [];
// }

// module.exports = { upsertChunks, queryPinecone };


const fetch = require('node-fetch');
require('dotenv').config();

const PINECONE_API_KEY = process.env.PINECONE_API_KEY;
const PINECONE_HOST = process.env.PINECONE_HOST;

if (!PINECONE_HOST) {
  console.warn("⚠️ PINECONE_HOST missing in .env");
}

// ============================
// ✅ METADATA CLEANER (fix null error)
// ============================
function cleanMeta(meta = {}) {
  const out = {};
  for (const k in meta) {
    const v = meta[k];

    if (v === null || v === undefined) continue;

    if (Array.isArray(v)) {
      out[k] = v.map(x => String(x));
    } else if (typeof v === "object") {
      out[k] = String(v);
    } else {
      out[k] = v;
    }
  }
  return out;
}


// ============================
// ✅ UPSERT VECTORS
// ============================
async function upsertChunks(items) {
  if (!PINECONE_API_KEY || !PINECONE_HOST) {
    throw new Error('Pinecone env missing');
  }

  const vectors = items.map((it, i) => ({
    id: `vec-${Date.now()}-${i}`,
    values: it.embedding,
    metadata: cleanMeta(it.metadata)
  }));

  const resp = await fetch(`${PINECONE_HOST}/vectors/upsert`, {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vectors: vectors,
      namespace: "default"
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error("❌ Pinecone upsert error:", errText);
    throw new Error('upsert_failed');
  }

  const data = await resp.json();
  console.log(`✅ Upserted ${vectors.length} vectors`);
  return data;
}


// ============================
// ✅ QUERY VECTORS
// ============================
async function queryPinecone(queryText, topK = 20) {
  if (!PINECONE_API_KEY || !PINECONE_HOST) {
    throw new Error('Pinecone env missing');
  }

  const { getEmbedding } = require('./gemini');
  const emb = await getEmbedding(queryText);

  const resp = await fetch(`${PINECONE_HOST}/query`, {
    method: 'POST',
    headers: {
      'Api-Key': PINECONE_API_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      vector: emb,
      topK,
      includeMetadata: true,
      includeValues: false,
      namespace: "default"
    })
  });

  if (!resp.ok) {
    const errText = await resp.text();
    console.error("❌ Pinecone query error:", errText);
    throw new Error('query_failed');
  }

  const j = await resp.json();
  return j.matches || [];
}

module.exports = { upsertChunks, queryPinecone };
