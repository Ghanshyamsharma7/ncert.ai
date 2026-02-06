// const API = (location.hostname === 'localhost') ? 'http://localhost:3001' : 'https://api.ncert.ai';
// document.getElementById('ask').addEventListener('click', async () => {
//   const q = document.getElementById('question').value.trim();
//   if (!q) return;
//   const el = document.getElementById('answer');
//   el.textContent = 'Thinking...';
//   try {
//     const r = await fetch(`${API}/ask`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ question: q }) });
//     const j = await r.json();
//     el.textContent = j.answer || JSON.stringify(j);
//   } catch (err) {
//     el.textContent = 'Error contacting API';
//   }
// });

// // chips
// document.querySelectorAll('.chips button').forEach(b => b.addEventListener('click', () => {
//   document.getElementById('question').value = b.textContent + ' ';
// }));

const API = (location.hostname === 'localhost')
  ? 'http://localhost:3001'
  : 'https://api.ncert.ai';

const askBtn = document.getElementById('ask');
const qBox = document.getElementById('question');
const answerEl = document.getElementById('answer');
const chatEl = document.getElementById('chat');
const loadingEl = document.getElementById('loading');
const errorEl = document.getElementById('error');
const sourcesEl = document.getElementById('sources');
const statsEl = document.getElementById('stats');
const chapterEl = document.getElementById('chapter');
const ragModeEl = document.getElementById('ragMode');
const clearBtn = document.getElementById('clearChat');


// ===== Ask Handler =====

askBtn.addEventListener('click', askQuestion);

async function askQuestion() {
  const q = qBox.value.trim();
  if (!q) return;

  errorEl.textContent = '';
  answerEl.textContent = '';
  sourcesEl.textContent = '';
  statsEl.textContent = '';

  loadingEl.style.display = 'block';

  try {
    const payload = {
      question: q,
      chapter: chapterEl ? chapterEl.value : '',
      rag: ragModeEl ? ragModeEl.checked : true
    };

    const r = await fetch(`${API}/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const j = await r.json();

    loadingEl.style.display = 'none';

    const ans = j.answer || JSON.stringify(j);

    // latest answer highlight
    answerEl.textContent = ans;

    // append to chat history
    chatEl.innerHTML += `
      <div class="q">Q: ${escapeHtml(q)}</div>
      <div class="a">A: ${escapeHtml(ans)}</div>
    `;
    chatEl.scrollTop = chatEl.scrollHeight;

    // optional: sources from RAG backend
    if (j.sources) {
      sourcesEl.textContent = "Sources: " + j.sources.join(', ');
    }

    // optional: compression stats
    if (j.stats) {
      statsEl.textContent =
        `Tokens: ${j.stats.original} → ${j.stats.compressed}  |  Saved: ${j.stats.saved}%`;
    }

  } catch (err) {
    loadingEl.style.display = 'none';
    errorEl.textContent = 'Error contacting API';
  }
}


// ===== Chips =====

document.querySelectorAll('.chips button').forEach(b =>
  b.addEventListener('click', () => {
    qBox.value = b.textContent + ' ';
    qBox.focus();
  })
);


// ===== Clear Chat =====

if (clearBtn) {
  clearBtn.addEventListener('click', () => {
    chatEl.innerHTML = '';
    answerEl.textContent = '';
    sourcesEl.textContent = '';
    statsEl.textContent = '';
  });
}


// ===== Enter Key Submit =====

qBox.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    askQuestion();
  }
});


// ===== Helper =====

function escapeHtml(s) {
  return s.replace(/[&<>"']/g, c =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c])
  );
}
