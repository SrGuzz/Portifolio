// Efeito "decodificar": o texto se revela da esquerda para a direita
// enquanto o restante aparece como ruído em caracteres monoespaçados.

const GLYPHS = 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#%&*+=/<>';

function hash(a, b) {
  let n = Math.imul(a, 374761393) ^ Math.imul(b + 1, 668265263);
  n = Math.imul(n ^ (n >>> 13), 1274126177);
  return (n ^ (n >>> 16)) >>> 0;
}

/** Prepara o elemento: um nó com o texto pronto e um <span> com o ruído. */
export function createDecoder(element, text, noiseClass = 'decode-noise') {
  const done = document.createTextNode(text);
  const noiseWrap = document.createElement('span');
  noiseWrap.className = noiseClass;
  noiseWrap.setAttribute('aria-hidden', 'true');
  const noise = document.createTextNode('');
  noiseWrap.appendChild(noise);
  element.replaceChildren(done, noiseWrap);
  return { text, done, noise };
}

/** Atualiza o decodificador para um progresso entre 0 e 1. */
export function renderDecoder(decoder, progress) {
  const { text } = decoder;
  const length = text.length;
  const p = Math.min(1, Math.max(0, progress));
  const revealed = Math.round(Math.min(1, Math.max(0, (p - 0.15) / 0.85)) * length);
  const frame = Math.floor(p * (length * 2 + 4));
  let noise = '';
  for (let i = revealed; i < length; i++) {
    noise += text[i] === ' ' ? ' ' : GLYPHS[hash(i, frame) % GLYPHS.length];
  }
  const head = text.slice(0, revealed);
  if (decoder.done.data !== head) decoder.done.data = head;
  if (decoder.noise.data !== noise) decoder.noise.data = noise;
}
