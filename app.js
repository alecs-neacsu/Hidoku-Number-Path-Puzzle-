import { BOARD_SIZES, LEVELS, Board, check } from './core.js';

/* =========================== i18n =========================== */
const I18N = {
  en: {
    intro: 'Fill the grid with the numbers 1 to N so that each number touches the next one — horizontally, vertically or diagonally.',
    size: 'Size', level: 'Level', options: 'Options',
    EASY: 'Easy', MEDIUM: 'Medium', HARD: 'Hard', CHALLENGING: 'Challenging',
    newPuzzle: 'New puzzle · {0} · {1}', collectionBtn: 'Collection · {0} / {1} solved', printBtn: 'Print puzzles',
    continue: 'Continue', inProgress: 'In progress', solvedTotal: 'Puzzles solved so far: {0}',
    generated: 'generated', filled: '{0} / {1} filled · {2}',
    bars: 'Connection bars', barsDesc: 'Draw a bar between consecutive numbers that touch each other',
    language: 'Language',
    deleteTitle: 'Delete this game?', deleteText: 'Your progress on {0} will be lost.', delete: 'Delete', cancel: 'Cancel', ok: 'OK',
    generating: 'Generating a puzzle with a unique solution…', generatingN: 'Generating puzzle {0} of {1}…',
    back: 'Back', menu: 'Menu', collectionTitle: 'Collection · {0} · {1}', collectionSolved: '{0} of {1} solved', tileStarted: 'in progress',
    subCollection: 'Collection #{0} · 1–{1}', subGenerated: 'Generated · 1–{0}',
    restart: 'Start over', printThis: 'Print this puzzle',
    correctTitle: 'Well done!', correctText: 'The solution is correct. You solved the puzzle in {0}.',
    incompleteTitle: 'Not finished yet', wrongTitle: 'Not correct', wrongText: "The grid is full, but the numbers don't form a valid chain. Keep trying.",
    restartTitle: 'Start over?', restartText: 'All the numbers you entered will be cleared and the timer starts from zero.', restartConfirm: 'Yes, clear it',
    undo: 'Undo', del: 'Delete', checkBtn: 'Check', solvedTitle: 'Solved correctly', time: 'Time: {0}', next: 'Next', newShort: 'New puzzle',
    keysHint: 'Keyboard: digits to type · Backspace · arrows to move · Enter to check · Ctrl+Z to undo',
    footerFree: 'Hidoku is free, works offline and has no ads.', privacy: 'Privacy policy', android: 'Android app: coming soon on Google Play',
    contact: 'Contact',
    printTitle: 'Print puzzles', source: 'Puzzles', fromCollection: 'From the collection', newOnes: 'Newly generated', thisPuzzle: 'This puzzle',
    from: 'From #', to: 'to #', count: 'How many', perPage: 'Per page', answers: 'Include answer pages', paper: 'Paper',
    prepare: 'Preview', print: 'Print', previewEmpty: 'Choose your puzzles and press Preview.',
    sheetTitle: 'HIDOKU PUZZLE {0}', sheetInstr: 'Fill in the missing numbers so that each number connects to the next one horizontally, vertically or diagonally.',
    answersTitle: 'ANSWERS', puzzleN: 'Puzzle {0}', pages: '{0} page(s)',
  },
  ro: {
    intro: 'Completează grila cu numerele de la 1 la N, astfel încât fiecare număr să fie vecin cu următorul — pe orizontală, verticală sau diagonală.',
    size: 'Mărime', level: 'Nivel', options: 'Opțiuni',
    EASY: 'Ușor', MEDIUM: 'Mediu', HARD: 'Greu', CHALLENGING: 'Provocare',
    newPuzzle: 'Puzzle nou · {0} · {1}', collectionBtn: 'Colecție · {0} / {1} rezolvate', printBtn: 'Printează puzzle-uri',
    continue: 'Continuă', inProgress: 'În lucru', solvedTotal: 'Puzzle-uri rezolvate până acum: {0}',
    generated: 'generat', filled: '{0} / {1} completate · {2}',
    bars: 'Bare de legătură', barsDesc: 'Arată o bară între numerele consecutive care sunt vecine',
    language: 'Limba',
    deleteTitle: 'Ștergi jocul?', deleteText: 'Progresul pentru {0} se va pierde.', delete: 'Șterge', cancel: 'Renunță', ok: 'OK',
    generating: 'Se generează un puzzle cu soluție unică…', generatingN: 'Se generează puzzle-ul {0} din {1}…',
    back: 'Înapoi', menu: 'Meniu', collectionTitle: 'Colecție · {0} · {1}', collectionSolved: '{0} din {1} rezolvate', tileStarted: 'în lucru',
    subCollection: 'Colecție #{0} · 1–{1}', subGenerated: 'Generat · 1–{0}',
    restart: 'Ia de la capăt', printThis: 'Printează acest puzzle',
    correctTitle: 'Felicitări!', correctText: 'Soluția este corectă. Ai rezolvat puzzle-ul în {0}.',
    incompleteTitle: 'Încă nu e gata', wrongTitle: 'Nu este corect', wrongText: 'Grila e completă, dar numerele nu formează un lanț corect. Mai încearcă.',
    restartTitle: 'Iei de la capăt?', restartText: 'Toate numerele introduse de tine vor fi șterse și cronometrul pornește de la zero.', restartConfirm: 'Da, șterge',
    undo: 'Anulează', del: 'Șterge', checkBtn: 'Verifică', solvedTitle: 'Rezolvat corect', time: 'Timp: {0}', next: 'Următorul', newShort: 'Puzzle nou',
    keysHint: 'Tastatură: cifre pentru numere · Backspace · săgeți pentru mutare · Enter pentru verificare · Ctrl+Z anulează',
    footerFree: 'Hidoku este gratuit, merge offline și nu are reclame.', privacy: 'Politica de confidențialitate', android: 'Aplicația Android: în curând pe Google Play',
    contact: 'Contact',
    printTitle: 'Printează puzzle-uri', source: 'Puzzle-uri', fromCollection: 'Din colecție', newOnes: 'Generate acum', thisPuzzle: 'Acest puzzle',
    from: 'De la #', to: 'până la #', count: 'Câte', perPage: 'Pe pagină', answers: 'Include paginile cu soluții', paper: 'Hârtie',
    prepare: 'Previzualizare', print: 'Printează', previewEmpty: 'Alege puzzle-urile și apasă Previzualizare.',
    sheetTitle: 'HIDOKU PUZZLE {0}', sheetInstr: 'Completează numerele lipsă astfel încât fiecare număr să fie legat de următorul pe orizontală, verticală sau diagonală.',
    answersTitle: 'SOLUȚII', puzzleN: 'Puzzle {0}', pages: '{0} pagini',
  },
};
function emptyCells(n) {
  if (lang === 'ro') {
    if (n === 1) return 'Mai este o căsuță goală.';
    const few = n % 100 >= 1 && n % 100 <= 19;
    return few ? `Mai sunt ${n} căsuțe goale.` : `Mai sunt ${n} de căsuțe goale.`;
  }
  return n === 1 ? 'There is one empty cell left.' : `There are ${n} empty cells left.`;
}
let lang = 'en';
const t = (k, ...a) => a.reduce((s, v, i) => s.replace(`{${i}}`, v), (I18N[lang] && I18N[lang][k]) ?? I18N.en[k] ?? k);
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

