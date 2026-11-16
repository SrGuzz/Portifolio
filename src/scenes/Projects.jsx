import { useRef } from 'react';
import * as defaults from '../data/content.pt';
import { useContent } from '../i18n/language';
import { blurOut, decodeIn, fadeOut, fadeUp, hide, highlightIn, show, useScene, wordsIn } from '../lib/fx';
import { openContact } from '../lib/contactBus';
import { Arrow, Button, Chip, Rich, Scene, plain } from '../components/primitives';
import { NinaScreen } from './NinaScreen';

const INTRO_START = 2;
const GALLERY_START = 2.28;

// Janela de cada projeto dentro da galeria (em J, relativo ao início da cena).
// A galeria ocupa sempre o mesmo trecho da jornada; o passo se ajusta à
// quantidade de projetos. O passo pensado para o ritmo atual é 0.31 (4 projetos);
// com mais projetos, aumente também o vhPerJ da galeria em lib/journey.js.
const GALLERY_SPAN = 1.24;
const STEP = GALLERY_SPAN / defaults.projects.length;
const enterAt = (index) => 0.02 + index * STEP;
const leaveAt = (index) => (index + 1) * STEP;
const GALLERY_END = leaveAt(defaults.projects.length - 1) + 0.06;

export function ProjectsIntro() {
  const { projectsIntro, ui } = useContent();
  const ref = useRef(null);

  useScene(ref, INTRO_START, (tl, { reduced }) => {
    const root = ref.current;
    const chip = root.querySelector('[data-chip]');
    const card = root.querySelector('[data-card]');
    const label = root.querySelector('[data-decode]');
    const rowsEls = root.querySelectorAll('[data-row]');
    show(tl, root, 0.03);
    if (reduced) {
      hide(tl, root, 0.27);
      return;
    }
    fadeUp(tl, chip, 0.035);
    const pieces = [];
    root.querySelectorAll('[data-title] [data-plain]').forEach((part) => {
      pieces.push(...wordsIn(tl, part, 0.045, 0.05, 0.005));
    });
    root.querySelectorAll('[data-title] [data-hl]').forEach((mark) => {
      highlightIn(tl, mark, 0.075, 0.06);
      pieces.push(mark);
    });
    tl.fromTo(
      card,
      { opacity: 0, y: 40, filter: 'blur(8px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.04 },
      0.1,
    );
    decodeIn(tl, label, 0.115, 0.05);
    fadeUp(tl, rowsEls, 0.13, 0.03, 0.008, 14);
    blurOut(tl, pieces, 0.22, 0.03);
    fadeOut(tl, [chip, card], 0.22, 0.03);
    hide(tl, root, 0.27);
  });

  const { card } = projectsIntro;
  return (
    <Scene ref={ref} anchor={2.17} label={ui.scenes.projects} className="pintro">
      <div className="pintro__wrap">
        <span data-chip>
          <Chip index="02" label={projectsIntro.chip} />
        </span>
        <h2 className="display pintro__title" data-title aria-label={plain(projectsIntro.title)}>
          <Rich text={projectsIntro.title} />
        </h2>
        <div className="info" data-card>
          <p className="info__label" data-decode data-text={card.label}>
            {card.label}
          </p>
          <p className="info__text" data-row>
            {card.text}
          </p>
          <dl className="info__stats" data-row>
            {card.stats.map((stat) => (
              <div key={stat.label}>
                <dt>{stat.label}</dt>
                <dd>{stat.value}</dd>
              </div>
            ))}
          </dl>
          <div className="info__foot" data-row>
            <p className="info__stack">
              <b>{card.stackLabel ?? ui.area}</b>
              {card.stack}
            </p>
            <Button size="sm" href={card.href}>
              {card.cta}
            </Button>
          </div>
        </div>
      </div>
    </Scene>
  );
}

function open(project, need) {
  if (project.href) window.open(project.href, '_blank', 'noopener,noreferrer');
  else openContact(need);
}

export function ProjectsGallery({ compact }) {
  const { projects, drawer, ui } = useContent();
  const ref = useRef(null);

  useScene(ref, GALLERY_START, (tl, { reduced }) => {
    const root = ref.current;
    const infos = Array.from(root.querySelectorAll('[data-project]'));
    const cards = Array.from(root.querySelectorAll('[data-card3d]'));
    show(tl, root, 0.01);

    infos.forEach((info, index) => {
      const card = cards[index];
      const enter = enterAt(index);
      const leave = leaveAt(index);
      const last = index === infos.length - 1;
      const badges = info.querySelectorAll('[data-badge]');
      const title = info.querySelector('[data-title]');
      const rest = info.querySelectorAll('[data-rest]');
      if (reduced) {
        show(tl, [info, card], enter);
        hide(tl, [info, card], leave);
        return;
      }
      show(tl, info, enter, 0.001);
      // o primeiro cartão sobe do fundo; os demais entram pela direita
      tl.fromTo(
        card,
        index === 0
          ? { opacity: 0, pointerEvents: 'none', rotationX: 62, rotationY: -8, yPercent: 38, z: -520 }
          : { opacity: 0, pointerEvents: 'none', rotationX: 6, rotationY: -46, xPercent: 60, z: -380 },
        {
          opacity: 1,
          pointerEvents: 'auto',
          rotationX: 4,
          rotationY: compact ? 0 : -11,
          rotationZ: 0,
          xPercent: 0,
          yPercent: 0,
          z: 0,
          duration: 0.08,
          ease: 'power3.out',
        },
        enter,
      );
      fadeUp(tl, badges, enter + 0.03, 0.03, 0.006, 16);
      wordsIn(tl, title, enter + 0.035, 0.045, 0.006);
      fadeUp(tl, rest, enter + 0.05, 0.03, 0.006, 16);

      // a imagem desliza dentro da moldura enquanto o projeto está em foco
      const shot = card.querySelector('[data-shot]');
      if (shot) {
        tl.fromTo(shot, { yPercent: 0 }, { yPercent: -8, duration: leave - enter, ease: 'none' }, enter);
      }
      // na tela montada em código, a conversa e o fluxo aparecem em sequência
      const messages = card.querySelectorAll('[data-msg]');
      if (messages.length) {
        tl.fromTo(
          messages,
          { opacity: 0, y: 14 },
          { opacity: 1, y: 0, duration: 0.02, stagger: 0.014, ease: 'power3.out' },
          enter + 0.05,
        );
        tl.fromTo(
          card.querySelectorAll('[data-flow]'),
          { opacity: 0, x: 14 },
          { opacity: 1, x: 0, duration: 0.02, stagger: 0.01, ease: 'power3.out' },
          enter + 0.06,
        );
      }

      tl.to(
        card,
        last
          ? { yPercent: -70, z: -1400, rotationX: -18, opacity: 0, pointerEvents: 'none', duration: 0.07, ease: 'power2.in' }
          : { rotationY: 38, rotationX: 10, xPercent: -70, z: -700, opacity: 0, pointerEvents: 'none', duration: 0.06, ease: 'power2.in' },
        leave,
      );
      blurOut(tl, title, leave, 0.03);
      fadeOut(tl, [badges, rest], leave, 0.03);
      hide(tl, info, leave + 0.035, 0.001);
    });

    hide(tl, root, GALLERY_END);
  });

  const anchorOf = (index) => (GALLERY_START + enterAt(index) + 0.1).toFixed(3);

  return (
    <Scene ref={ref} anchor={2.44} label={ui.scenes.gallery} className="gallery-scene">
      <div className="gallery">
        <div className="gallery__infos">
          {projects.map((project, index) => (
            <article
              key={project.index}
              className="project"
              data-project
              data-anchor={anchorOf(index)}
              aria-label={project.badge}
            >
              <div className="project__badges">
                <Chip index={project.index} label={project.badge} data-badge />
                <span className="chip chip--status" data-badge>
                  <b aria-hidden="true">✦</b>
                  <span>{project.status}</span>
                </span>
              </div>
              <h3 className="display-m project__title" data-title>
                {project.title}
              </h3>
              <p className="project__text" data-rest>
                {project.text}
              </p>
              <ul className="project__features" data-rest aria-label={ui.features}>
                {project.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
              <p className="mono-label project__meta" data-rest>
                {project.meta}
              </p>
              <span data-rest>
                {project.href ? (
                  <a className="link-mono" href={project.href} target="_blank" rel="noreferrer">
                    {project.link}
                    <Arrow size={14} />
                  </a>
                ) : (
                  <button type="button" className="link-mono" onClick={() => openContact(drawer.needs[0])}>
                    {project.link}
                    <Arrow size={14} />
                  </button>
                )}
              </span>
            </article>
          ))}
        </div>

        <div className="gallery__viewport">
          {projects.map((project, index) => (
            <button
              key={project.index}
              type="button"
              className="card3d"
              data-card3d
              data-anchor={anchorOf(index)}
              data-cursor-label={project.href ? ui.openProject : ui.talk}
              aria-label={`${project.link}: ${project.badge}`}
              onClick={() => open(project, drawer.needs[0])}
            >
              {project.visual === 'nina' ? (
                <NinaScreen />
              ) : (
              <span className="browser">
                <span className="browser__bar">
                  <span className="browser__dots">
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="browser__url">{project.url}</span>
                </span>
                <span className="browser__view">
                  <img
                    src={project.image}
                    alt={`Tela do projeto ${project.badge}`}
                    data-shot
                    loading="lazy"
                    decoding="async"
                    draggable="false"
                  />
                </span>
              </span>
              )}
            </button>
          ))}
        </div>
      </div>
    </Scene>
  );
}
