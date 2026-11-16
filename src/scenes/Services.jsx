import { useRef } from 'react';
import { useContent } from '../i18n/language';
import { cx } from '../lib/env';
import { hide, show, useScene } from '../lib/fx';
import { openContact } from '../lib/contactBus';
import { Arrow, Icon, Scene } from '../components/primitives';

const START = 1.6;

/** "O que eu faço": cartões de vidro que viram cartões sólidos ao entrar. */
export function Services({ compact }) {
  const { services, drawer, ui } = useContent();
  const ref = useRef(null);

  useScene(ref, START, (tl, { reduced }) => {
    const root = ref.current;
    const cards = Array.from(root.querySelectorAll('[data-card]'));
    const label = root.querySelector('[data-label]');
    show(tl, root, 0.02);
    if (!reduced) {
      tl.fromTo(label, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.03 }, 0.025);
      cards.forEach((card, index) => {
        const at = 0.03 + index * (compact ? 0.075 : 0.045);
        const glass = card.querySelector('[data-glass]');
        const solid = card.querySelector('[data-solid]');
        const content = card.querySelectorAll('[data-content]');
        if (compact) {
          tl.fromTo(
            card,
            { yPercent: 120, opacity: 0 },
            { yPercent: 0, opacity: 1, duration: 0.05, ease: 'power3.out' },
            at,
          );
        } else {
          tl.fromTo(
            card,
            { y: 70, opacity: 0, scale: 0.94, filter: 'blur(10px)' },
            { y: 0, opacity: 1, scale: 1, filter: 'blur(0px)', duration: 0.045, ease: 'power3.out' },
            at,
          );
        }
        tl.fromTo(glass, { opacity: 1 }, { opacity: 0, duration: 0.03 }, at + 0.035);
        tl.fromTo(solid, { opacity: 0 }, { opacity: 1, duration: 0.03 }, at + 0.035);
        tl.fromTo(content, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.03, stagger: 0.004 }, at + 0.04);
      });
      tl.to(
        cards,
        { opacity: 0, y: -40, filter: 'blur(10px)', duration: 0.035, stagger: 0.006, ease: 'power2.in' },
        0.32,
      );
      tl.to(label, { opacity: 0, duration: 0.02 }, 0.32);
    }
    hide(tl, root, 0.38);
  });

  return (
    <Scene ref={ref} anchor={1.84} label={ui.scenes.services} className="services">
      <div className="services__wrap">
        <p className="mono-label services__label" data-label>
          {services.label}
        </p>
        <ul className="services__cards">
          {services.items.map((item, index) => (
            <li key={item.title} className="card" data-card style={{ '--i': index }}>
              <span className="card__glass" data-glass aria-hidden="true" />
              <span className="card__solid" data-solid aria-hidden="true" />
              <div className="card__media" data-content>
                <span className="card__index">{String(index + 1).padStart(2, '0')}</span>
                <span className="card__tile">
                  <Icon name={item.icon} size={34} />
                </span>
              </div>
              <div className="card__body">
                <h3 className="card__title" data-content>
                  {item.title}
                </h3>
                <p className="card__text" data-content>
                  {item.text}
                </p>
                <ul className="card__tags" data-content aria-label={ui.technologies}>
                  {item.tags.map((tag) => (
                    <li key={tag}>{tag}</li>
                  ))}
                </ul>
                <button
                  type="button"
                  className={cx('card__more')}
                  data-content
                  onClick={() => openContact(drawer.needs[0])}
                >
                  <span>{services.more}</span>
                  <Arrow />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Scene>
  );
}
