import { useRef } from 'react';
import { useContent } from '../i18n/language';
import { blurOut, fadeOut, fadeUp, hide, show, useScene, wordsIn } from '../lib/fx';
import { Chip, Icon, Scene } from '../components/primitives';

const INTRO_START = 4.6;
const PANEL_START = 5.04;

export function StackIntro() {
  const { stack, ui } = useContent();
  const ref = useRef(null);

  useScene(ref, INTRO_START, (tl, { reduced }) => {
    const root = ref.current;
    const chip = root.querySelector('[data-chip]');
    const lead = root.querySelector('[data-lead]');
    show(tl, root, 0.04);
    if (reduced) {
      hide(tl, root, 0.43);
      return;
    }
    fadeUp(tl, chip, 0.05);
    const words = wordsIn(tl, root.querySelector('[data-title]'), 0.06, 0.06, 0.006);
    fadeUp(tl, lead, 0.11);
    blurOut(tl, words, 0.38, 0.035);
    fadeOut(tl, [chip, lead], 0.38, 0.03);
    hide(tl, root, 0.43);
  });

  return (
    <Scene ref={ref} anchor={4.82} label={ui.scenes.stack} className="stack-intro">
      <div className="stack-intro__text">
        <span data-chip>
          <Chip index="04" label={stack.chip} />
        </span>
        <h2 className="display" data-title>
          {stack.title}
        </h2>
        <p className="lead" data-lead>
          {stack.lead}
        </p>
      </div>
    </Scene>
  );
}

/** Painel de vidro: camadas isométricas à esquerda, tecnologias à direita. */
export function StackPanel() {
  const { stack, ui } = useContent();
  const ref = useRef(null);

  useScene(ref, PANEL_START, (tl, { reduced }) => {
    const root = ref.current;
    const panel = root.querySelector('[data-panel]');
    const layers = root.querySelectorAll('[data-layer]');
    const items = root.querySelectorAll('[data-item]');
    show(tl, root, 0.02);
    if (!reduced) {
      tl.fromTo(
        panel,
        { opacity: 0, scale: 0.97, filter: 'blur(10px)' },
        { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.04 },
        0.02,
      );
      tl.fromTo(
        layers,
        { opacity: 0, y: -40 },
        { opacity: 1, y: 0, duration: 0.04, stagger: 0.025, ease: 'power3.out' },
        0.05,
      );
      fadeUp(tl, items, 0.07, 0.035, 0.025, 18);
      fadeOut(tl, panel, 0.44, 0.04);
    }
    hide(tl, root, 0.5);
  });

  return (
    <Scene ref={ref} anchor={5.34} label={ui.scenes.tech} className="panel-scene">
      <div className="panel" data-panel>
        <div className="layers" aria-hidden="true">
          {stack.layers.map((layer, index) => (
            <div key={layer.index} className="layer" data-layer style={{ zIndex: 3 - index }}>
              <div className="layer__plane">
                {Array.from({ length: 4 - index }).map((_, cell) => (
                  <i
                    key={cell}
                    style={{ gridColumn: `${((cell * 2 + index) % 4) + 1}`, gridRow: `${((cell + index) % 4) + 1}` }}
                  />
                ))}
              </div>
              <span className="layer__label">
                <Chip index={layer.index} label={layer.name} />
                <span className="layer__role">{layer.role}</span>
              </span>
            </div>
          ))}
        </div>
        <ul className="panel__items">
          {stack.items.map((item) => (
            <li key={item.title} className="panel__item" data-item>
              <span className="panel__icon">
                <Icon name={item.icon} size={16} />
              </span>
              <div>
                <h3 className="panel__title">{item.title}</h3>
                <p className="panel__text">{item.text}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}
