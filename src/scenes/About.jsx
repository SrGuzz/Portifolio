import { useRef } from 'react';
import { about } from '../data/content';
import { blurOut, fadeOut, fadeUp, hide, highlightIn, show, useScene, wordsIn } from '../lib/fx';
import { Chip, Rich, Scene, plain } from '../components/primitives';

const ABOUT_START = 1;
const MANIFESTO_START = 1.3;

export function About() {
  const ref = useRef(null);
  const titleRef = useRef(null);

  useScene(ref, ABOUT_START, (tl, { reduced }) => {
    const root = ref.current;
    const chip = root.querySelector('[data-chip]');
    const lead = root.querySelector('[data-lead]');
    show(tl, root, 0.02);
    if (reduced) {
      hide(tl, root, 0.3);
      return;
    }
    fadeUp(tl, chip, 0.03);
    const words = wordsIn(tl, titleRef.current, 0.045, 0.06, 0.005);
    fadeUp(tl, lead, 0.1);
    blurOut(tl, words, 0.25, 0.035);
    fadeOut(tl, [chip, lead], 0.25);
    hide(tl, root, 0.3);
  });

  return (
    <Scene ref={ref} anchor={1.18} label="Sobre" className="center">
      <div className="statement">
        <span data-chip>
          <Chip index="01" label={about.chip} />
        </span>
        <h2 ref={titleRef} className="display">
          {about.title}
        </h2>
        <p className="lead" data-lead>
          {about.lead}
        </p>
      </div>
    </Scene>
  );
}

export function Manifesto() {
  const ref = useRef(null);

  useScene(ref, MANIFESTO_START, (tl, { reduced }) => {
    const root = ref.current;
    const lines = Array.from(root.querySelectorAll('[data-line]'));
    show(tl, root, 0.025);
    if (reduced) {
      hide(tl, root, 0.29);
      return;
    }
    const pieces = [];
    lines.forEach((line, index) => {
      const at = 0.03 + index * 0.07;
      line.querySelectorAll('[data-plain]').forEach((part) => {
        pieces.push(...wordsIn(tl, part, at, 0.05, 0.005));
      });
      line.querySelectorAll('[data-hl]').forEach((mark) => {
        highlightIn(tl, mark, at + 0.035, 0.065);
        pieces.push(mark);
      });
    });
    blurOut(tl, pieces, 0.255, 0.03);
    hide(tl, root, 0.29);
  });

  return (
    <Scene ref={ref} anchor={1.5} label="Manifesto" className="center">
      <p className="sr-only">{about.manifesto.map(plain).join(' ')}</p>
      <div className="manifesto" aria-hidden="true">
        {about.manifesto.map((line) => (
          <p key={line} className="manifesto__line" data-line>
            <Rich text={line} />
          </p>
        ))}
      </div>
    </Scene>
  );
}