/* =========================== storage =========================== */
const KEY = 'hidoku.v1';
function loadStore() {
  try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.games) return s; } catch {}
  return null;
}
const S = loadStore() || { settings: {}, games: {}, last: null };
S.settings = Object.assign({ size: 4, level: 'EASY', bars: false, lang: null, print: {} }, S.settings);
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} }
lang = S.settings.lang || ((navigator.language || 'en').toLowerCase().startsWith('ro') ? 'ro' : 'en');
document.documentElement.lang = lang;

/* =========================== library =========================== */
let LIB = null;
async function library() {
  if (!LIB) LIB = await (await fetch('puzzles.json')).json();
  return LIB;
}
const libKey = (w, h, lv) => `${w}x${h}-${lv}`;
function libPuzzle(w, h, lv, i) {
  const [g, s] = LIB[libKey(w, h, lv)][i - 1].split('|');
  return { givens: g.split(',').map(Number), solution: s.split(',').map(Number) };
}
const libId = (w, h, lv, i) => `lib-${w}x${h}-${lv}-${i}`;

/* =========================== helpers =========================== */
const app = document.getElementById('app');
const dialog = document.getElementById('dialog');
const fmtTime = (ms) => {
  const s = Math.floor(ms / 1000), h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), x = s % 60;
  const p = (n) => String(n).padStart(2, '0');
  return h ? `${h}:${p(m)}:${p(x)}` : `${p(m)}:${p(x)}`;
};
const givensCount = (g) => g.givens.filter(Boolean).length;
const filledCount = (g) => g.values.filter(Boolean).length;
const describe = (g) => `${g.w}×${g.h} · ${t(g.level)} · ${g.lib ? '#' + g.lib : t('generated')}`;
const ICON = {
  back: '<svg viewBox="0 0 24 24"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>',
  more: '<svg viewBox="0 0 24 24"><path d="M12 8a2 2 0 1 0 0-4 2 2 0 0 0 0 4zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4zm0 6a2 2 0 1 0 0 4 2 2 0 0 0 0-4z"/></svg>',
  close: '<svg viewBox="0 0 24 24"><path d="M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>',
  undo: '<svg viewBox="0 0 24 24"><path d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"/></svg>',
  bksp: '<svg viewBox="0 0 24 24"><path d="M22 3H7c-.69 0-1.23.35-1.59.88L0 12l5.41 8.11c.36.53.9.89 1.59.89h15c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-3 12.59L17.59 17 14 13.41 10.41 17 9 15.59 12.59 12 9 8.41 10.41 7 14 10.59 17.59 7 19 8.41 15.41 12 19 15.59z"/></svg>',
  print: '<svg viewBox="0 0 24 24"><path d="M19 8H5c-1.66 0-3 1.34-3 3v6h4v4h12v-4h4v-6c0-1.66-1.34-3-3-3zm-3 11H8v-5h8v5zm3-7c-.55 0-1-.45-1-1s.45-1 1-1 1 .45 1 1-.45 1-1 1zm-1-9H6v4h12V3z"/></svg>',
};

function showDialog({ title, text = '', html = '', buttons = [{ label: t('ok') }], dismissible = true }) {
  return new Promise((resolve) => {
    dialog.innerHTML = `<h2>${esc(title)}</h2>${text ? `<p>${esc(text)}</p>` : ''}${html}
      <div class="actions">${buttons.map((b, i) => `<button data-i="${i}" ${b.id ? `id="${b.id}"` : ''}>${esc(b.label)}</button>`).join('')}</div>`;
    const done = (v) => { dialog.close(); resolve(v); };
    dialog.querySelectorAll('.actions button').forEach((b) => (b.onclick = () => done(buttons[+b.dataset.i].value)));
    dialog.oncancel = (e) => { if (!dismissible) e.preventDefault(); else resolve(undefined); };
    dialog.showModal();
  });
}

