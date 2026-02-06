const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
require('dotenv').config();

const { askHandler } = require('./rag');
const { ingestHandler } = require('./ingest');

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use(morgan('combined'));
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

const limiter = rateLimit({ windowMs: 60 * 1000, max: 60 });
app.use(limiter);

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/ask', async (req, res) => {
  try {
    const { question } = req.body;
    if (!question) return res.status(400).json({ error: 'missing question' });
    const answer = await askHandler(question);
    res.json(answer);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'internal_error' });
  }
});

app.post('/ingest', async (req, res) => {
  try {
    const { run } = req.body;
    const result = await ingestHandler({ run });
    res.json({ ok: true, result });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'ingest_error' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`server listening on ${PORT}`));
