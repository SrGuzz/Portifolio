import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { SplitText } from 'gsap/SplitText';
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin';
import { TextPlugin } from 'gsap/TextPlugin';
import { prefersReduced } from './env';
import { journey } from './journey';
import { createDecoder, renderDecoder } from './decode';

gsap.registerPlugin(useGSAP, SplitText, DrawSVGPlugin, TextPlugin);
gsap.defaults({ ease: 'expo.out', duration: 1 });

// Blocos de animação usados pelas cenas. Todas as durações e posições
// estão em unidades de J (a timeline é guiada pelo scroll, não pelo tempo).

/** Palavras entram com desfoque, de baixo para cima. */
export function wordsIn(tl, element, at, duration = 0.05, stagger = 0.0045) {
  const split = SplitText.create(element, { type: 'words', wordsClass: 'fx-word', aria: 'auto' });
  tl.fromTo(
    split.words,
    { opacity: 0, filter: 'blur(18px)', yPercent: 24 },
    { opacity: 1, filter: 'blur(0px)', yPercent: 0, duration, stagger, ease: 'power2.out' },
    at,
  );
  return split.words;
}

export function blurOut(tl, targets, at, duration = 0.03) {
  tl.to(targets, { opacity: 0, filter: 'blur(16px)', duration, ease: 'power2.in' }, at);
}

export function fadeUp(tl, targets, at, duration = 0.035, stagger = 0.006, y = 28) {
  tl.fromTo(targets, { opacity: 0, y }, { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }, at);
}

export function fadeOut(tl, targets, at, duration = 0.025) {
  tl.to(targets, { opacity: 0, duration, ease: 'power1.in' }, at);
}

/** Destaque dourado: a faixa se abre e o texto é decodificado por cima. */
export function highlightIn(tl, element, at, duration = 0.07) {
  const live = element.querySelector('[data-hl-live]');
  if (!live) return;
  const decoder = createDecoder(live, element.dataset.text ?? live.textContent ?? '', 'hl__noise');
  const state = { p: 0 };
  renderDecoder(decoder, 0);
  tl.fromTo(element, { '--hl': 0 }, { '--hl': 1, duration: duration * 0.5, ease: 'power3.inOut' }, at);
  tl.fromTo(
    state,
    { p: 0 },
    { p: 1, duration, ease: 'power1.out', onUpdate: () => renderDecoder(decoder, state.p) },
    at + duration * 0.12,
  );
}

export function decodeIn(tl, element, at, duration = 0.05) {
  const decoder = createDecoder(element, element.dataset.text ?? element.textContent ?? '');
  const state = { p: 0 };
  renderDecoder(decoder, 0);
  tl.fromTo(state, { p: 0 }, { p: 1, duration, ease: 'none', onUpdate: () => renderDecoder(decoder, state.p) }, at);
}

/** Texto digitado caractere a caractere (terminal). */
export function typeIn(tl, element, at, duration = 0.05) {
  const value = element.dataset.text ?? '';
  tl.fromTo(element, { text: { value: '' } }, { text: { value }, duration, ease: 'none' }, at);
}

export function show(tl, targets, at, duration = 0.005) {
  tl.fromTo(targets, { opacity: 0, pointerEvents: 'none' }, { opacity: 1, pointerEvents: 'auto', duration }, at);
}

export function hide(tl, targets, at, duration = 0.005) {
  tl.to(targets, { opacity: 0, pointerEvents: 'none', duration }, at);
}

/** Registra a timeline de uma cena na jornada, a partir de um J inicial. */
export function useScene(scope, start, build) {
  useGSAP(
    () => {
      const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
      build(tl, { reduced: prefersReduced() });
      const unregister = journey.register(tl, start);
      return () => {
        unregister();
        tl.kill();
      };
    },
    { scope },
  );
}

export { gsap, useGSAP };