/* =========================== generator worker =========================== */
let worker = null, jobSeq = 0;
function getWorker() {
  if (!worker) worker = new Worker('worker.js', { type: 'module' });
  return worker;
}
function generateAsync(width, height, level) {
  const id = ++jobSeq;
  const seed = (Math.random() * 2 ** 32) >>> 0;
  return new Promise((resolve) => {
    const w = getWorker();
    const onMsg = (e) => { if (e.data.id === id) { w.removeEventListener('message', onMsg); resolve(e.data.puzzle); } };
    w.addEventListener('message', onMsg);
    w.postMessage({ id, width, height, level, seed });
  });
}
function cancelGeneration() { if (worker) { worker.terminate(); worker = null; } }

/* =========================== router =========================== */
let leaveCurrent = null;
function route() {
  if (leaveCurrent) { leaveCurrent(); leaveCurrent = null; }
  closeMenu();
  const parts = location.hash.replace(/^#\/?/, '').split('/').filter(Boolean).map(decodeURIComponent);
  window.scrollTo(0, 0);
  if (parts[0] === 'play' && parts[1]) return renderGame(parts[1]);
  if (parts[0] === 'collection' && parts[2]) {
    const [w, h] = parts[1].split('x').map(Number);
    return renderCollection(w, h, parts[2]);
  }
  if (parts[0] === 'print') return renderPrint(parts[1]);
  return renderHome();
}
const go = (hash) => { if (location.hash === hash) route(); else location.hash = hash; };
window.addEventListener('hashchange', route);

/* =========================== home =========================== */
async function renderHome() {
  document.title = 'Hidoku: Number Path Puzzle';
  await library();
  const st = S.settings;
  const [w, h] = BOARD_SIZES[st.size];
  const games = Object.values(S.games).sort((a, b) => b.updated - a.updated);
  const last = games.find((g) => g.id === S.last && !g.solved);
  const inProgress = games.filter((g) => !g.solved && g.id !== last?.id && (filledCount(g) > givensCount(g) || !g.lib));
  const count = LIB[libKey(w, h, st.level)].length;
  const solvedHere = games.filter((g) => g.solved && g.lib && g.w === w && g.h === h && g.level === st.level).length;
  const solvedTotal = games.filter((g) => g.solved).length;

  const progress = (g) => {
    const gv = givensCount(g), tot = g.w * g.h - gv;
    return tot ? Math.round((100 * (filledCount(g) - gv)) / tot) : 100;
  };
  app.innerHTML = `
  <main class="page">
    <h1 class="title">HIDOKU</h1>
    <p class="intro">${esc(t('intro'))}</p>
    ${last ? `<button class="continue" id="continue">
        <span style="flex:1"><span class="t">${esc(t('continue'))}</span><br>
        <span class="s">${esc(describe(last))} · ${fmtTime(last.elapsed)}</span>
        <span class="progress"><i style="width:${progress(last)}%"></i></span></span>
        <span style="font-size:22px">▶</span></button>` : ''}
    <div class="label">${esc(t('size'))}</div>
    <div class="chips">${BOARD_SIZES.map(([a, b], i) => `<button class="chip" data-size="${i}" aria-pressed="${i === st.size}">${a}×${b}</button>`).join('')}</div>
    <div class="label">${esc(t('level'))}</div>
    <div class="chips">${LEVELS.map((l) => `<button class="chip" data-level="${l}" aria-pressed="${l === st.level}">${esc(t(l))}</button>`).join('')}</div>
    <div class="btn-row">
      <button class="btn primary" id="new">${esc(t('newPuzzle', `${w}×${h}`, t(st.level)))}</button>
      <a class="btn" href="#/collection/${w}x${h}/${st.level}">${esc(t('collectionBtn', solvedHere, count))}</a>
      <a class="btn" href="#/print">${ICON.print.replace('<svg', '<svg width="20" height="20" fill="currentColor"')} ${esc(t('printBtn'))}</a>
    </div>
    <div class="label">${esc(t('options'))}</div>
    <div class="row switch-row" id="bars-row" role="switch" aria-checked="${st.bars}" tabindex="0">
      <div class="grow"><div class="t">${esc(t('bars'))}</div><div class="s">${esc(t('barsDesc'))}</div></div>
      <span class="switch" aria-checked="${st.bars}"></span>
    </div>
    <div class="row">
      <div class="grow"><div class="t">${esc(t('language'))}</div></div>
      <div class="chips" style="padding-right:8px">
        <button class="chip" data-lang="en" aria-pressed="${lang === 'en'}">English</button>
        <button class="chip" data-lang="ro" aria-pressed="${lang === 'ro'}">Română</button>
      </div>
    </div>
    ${inProgress.length ? `<div class="label">${esc(t('inProgress'))}</div>
      ${inProgress.slice(0, 12).map((g) => `<div class="row">
        <div class="grow"><button data-open="${esc(g.id)}"><div class="t">${esc(describe(g))}</div>
        <div class="s">${esc(t('filled', filledCount(g) - givensCount(g), g.w * g.h - givensCount(g), fmtTime(g.elapsed)))}</div></button></div>
        <button class="icon-btn" data-del="${esc(g.id)}" aria-label="${esc(t('delete'))}">${ICON.close}</button></div>`).join('')}` : ''}
    ${solvedTotal ? `<p class="muted" style="font-size:13px;margin-top:14px">${esc(t('solvedTotal', solvedTotal))}</p>` : ''}
    <footer class="footer">
      <span>${esc(t('footerFree'))}</span>
      <span>${esc(t('android'))}</span>
      <span><a href="privacy-policy.html">${esc(t('privacy'))}</a> · ${esc(t('contact'))}: <a href="mailto:office@radicalsolutions.be">office@radicalsolutions.be</a></span>
    </footer>
  </main>`;

  app.querySelectorAll('[data-size]').forEach((b) => (b.onclick = () => { st.size = +b.dataset.size; save(); renderHome(); }));
  app.querySelectorAll('[data-level]').forEach((b) => (b.onclick = () => { st.level = b.dataset.level; save(); renderHome(); }));
  app.querySelectorAll('[data-lang]').forEach((b) => (b.onclick = () => { lang = st.lang = b.dataset.lang; document.documentElement.lang = lang; save(); renderHome(); }));
  const barsRow = app.querySelector('#bars-row');
  barsRow.onclick = () => { st.bars = !st.bars; save(); renderHome(); };
  barsRow.onkeydown = (e) => { if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); barsRow.onclick(); } };
  app.querySelector('#new').onclick = () => newGenerated(w, h, st.level);
  if (last) app.querySelector('#continue').onclick = () => go('#/play/' + last.id);
  app.querySelectorAll('[data-open]').forEach((b) => (b.onclick = () => go('#/play/' + b.dataset.open)));
  app.querySelectorAll('[data-del]').forEach((b) => (b.onclick = async () => {
    const g = S.games[b.dataset.del];
    const ok = await showDialog({ title: t('deleteTitle'), text: t('deleteText', describe(g)), buttons: [{ label: t('cancel'), value: false }, { label: t('delete'), value: true }] });
    if (ok) { delete S.games[g.id]; if (S.last === g.id) S.last = null; save(); renderHome(); }
  }));
}

