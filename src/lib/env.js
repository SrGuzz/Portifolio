const REDUCED = '(prefers-reduced-motion: reduce)';
const FINE_POINTER = '(hover: hover) and (pointer: fine)';

const matches = (query) => typeof window !== 'undefined' && window.matchMedia(query).matches;

export const prefersReduced = () => matches(REDUCED);
export const hasFinePointer = () => matches(FINE_POINTER);

export const session = {
  get(key) {
    try {
      return window.sessionStorage.getItem(key);
    } catch {
      return null;
    }
  },
  set(key, value) {
    try {
      window.sessionStorage.setItem(key, value);
    } catch {
      /* armazenamento indisponível: segue sem persistir */
    }
  },
};

export const cx = (...parts) => parts.filter(Boolean).join(' ');
