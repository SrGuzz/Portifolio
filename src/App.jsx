import { useCallback, useEffect, useState } from 'react';
import { journey, TOTAL_VH } from './lib/journey';
import { startSmoothScroll } from './lib/smooth';
import { World } from './world/World';
import { playWorldIntro } from './world/bridge';
import { Stage } from './components/primitives';
import { Loader } from './components/Loader';
import { Header } from './components/Header';
import { Hud } from './components/Hud';
import { CursorTag } from './components/CursorTag';
import { ContactDrawer } from './components/ContactDrawer';
import { Intro } from './scenes/Intro';
import { About, Manifesto } from './scenes/About';
import { Services } from './scenes/Services';
import { ProjectsGallery, ProjectsIntro } from './scenes/Projects';
import { PathDetails, PathIntro, PathSteps } from './scenes/Path';
import { StackIntro, StackPanel } from './scenes/Stack';
import { Contact } from './scenes/Contact';
import { useLanguage } from './i18n/language';

function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

export default function App() {
  const { lang, content } = useLanguage();
  const [ready, setReady] = useState(false);
  const compact = useMediaQuery('(max-width: 1023px)');

  useEffect(() => startSmoothScroll(), []);
  useEffect(() => {
    journey.start();
    return () => journey.stop();
  }, []);

  const reveal = useCallback(() => {
    setReady(true);
    playWorldIntro();
  }, []);

  return (
    <>
      <a className="skip-link" href="#conteudo">
        {content.ui.skip}
      </a>
      <Loader onReveal={reveal} />
      <World />
      <CursorTag />
      <Header ready={ready} />

      <main id="conteudo" tabIndex={-1}>
        {/* a altura da página vem deste espaçador; o conteúdo vive no palco fixo */}
        <div aria-hidden="true" style={{ height: `${TOTAL_VH}vh` }} />
        <Stage key={`${compact ? 'compact' : 'wide'}-${lang}`}>
          <Intro />
          <About />
          <Manifesto />
          <Services compact={compact} />
          <ProjectsIntro />
          <ProjectsGallery compact={compact} />
          <PathIntro />
          <PathSteps />
          <PathDetails />
          <StackIntro />
          <StackPanel />
          <Contact />
        </Stage>
      </main>

      <Hud ready={ready} />
      <ContactDrawer />
    </>
  );
}