async function newGenerated(w, h, level) {
  const cancelled = { v: false };
  showDialog({ title: '', html: `<div class="spinner"></div><p style="text-align:center">${esc(t('generating'))}</p>`, buttons: [{ label: t('cancel'), value: 'cancel' }] })
    .then((v) => { if (v === 'cancel' || v === undefined) { cancelled.v = true; cancelGeneration(); } });
  const p = await generateAsync(w, h, level);
  if (cancelled.v) return;
  dialog.close();
  const now = Date.now();
  const g = { id: 'gen-' + now, w, h, level, lib: 0, givens: p.givens, solution: p.solution, values: p.givens.slice(), elapsed: 0, solved: false, updated: now };
  S.games[g.id] = g; S.last = g.id; save();
  go('#/play/' + g.id);
}

/* =========================== collection =========================== */
async function renderCollection(w, h, level) {
  await library();
  const list = LIB[libKey(w, h, level)];
  if (!list) return go('#/');
  const solved = list.filter((_, i) => S.games[libId(w, h, level, i + 1)]?.solved).length;
  app.innerHTML = `
  <header class="topbar">
    <a class="icon-btn" href="#/" aria-label="${esc(t('back'))}">${ICON.back}</a>
    <div class="grow"><div class="t">${esc(t('collectionTitle', `${w}×${h}`, t(level)))}</div>
    <div class="s">${esc(t('collectionSolved', solved, list.length))}</div></div>
  </header>
  <main class="page" style="max-width:820px;padding-top:8px">
    <div class="tiles">${list.map((_, i) => {
      const g = S.games[libId(w, h, level, i + 1)];
      const started = g && !g.solved && filledCount(g) > givensCount(g);
      const cls = g?.solved ? 'done' : started ? 'started' : '';
      const sub = g?.solved ? '✓ ' + fmtTime(g.elapsed) : started ? t('tileStarted') : '';
      return `<a class="tile ${cls}" href="#/play/${libId(w, h, level, i + 1)}"><b>${i + 1}</b>${sub ? `<small>${esc(sub)}</small>` : ''}</a>`;
    }).join('')}</div>
  </main>`;
}

/* =========================== board svg =========================== */
function boardSvg(w, h, givens, values, o = {}) {
  const board = Board.of(w, h), C = 100, W = w * C, H = h * C, n = w * h;
  const pr = o.print ? 'p' : 'b';
  let s = `<svg viewBox="-3 -3 ${W + 6} ${H + 6}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg"${o.print ? '' : ` role="img" aria-label="Hidoku ${w}×${h}"`}>`;
  s += `<rect class="${pr}-bg" x="0" y="0" width="${W}" height="${H}"/>`;
  if (o.selected >= 0) s += `<rect class="b-sel" x="${board.x(o.selected) * C}" y="${board.y(o.selected) * C}" width="${C}" height="${C}"/>`;
  for (let i = 1; i < w; i++) s += `<line class="${pr}-grid" x1="${i * C}" y1="0" x2="${i * C}" y2="${H}"/>`;
  for (let j = 1; j < h; j++) s += `<line class="${pr}-grid" x1="0" y1="${j * C}" x2="${W}" y2="${j * C}"/>`;
  const cx = (c) => board.x(c) * C + C / 2, cy = (c) => board.y(c) * C + C / 2;
  if (o.bars) {
    for (let c = 0; c < n; c++) {
      const v = values[c];
      if (!v) continue;
      for (const nb of board.neighbors[c]) if (values[nb] === v + 1) s += `<line class="b-bar" x1="${cx(c)}" y1="${cy(c)}" x2="${cx(nb)}" y2="${cy(nb)}"/>`;
    }
  }
  for (let c = 0; c < n; c++) {
    const v = values[c];
    if (!v) continue;
    const fs = v >= 100 ? 37 : v >= 10 ? 45 : 50;
    const given = !!givens[c];
    const cls = o.print ? (given ? 'p-g' : 'p-a') : given ? 'b-g' : o.solved ? 'b-v ok' : 'b-v';
    s += `<text class="b-num ${cls}" x="${cx(c)}" y="${cy(c) + 1}" font-size="${fs}">${v}</text>`;
  }
  s += `<rect class="${pr}-frame" x="0" y="0" width="${W}" height="${H}"/>`;
  if (o.hits) for (let c = 0; c < n; c++) if (!givens[c]) s += `<rect class="b-hit" data-c="${c}" x="${board.x(c) * C}" y="${board.y(c) * C}" width="${C}" height="${C}"/>`;
  return s + '</svg>';
}

