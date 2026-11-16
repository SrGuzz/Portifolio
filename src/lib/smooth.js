import gsap from 'gsap';
import Lenis from 'lenis';
import { prefersReduced } from './env';

// Rolagem suave (Lenis) sincronizada com o ticker do GSAP,
// mais navegação por teclado com inércia.

const HOLD_SPEED = 0.62; // alturas de tela por segundo com a seta pressionada
const TAP_KICK = 0.28;
const ACCEL = 3.6;
const BRAKE = 3.4;
const KEY_LERP = 0.085;
const PAGE_STEP = 0.85;
const PAGE_DURATION = 1.15;

const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2);

let lenis = null;

const isTyping = (el) =>
  !!el && el.matches('input, textarea, select, [contenteditable=""], [contenteditable="true"]');

const isInteractive = (el) =>
  !!el &&
  el !== document.body &&
  el.matches('button, a[href], summary, label, [role="button"], input, textarea, select');

function bindKeyboard(instance) {
  const held = { down: false, up: false };
  let velocity = 0;

  const release = () => {
    held.down = held.up = false;
  };

  const page = (direction) => {
    const target = instance.targetScroll + direction * window.innerHeight * PAGE_STEP;
    instance.scrollTo(target, { programmatic: false, duration: PAGE_DURATION, easing: easeInOutCubic });
  };

  const onKeyDown = (event) => {
    if (
      event.defaultPrevented ||
      event.altKey ||
      event.ctrlKey ||
      event.metaKey ||
      instance.isStopped ||
      isTyping(document.activeElement)
    ) {
      return;
    }
    const max = window.innerHeight * HOLD_SPEED;
    switch (event.key) {
      case 'ArrowDown':
      case 'ArrowUp': {
        event.preventDefault();
        const down = event.key === 'ArrowDown';
        if (event.repeat) return;
        if (down) held.down = true;
        else held.up = true;
        const sign = down ? 1 : -1;
        if (Math.sign(velocity) !== sign || Math.abs(velocity) < max * TAP_KICK) {
          velocity = sign * max * TAP_KICK;
        }
        break;
      }
      case 'PageDown':
      case 'PageUp':
        event.preventDefault();
        if (!event.repeat) page(event.key === 'PageDown' ? 1 : -1);
        break;
      case ' ':
        if (isInteractive(document.activeElement)) return;
        event.preventDefault();
        if (!event.repeat) page(event.shiftKey ? -1 : 1);
        break;
      case 'Home':
      case 'End':
        event.preventDefault();
        if (!event.repeat) {
          instance.scrollTo(event.key === 'Home' ? 0 : instance.limit, {
            programmatic: false,
            duration: 2.4,
            easing: easeInOutCubic,
          });
        }
        break;
      default:
    }
  };

  const onKeyUp = (event) => {
    if (event.key === 'ArrowDown') held.down = false;
    if (event.key === 'ArrowUp') held.up = false;
  };

  const tick = (_time, deltaMs) => {
    const dt = Math.min(0.05, deltaMs / 1000);
    if (instance.isStopped) {
      velocity = 0;
      release();
      return;
    }
    const goal = ((held.down ? 1 : 0) - (held.up ? 1 : 0)) * window.innerHeight * HOLD_SPEED;
    if (goal === 0 && velocity === 0) return;
    const rate = goal === 0 ? BRAKE : ACCEL;
    velocity += (goal - velocity) * (1 - Math.exp(-dt * rate));
    if (goal === 0 && Math.abs(velocity) < 4) {
      velocity = 0;
      return;
    }
    const next = instance.targetScroll + velocity * dt;
    if ((next <= 0 && velocity < 0) || (next >= instance.limit && velocity > 0)) velocity = 0;
    instance.scrollTo(next, { programmatic: false, lerp: KEY_LERP });
  };

  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
  window.addEventListener('blur', release);
  document.addEventListener('visibilitychange', release);
  gsap.ticker.add(tick);

  return () => {
    window.removeEventListener('keydown', onKeyDown);
    window.removeEventListener('keyup', onKeyUp);
    window.removeEventListener('blur', release);
    document.removeEventListener('visibilitychange', release);
    gsap.ticker.remove(tick);
  };
}

export function startSmoothScroll() {
  if (lenis || prefersReduced()) return () => {};

  lenis = new Lenis({ lerp: 0.085, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 1.2 });
  const raf = (time) => lenis?.raf(time * 1000);
  gsap.ticker.add(raf);
  gsap.ticker.lagSmoothing(0);
  const unbindKeyboard = bindKeyboard(lenis);

  return () => {
    unbindKeyboard();
    gsap.ticker.remove(raf);
    lenis?.destroy();
    lenis = null;
  };
}

export const getLenis = () => lenis;

/** Trava ou libera a rolagem (loader, menu e painel de contato). */
export function lockScroll(locked) {
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
  document.documentElement.classList.toggle('is-locked', locked);
}
