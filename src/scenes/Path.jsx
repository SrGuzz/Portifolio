import { useEffect, useRef } from 'react';
import { useContent } from '../i18n/language';
import { cx } from '../lib/env';
import { blurOut, fadeOut, fadeUp, hide, show, typeIn, useScene, wordsIn } from '../lib/fx';
import { bindWorldLabels } from '../world/bridge';
import { Chip, Scene } from '../components/primitives';

const INTRO_START = 3.6;
const STEPS_START = 3.84;
const STEP_SPAN = 0.16;
const DETAILS_START = 4.47;


/** Abertura da trajetória: quatro peças sobre a linha, com rótulos presos a elas. */
export function PathIntro() {
  const { journeyPath, ui } = useContent();
  const { steps } = journeyPath;
  const ref = useRef(null);
  const nodes = useRef([]);

  useEffect(() => {
    bindWorldLabels(nodes.current.filter(Boolean).map((el, tile) => ({ el, tile })));
    return () => bindWorldLabels([]);
  }, []);

  useScene(ref, INTRO_START, (tl, { reduced }) => {
    const root = ref.current;
    const chip = root.querySelector('[data-chip]');
    const title = root.querySelector('[data-title]');
    const lead = root.querySelector('[data-lead]');
    const labels = nodes.current.filter(Boolean).map((el) => el.querySelector('[data-node-content]'));
    show(tl, root, 0.04);
    if (reduced) {
      hide(tl, root, 0.235);
      return;
    }
    fadeUp(tl, chip, 0.045);
    const words = wordsIn(tl, title, 0.05, 0.05, 0.005);
    fadeUp(tl, lead, 0.09);
    labels.forEach((label, index) => {
      tl.fromTo(
        label,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.015 },
        0.06 + ((index + 1) / (labels.length + 1)) * 0.12,
      );
    });
    blurOut(tl, words, 0.2, 0.03);
    fadeOut(tl, [chip, lead, ...labels], 0.2, 0.025);
    hide(tl, root, 0.235);
  });

  return (
    <Scene ref={ref} anchor={3.77} label={ui.scenes.path} className="path-intro">
      <div className="path-intro__text">
        <span data-chip>
          <Chip index="03" label={journeyPath.chip} />
        </span>
        <h2 className="display" data-title>
          {journeyPath.title}
        </h2>
        <p className="lead" data-lead>
          {journeyPath.lead}
        </p>
      </div>
      <ol className="nodes">
        {steps.map((step, index) => (
          <li key={step.key}>
            <div
              ref={(el) => {
                nodes.current[index] = el;
              }}
              className="node"
            >
              <div className="node__inner">
                <div className="node__content" data-node-content>
                  <Chip index={String(index + 1).padStart(2, '0')} label={step.key} />
                  <span className="node__short">{step.short}</span>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </Scene>
  );
}

/** Um cartão percorre as etapas; no fim ele escurece e as peças formam o monograma. */
export function PathSteps() {
  const { journeyPath, ui } = useContent();
  const { steps } = journeyPath;
  const ref = useRef(null);

  useScene(ref, STEPS_START, (tl, { reduced }) => {
    const root = ref.current;
    const card = root.querySelector('[data-card]');
    const dark = root.querySelector('[data-dark]');
    const items = Array.from(root.querySelectorAll('[data-step]'));
    const bars = Array.from(root.querySelectorAll('[data-bar]'));
    show(tl, root, 0.005);
    tl.fromTo(
      card,
      { opacity: 0, x: -40, filter: 'blur(10px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.03 },
      0.01,
    );

    items.forEach((item, index) => {
      const at = 0.02 + index * STEP_SPAN;
      const typed = item.querySelectorAll('[data-type]');
      const isLast = index === items.length - 1;
      if (reduced) {
        typed.forEach((el) => {
          el.textContent = el.dataset.text ?? '';
        });
        show(tl, item, at);
        tl.fromTo(bars[index], { scaleX: 0 }, { scaleX: 1, duration: 0.005 }, at);
        if (!isLast) hide(tl, item, at + STEP_SPAN - 0.01);
        return;
      }
      show(tl, item, at, 0.001);
      fadeUp(tl, item.querySelector('[data-chip]'), at, 0.02, 0, 10);
      const words = wordsIn(tl, item.querySelector('[data-title]'), at + 0.005, 0.035, 0.005);
      fadeUp(tl, item.querySelector('[data-text]'), at + 0.025, 0.025, 0, 12);
      typed.forEach((el, line) => typeIn(tl, el, at + 0.03 + line * 0.025, 0.025));
      tl.fromTo(bars[index], { scaleX: 0 }, { scaleX: 1, duration: 0.14 }, at);
      if (!isLast) {
        blurOut(tl, words, at + STEP_SPAN - 0.03, 0.02);
        fadeOut(tl, item.querySelectorAll('[data-chip], [data-text], [data-terminal]'), at + STEP_SPAN - 0.03, 0.02);
        hide(tl, item, at + STEP_SPAN - 0.008, 0.001);
      }
    });

    tl.fromTo(dark, { opacity: 0 }, { opacity: 1, duration: reduced ? 0.005 : 0.03 }, 0.49);
    tl.fromTo(card, { color: '#08090b' }, { color: '#f5f6f8', duration: reduced ? 0.005 : 0.03 }, 0.49);
    tl.to(card, { opacity: 0, x: -40, filter: 'blur(10px)', duration: 0.025 }, 0.615);
    hide(tl, root, 0.64);
  });

  return (
    <Scene ref={ref} anchor={3.92} label={ui.scenes.steps} className="steps">
      <div className="step-card" data-card>
        <span className="step-card__dark" data-dark aria-hidden="true" />
        <div className="step-card__stack">
          {steps.map((step, index) => (
            <div
              key={step.key}
              className="step"
              data-step
              data-anchor={(STEPS_START + 0.02 + index * STEP_SPAN + 0.09).toFixed(3)}
            >
              <Chip index={String(index + 1).padStart(2, '0')} label={step.key} data-chip />
              <h3 className={cx('display-m', 'step__title')} data-title>
                {step.title}
              </h3>
              <p className="step__text" data-text>
                {step.text}
              </p>
              <div className="step__terminal" data-terminal>
                {step.terminal.map((line, lineIndex) => (
                  <p key={line}>
                    <span className="sr-only">{line}</span>
                    <span data-type data-text={line} aria-hidden="true" />
                    {lineIndex === step.terminal.length - 1 && <i className="step__caret" aria-hidden="true" />}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="step-card__progress" aria-hidden="true">
          {steps.map((step) => (
            <span key={step.key}>
              <i data-bar />
            </span>
          ))}
        </div>
      </div>
    </Scene>
  );
}

/** Frase de fechamento, emoldurada como uma seleção de ferramenta de design. */
export function PathDetails() {
  const { journeyPath, ui } = useContent();
  const ref = useRef(null);
  const zoomRef = useRef(null);

  useScene(ref, DETAILS_START, (tl, { reduced }) => {
    const root = ref.current;
    const frame = root.querySelector('[data-frame]');
    const title = root.querySelector('[data-title]');
    show(tl, root, 0.015);
    if (reduced) {
      hide(tl, root, 0.125);
      return;
    }
    const zoom = { value: 32 };
    tl.fromTo(frame, { scale: 0.34, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.05, ease: 'power3.out' }, 0.02);
    tl.fromTo(
      zoom,
      { value: 32 },
      {
        value: 100,
        duration: 0.05,
        ease: 'power3.out',
        onUpdate: () => {
          if (zoomRef.current) zoomRef.current.textContent = `${Math.round(zoom.value)}%`;
        },
      },
      0.02,
    );
    blurOut(tl, [...wordsIn(tl, title, 0.03, 0.04, 0.006), frame], 0.1, 0.02);
    hide(tl, root, 0.125);
  });

  return (
    <Scene ref={ref} anchor={4.55} label={ui.scenes.details} className="details">
      <div className="selection">
        <div className="selection__frame" data-frame aria-hidden="true">
          <span ref={zoomRef} className="selection__zoom">
            100%
          </span>
          <i className="selection__handle" data-pos="tl" />
          <i className="selection__handle" data-pos="tr" />
          <i className="selection__handle" data-pos="bl" />
          <i className="selection__handle" data-pos="br" />
        </div>
        <h2 className="display selection__title" data-title>
          {journeyPath.details}
        </h2>
      </div>
    </Scene>
  );
}
