import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { useContent } from '../i18n/language';
import { prefersReduced } from '../lib/env';
import { CHAPTERS, journey } from '../lib/journey';
import { createDecoder, renderDecoder } from '../lib/decode';

/** Indicador de capítulo no canto inferior esquerdo. */
export function Hud({ ready }) {
  const { ui } = useContent();
  const labelOf = (index) => ui.chapters[CHAPTERS[index].id];
  const labelsRef = useRef(labelOf);
  labelsRef.current = labelOf;
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
        el.textContent = labelsRef.current(index);
        return;
      }
      const decoder = createDecoder(el, labelsRef.current(index));
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

  // o texto do rótulo é controlado pelo efeito de decodificação, não pelo React;
  // na troca de idioma ele é reescrito aqui
  useEffect(() => {
    if (labelRef.current) labelRef.current.textContent = labelsRef.current(journey.chapter);
  }, [ui]);

  return (
    <div className="hud" data-ready={ready} data-off={chapter === CHAPTERS.length - 1} aria-hidden="true">
      <b className="hud__index">{String(chapter).padStart(2, '0')}</b>
      <span className="hud__box">
        <small>{ui.chapter}</small>
        <strong ref={labelRef} />
      </span>
    </div>
  );
}
