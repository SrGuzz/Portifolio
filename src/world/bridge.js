// Ponte entre as cenas (React) e o motor 3D. As cenas podem reservar
// espaço na tela, fixar rótulos e disparar a entrada antes mesmo de o
// motor existir; o que foi pedido fica guardado e é aplicado na conexão.

let engine = null;
let labels = [];
let slots = {};
let introRequested = false;

export function connectEngine(next) {
  engine = next;
  if (!engine) return;
  engine.bindLabels(labels);
  Object.entries(slots).forEach(([name, rect]) => engine.setSlot(name, rect ?? null));
  if (introRequested) engine.playIntro();
}

export function setWorldSlot(name, rect) {
  slots = { ...slots, [name]: rect };
  engine?.setSlot(name, rect);
}

export function bindWorldLabels(next) {
  labels = next;
  engine?.bindLabels(next);
}

export function playWorldIntro() {
  introRequested = true;
  engine?.playIntro();
}
