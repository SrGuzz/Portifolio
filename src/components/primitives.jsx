import { Fragment, forwardRef, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cx, hasFinePointer, prefersReduced } from '../lib/env';
import { journey } from '../lib/journey';
import { ICONS, MARK, MARK_PATHS } from '../world/icons';

/* Peças pequenas de interface reutilizadas em todo o site. */

/** Monograma "AL". `lineRef` e `dotRef` permitem animar o traço e o ponto. */
export function Mark({ className, title, lineRef, dotRef }) {
  return (
    <svg
      className={cx('mark', className)}
      viewBox="1 11 62 42"
      fill="none"
      role={title ? 'img' : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : 'true'}
    >
      <g ref={lineRef} stroke="currentColor" strokeWidth={MARK.stroke} strokeLinecap="round" strokeLinejoin="round">
        {MARK_PATHS.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
      <circle ref={dotRef} className="mark__dot" cx={MARK.dot[0]} cy={MARK.dot[1]} r={MARK.dotRadius} />
    </svg>
  );
}

export function Logo({ size = 24, className, label = 'Albert Luis' }) {
  return (
    <span className={cx('logo', className)} style={{ '--logo-size': `${size}px` }}>
      <Mark className="logo__mark" />
      <span className="logo__word">{label}</span>
    </span>
  );
}

export function Icon({ name, size = 16, className }) {
  if (name === 'mark') return <Mark className={className} />;
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={ICONS[name]} />
    </svg>
  );
}

export function Arrow({ size = 16, className }) {
  return (
    <svg className={className} width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function CopyIcon({ size = 14, done }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" aria-hidden="true">
      {done ? (
        <path d="M3 8.5l3.2 3.2L13 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <>
          <rect x="5.5" y="5.5" width="8" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.4" />
          <path d="M10.5 3.5h-6a1.5 1.5 0 0 0-1.5 1.5v6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}

/** Texto que rola para cima no hover (usado no menu). */
export function Roll({ text }) {
  return (
    <span className="roll">
      <span className="roll__a">{text}</span>
      <span className="roll__b" aria-hidden="true">
        {text}
      </span>
    </span>
  );
}

/** Envolve um elemento e faz ele "puxar" em direção ao cursor. */
export function Magnetic({ children, strength = 0.32 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !hasFinePointer() || prefersReduced()) return undefined;
    let toX = null;
    let toY = null;
    const arm = () => {
      gsap.killTweensOf(el);
      toX = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3.out' });
      toY = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3.out' });
    };
    const move = (event) => {
      if (!toX || !toY) arm();
      const box = el.getBoundingClientRect();
      toX((event.clientX - (box.left + box.width / 2)) * strength);
      toY((event.clientY - (box.top + box.height / 2)) * strength);
    };
    const leave = () => {
      toX = toY = null;
      gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.32)', overwrite: true });
    };
    el.addEventListener('pointerenter', arm);
    el.addEventListener('pointermove', move);
    el.addEventListener('pointerleave', leave);
    return () => {
      el.removeEventListener('pointerenter', arm);
      el.removeEventListener('pointermove', move);
      el.removeEventListener('pointerleave', leave);
      gsap.killTweensOf(el);
    };
  }, [strength]);

  return (
    <span ref={ref} className="magnetic">
      {children}
    </span>
  );
}

export function Button({
  children,
  href,
  download,
  variant = 'gold',
  size = 'md',
  type = 'button',
  icon = <Arrow />,
  className,
  magnetic = false,
  disabled,
  onClick,
}) {
  const classes = cx('btn', variant === 'ghost' && 'btn--ghost', size === 'sm' && 'btn--sm', className);
  const content = (
    <>
      <span className="btn__label">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon && <span className="btn__icon">{icon}</span>}
    </>
  );
  const external = href?.startsWith('http');
  const element = href ? (
    <a
      className={classes}
      href={href}
      onClick={onClick}
      download={download}
      target={external || download ? '_blank' : undefined}
      rel={external ? 'noreferrer' : undefined}
    >
      {content}
    </a>
  ) : (
    <button type={type} className={classes} onClick={onClick} disabled={disabled}>
      {content}
    </button>
  );
  return magnetic ? <Magnetic>{element}</Magnetic> : element;
}

export function Chip({ index, label, className, ...rest }) {
  return (
    <span className={cx('chip', className)} {...rest}>
      <b>{index}</b>
      <span>{label}</span>
    </span>
  );
}

/** Converte "texto **destaque** texto" em trechos animáveis. */
export function Rich({ text }) {
  return (
    <>
      {text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="hl" data-hl data-text={part}>
            <span className="hl__ghost" aria-hidden="true">
              {part}
            </span>
            <span className="hl__live" data-hl-live aria-hidden="true">
              {part}
            </span>
          </span>
        ) : part ? (
          <span key={i} data-plain>
            {part}
          </span>
        ) : (
          <Fragment key={i} />
        ),
      )}
    </>
  );
}

export const plain = (text) => text.replace(/\*\*/g, '');

/** Palco fixo onde as cenas se sobrepõem. */
export function Stage({ children }) {
  return <div className="stage">{children}</div>;
}

/**
 * Uma cena do palco. Ao receber foco pelo teclado, rola a página até o
 * ponto da jornada em que ela está visível.
 */
export const Scene = forwardRef(function Scene({ anchor, label, className, children }, ref) {
  const onFocus = (event) => {
    const holder = event.target.closest('[data-anchor]');
    const target = holder ? Number(holder.dataset.anchor) : anchor;
    if (Math.abs(journey.value - target) > 0.04) journey.scrollTo(target, false, 1.1);
  };
  return (
    <section ref={ref} className={cx('scene', className)} aria-label={label} onFocus={onFocus}>
      {children}
    </section>
  );
});
