
require('dotenv').config();
const pdf = require('pdf-parse');
const { createClient } = require('@supabase/supabase-js');

const { chunkText } = require('./chunkApi');
const { getEmbedding } = require('./gemini');
const { upsertChunks } = require('./pinecone');

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_KEY;
const BUCKET = 'ncert-books';

console.log("🔎 SUPABASE_URL =", SUPABASE_URL?.slice(0, 35) + "...");

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("Missing Supabase env");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// deep list helper

async function listAll(prefix = "") {
  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .list(prefix);

  if (error) {
    console.log("❌ LIST ERROR:", error);
    return [];
  }

  console.log(`📂 LIST("${prefix}") =>`, data);

  let files = [];

  for (const item of data || []) {
    if (item.id) {
      // file
      files.push(prefix ? `${prefix}/${item.name}` : item.name);
    } else {
      // folder → recurse
      const sub = await listAll(prefix ? `${prefix}/${item.name}` : item.name);
      files.push(...sub);
    }
  }

  return files;
}


// download helper
async function downloadPdf(path) {
  console.log("⬇️ downloading:", path);

  const { data, error } = await supabase
    .storage
    .from(BUCKET)
    .download(path);

  if (error) throw error;

  return Buffer.from(await data.arrayBuffer());
}


// main ingest

async function ingestHandler() {
  console.log("\n🚀 Starting ingest pipeline...\n");

  // test bucket access
  const { data: buckets } = await supabase.storage.listBuckets();
  console.log("🪣 Buckets visible:", buckets.map(b => b.name));

  if (!buckets.find(b => b.name === BUCKET)) {
    throw new Error("Bucket not visible to this API key");
  }

  // recursive list
  const allFiles = await listAll("");

  const pdfFiles = allFiles.filter(f =>
    f.toLowerCase().endsWith(".pdf")
  );

  console.log("\n📚 PDF FILE PATHS FOUND:", pdfFiles);

  if (!pdfFiles.length) {
    console.log("⚠️ ZERO PDFs detected — this confirms storage path or permission issue");
    return { ingested: 0 };
  }

  let vectors = 0;

  for (const filePath of pdfFiles) {
    console.log("\n📖 Processing:", filePath);

    const buffer = await downloadPdf(filePath);
    const parsed = await pdf(buffer);

    console.log("📝 text length:", parsed.text.length);

    const chunks = await chunkText(parsed.text);

    console.log("🧠 chunks:", chunks.length);

    for (const c of chunks.slice(0, 5)) {
      console.log("chunk sample:", c.text.slice(0, 120));
    }

    const batch = [];

    for (const c of chunks) {
      const emb = await getEmbedding(c.text);

      batch.push({
        embedding: emb,
        metadata: {
          source: filePath,
          chapter: c.chapter,
          section: c.section,
          concept: c.concept,
          text: c.text.slice(0, 1000)
        }
      });

      if (batch.length === 100) {
        await upsertChunks(batch);
        vectors += batch.length;
        batch.length = 0;
      }
    }

    if (batch.length) {
      await upsertChunks(batch);
      vectors += batch.length;
    }
  }

  console.log("\n✅ INGEST COMPLETE — vectors:", vectors);

  return { ingested: pdfFiles.length, vectors };
}



if (require.main === module) {
  ingestHandler()
    .then(r => console.log("\n🎉 DONE:", r))
    .catch(e => console.error("\n🔥 ERROR:", e));
}

module.exports = { ingestHandler };
