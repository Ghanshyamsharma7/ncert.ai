
const { queryPinecone } = require('./pinecone');
const { generateAnswer } = require('./gemini');
const { compressWithScaleDown } = require('./scaledown');

const TOPK = 20;

async function askHandler(question) {
  try {
    // =========================
    // VECTOR SEARCH
    // =========================
    const matches = await queryPinecone(question, TOPK);

    // =========================
    // NO VECTOR FALLBACK
    // =========================
    if (!matches || matches.length === 0) {
      console.log("⚠️ No vector matches — using base model fallback");

      try {
        const gen = await generateAnswer(
          `You are NCERT History Assistant. If question is outside NCERT, say Not in NCERT.\nQuestion: ${question}`,
          { temperature: 0.4, max_tokens: 200 }
        );

        return { answer: gen, sources: [], mode: "llm_no_vectors" };

      } catch (e) {
        console.warn("⚠️ LLM also failed — no-vector safe fallback");

        return {
          answer: "⚠️ LLM unavailable and no NCERT context found.",
          sources: [],
          mode: "hard_fallback"
        };
      }
    }

    // =========================
    // BUILD RAG CONTEXT
    // =========================
    const context = matches.map((m) => `
---
book: ${m.metadata.book || 'unknown'}
chapter: ${m.metadata.chapter || ''}
section: ${m.metadata.section || ''}
concept: ${m.metadata.concept || ''}
text: ${m.metadata.text || ''}
`).join('\n');

    // =========================
    // COMPRESS
    // =========================
    const compressed = await compressWithScaleDown(context);

    const prompt = `
You are NCERT History Assistant.
Use ONLY the provided NCERT context to answer.
If answer not present, say "Not in NCERT text".
Do not use outside knowledge.

Context:
${compressed}

Question:
${question}
`;

    // =========================
    // LLM GENERATION + FALLBACK
    // =========================
    let gen;

    try {
      gen = await generateAnswer(prompt, {
        temperature: 0.2,
        max_tokens: 200
      });

    } catch (e) {
      console.warn("⚠️ LLM failed — returning retrieved context fallback");

      gen =
        "⚠️ LLM unavailable — showing retrieved NCERT text:\n\n" +
        compressed.slice(0, 1200);
    }

    return {
      answer: gen,
      mode: gen.startsWith("⚠️") ? "context_fallback" : "llm",
      sources: matches.slice(0, 5).map(m => ({
        book: m.metadata.book,
        chapter: m.metadata.chapter,
        section: m.metadata.section,
        concept: m.metadata.concept
      }))
    };

  } catch (err) {
    console.error("🔥 askHandler hard error:", err);

    // =========================
    // HARD SYSTEM FAIL SAFE
    // =========================
    return {
      answer: "⚠️ System temporarily unavailable. Please try again later.",
      sources: [],
      mode: "system_fail"
    };
  }
}

module.exports = { askHandler };
