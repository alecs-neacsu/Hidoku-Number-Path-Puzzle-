// Hidoku core: board geometry, solution-counting solver, unique-puzzle generator, rule validator.
// Port of the Android app's Kotlin core. Works in browsers, workers and Node (ES module).

export const BOARD_SIZES = [[6, 6], [7, 7], [8, 8], [9, 9], [10, 10], [10, 12]];
export const LEVELS = ['EASY', 'MEDIUM', 'HARD', 'CHALLENGING'];

const boardCache = new Map();

export class Board {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.size = width * height;
    this.neighbors = [];
    for (let c = 0; c < this.size; c++) {
      const x = c % width, y = (c / width) | 0, list = [];
      for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
        if (!dx && !dy) continue;
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < width && ny >= 0 && ny < height) list.push(ny * width + nx);
      }
      this.neighbors.push(Int32Array.from(list));
    }
  }
  static of(w, h) {
    const k = w + 'x' + h;
    if (!boardCache.has(k)) boardCache.set(k, new Board(w, h));
    return boardCache.get(k);
  }
  x(c) { return c % this.width; }
  y(c) { return (c / this.width) | 0; }
  dist(a, b) { return Math.max(Math.abs(this.x(a) - this.x(b)), Math.abs(this.y(a) - this.y(b))); }
  adjacent(a, b) { return a !== b && this.dist(a, b) === 1; }
}

/** Counts solutions (up to a limit) by building the chain 1 -> N with strong pruning. */
export class Solver {
  constructor(board, givens, nodeLimit = 3_000_000) {
    this.board = board;
    this.nodeLimit = nodeLimit;
    const n = (this.n = board.size);
    this.value = Int32Array.from(givens);
    this.pos = new Int32Array(n + 2).fill(-1);
    this.isGiven = new Uint8Array(n + 2);
    this.nextGivenAbove = new Int32Array(n + 2);
    this.maxCoverEnd = new Int32Array(n);
    for (let c = 0; c < n; c++) {
      const v = this.value[c];
      if (v) { this.pos[v] = c; this.isGiven[v] = 1; }
    }
    let next = 0;
    for (let k = n + 1; k >= 0; k--) {
      this.nextGivenAbove[k] = next;
      if (k >= 1 && k <= n && this.isGiven[k]) next = k;
    }
    const gaps = [];
    let prev = 0;
    for (let g = 1; g <= n; g++) {
      if (!this.isGiven[g]) continue;
      if (g - prev >= 2) gaps.push([prev, g]);
      prev = g;
    }
    if (prev < n) gaps.push([prev, n + 1]);
    for (let f = 0; f < n; f++) {
      if (this.value[f]) continue;
      let best = 0;
      for (const [a, b] of gaps) {
        let ok;
        if (a === 0 && b === n + 1) ok = true;
        else if (a === 0) ok = board.dist(f, this.pos[b]) <= b - 1;
        else if (b === n + 1) ok = board.dist(this.pos[a], f) <= n - a;
        else ok = board.dist(this.pos[a], f) + board.dist(f, this.pos[b]) <= b - a;
        if (ok && b > best) best = b;
      }
      this.maxCoverEnd[f] = best;
    }
    this.nodes = 0;
    this.aborted = false;
    this.solution = null;
  }

  countSolutions(limit = 2) {
    this.limit = limit;
    this.count = 0;
    this.nodes = 0;
    this.aborted = false;
    const { pos, value, n, board } = this;
    if (pos[1] !== -1) {
      this.dfs(1, pos[1]);
    } else {
      const ng = this.nextGivenAbove[1];
      for (let c = 0; c < n; c++) {
        if (value[c]) continue;
        if (ng && board.dist(c, pos[ng]) > ng - 1) continue;
        value[c] = 1; pos[1] = c;
        this.dfs(1, c);
        value[c] = 0; pos[1] = -1;
        if (this.count >= limit || this.aborted) break;
      }
    }
    return this.count;
  }

  dfs(k, head) {
    const { n, board, value, pos } = this;
    if (k === n) {
      this.count++;
      if (!this.solution) this.solution = Array.from(value);
      return;
    }
    if (++this.nodes > this.nodeLimit) { this.aborted = true; return; }
    const k1 = k + 1;
    if (this.isGiven[k1]) {
      const g = pos[k1];
      if (board.adjacent(head, g) && this.aliveAround(head)) this.dfs(k1, g);
      return;
    }
    const ng = this.nextGivenAbove[k1];
    const target = ng ? pos[ng] : -1;
    const budget = ng - k1;
    if (!this.coverageOk(k, head)) return;

    let forced = -1;
    if (pos[n] !== -1) {
      for (const f of board.neighbors[head]) {
        if (value[f]) continue;
        const a = this.availability(f, 3);
        if (a < 2) return;
        if (a === 2) {
          if (forced !== -1) return;
          forced = f;
        }
      }
    }
    for (const c of board.neighbors[head]) {
      if (value[c]) continue;
      if (forced !== -1 && c !== forced) continue;
      if (target >= 0 && board.dist(c, target) > budget) continue;
      value[c] = k1; pos[k1] = c;
      if (this.aliveAround(head) && this.placedNeighboursOk(c)) this.dfs(k1, c);
      value[c] = 0; pos[k1] = -1;
      if (this.count >= this.limit || this.aborted) return;
    }
  }

