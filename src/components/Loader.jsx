import { useRef, useState } from 'react';
import { site } from '../data/content';
import { prefersReduced, session } from '../lib/env';
import { gsap, useGSAP } from '../lib/fx';
import { lockScroll } from '../lib/smooth';
import { Mark } from './primitives';

const SEEN_KEY = 'albertluis:intro';

/** Tela de abertura: o monograma se desenha, o contador vai a 100 e o painel sobe. */
export function Loader({ onReveal }) {
  const rootRef = useRef(null);
  const lineRef = useRef(null);
  const dotRef = useRef(null);
  const countRef = useRef(null);
  const [done, setDone] = useState(false);

  useGSAP(
    () => {
      // depois de concluída, a abertura não renderiza mais nada
      if (!rootRef.current) return;
      if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
      window.scrollTo(0, 0);
      lockScroll(true);

      const reduced = prefersReduced();
      const seen = session.get(SEEN_KEY) === '1';
      const loaded = Promise.all([
        document.fonts?.ready ?? Promise.resolve(),
        new Promise((resolve) => {
          if (document.readyState === 'complete') resolve();
          else window.addEventListener('load', () => resolve(), { once: true });
        }),
      ]);
      const finish = () => {
        session.set(SEEN_KEY, '1');
        lockScroll(false);
        setDone(true);
      };

      if (reduced) {
        loaded.then(() => {
          onReveal();
          gsap.to(rootRef.current, { autoAlpha: 0, duration: 0.3, onComplete: finish });
        });
        return;
      }

      // quem já viu a abertura nesta sessão recebe uma versão mais curta
      const pace = seen ? 0.55 : 1;
      const counter = { value: 0 };
      const strokes = lineRef.current.querySelectorAll('path');
      const renderCount = () => {
        if (countRef.current) countRef.current.textContent = String(Math.round(counter.value)).padStart(3, '0');
      };

      gsap.set(strokes, { drawSVG: '0%' });
      gsap.set(dotRef.current, { scale: 0, transformOrigin: '50% 50%' });
      gsap.set('[data-loader-word]', { yPercent: 115 });

      const intro = gsap
        .timeline({ paused: true })
        .to(strokes, { drawSVG: '100%', duration: 1.05 * pace, stagger: 0.18 * pace, ease: 'power3.inOut' }, 0.1)
        .to(dotRef.current, { scale: 1, duration: 0.7, ease: 'back.out(3.4)' }, 1.05 * pace)
        .to('[data-loader-word]', { yPercent: 0, duration: 1, ease: 'expo.out' }, 0.95 * pace)
        .to(counter, { value: 100, duration: 1.7 * pace, ease: 'power2.inOut', onUpdate: renderCount }, 0)
        .to('[data-loader-progress]', { scaleX: 1, duration: 1.7 * pace, ease: 'power2.inOut' }, 0);

      Promise.all([loaded, new Promise((resolve) => intro.eventCallback('onComplete', resolve).play())]).then(() =>
        gsap
          .timeline({ onComplete: finish })
          .to('[data-loader-logo]', { yPercent: -60, autoAlpha: 0, duration: 0.7, ease: 'power3.in' }, 0)
          .to('[data-loader-meta]', { autoAlpha: 0, duration: 0.4 }, 0)
          .to('[data-loader-panel]', { yPercent: -100, duration: 1.15, ease: 'expo.inOut' }, 0.35)
          .add(onReveal, 0.75),
      );
    },
    { scope: rootRef },
  );

  if (done) return null;
  return (
    <div ref={rootRef} className="loader" aria-hidden="true">
      <div className="loader__panel" data-loader-panel>
        <div className="loader__logo" data-loader-logo>
          <Mark className="loader__mark" lineRef={lineRef} dotRef={dotRef} />
          <span className="loader__mask">
            <span className="loader__word" data-loader-word>
              {site.name}
            </span>
          </span>
        </div>
        <div className="loader__meta" data-loader-meta>
          <span>{site.role}</span>
          <span ref={countRef} className="loader__count">
            000
          </span>
        </div>
        <span className="loader__progress" data-loader-progress />
      </div>
    </div>
  );
}