/* =========================== game =========================== */
let G = null, sel = -1, fresh = true, undoStack = [], tStart = null, ticker = null;

function elapsedNow() { return G ? G.elapsed + (tStart !== null ? performance.now() - tStart : 0) : 0; }
function resumeTimer() { if (G && !G.solved && tStart === null && !document.hidden) tStart = performance.now(); }
function pauseTimer() { if (G && tStart !== null) { G.elapsed += performance.now() - tStart; tStart = null; save(); } }
document.addEventListener('visibilitychange', () => { if (document.hidden) pauseTimer(); else if (G) resumeTimer(); });
window.addEventListener('pagehide', pauseTimer);

async function renderGame(id) {
  await library();
  let g = S.games[id];
  if (!g) {
    const m = /^lib-(\d+)x(\d+)-([A-Z]+)-(\d+)$/.exec(id);
    if (!m || !LIB[libKey(+m[1], +m[2], m[3])]) return go('#/');
    const [w, h, lv, i] = [+m[1], +m[2], m[3], +m[4]];
    if (i < 1 || i > LIB[libKey(w, h, lv)].length) return go('#/');
    const p = libPuzzle(w, h, lv, i);
    g = S.games[id] = { id, w, h, level: lv, lib: i, givens: p.givens, solution: p.solution, values: p.givens.slice(), elapsed: 0, solved: false, updated: Date.now() };
  }
  G = g; S.last = id; save();
  sel = -1; fresh = true; undoStack = [];
  document.title = `${g.w}×${g.h} · ${t(g.level)} — Hidoku`;
  app.innerHTML = `
  <div class="game">
    <header class="topbar">
      <a class="icon-btn" href="#/" aria-label="${esc(t('back'))}">${ICON.back}</a>
      <div class="grow"><div class="t">${g.w}×${g.h} · ${esc(t(g.level))}</div>
        <div class="s">${esc(g.lib ? t('subCollection', g.lib, g.w * g.h) : t('subGenerated', g.w * g.h))}</div></div>
      <span class="timer" id="timer"></span>
      <button class="icon-btn" id="menu-btn" aria-label="${esc(t('menu'))}" aria-haspopup="menu">${ICON.more}</button>
    </header>
    <div class="game-body">
      <div class="board-wrap" id="board"></div>
      <div class="controls" id="controls"></div>
    </div>
  </div>`;
  app.querySelector('#board').addEventListener('pointerdown', (e) => {
    const hit = e.target.closest('[data-c]');
    if (hit) { e.preventDefault(); select(+hit.dataset.c); }
  });
  app.querySelector('#menu-btn').onclick = (e) => { e.stopPropagation(); openGameMenu(e.currentTarget); };
  drawBoard(); drawControls(); tick();
  resumeTimer();
  ticker = setInterval(tick, 500);
  document.addEventListener('keydown', onKey);
  leaveCurrent = () => { pauseTimer(); clearInterval(ticker); document.removeEventListener('keydown', onKey); G = null; };
}

function tick() {
  const el = document.getElementById('timer');
  if (el && G) { el.textContent = fmtTime(elapsedNow()); el.classList.toggle('done', G.solved); }
}
function drawBoard() {
  document.getElementById('board').innerHTML = boardSvg(G.w, G.h, G.givens, G.values, { selected: sel, bars: S.settings.bars, solved: G.solved, hits: !G.solved });
}
function drawControls() {
  const el = document.getElementById('controls');
  if (G.solved) {
    const hasNext = G.lib && G.lib < (LIB[libKey(G.w, G.h, G.level)]?.length || 0);
    el.innerHTML = `<div class="solved"><b>✓</b><div><div style="font-weight:700">${esc(t('solvedTitle'))}</div>
      <div class="muted" style="font-size:13px">${esc(t('time', fmtTime(G.elapsed)))}</div></div></div>
      <div class="btn-row ${hasNext ? 'two' : ''}" style="margin-top:0">
        ${hasNext ? `<a class="btn" href="#/play/${libId(G.w, G.h, G.level, G.lib + 1)}">${esc(t('next'))}</a>` : ''}
        <button class="btn dark" id="new-like">${esc(t('newShort'))}</button></div>`;
    el.querySelector('#new-like').onclick = () => {
      const i = BOARD_SIZES.findIndex(([a, b]) => a === G.w && b === G.h);
      if (i >= 0) S.settings.size = i;
      S.settings.level = G.level; save();
      newGenerated(G.w, G.h, G.level);
    };
    return;
  }
  el.innerHTML = `<div class="keypad">
    ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map((d) => `<button class="key" data-d="${d}">${d}</button>`).join('')}
    <button class="key" id="k-undo" ${undoStack.length ? '' : 'disabled'} aria-label="${esc(t('undo'))}">${ICON.undo}<small>${esc(t('undo'))}</small></button>
    <button class="key" id="k-bksp" aria-label="${esc(t('del'))}">${ICON.bksp}<small>${esc(t('del'))}</small></button>
    <button class="key check" id="k-check">${esc(t('checkBtn'))}</button>
  </div><div class="hint-keys">${esc(t('keysHint'))}</div>`;
  el.querySelectorAll('[data-d]').forEach((b) => (b.onclick = () => digit(+b.dataset.d)));
  el.querySelector('#k-undo').onclick = undo;
  el.querySelector('#k-bksp').onclick = backspace;
  el.querySelector('#k-check').onclick = doCheck;
}
function refreshUndo() { const u = document.getElementById('k-undo'); if (u) u.disabled = !undoStack.length; }

