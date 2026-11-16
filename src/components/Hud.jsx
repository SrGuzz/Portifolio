import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { prefersReduced } from '../lib/env';
import { CHAPTERS, journey } from '../lib/journey';
import { createDecoder, renderDecoder } from '../lib/decode';

/** Indicador de capítulo no canto inferior esquerdo. */
export function Hud({ ready }) {
  const labelRef = useRef(null);
  const [chapter, setChapter] = useState(0);

  useEffect(() => {
    let tween = null;
    const off = journey.onChapter((index) => {
      setChapter(index);
      const el = labelRef.current;
      if (!el) return;
      tween?.kill();
      if (prefersReduced()) {
        el.textContent = CHAPTERS[index].label;
        return;
      }
      const decoder = createDecoder(el, CHAPTERS[index].label);
      const state = { p: 0 };
      tween = gsap.to(state, {
        p: 1,
        duration: 0.55,
        ease: 'none',
        onUpdate: () => renderDecoder(decoder, state.p),
      });
    });
    return () => {
      off();
      tween?.kill();
    };
  }, []);

  return (
    <div className="hud" data-ready={ready} data-off={chapter === CHAPTERS.length - 1} aria-hidden="true">
      <b className="hud__index">{String(chapter).padStart(2, '0')}</b>
      <span className="hud__box">
        <small>Capítulo</small>
        <strong ref={labelRef}>{CHAPTERS[0].label}</strong>
      </span>
    </div>
  );
}
