import { useLayoutEffect, useRef, useState } from 'react';
import { useContent } from '../i18n/language';
import { fadeUp, show, useScene, wordsIn } from '../lib/fx';
import { openContact } from '../lib/contactBus';
import { setWorldSlot } from '../world/bridge';
import { MARK, MARK_PATHS } from '../world/icons';
import { Button, Chip, CopyIcon, Scene } from '../components/primitives';

const START = 5.6;
const YEAR = new Date().getFullYear();

// Medidas do letreiro gigante (unidades do SVG).
const FONT_SIZE = 100;
const FONT_FAMILY = "'Sora Variable', 'Sora', ui-sans-serif, system-ui, sans-serif";
const MARK_SCALE = 1.78;
const MARK_WIDTH = 59.5 * MARK_SCALE;
const TEXT_X = MARK_WIDTH + 30;

/** Letreiro com o monograma e o nome ocupando a largura da tela. */
function Giant() {
  const { site } = useContent();
  const ref = useRef(null);
  const [metrics, setMetrics] = useState({ width: 570, ascent: 77 });

  useLayoutEffect(() => {
    const measure = () => {
      const ctx = document.createElement('canvas').getContext('2d');
      if (!ctx) return;
      ctx.font = `600 ${FONT_SIZE}px ${FONT_FAMILY}`;
      ctx.letterSpacing = '-2.5px';
      const box = ctx.measureText(site.name);
      setMetrics({ width: box.width, ascent: Math.max(72, box.actualBoundingBoxAscent || 77) });
    };
    measure();
    document.fonts?.ready.then(measure);
  }, []);

  const baseline = metrics.ascent + 2;
  const height = baseline + 2;
  const width = TEXT_X + metrics.width + 4;
  // a base do monograma (y = 51.75 no desenho) encosta na linha de base do texto
  const markTransform = `translate(${-2.25 * MARK_SCALE} ${baseline - 51.75 * MARK_SCALE}) scale(${MARK_SCALE})`;

  return (
    <svg
      ref={ref}
      className="giant"
      style={{ '--ratio': width / height }}
      viewBox={`0 0 ${width} ${height}`}
      aria-hidden="true"
    >
      <g transform={markTransform} fill="none">
        <g stroke="currentColor" strokeWidth={MARK.stroke} strokeLinecap="round" strokeLinejoin="round">
          {MARK_PATHS.map((d) => (
            <path key={d} d={d} data-giant-line />
          ))}
        </g>
        <circle className="giant__dot" cx={MARK.dot[0]} cy={MARK.dot[1]} r={MARK.dotRadius} data-giant-dot />
      </g>
      <text
        x={TEXT_X}
        y={baseline}
        fontFamily={FONT_FAMILY}
        fontSize={FONT_SIZE}
        fontWeight="600"
        letterSpacing="-2.5"
        fill="currentColor"
        data-giant-word
      >
        {site.name}
      </text>
    </svg>
  );
}

export function Contact() {
  const { contact, site, ui } = useContent();
  const ref = useRef(null);
  const slotRef = useRef(null);
  const [copied, setCopied] = useState(false);

  // reserva o espaço livre da cena para o anel 3D
  useLayoutEffect(() => {
    const slot = slotRef.current;
    if (!slot) return undefined;
    const report = () => {
      const box = slot.getBoundingClientRect();
      setWorldSlot('contact', { x: box.left, y: box.top, width: box.width, height: box.height });
    };
    report();
    const observer = new ResizeObserver(report);
    observer.observe(slot);
    window.addEventListener('resize', report);
    document.fonts?.ready.then(report);
    return () => {
      observer.disconnect();
      window.removeEventListener('resize', report);
      setWorldSlot('contact', null);
    };
  }, []);

  useScene(ref, START, (tl, { reduced }) => {
    const root = ref.current;
    show(tl, root, 0.04);
    if (reduced) return;
    fadeUp(tl, root.querySelector('[data-chip]'), 0.05);
    wordsIn(tl, root.querySelector('[data-title]'), 0.06, 0.07, 0.007);
    fadeUp(tl, root.querySelectorAll('[data-rest]'), 0.12, 0.05, 0.012, 20);
    tl.fromTo(
      root.querySelectorAll('[data-giant-line]'),
      { drawSVG: '0%' },
      { drawSVG: '100%', duration: 0.14, stagger: 0.03, ease: 'power2.inOut' },
      0.1,
    );
    tl.fromTo(
      root.querySelector('[data-giant-dot]'),
      { scale: 0, transformOrigin: '50% 50%' },
      { scale: 1, duration: 0.05, ease: 'back.out(3)' },
      0.23,
    );
    tl.fromTo(root.querySelector('[data-giant-word]'), { y: 110 }, { y: 0, duration: 0.12, ease: 'power3.out' }, 0.14);
  });

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(site.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      const el = document.getElementById('contato-email');
      if (el) window.getSelection()?.selectAllChildren(el);
    }
  };

  return (
    <Scene ref={ref} anchor={6.2} label={ui.scenes.contact} className="contact">
      <div className="contact__content">
        <span data-chip>
          <Chip index="05" label={contact.chip} />
        </span>
        <h2 className="display-m contact__title" data-title>
          {contact.title}
        </h2>
        <p className="contact__lead" data-rest>
          {contact.lead}
        </p>
        <div className="contact__actions" data-rest>
          <Button magnetic onClick={() => openContact()}>
            {contact.cta}
          </Button>
          <Button variant="ghost" href={contact.cvHref} download={contact.cvFile} icon={null}>
            {contact.cv}
          </Button>
        </div>
      </div>

      <div ref={slotRef} className="contact__slot" aria-hidden="true" />

      <footer className="contact__footer">
        <Giant />
        <div className="contact__info" data-rest>
          <p className="contact__services">{contact.services.join(' · ')}</p>
          <p className="contact__links">
            <a id="contato-email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <button type="button" className="contact__copy" onClick={copy}>
              <CopyIcon size={13} done={copied} />
              {copied ? ui.copied : ui.copy}
            </button>
            {site.social.map((item) => (
              <a key={item.label} href={item.href} target="_blank" rel="noreferrer">
                {item.label}
              </a>
            ))}
          </p>
          <p className="contact__rights">
            © {YEAR} {site.name}. {contact.rights}
          </p>
        </div>
      </footer>
    </Scene>
  );
}
