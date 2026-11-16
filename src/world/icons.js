import * as THREE from 'three';

// Ícones em caixa 24×24, só com traço. Os mesmos caminhos servem para o
// DOM (componente <Icon/>) e para as texturas das peças 3D.

const roundRect = (x, y, w, h, r) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1-${r} ${r}h-${w - 2 * r}a${r} ${r} 0 0 1-${r}-${r}v-${h - 2 * r}a${r} ${r} 0 0 1 ${r}-${r}Z`;

const circle = (cx, cy, r) => `M${cx + r} ${cy}a${r} ${r} 0 1 1-${2 * r} 0a${r} ${r} 0 1 1 ${2 * r} 0Z`;

export const ICONS = {
  code: 'M8 7 3 12l5 5M16 7l5 5-5 5M13.6 5.5 10.4 18.5',
  api: 'M9 4.5c-2 0-3 .8-3 2.6v2.3c0 1.4-.7 2.2-2 2.6 1.3.4 2 1.2 2 2.6v2.3c0 1.8 1 2.6 3 2.6M15 4.5c2 0 3 .8 3 2.6v2.3c0 1.4.7 2.2 2 2.6-1.3.4-2 1.2-2 2.6v2.3c0 1.8-1 2.6-3 2.6',
  database: 'M5 6a7 2.6 0 1 0 14 0a7 2.6 0 1 0-14 0M5 6v12a7 2.6 0 0 0 14 0V6M5 12a7 2.6 0 0 0 14 0',
  chart: 'M4 20h16M7.5 16.5V12M12 16.5v-10M16.5 16.5v-7',
  cursor: 'M5.5 4.5 19 11l-6.4 1.9L10 19.2Z',
  nodes: `${circle(12, 5.5, 2.4)}${circle(5.5, 17.5, 2.4)}${circle(18.5, 17.5, 2.4)}M10.8 7.6 6.7 15.4M13.2 7.6l4.1 7.8M7.9 17.5h8.2`,
  terminal: `${roundRect(3, 4.5, 18, 15, 2.6)}M7 9.5l3 2.5-3 2.5M12.5 14.5H17`,
  layers: 'M12 3.5 20.5 8 12 12.5 3.5 8ZM3.5 12l8.5 4.5 8.5-4.5M3.5 16l8.5 4.5 8.5-4.5',
  loop: 'M4.89 10.87A7.2 7.2 0 0 1 18.42 8.73M15.6 3.6l2.3 3-3.3 1.6M19.11 13.13A7.2 7.2 0 0 1 5.58 15.27M8.4 20.4l-2.3-3 3.3-1.6',
  dashboard: `${roundRect(4, 4, 7, 7, 1.6)}${roundRect(13, 4, 7, 7, 1.6)}${roundRect(4, 13, 7, 7, 1.6)}M16.5 13.5v6M13.5 16.5h6`,
  plug: 'M9 3.5V8M15 3.5V8M6 8h12v3a6 6 0 0 1-12 0ZM12 17v4',
  shield: 'M12 3l7.5 2.8V11c0 5-3.5 8.4-7.5 10-4-1.6-7.5-5-7.5-10V5.8ZM8.7 12l2.3 2.3 4.4-4.7',
  cloud: 'M7 18.5C3.8 18.5 2.6 14.2 5.3 12.6 5.1 8.8 9.6 6.6 12.4 8.9 14.2 5.4 19.8 6.6 19.6 11.2 22.4 12.2 21.8 18.5 17.6 18.5Z',
  bolt: 'M13.5 2.8 5.5 13.2h6.1l-1.1 8 8-10.4h-6.1Z',
  spark: 'M11 5c.5 4.3 2.7 6.5 7 7-4.3.5-6.5 2.7-7 7-.5-4.3-2.7-6.5-7-7 4.3-.5 6.5-2.7 7-7ZM18.5 3v3.4M16.8 4.7h3.4',
  pin: `M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z${circle(12, 10, 2.4)}`,
  cap: 'M2.8 9.2 12 5l9.2 4.2L12 13.4ZM6.5 11.3v4.2c1.6 1.6 3.4 2.3 5.5 2.3s3.9-.7 5.5-2.3v-4.2M21.2 9.2v5',
};

// Monograma "AL" em um espaço 64×64: um A sem barra, um L e o ponto dourado.
export const MARK = {
  a: [
    [6, 48],
    [19, 16],
    [32, 48],
  ],
  l: [
    [41, 16],
    [41, 48],
    [58, 48],
  ],
  dot: [19, 42.6],
  dotRadius: 3.4,
  stroke: 7.5,
};

const polyline = (points) => points.map(([x, y], i) => `${i ? 'L' : 'M'}${x} ${y}`).join('');
export const MARK_PATHS = [polyline(MARK.a), polyline(MARK.l)];

function drawMark(ctx, stroke, dot) {
  const k = 16.5 / 52;
  const map = ([x, y]) => [(x - 6) * k + 3.75, (y - 16) * k + (24 - 32 * k) / 2];
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 7 * k;
  [MARK.a, MARK.l].forEach((points) => {
    ctx.beginPath();
    points.map(map).forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.stroke();
  });
  const [dx, dy] = map(MARK.dot);
  ctx.fillStyle = dot;
  ctx.beginPath();
  ctx.arc(dx, dy, 3.2 * k, 0, Math.PI * 2);
  ctx.fill();
}

export function drawIcon(ctx, name, stroke, dot = '#C9A227') {
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.strokeStyle = stroke;
  ctx.lineWidth = 1.75;
  if (name === 'mark') drawMark(ctx, stroke, dot);
  else ctx.stroke(new Path2D(ICONS[name]));
}

const cache = new Map();

export function iconTexture(name, stroke, dot = '#C9A227') {
  const key = `${name}:${stroke}:${dot}`;
  const cached = cache.get(key);
  if (cached) return cached;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d');
  ctx.scale(256 / 24, 256 / 24);
  drawIcon(ctx, name, stroke, dot);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  cache.set(key, texture);
  return texture;
}

export function disposeIconTextures() {
  cache.forEach((texture) => texture.dispose());
  cache.clear();
}
