import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { hasFinePointer, prefersReduced } from '../lib/env';
import { Arrow } from './primitives';

/** Etiqueta dourada que segue o cursor sobre elementos com data-cursor-label. */
export function CursorTag() {
  const ref = useRef(null);
  const [enabled] = useState(() => hasFinePointer());

  useEffect(() => {
    const tag = ref.current;
    if (!tag) return undefined;
    const reduced = prefersReduced();
    gsap.set(tag, { x: -200, y: -200 });
    const toX = gsap.quickTo(tag, 'x', { duration: reduced ? 0 : 0.35, ease: 'power3.out' });
    const toY = gsap.quickTo(tag, 'y', { duration: reduced ? 0 : 0.35, ease: 'power3.out' });
    let current = null;

    const move = (event) => {
      if (event.pointerType !== 'mouse') return;
      toX(event.clientX + 18);
      toY(event.clientY + 20);
    };
    const over = (event) => {
      const target = event.target?.closest?.('[data-cursor-label]') ?? null;
      if (target === current) return;
      current = target;
      if (target) {
        tag.firstChild.textContent = target.dataset.cursorLabel ?? '';
        gsap.set(tag, { x: event.clientX + 18, y: event.clientY + 20 });
      }
      tag.dataset.visible = String(!!target);
    };
    const hide = () => {
      current = null;
      tag.dataset.visible = 'false';
    };

    window.addEventListener('pointermove', move, { passive: true });
    document.addEventListener('pointerover', over, { passive: true });
    document.documentElement.addEventListener('pointerleave', hide);
    window.addEventListener('scroll', hide, { passive: true });
    return () => {
      window.removeEventListener('pointermove', move);
      document.removeEventListener('pointerover', over);
      document.documentElement.removeEventListener('pointerleave', hide);
      window.removeEventListener('scroll', hide);
    };
  }, [enabled]);

  if (!enabled) return null;
  return (
    <div ref={ref} className="cursor-tag" data-visible="false" aria-hidden="true">
      <span />
      <Arrow size={14} />
    </div>
  );
}