function select(c) {
  if (!G || G.solved || G.givens[c]) return;
  fresh = true; // tapping a cell (again) always starts a fresh entry
  if (sel !== c) { sel = c; drawBoard(); }
}
function setVal(c, v) {
  G.values[c] = v; G.updated = Date.now(); save(); drawBoard(); refreshUndo();
}
function digit(d) {
  if (!G || sel < 0 || G.solved || G.givens[sel]) return;
  const old = G.values[sel], N = G.w * G.h;
  let nv;
  if (fresh) {
    if (d === 0) return;
    undoStack.push([sel, old]);
    nv = d;
  } else {
    const ap = old * 10 + d;
    if (ap >= 1 && ap <= N) nv = ap;
    else if (d === 0) return;
    else nv = d;
  }
  fresh = false;
  if (nv !== old) setVal(sel, nv); else refreshUndo();
}
function backspace() {
  if (!G || sel < 0 || G.solved || !G.values[sel] || G.givens[sel]) return;
  undoStack.push([sel, G.values[sel]]);
  fresh = false;
  setVal(sel, Math.floor(G.values[sel] / 10));
}
function clearCell() {
  if (!G || sel < 0 || G.solved || !G.values[sel] || G.givens[sel]) return;
  undoStack.push([sel, G.values[sel]]);
  fresh = true;
  setVal(sel, 0);
}
function undo() {
  if (!G || G.solved) return;
  const e = undoStack.pop();
  if (!e) return;
  sel = e[0]; fresh = true;
  setVal(e[0], e[1]);
}
function moveSel(dx, dy) {
  if (!G || G.solved) return;
  const { w, h } = G;
  let x = sel < 0 ? 0 : sel % w, y = sel < 0 ? 0 : Math.floor(sel / w);
  if (sel < 0) { const f = G.givens.findIndex((v) => !v); if (f >= 0) select(f); return; }
  for (let k = 0; k < w * h; k++) {
    x += dx; y += dy;
    if (x < 0 || x >= w || y < 0 || y >= h) return;
    const c = y * w + x;
    if (!G.givens[c]) { select(c); return; }
  }
}
function onKey(e) {
  if (dialog.open || document.querySelector('.menu')) return;
  if (e.target.closest && e.target.closest('input, textarea, select')) return;
  const k = e.key;
  if ((e.ctrlKey || e.metaKey) && k.toLowerCase() === 'z') { e.preventDefault(); undo(); return; }
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (/^[0-9]$/.test(k)) { e.preventDefault(); digit(+k); }
  else if (k === 'Backspace') { e.preventDefault(); backspace(); }
  else if (k === 'Delete') { e.preventDefault(); clearCell(); }
  else if (k === 'ArrowLeft') { e.preventDefault(); moveSel(-1, 0); }
  else if (k === 'ArrowRight') { e.preventDefault(); moveSel(1, 0); }
  else if (k === 'ArrowUp') { e.preventDefault(); moveSel(0, -1); }
  else if (k === 'ArrowDown') { e.preventDefault(); moveSel(0, 1); }
  else if (k === 'Enter') { e.preventDefault(); if (!G.solved) doCheck(); }
}
async function doCheck() {
  const r = check(G.w, G.h, G.givens, G.values);
  if (r === 'CORRECT') {
    pauseTimer();
    G.solved = true; sel = -1; G.updated = Date.now(); save();
    drawBoard(); drawControls(); tick();
    await showDialog({ title: t('correctTitle'), text: t('correctText', fmtTime(G.elapsed)) });
  } else if (r === 'INCOMPLETE') {
    await showDialog({ title: t('incompleteTitle'), text: emptyCells(G.values.filter((v) => !v).length) });
  } else {
    await showDialog({ title: t('wrongTitle'), text: t('wrongText') });
  }
}

