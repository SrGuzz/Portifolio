import { useEffect, useRef, useState } from 'react';
import { nav, site } from '../data/content';
import { cx, prefersReduced } from '../lib/env';
import { gsap, useGSAP } from '../lib/fx';
import { CHAPTERS, journey } from '../lib/journey';
import { lockScroll } from '../lib/smooth';
import { openContact } from '../lib/contactBus';
import { Button, Logo, Roll } from './primitives';

export function Header({ ready }) {
  const headerRef = useRef(null);
  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState(0);

  // some ao rolar para baixo, volta ao rolar para cima
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > last && y > 120);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    const offChapter = journey.onChapter(setChapter);
    return () => {
      window.removeEventListener('scroll', onScroll);
      offChapter();
    };
  }, []);

  useGSAP(
    () => {
      if (prefersReduced()) return;
      if (ready) gsap.to(headerRef.current, { yPercent: 0, duration: 1.2, ease: 'expo.out', delay: 0.5 });
      else gsap.set(headerRef.current, { yPercent: -110 });
    },
    { dependencies: [ready] },
  );

  // menu em tela cheia (telas menores)
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return undefined;
    if (open) {
      lockScroll(true);
      gsap.set(menu, { visibility: 'visible' });
      gsap.fromTo(menu, { clipPath: 'inset(0 0 100% 0)' }, { clipPath: 'inset(0 0 0% 0)', duration: 0.8, ease: 'expo.inOut' });
      gsap.fromTo(
        menu.querySelectorAll('[data-menu-item]'),
        { yPercent: 110 },
        { yPercent: 0, duration: 0.9, stagger: 0.05, ease: 'expo.out', delay: 0.3 },
      );
      menu.querySelector('a, button')?.focus({ preventScroll: true });
      const onKey = (event) => {
        if (event.key !== 'Escape') return;
        toggleRef.current?.focus();
        setOpen(false);
      };
      window.addEventListener('keydown', onKey);
      return () => window.removeEventListener('keydown', onKey);
    }
    if (menu.style.visibility === 'visible') {
      lockScroll(false);
      gsap.to(menu, {
        clipPath: 'inset(0 0 100% 0)',
        duration: 0.6,
        ease: 'expo.inOut',
        onComplete: () => gsap.set(menu, { visibility: 'hidden' }),
      });
    }
    return undefined;
  }, [open]);

  // tira o foco de dentro do menu antes de escondê-lo dos leitores de tela
  const closeMenu = () => {
    if (menuRef.current?.contains(document.activeElement)) toggleRef.current?.focus({ preventScroll: true });
    setOpen(false);
  };

  const go = (id) => {
    closeMenu();
    requestAnimationFrame(() => journey.scrollToChapter(id));
  };
  const active = CHAPTERS[chapter]?.id;

  return (
    <>
      <header ref={headerRef} className={cx('header', hidden && !open && 'header--hidden')}>
        <div className="header__inner">
          <a
            href="#topo"
            className="header__brand"
            aria-label={`${site.name}, voltar ao início`}
            onClick={(event) => {
              event.preventDefault();
              go('inicio');
            }}
          >
            <Logo size={22} />
          </a>

          <nav className="header__nav" aria-label="Navegação principal">
            <ul>
              {nav.map((item) => (
                <li key={item.chapter}>
                  <button
                    type="button"
                    className={cx('header__link', active === item.chapter && 'is-active')}
                    aria-current={active === item.chapter ? 'true' : undefined}
                    onClick={() => go(item.chapter)}
                  >
                    <Roll text={item.label} />
                    <span className="header__plus" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="header__actions">
            <Button size="sm" className="header__cta" onClick={() => openContact()}>
              Contato
            </Button>
            <button
              ref={toggleRef}
              type="button"
              className={cx('header__toggle', open && 'is-open')}
              aria-expanded={open}
              aria-controls="menu-principal"
              onClick={() => setOpen((value) => !value)}
            >
              <span className="sr-only">{open ? 'Fechar menu' : 'Abrir menu'}</span>
              <span className="header__toggle-lines" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <div ref={menuRef} id="menu-principal" className="menu" aria-hidden={!open} inert={open ? undefined : ''}>
        <nav className="menu__nav" aria-label="Menu">
          <ul className="menu__list">
            {nav.map((item, index) => (
              <li key={item.chapter} className="menu__mask">
                <button type="button" className="menu__link" data-menu-item onClick={() => go(item.chapter)}>
                  <span className="menu__index">{String(index + 1).padStart(2, '0')}</span>
                  {item.label}
                </button>
              </li>
            ))}
            <li className="menu__mask">
              <button
                type="button"
                className="menu__link"
                data-menu-item
                onClick={() => {
                  closeMenu();
                  openContact();
                }}
              >
                <span className="menu__index">{String(nav.length + 1).padStart(2, '0')}</span>
                Contato
              </button>
            </li>
          </ul>
          <p className="menu__mail">{site.email}</p>
        </nav>
      </div>
    </>
  );
}
