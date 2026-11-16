import * as THREE from 'three';

// Formações das peças e roteiro da câmera ao longo da jornada.
// Cada formação é uma função (índice, contexto, saída) que escreve
// posição, rotação e escala de uma peça.

export const FLOOR_Y = -1.6;
const TAU = Math.PI * 2;
const RING_TILT = 0.42;

// Peças que formam os nós da trajetória e peças que não são douradas.
export const PATH_TILES = 4;
export const INK_TILE = 4;
export const PAPER_TILE = 8;

/* ---------- utilidades ---------- */

function mulberry(seed) {
  let s = seed;
  return () => {
    s = (s + 1831565813) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry(20261116);
// Tabela fixa de números aleatórios: as formações são sempre as mesmas.
const R = Array.from({ length: 64 }, () => Array.from({ length: 10 }, () => rand()));

const euler = new THREE.Euler(0, 0, 0, 'YXZ');
const qa = new THREE.Quaternion();
const qb = new THREE.Quaternion();
const AXIS_X = new THREE.Vector3(1, 0, 0);
const AXIS_Y = new THREE.Vector3(0, 1, 0);

function put(out, x, y, z, rx, ry, rz, scale) {
  out.p.set(x, y, z);
  euler.set(rx, ry, rz, 'YXZ');
  out.q.setFromEuler(euler);
  out.s = scale;
  out.icon = 1;
}

const fract = (v) => v - Math.floor(v);
const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const widthFactor = (ctx) => clamp(ctx.aspect / 1.78, 0.5, 1.25);

/* ---------- formações ---------- */

/** Anel inclinado girando devagar em torno do logo. */
function ring(phase, { center, r, s }) {
  return (i, ctx, out) => {
    const angle = phase + ctx.t * 0.1 + (i / ctx.n) * TAU;
    const lx = Math.sin(angle) * r;
    const lz = Math.cos(angle) * r;
    out.p.set(center[0] + lx, center[1] - lz * Math.sin(RING_TILT), center[2] + lz * Math.cos(RING_TILT));
    qa.setFromAxisAngle(AXIS_X, RING_TILT);
    qb.setFromAxisAngle(AXIS_Y, angle);
    out.q.copy(qa).multiply(qb);
    out.s = s;
    out.icon = 1;
  };
}

/** Moldura: as peças contornam a tela e deixam o centro livre para o texto. */
function frame(seed) {
  return (i, ctx, out) => {
    const r = R[(i + seed * 11) % 64];
    const tall = ctx.aspect < 1.15;
    const ex = ctx.hw * (tall ? 0.78 : 0.87);
    const ey = ctx.hh * (tall ? 0.7 : 0.7);
    const lift = -ctx.hh * 0.06; // desce a moldura para livrar o cabeçalho
    const scale = tall ? clamp(ctx.hw * 0.26, 0.42, 0.7) : clamp(ctx.hw * 0.16, 0.6, 0.9);
    let x;
    let y;
    if (tall) {
      // em telas altas, só faixas em cima e embaixo
      const half = Math.ceil(ctx.n / 2);
      const top = i % 2 === 0;
      const k = Math.floor(i / 2);
      const cols = Math.ceil(half / 2);
      x = -ex + ((k % cols) + (k >= cols ? 0.5 : 0)) * ((ex * 2) / cols) + ex / cols / 2;
      y = (top ? 1 : -1) * (ey - (k >= cols ? scale * 1.25 : 0));
    } else {
      const perimeter = 4 * (ex + ey);
      let d = fract(i / ctx.n + 0.035 + seed * 0.021) * perimeter;
      if (d < 2 * ex) {
        x = -ex + d;
        y = ey;
      } else if ((d -= 2 * ex) < 2 * ey) {
        x = ex;
        y = ey - d;
      } else if ((d -= 2 * ey) < 2 * ex) {
        x = ex - d;
        y = -ey;
      } else {
        x = -ex;
        y = -ey + (d - 2 * ex);
      }
    }
    put(
      out,
      x + (r[0] - 0.5) * 0.45,
      y + lift + (r[1] - 0.5) * 0.4,
      (r[2] - 0.5) * 1.4,
      (r[3] - 0.5) * 0.6,
      (r[4] - 0.5) * 0.7,
      (r[5] - 0.5) * 0.5,
      scale,
    );
  };
}

/** Duas fileiras, em cima e embaixo, para o manifesto. */
function rows() {
  return (i, ctx, out) => {
    const r = R[(i + 23) % 64];
    const tall = ctx.aspect < 1.15;
    const half = Math.ceil(ctx.n / 2);
    const top = i % 2 === 0;
    const k = Math.floor(i / 2);
    const ex = ctx.hw * 0.9;
    const scale = tall ? clamp(ctx.hw * 0.24, 0.4, 0.66) : clamp(ctx.hw * 0.15, 0.6, 0.86);
    const cols = tall ? Math.ceil(half / 2) : half;
    const col = k % cols;
    const second = k >= cols;
    const x = -ex + (col + 0.5 + (second ? 0.5 : 0)) * ((ex * 2) / cols);
    const y = (top ? 1 : -1) * (ctx.hh * 0.66 - (second ? scale * 1.3 : 0)) - ctx.hh * 0.05;
    put(
      out,
      x + (r[0] - 0.5) * 0.25,
      y + (r[1] - 0.5) * 0.3,
      (r[2] - 0.5) * 1,
      (r[3] - 0.5) * 0.4 + (top ? 0.12 : -0.12),
      (r[4] - 0.5) * 0.6,
      (r[5] - 0.5) * 0.3,
      scale,
    );
  };
}

/** Peças soltas ao fundo, atrás dos cartões. */
function backdrop(depth) {
  return (i, ctx, out) => {
    const r = R[(i + 31) % 64];
    put(
      out,
      (r[0] - 0.5) * 19 * widthFactor(ctx),
      0.5 + r[1] * 2.8 + depth * 1.2,
      -1.4 - r[2] * 7 - depth * 2,
      (r[3] - 0.5) * 2.4 - 0.5,
      (r[4] - 0.5) * 3,
      (r[5] - 0.5) * 1.6,
      0.82,
    );
  };
}

/** Peças deitadas no piso, vistas de cima. */
function onFloor(side = 'both', seed = 0) {
  return (i, ctx, out) => {
    const r = R[(i + 7 + seed * 13) % 64];
    let x = (r[0] - 0.5) * 22 * widthFactor(ctx);
    const z = 3 - r[1] * 18;
    if (Math.abs(x) < 3.6) x += Math.sign(x || 1) * 3.6;
    if (side === 'right') x = Math.abs(x) * 0.8 + 2.4 * widthFactor(ctx);
    put(out, x, FLOOR_Y + 0.14, z, -Math.PI / 2 + (r[2] - 0.5) * 0.12, r[3] * TAU, 0, 0.9);
  };
}

const PATH_WIDE = [
  [-4.3, 1.2],
  [-1.5, -0.2],
  [1.5, 1.6],
  [4.3, 0.1],
];
const PATH_MOBILE = [
  [-1.25, 4.2],
  [0.95, 2.5],
  [-1.05, 0.8],
  [1.1, -0.9],
];

/** Pontos (x, z) da linha da trajetória sobre o piso. */
export function pathPoints(mobile, aspect) {
  if (mobile) return PATH_MOBILE.map(([x, z]) => [x, z]);
  const k = clamp(aspect / 1.78, 0.55, 1);
  return PATH_WIDE.map(([x, z]) => [x * k, z]);
}

/** As quatro primeiras peças marcam a trajetória; o resto fica ao longe. */
function path(i, ctx, out) {
  if (i < PATH_TILES) {
    const [x, z] = pathPoints(ctx.mobile, ctx.aspect)[i];
    put(out, x, FLOOR_Y + 0.62, z, -0.62, 0, 0, ctx.mobile ? 0.82 : 1.08);
    return;
  }
  const r = R[(i + 41) % 64];
  put(
    out,
    (r[0] - 0.5) * 30 * widthFactor(ctx),
    FLOOR_Y + 0.14,
    -9 - r[1] * 14,
    -Math.PI / 2,
    r[2] * TAU,
    0,
    0.8,
  );
}

/** Onde o conjunto de peças fica durante os passos da trajetória. */
function clusterBox(ctx) {
  if (ctx.mobile) return { x: 0, y: ctx.hh * 0.56, unit: clamp(ctx.hw * 0.24, 0.34, 0.56) };
  return { x: ctx.hw * 0.55, y: 0.3, unit: clamp(ctx.hw * 0.13, 0.5, 0.78) };
}

const GRID_COLS = 5;

function jumble(i, ctx, out) {
  const r = R[(i + 17) % 64];
  const box = clusterBox(ctx);
  const rowsCount = Math.ceil(ctx.n / GRID_COLS);
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS);
  put(
    out,
    box.x + (col - (GRID_COLS - 1) / 2) * box.unit * 1.1 + (r[0] - 0.5) * box.unit * 0.9,
    box.y + ((rowsCount - 1) / 2 - row) * box.unit * 1.1 + (r[1] - 0.5) * box.unit * 0.9,
    (r[2] - 0.5) * 2.6,
    (r[3] - 0.5) * 1.3,
    (r[4] - 0.5) * 1.5,
    (r[5] - 0.5) * 1.2,
    box.unit * 0.92,
  );
}

function grid(i, ctx, out) {
  const box = clusterBox(ctx);
  const rowsCount = Math.ceil(ctx.n / GRID_COLS);
  const col = i % GRID_COLS;
  const row = Math.floor(i / GRID_COLS);
  put(
    out,
    box.x + (col - (GRID_COLS - 1) / 2) * box.unit * 1.08,
    box.y + ((rowsCount - 1) / 2 - row) * box.unit * 1.08,
    0,
    0,
    -0.22,
    0,
    box.unit * 0.94,
  );
}

/** Esteira: as peças correm em onda da esquerda para a direita. */
function flow(i, ctx, out) {
  const box = clusterBox(ctx);
  const v = fract(i / ctx.n + ctx.t * 0.03);
  const size = Math.sin(v * Math.PI) ** 0.6;
  const span = box.unit * 6.4;
  put(
    out,
    box.x + (v - 0.5) * span,
    box.y + Math.sin(v * TAU * 1.5) * box.unit * 1.1,
    Math.cos(v * TAU * 1.5) * 0.8,
    0,
    (v - 0.5) * 1.3,
    Math.sin(v * TAU) * 0.25,
    Math.max(0.001, box.unit * 0.95 * size),
  );
}

// Monograma "AL" montado com as peças douradas: [coluna, linha].
const MARK_CELLS = [
  // A
  [0, 0],
  [2, 0],
  [0, 1],
  [2, 1],
  [0, 2],
  [1, 2],
  [2, 2],
  [0, 3],
  [2, 3],
  [1, 4],
  // L
  [4, 4],
  [4, 3],
  [4, 2],
  [4, 1],
  [4, 0],
  [5, 0],
  [6, 0],
];
const MARK_DOT = [7.25, -0.22];

function mark(i, ctx, out) {
  const box = clusterBox(ctx);
  const cell = box.unit * 0.74;
  const originX = box.x - 3.6 * cell;
  const originY = box.y - 2 * cell;
  if (i === INK_TILE || i === PAPER_TILE) {
    put(out, box.x, box.y, -3, 0, 0, 0, 0.001);
    out.icon = 0;
    return;
  }
  // índice entre as peças douradas (pula as duas que não são)
  const g = i - (i > INK_TILE ? 1 : 0) - (i > PAPER_TILE ? 1 : 0);
  if (g < MARK_CELLS.length) {
    const [col, row] = MARK_CELLS[g];
    put(out, originX + col * cell, originY + row * cell, 0, 0, -0.26, 0, cell * 0.98);
  } else {
    put(out, originX + MARK_DOT[0] * cell, originY + MARK_DOT[1] * cell, 0.1, 0, -0.26, 0, cell * 0.52);
  }
  out.icon = 0;
}

/** Peças espalhadas, deixando a faixa central livre para a frase. */
function explode(i, ctx, out) {
  const r = R[(i + 53) % 64];
  let y = (r[1] - 0.5) * 2.1 * ctx.hh;
  const band = ctx.hh * 0.36;
  if (Math.abs(y) < band) y = Math.sign(y || 1) * (band + Math.abs(y) * 0.7);
  put(
    out,
    (r[0] - 0.5) * 2.3 * ctx.hw,
    y,
    (r[2] - 0.5) * 6,
    (r[3] - 0.5) * 2.6,
    (r[4] - 0.5) * 3,
    (r[5] - 0.5) * 2,
    ctx.mobile ? 0.55 : 0.78,
  );
}

/* ---------- roteiro ---------- */

const LOGO_HIDDEN = { p: [0, 0.35, -5], s: 0.35, o: 0 };

function makeStop(J, f, changes, previous) {
  return {
    J,
    f,
    cam: changes.cam ?? previous.cam,
    logo: changes.logo ?? previous.logo,
    theme: changes.theme ?? previous.theme,
    curve: changes.curve ?? previous.curve,
    floor: changes.floor ?? previous.floor,
    beam: changes.beam ?? previous.beam,
    line: changes.line ?? previous.line,
    wobble: changes.wobble ?? previous.wobble,
  };
}

/** Ponto do mundo que aparece em (nx, ny) da tela, a uma dada profundidade. */
function pointOnScreen(cam, view, nx, ny, depth) {
  const position = new THREE.Vector3(...cam.p);
  const forward = new THREE.Vector3(...cam.t).sub(position).normalize();
  const right = new THREE.Vector3().crossVectors(forward, AXIS_Y).normalize();
  const up = new THREE.Vector3().crossVectors(right, forward);
  const halfH = depth * Math.tan(THREE.MathUtils.degToRad(view.fov / 2));
  return position
    .addScaledVector(forward, depth)
    .addScaledVector(right, nx * halfH * view.aspect)
    .addScaledVector(up, ny * halfH)
    .toArray();
}

/**
 * Monta as paradas da jornada para o tamanho de tela atual.
 * `slots.contact` é o retângulo (px) reservado ao anel na cena de contato.
 */
export function buildStops(view, slots = {}) {
  const { mobile, width, height } = view;
  const tileFit = (r, max) => Math.min(max, (TAU * r) / (view.tiles * 1.32));

  // abertura: anel em torno do logo
  const heroCam = { p: [0, 1.9, 14], t: [0, 0.25, 0] };
  const heroR = mobile ? 2.6 : 4.6;
  const hero = { center: [0, 0.2, 0], r: heroR, s: tileFit(heroR, mobile ? 0.72 : 1) };
  const heroLogo = { p: [0, 0.35, 0], s: mobile ? 0.6 : 1.04, o: 1 };

  // contato: anel menor, encaixado no espaço livre da cena
  const contactCam = { p: [0, 3, 12.5], t: [0, 0.5, 0] };
  const slot = slots.contact ?? {
    x: width * 0.52,
    y: height * 0.12,
    width: width * 0.44,
    height: height * 0.55,
  };
  const depth = 13;
  const halfH = depth * Math.tan(THREE.MathUtils.degToRad(view.fov / 2));
  const slotW = (slot.width / width) * 2 * halfH * view.aspect;
  const slotH = (slot.height / height) * 2 * halfH;
  const contactR = clamp(Math.min(slotW * 0.4, slotH * 0.72), 1.1, 3.4);
  const contactCenter = pointOnScreen(
    contactCam,
    view,
    ((slot.x + slot.width / 2) / width) * 2 - 1,
    1 - ((slot.y + slot.height / 2) / height) * 2,
    depth,
  );
  const contact = { center: contactCenter, r: contactR, s: tileFit(contactR, clamp(contactR / 3.3, 0.5, 1)) };
  const contactLogo = { p: contactCenter, s: clamp(contactR / 4.4, 0.24, 0.8), o: 1 };

  const frontCam = { p: [0, 0, 10], t: [0, 0, 0] };
  const stepsCam = { p: [0, 0.3, 10], t: [0, 0.3, 0] };
  const pathCam = mobile
    ? { p: [0, 8.4, 10.4], t: [0, 0.2, 0.9] }
    : { p: [0, 6.8, 8.6], t: [0, -0.15, -0.4] };

  const stops = [];
  const add = (J, f, changes = {}) => stops.push(makeStop(J, f, changes, stops[stops.length - 1] ?? {}));

  add(0, ring(0, hero), {
    cam: heroCam,
    logo: heroLogo,
    theme: 0,
    curve: 0.03,
    floor: 1,
    beam: 1,
    line: 0,
    wobble: 1,
  });
  add(0.82, ring(1.5, hero), { cam: { p: [0, 2.6, 12.4], t: [0, 0.2, 0] } });

  // sobre e manifesto
  add(1.1, frame(0), { cam: frontCam, logo: LOGO_HIDDEN, curve: 0.018, floor: 0.35, beam: 0.75 });
  add(1.28, frame(0));
  add(1.36, rows(), { cam: { p: [0, 0.2, 9.4], t: [0, 0, 0] } });
  add(1.555, rows());

  // o que eu faço
  add(1.64, backdrop(0), { cam: { p: [0, 3.2, 9], t: [0, -0.4, -4] }, curve: 0.004, floor: 1, beam: 0.9 });
  add(1.9, backdrop(1), { cam: { p: [0, 3.8, 8], t: [0, -0.4, -5] } });

  // projetos (tema claro)
  add(2.03, onFloor(), { cam: { p: [0, 5.6, 8.2], t: [0, -1.6, -3] }, theme: 1, curve: 0.002, floor: 0.9, beam: 0 });
  add(2.2, onFloor());
  add(2.32, onFloor('right'), { cam: { p: [0, 5.9, 7.4], t: [0, -1.6, -4.2] } });
  add(3.48, onFloor('right'), { cam: { p: [0, 6.2, 6.4], t: [0, -1.6, -5.5] } });
  add(3.57, backdrop(2), { cam: { p: [0, 6.6, 7.6], t: [0, -1.4, -3] } });

  // trajetória
  add(3.66, path, { cam: pathCam, theme: 0, floor: 1, beam: 0.8, line: 0 });
  add(3.78, path, { line: 1 });
  add(3.85, jumble, { cam: stepsCam, floor: 0.45, line: 0 });
  add(3.96, jumble);
  add(4.02, grid);
  add(4.12, grid);
  add(4.18, flow, { beam: 1.35 });
  add(4.28, flow);
  add(4.34, mark, { beam: 0.8, wobble: 0.25 });
  add(4.43, mark);
  add(4.49, explode, { cam: { p: [0, 1.1, 10], t: [0, -0.2, 0] }, wobble: 1 });
  add(4.57, explode);

  // stack
  add(4.68, onFloor('both', 1), { cam: { p: [0, 10.5, 6.6], t: [0, 0.9, -1.6] }, floor: 1, beam: 0.6, wobble: 0.2 });
  add(5, onFloor('both', 1), { cam: { p: [0, 10, 5.8], t: [0, 0.6, -1.6] } });
  add(5.15, onFloor('both', 1), { cam: { p: [0, 6.5, 4.6], t: [0, -1.6, -2] } });
  add(5.45, onFloor('both', 1));

  // contato
  add(5.6, ring(2.2, contact), { cam: contactCam, logo: contactLogo, curve: 0.03, floor: 0.9, beam: 1.2, wobble: 1 });
  add(6.6, ring(2.2, contact));

  return stops;
}