/* menu */
let menuEl = null;
function closeMenu() { if (menuEl) { menuEl.remove(); menuEl = null; document.removeEventListener('pointerdown', outsideMenu, true); } }
function outsideMenu(e) { if (menuEl && !menuEl.contains(e.target)) closeMenu(); }
function openGameMenu(anchor) {
  closeMenu();
  const r = anchor.getBoundingClientRect();
  menuEl = document.createElement('div');
  menuEl.className = 'menu';
  menuEl.setAttribute('role', 'menu');
  menuEl.style.top = r.bottom + 4 + 'px';
  menuEl.style.right = Math.max(8, window.innerWidth - r.right) + 'px';
  menuEl.innerHTML = `
    <button role="menuitemcheckbox" id="m-bars" aria-checked="${S.settings.bars}">${esc(t('bars'))}<span class="switch" aria-checked="${S.settings.bars}"></span></button>
    <button role="menuitem" id="m-print">${esc(t('printThis'))}</button>
    <button role="menuitem" id="m-restart">${esc(t('restart'))}</button>`;
  document.body.appendChild(menuEl);
  menuEl.querySelector('#m-bars').onclick = () => {
    S.settings.bars = !S.settings.bars; save(); drawBoard();
    const b = menuEl.querySelector('#m-bars');
    b.setAttribute('aria-checked', S.settings.bars); b.querySelector('.switch').setAttribute('aria-checked', S.settings.bars);
  };
  menuEl.querySelector('#m-print').onclick = () => { closeMenu(); go('#/print/' + G.id); };
  menuEl.querySelector('#m-restart').onclick = async () => {
    closeMenu();
    const ok = await showDialog({ title: t('restartTitle'), text: t('restartText'), buttons: [{ label: t('cancel'), value: false }, { label: t('restartConfirm'), value: true }] });
    if (!ok) return;
    G.values = G.givens.slice(); G.solved = false; G.elapsed = 0; tStart = null; sel = -1; fresh = true; undoStack = [];
    G.updated = Date.now(); save(); resumeTimer(); drawBoard(); drawControls(); tick();
  };
  setTimeout(() => document.addEventListener('pointerdown', outsideMenu, true));
}

/* =========================== print =========================== */
const PAPER = { A4: { size: 'A4', pw: '186mm', ph: '272mm' }, Letter: { size: 'letter', pw: '191mm', ph: '254mm' } };

async function renderPrint(gameId) {
  await library();
  document.title = t('printTitle') + ' — Hidoku';
  const single = gameId && S.games[gameId] ? S.games[gameId] : null;
  const P = (S.settings.print = Object.assign({ source: 'collection', size: S.settings.size, level: S.settings.level, from: 1, to: 4, count: 4, perPage: 1, answers: true, paper: 'A4' }, S.settings.print));
  if (single) P.source = 'single';
  else if (P.source === 'single') P.source = 'collection';

  const chips = (name, items, current) => items.map(([v, label]) => `<button class="chip" data-${name}="${v}" aria-pressed="${String(v) === String(current)}">${esc(label)}</button>`).join('');
  app.innerHTML = `
  <header class="topbar">
    <a class="icon-btn" href="${single ? '#/play/' + esc(single.id) : '#/'}" aria-label="${esc(t('back'))}">${ICON.back}</a>
    <div class="grow"><div class="t">${esc(t('printTitle'))}</div><div class="s" id="pages-info"></div></div>
  </header>
  <div class="print-layout">
    <section class="panel">
      <div class="label">${esc(t('source'))}</div>
      <div class="chips">${single ? chips('source', [['single', t('thisPuzzle')]], 'single') : chips('source', [['collection', t('fromCollection')], ['generated', t('newOnes')]], P.source)}</div>
      <div class="${single ? 'hidden' : ''}">
        <div class="label">${esc(t('size'))}</div>
        <div class="chips">${chips('psize', BOARD_SIZES.map(([a, b], i) => [i, `${a}×${b}`]), P.size)}</div>
        <div class="label">${esc(t('level'))}</div>
        <div class="chips">${chips('plevel', LEVELS.map((l) => [l, t(l)]), P.level)}</div>
        <div class="field ${P.source === 'collection' ? '' : 'hidden'}">${esc(t('from'))}
          <input type="number" id="p-from" min="1" max="30" value="${P.from}"> ${esc(t('to'))}
          <input type="number" id="p-to" min="1" max="30" value="${P.to}"></div>
        <div class="field ${P.source === 'generated' ? '' : 'hidden'}">${esc(t('count'))}
          <input type="number" id="p-count" min="1" max="40" value="${P.count}"></div>
      </div>
      <div class="label">${esc(t('perPage'))}</div>
      <div class="chips">${chips('per', [[1, '1'], [2, '2'], [4, '4']], P.perPage)}</div>
      <div class="label">${esc(t('paper'))}</div>
      <div class="chips">${chips('paper', [['A4', 'A4'], ['Letter', 'Letter']], P.paper)}</div>
      <label class="check-row"><input type="checkbox" id="p-ans" ${P.answers ? 'checked' : ''}> ${esc(t('answers'))}</label>
      <div class="btn-row two">
        <button class="btn" id="p-preview">${esc(t('prepare'))}</button>
        <button class="btn primary" id="p-print">${ICON.print.replace('<svg', '<svg width="20" height="20" fill="currentColor"')} ${esc(t('print'))}</button>
      </div>
    </section>
    <section class="preview" id="preview"><div class="preview-empty">${esc(t('previewEmpty'))}</div></section>
  </div>`;

  const rerender = () => renderPrint(gameId);
  app.querySelectorAll('[data-source]').forEach((b) => (b.onclick = () => { if (!single) { P.source = b.dataset.source; save(); rerender(); } }));
  app.querySelectorAll('[data-psize]').forEach((b) => (b.onclick = () => { P.size = +b.dataset.psize; save(); rerender(); }));
  app.querySelectorAll('[data-plevel]').forEach((b) => (b.onclick = () => { P.level = b.dataset.plevel; save(); rerender(); }));
  app.querySelectorAll('[data-per]').forEach((b) => (b.onclick = () => { P.perPage = +b.dataset.per; save(); rerender(); }));
  app.querySelectorAll('[data-paper]').forEach((b) => (b.onclick = () => { P.paper = b.dataset.paper; save(); rerender(); }));
  const readInputs = () => {
    const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v | 0 || lo));
    const from = clamp(+app.querySelector('#p-from').value, 1, 30), to = clamp(+app.querySelector('#p-to').value, 1, 30);
    P.from = Math.min(from, to); P.to = Math.max(from, to);
    P.count = clamp(+app.querySelector('#p-count').value, 1, 40);
    P.answers = app.querySelector('#p-ans').checked;
    save();
  };
  let built = null;
  const build = async () => {
    readInputs();
    const [w, h] = BOARD_SIZES[P.size];
    let puzzles = [];
    if (P.source === 'single') {
      puzzles = [{ w: single.w, h: single.h, level: single.level, label: single.lib ? `${t(single.level)} · ${t('puzzleN', single.lib)}` : `${t(single.level)} · ${t('generated')}`, givens: single.givens, solution: single.solution || null }];
    } else if (P.source === 'collection') {
      for (let i = P.from; i <= P.to; i++) {
        const p = libPuzzle(w, h, P.level, i);
        puzzles.push({ w, h, level: P.level, label: `${t(P.level)} · ${t('puzzleN', i)}`, ...p });
      }
    } else {
      let cancelled = false;
      const info = document.createElement('p');
      showDialog({ title: '', html: `<div class="spinner"></div><p style="text-align:center" id="gen-info"></p>`, buttons: [{ label: t('cancel'), value: 'cancel' }] })
        .then((v) => { if (v === 'cancel' || v === undefined) { cancelled = true; cancelGeneration(); } });
      for (let i = 1; i <= P.count && !cancelled; i++) {
        const el = document.getElementById('gen-info');
        if (el) el.textContent = t('generatingN', i, P.count);
        const p = await generateAsync(w, h, P.level);
        if (cancelled) break;
        puzzles.push({ w, h, level: P.level, label: `${t(P.level)} · #${i}`, givens: p.givens, solution: p.solution });
      }
      if (dialog.open) dialog.close();
      if (cancelled) return null;
      void info;
    }
    built = sheetsHtml(puzzles, P);
    const pv = app.querySelector('#preview');
    pv.innerHTML = built.html;
    fitPreview();
    app.querySelector('#pages-info').textContent = t('pages', built.pages);
    return built;
  };
  const fitPreview = () => {
    const pv = app.querySelector('#preview');
    if (!pv) return;
    const sheet = pv.querySelector('.sheet');
    if (!sheet) return;
    sheet.style.zoom = 1;
    const natural = sheet.getBoundingClientRect().width;
    const z = Math.min(1, (pv.clientWidth - 32) / natural);
    pv.querySelectorAll('.sheet').forEach((s) => (s.style.zoom = z));
  };
  window.onresize = () => fitPreview();
  app.querySelector('#p-preview').onclick = build;
  app.querySelector('#p-print').onclick = async () => {
    const b = (P.source === 'generated' && built) ? built : await build();
    if (!b) return;
    const paper = PAPER[P.paper];
    document.getElementById('page-style').textContent = `@page { size: ${paper.size} portrait; margin: 12mm; }`;
    const root = document.getElementById('print-root');
    root.innerHTML = b.html;
    root.style.setProperty('--pw', paper.pw); root.style.setProperty('--ph', paper.ph);
    setTimeout(() => window.print(), 50);
  };
  if (single) build();
  leaveCurrent = () => { window.onresize = null; };
}

