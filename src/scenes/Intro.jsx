import { useRef } from 'react';
import { intro, site } from '../data/content';
import { useScene } from '../lib/fx';
import { Scene } from '../components/primitives';

/** Abertura: o cenário 3D ocupa a tela; aqui ficam só as legendas. */
export function Intro() {
  const ref = useRef(null);

  useScene(ref, 0, (tl) => {
    tl.fromTo(ref.current, { opacity: 1 }, { opacity: 0, duration: 0.1 }, 0.06);
  });

  return (
    <Scene ref={ref} anchor={0} label="Início" className="intro">
      <h1 className="sr-only">{intro.title}</h1>
      <p className="intro__side mono-label" aria-hidden="true">
        <span>{site.role}</span>
        <span>{site.location}</span>
      </p>
      <div className="intro__hint" aria-hidden="true">
        <span className="intro__line" />
        <span className="mono-label">{intro.hint}</span>
      </div>
    </Scene>
  );
}
