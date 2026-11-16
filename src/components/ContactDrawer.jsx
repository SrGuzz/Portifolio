import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { drawer, site } from '../data/content';
import { cx, prefersReduced } from '../lib/env';
import { lockScroll } from '../lib/smooth';
import { closeContact, onContact } from '../lib/contactBus';
import { Button } from './primitives';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Painel lateral com o formulário de contato. */
export function ContactDrawer() {
  const rootRef = useRef(null);
  const panelRef = useRef(null);
  const formRef = useRef(null);
  const returnFocusRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [need, setNeed] = useState();
  const [status, setStatus] = useState({ kind: 'idle' });
  const [errors, setErrors] = useState({});

  useEffect(
    () =>
      onContact(({ open: next, need: nextNeed }) => {
        if (next) {
          returnFocusRef.current = document.activeElement;
        } else if (panelRef.current?.contains(document.activeElement)) {
          // devolve o foco antes de o painel ficar oculto para leitores de tela
          const target = returnFocusRef.current;
          if (target?.isConnected) target.focus({ preventScroll: true });
          else document.activeElement.blur();
        }
        setNeed(nextNeed);
        setOpen(next);
      }),
    [],
  );

  // abre e fecha com animação, prende o foco e fecha com Esc
  useEffect(() => {
    const root = rootRef.current;
    const panel = panelRef.current;
    if (!root || !panel) return undefined;
    const reduced = prefersReduced();
    const backdrop = root.querySelector('[data-backdrop]');

    if (open) {
      lockScroll(true);
      gsap.set(root, { visibility: 'visible' });
      gsap.fromTo(backdrop, { opacity: 0 }, { opacity: 1, duration: reduced ? 0 : 0.5 });
      gsap.fromTo(panel, { xPercent: 100 }, { xPercent: 0, duration: reduced ? 0 : 0.9, ease: 'expo.out' });
      const focusTimer = window.setTimeout(
        () => panel.querySelector('input:not([type="radio"]):not([tabindex="-1"])')?.focus({ preventScroll: true }),
        reduced ? 0 : 450,
      );
      const onKey = (event) => {
        if (event.key === 'Escape') closeContact();
        if (event.key !== 'Tab') return;
        const focusable = panel.querySelectorAll('button, input:not([tabindex="-1"]), textarea, a[href]');
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      };
      window.addEventListener('keydown', onKey);
      return () => {
        window.clearTimeout(focusTimer);
        window.removeEventListener('keydown', onKey);
      };
    }

    if (root.style.visibility === 'visible') {
      lockScroll(false);
      gsap.to(backdrop, { opacity: 0, duration: reduced ? 0 : 0.4 });
      gsap.to(panel, {
        xPercent: 100,
        duration: reduced ? 0 : 0.6,
        ease: 'expo.in',
        onComplete: () => gsap.set(root, { visibility: 'hidden' }),
      });
    }
    return undefined;
  }, [open]);

  // pré-seleciona o assunto quando o painel é aberto a partir de um cartão
  useEffect(() => {
    if (!open || !formRef.current) return;
    formRef.current.querySelectorAll('input[name="assunto"]').forEach((input) => {
      input.checked = !!need && need.toLowerCase().startsWith(input.value.toLowerCase().split(' ')[0]);
    });
  }, [open, need]);

  const submit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const values = {
      nome: String(data.get('nome') ?? '').trim(),
      email: String(data.get('email') ?? '').trim(),
      empresa: String(data.get('empresa') ?? '').trim(),
      assunto: String(data.get('assunto') ?? need ?? '').trim(),
      mensagem: String(data.get('mensagem') ?? '').trim(),
    };

    const nextErrors = {};
    if (values.nome.length < 2) nextErrors.nome = 'Informe o seu nome.';
    if (!EMAIL_PATTERN.test(values.email)) nextErrors.email = 'Informe um e-mail válido.';
    if (values.mensagem.length < 10) nextErrors.mensagem = 'Escreva uma mensagem com pelo menos 10 caracteres.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      form.querySelector(`[name="${Object.keys(nextErrors)[0]}"]`)?.focus();
      return;
    }
    if (data.get('_gotcha')) return; // honeypot: robôs preenchem, pessoas não

    setStatus({ kind: 'sending' });
    try {
      const body = new FormData();
      body.append('name', values.nome);
      body.append('email', values.email);
      body.append('company', values.empresa);
      body.append('subject', values.assunto || 'Contato pelo portfólio');
      body.append('message', values.mensagem);
      const response = await fetch(site.formEndpoint, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body,
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      form.reset();
      setStatus({ kind: 'sent', message: 'Mensagem enviada. Obrigado pelo contato, respondo em breve!' });
    } catch {
      setStatus({
        kind: 'error',
        message: `Não foi possível enviar agora. Se preferir, escreva para ${site.email}.`,
      });
    }
  };

  const field = (name, label, props = {}) => (
    <div className={cx('field', errors[name] && 'field--invalid')}>
      <input
        id={`contato-${name}`}
        name={name}
        className="field__input"
        placeholder=" "
        aria-invalid={!!errors[name]}
        aria-describedby={errors[name] ? `erro-${name}` : undefined}
        {...props}
      />
      <label className="field__label" htmlFor={`contato-${name}`}>
        {label}
      </label>
      {errors[name] && (
        <p className="field__error" id={`erro-${name}`}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div ref={rootRef} className="drawer" aria-hidden={!open} inert={open ? undefined : ''}>
      <div className="drawer__backdrop" data-backdrop onClick={closeContact} />
      <aside
        ref={panelRef}
        className="drawer__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        data-lenis-prevent
      >
        <div className="drawer__head">
          <span className="chip">
            <b>✦</b>
            <span>Contato</span>
          </span>
          <button type="button" className="drawer__close" onClick={closeContact}>
            <span className="sr-only">Fechar</span>
            <span aria-hidden="true" />
          </button>
        </div>

        <h2 className="drawer__title" id="drawer-title">
          {drawer.title}
        </h2>
        <p className="drawer__lead">{drawer.lead}</p>

        <form ref={formRef} className="drawer__form" onSubmit={submit} noValidate>
          <div className="drawer__row">
            {field('nome', 'Nome', { type: 'text', autoComplete: 'name', required: true })}
            {field('email', 'E-mail', { type: 'email', autoComplete: 'email', required: true })}
          </div>
          {field('empresa', 'Empresa (opcional)', { type: 'text', autoComplete: 'organization' })}

          <fieldset className="drawer__needs">
            <legend className="drawer__legend">Sobre o que você quer falar?</legend>
            <div className="drawer__chips">
              {drawer.needs.map((item) => (
                <label key={item} className="drawer__chip">
                  <input type="radio" name="assunto" value={item} />
                  <span>{item}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className={cx('field', errors.mensagem && 'field--invalid')}>
            <textarea
              id="contato-mensagem"
              name="mensagem"
              className="field__input field__input--area"
              placeholder=" "
              rows={5}
              required
              aria-invalid={!!errors.mensagem}
              aria-describedby={errors.mensagem ? 'erro-mensagem' : undefined}
            />
            <label className="field__label" htmlFor="contato-mensagem">
              Mensagem
            </label>
            {errors.mensagem && (
              <p className="field__error" id="erro-mensagem">
                {errors.mensagem}
              </p>
            )}
          </div>

          <input type="text" name="_gotcha" tabIndex={-1} autoComplete="off" className="sr-only" aria-hidden="true" />

          <div className="drawer__submit">
            <Button type="submit" disabled={status.kind === 'sending'}>
              {status.kind === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
            </Button>
            <p className="drawer__note">{drawer.privacy}</p>
          </div>
          <p className={cx('drawer__status', status.kind === 'error' && 'drawer__status--error')} role="status">
            {status.message ?? ''}
          </p>
        </form>
      </aside>
    </div>
  );
}
