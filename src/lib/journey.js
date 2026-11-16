import gsap from 'gsap';
import { prefersReduced } from './env';
import { getLenis } from './smooth';

// A "jornada" converte a posição do scroll em um valor contínuo J.
// Cada cena registra uma timeline pausada com um J inicial; a cada frame
// a jornada posiciona todas as timelines no tempo (J atual - J inicial).
// O mundo 3D lê o mesmo J para interpolar câmera e formações.

// Os nomes de cada capítulo ficam em ui.chapters, no conteúdo de cada idioma.
export const CHAPTERS = [
  { id: 'inicio', anchor: 0, from: 0 },
  { id: 'sobre', anchor: 1.16, from: 1 },
  { id: 'projetos', anchor: 2.14, from: 2 },
  { id: 'trajetoria', anchor: 3.72, from: 3.6 },
  { id: 'stack', anchor: 4.78, from: 4.6 },
  { id: 'contato', anchor: 6.2, from: 5.6 },
];

// Quanto de rolagem (em vh) cada trecho de J consome.
const SEGMENTS = [
  { from: 0, to: 1, vhPerJ: 170 }, // abertura
  { from: 1, to: 1.28, vhPerJ: 700 }, // sobre
  { from: 1.28, to: 1.6, vhPerJ: 1120 }, // manifesto
  { from: 1.6, to: 2, vhPerJ: 700 }, // o que eu faço
  { from: 2, to: 2.28, vhPerJ: 640 }, // projetos: abertura
  { from: 2.28, to: 3.6, vhPerJ: 800 }, // projetos: galeria
  { from: 3.6, to: 4.6, vhPerJ: 920 }, // trajetória
  { from: 4.6, to: 5.6, vhPerJ: 460 }, // stack
  { from: 5.6, to: 6.6, vhPerJ: 130 }, // contato
];

export const TOTAL_VH = SEGMENTS.reduce((sum, s) => sum + (s.to - s.from) * s.vhPerJ, 0) + 100;

const chapterAt = (value) => {
  let index = 0;
  for (let i = 0; i < CHAPTERS.length; i++) {
    if (value + 0.02 >= CHAPTERS[i].from) index = i;
  }
  return index;
};

class Journey {
  target = 0;
  value = 0;
  chapter = 0;
  smoothing = 7;
  entries = new Set();
  chapterListeners = new Set();
  frameListeners = new Set();
  running = false;
  lastApplied = -1;

  /** J correspondente à posição atual do scroll. */
  measure() {
    const unit = window.innerHeight / 100 || 1;
    let vh = window.scrollY / unit;
    for (let i = 0; i < SEGMENTS.length; i++) {
      const s = SEGMENTS[i];
      const length = (s.to - s.from) * s.vhPerJ;
      if (vh < length || i === SEGMENTS.length - 1) {
        return s.from + Math.min(s.to - s.from, Math.max(0, vh / s.vhPerJ));
      }
      vh -= length;
    }
    return SEGMENTS[SEGMENTS.length - 1].to;
  }

  /** Posição de scroll (px) para um dado J. */
  scrollFor(j) {
    let vh = 0;
    for (let i = 0; i < SEGMENTS.length; i++) {
      const s = SEGMENTS[i];
      if (j < s.to || i === SEGMENTS.length - 1) {
        vh += Math.min(s.to - s.from, Math.max(0, j - s.from)) * s.vhPerJ;
        break;
      }
      vh += (s.to - s.from) * s.vhPerJ;
    }
    return vh * (window.innerHeight / 100);
  }

  scrollTo(j, immediate = false, duration = 2.2) {
    const top = this.scrollFor(j);
    const lenis = getLenis();
    if (lenis) {
      lenis.scrollTo(top, {
        duration: immediate ? 0 : duration,
        immediate,
        easing: (t) => 1 - (1 - t) ** 4,
      });
    } else {
      window.scrollTo({ top, behavior: immediate || prefersReduced() ? 'auto' : 'smooth' });
    }
  }

  scrollToChapter(id) {
    const chapter = CHAPTERS.find((c) => c.id === id);
    if (chapter) this.scrollTo(chapter.anchor);
  }

  register(timeline, start) {
    const entry = { timeline, start };
    timeline.pause();
    this.entries.add(entry);
    this.apply(entry);
    return () => {
      this.entries.delete(entry);
    };
  }

  onChapter(listener) {
    this.chapterListeners.add(listener);
    listener(this.chapter);
    return () => {
      this.chapterListeners.delete(listener);
    };
  }

  onFrame(listener) {
    this.frameListeners.add(listener);
    return () => {
      this.frameListeners.delete(listener);
    };
  }

  start() {
    if (this.running) return;
    this.running = true;
    this.target = this.value = this.measure();
    gsap.ticker.add(this.tick);
  }

  stop() {
    this.running = false;
    gsap.ticker.remove(this.tick);
  }

  apply(entry) {
    const { timeline, start } = entry;
    const time = Math.min(timeline.duration(), Math.max(0, this.value - start));
    if (timeline.time() !== time) timeline.time(time, false);
  }

  tick = (_time, deltaMs) => {
    const dt = Math.min(0.1, deltaMs / 1000);
    this.target = this.measure();
    if (prefersReduced() || this.smoothing <= 0) {
      this.value = this.target;
    } else {
      this.value += (this.target - this.value) * (1 - Math.exp(-dt * this.smoothing));
    }
    if (Math.abs(this.value - this.target) < 1e-4) this.value = this.target;

    if (this.value !== this.lastApplied) {
      this.lastApplied = this.value;
      this.entries.forEach((entry) => this.apply(entry));
      const chapter = chapterAt(this.value);
      if (chapter !== this.chapter) {
        this.chapter = chapter;
        this.chapterListeners.forEach((listener) => listener(chapter));
      }
    }
    this.frameListeners.forEach((listener) => listener(dt, this.value));
  };
}

export const journey = new Journey();