function sheetsHtml(puzzles, P) {
  const paper = PAPER[P.paper];
  const style = `style="--pw:${paper.pw};--ph:${paper.ph}"`;
  const host = location.host + location.pathname.replace(/index\.html$/, '');
  const sameN = puzzles.every((p) => p.w * p.h === puzzles[0].w * puzzles[0].h);
  const title = t('sheetTitle', sameN ? `1–${puzzles[0].w * puzzles[0].h}` : '').trim();
  const per = P.perPage;
  let html = '', pages = 0;
  for (let i = 0; i < puzzles.length; i += per) {
    const chunk = puzzles.slice(i, i + per);
    pages++;
    html += `<div class="sheet" ${style}><h1>${esc(title)}</h1><div class="instr">${esc(t('sheetInstr'))}</div>
      <div class="grids n${per}">${chunk.map((p) => `<div class="item"><div class="cap">${esc(p.label)}</div>${boardSvg(p.w, p.h, p.givens, p.givens, { print: true })}</div>`).join('')}</div>
      <div class="foot"><span>Hidoku</span><span>${esc(host)}</span></div></div>`;
  }
  const withSol = puzzles.filter((p) => p.solution);
  if (P.answers && withSol.length) {
    for (let i = 0; i < withSol.length; i += 6) {
      const chunk = withSol.slice(i, i + 6);
      pages++;
      html += `<div class="sheet" ${style}><h1>${esc(t('answersTitle'))}</h1><div class="instr">&nbsp;</div>
        <div class="grids ans">${chunk.map((p) => `<div class="item"><div class="cap">${esc(p.label)}</div>${boardSvg(p.w, p.h, p.givens, p.solution, { print: true })}</div>`).join('')}</div>
        <div class="foot"><span>Hidoku</span><span>${esc(host)}</span></div></div>`;
    }
  }
  return { html, pages };
}

/* =========================== start =========================== */
route();
if ('serviceWorker' in navigator && location.protocol === 'https:') {
  navigator.serviceWorker.register('sw.js').catch(() => {});
}
