import { generate } from './core.js';

self.onmessage = (e) => {
  const { id, width, height, level, seed } = e.data;
  const p = generate(width, height, level, seed);
  self.postMessage({ id, puzzle: p });
};