  coverageOk(k, head) {
    const { n, board, value, pos, maxCoverEnd } = this;
    const curEnd = this.nextGivenAbove[k] === 0 ? n + 1 : this.nextGivenAbove[k];
    const room = curEnd === n + 1 ? n - k : curEnd - k - 1;
    const target = curEnd <= n ? pos[curEnd] : -1;
    let onlyHere = 0;
    for (let f = 0; f < n; f++) {
      if (value[f] || maxCoverEnd[f] > curEnd) continue;
      const d = board.dist(head, f);
      const ok = target >= 0 ? d + board.dist(f, target) <= curEnd - k : d <= n - k;
      if (!ok) return false;
      if (++onlyHere > room) return false;
    }
    return true;
  }

  placedNeighboursOk(c) {
    const { n, board, value, pos } = this;
    for (const g of board.neighbors[c]) {
      const v = value[g];
      if (!v) continue;
      let req = 0;
      if (v > 1 && pos[v - 1] === -1) req++;
      if (v < n && pos[v + 1] === -1) req++;
      if (!req) continue;
      let free = 0;
      for (const nb of board.neighbors[g]) if (!value[nb] && ++free >= req) break;
      if (free < req) return false;
    }
    return true;
  }

  aliveAround(closed) {
    const needed = this.pos[this.n] === -1 ? 1 : 2;
    for (const f of this.board.neighbors[closed]) {
      if (this.value[f]) continue;
      if (this.availability(f, needed) < needed) return false;
    }
    return true;
  }

  availability(f, needed) {
    const { n, value, pos } = this;
    let a = 0;
    for (const nb of this.board.neighbors[f]) {
      const v = value[nb];
      if (v === 0 || (v < n && pos[v + 1] === -1) || (v > 1 && pos[v - 1] === -1)) {
        if (++a >= needed) return a;
      }
    }
    return a;
  }
}

/** Small seeded PRNG (mulberry32). */
export function rng(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle(arr, rand) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

/** Random Hamiltonian king-path via backbite moves from a serpentine. */
export function randomPath(board, rand) {
  const n = board.size, w = board.width;
  const path = new Int32Array(n);
  let i = 0;
  for (let y = 0; y < board.height; y++) {
    if (y % 2 === 0) for (let x = 0; x < w; x++) path[i++] = y * w + x;
    else for (let x = w - 1; x >= 0; x--) path[i++] = y * w + x;
  }
  const idx = new Int32Array(n);
  for (let j = 0; j < n; j++) idx[path[j]] = j;
  const reverse = (from, to) => {
    for (let a = from, b = to; a < b; a++, b--) {
      const t = path[a]; path[a] = path[b]; path[b] = t;
      idx[path[a]] = a; idx[path[b]] = b;
    }
  };
  for (let s = 0; s < n * 60; s++) {
    if (rand() < 0.5) {
      const nb = board.neighbors[path[0]];
      const j = idx[nb[Math.floor(rand() * nb.length)]];
      if (j > 1) reverse(0, j - 1);
    } else {
      const nb = board.neighbors[path[n - 1]];
      const j = idx[nb[Math.floor(rand() * nb.length)]];
      if (j < n - 2) reverse(j + 1, n - 1);
    }
  }
  return path;
}

const TARGET = { EASY: 0.5, MEDIUM: 0.42, HARD: 0.37, CHALLENGING: 0 };

/** Generates a puzzle with a unique solution; 1 and N are always given. */
export function generate(width, height, level, seed, isCancelled = () => false) {
  const board = Board.of(width, height);
  const n = board.size;
  const rand = rng(seed);
  const target = Math.max(2, Math.round(n * TARGET[level]));
  const attempts = level === 'CHALLENGING' ? 2 : 4;
  let best = null;
  for (let a = 0; a < attempts; a++) {
    const p = attempt(board, target, rand, isCancelled);
    if (!best || p.clues < best.clues) best = p;
    if (isCancelled()) break;
    if (level !== 'CHALLENGING' && p.clues <= target + 1) break;
  }
  return { width, height, level, givens: best.givens, solution: best.solution };
}

function attempt(board, target, rand, isCancelled) {
  const n = board.size;
  const path = randomPath(board, rand);
  const solution = new Array(n);
  for (let j = 0; j < n; j++) solution[path[j]] = j + 1;
  const givens = solution.slice();
  let clues = n;
  const order = shuffle([...Array(n).keys()].filter(c => solution[c] !== 1 && solution[c] !== n), rand);
  for (const c of order) {
    if (clues <= target || isCancelled()) break;
    givens[c] = 0;
    const s = new Solver(board, givens, 120_000);
    if (s.countSolutions(2) === 1 && !s.aborted) clues--; else givens[c] = solution[c];
  }
  return { givens, solution, clues };
}

/** Rule-based check: 'INCOMPLETE' | 'WRONG' | 'CORRECT'. */
export function check(width, height, givens, values) {
  const board = Board.of(width, height);
  const n = board.size;
  if (values.some(v => !v)) return 'INCOMPLETE';
  const pos = new Int32Array(n + 1).fill(-1);
  for (let c = 0; c < n; c++) {
    const v = values[c];
    if (v < 1 || v > n) return 'WRONG';
    if (givens[c] && givens[c] !== v) return 'WRONG';
    if (pos[v] !== -1) return 'WRONG';
    pos[v] = c;
  }
  for (let k = 1; k < n; k++) if (!board.adjacent(pos[k], pos[k + 1])) return 'WRONG';
  return 'CORRECT';
}
