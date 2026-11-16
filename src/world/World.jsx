import { useEffect, useRef } from 'react';
import { prefersReduced } from '../lib/env';
import { journey } from '../lib/journey';
import { connectEngine } from './bridge';
import { WorldEngine } from './engine';

const DARK = [8, 9, 11];
const LIGHT = [240, 241, 244];

/** Cenário 3D fixo atrás do conteúdo: fundo, feixe de luz e canvas. */
export function World() {
  const canvasRef = useRef(null);
  const backdropRef = useRef(null);
  const beamRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const reduced = prefersReduced();
    const root = document.documentElement;
    let tone = '';
    let world;

    try {
      world = new WorldEngine(canvas, {
        reducedMotion: reduced,
        onUpdate: ({ theme, beam }) => {
          const mix = (i) => Math.round(DARK[i] + (LIGHT[i] - DARK[i]) * theme);
          if (backdropRef.current) {
            backdropRef.current.style.backgroundColor = `rgb(${mix(0)}, ${mix(1)}, ${mix(2)})`;
          }
          if (beamRef.current) beamRef.current.style.opacity = String(Math.max(0, beam) * (1 - theme));
          const next = theme > 0.5 ? 'light' : 'dark';
          if (next !== tone) {
            tone = next;
            root.dataset.tone = next;
          }
        },
      });
    } catch (error) {
      // sem WebGL o site continua funcionando, só sem o cenário 3D
      console.warn('Cenário 3D indisponível:', error);
      return undefined;
    }

    connectEngine(world);
    const offFrame = journey.onFrame((dt, J) => world.tick(dt, reduced ? world.snap(J) : J));
    const onPointer = (event) => {
      if (event.pointerType !== 'mouse') return;
      world.setPointer((event.clientX / window.innerWidth) * 2 - 1, -((event.clientY / window.innerHeight) * 2 - 1));
    };
    const onResize = () => world.resize();
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('resize', onResize);

    return () => {
      offFrame();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('resize', onResize);
      connectEngine(null);
      world.dispose();
    };
  }, []);

  return (
    <div className="world" aria-hidden="true">
      <div ref={backdropRef} className="world__backdrop">
        <div ref={beamRef} className="world__beam" />
      </div>
      <canvas ref={canvasRef} className="world__canvas" />
      <div className="world__vignette" />
    </div>
  );
}
