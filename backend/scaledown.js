
const fetch = require('node-fetch');
require('dotenv').config();

const SCALEDOWN_KEY = process.env.SCALEDOWN_API_KEY;

async function compressWithScaleDown(contextText, question = "") {
  if (!SCALEDOWN_KEY) {
    console.warn("⚠️ No ScaleDown key — skipping compression");
    return contextText;
  }

  const url = "https://api.scaledown.xyz/compress/raw/";

  const payload = {
    context: contextText,
    prompt: question || "Compress this context for QA",
    model: "gpt-4o",
    scaledown: {
      rate: "auto"
    }
  };

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "x-api-key": SCALEDOWN_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (!resp.ok) {
      const t = await resp.text();
      console.warn("ScaleDown HTTP error:", t);
      return contextText;
    }

    const data = await resp.json();

    // ScaleDown returns compressed prompt/context depending on mode
    return data.compressed || data.output || contextText;

  } catch (err) {
    console.warn("ScaleDown failed — fallback used:", err.message);
    return contextText;
  }
}

module.exports = { compressWithScaleDown };
