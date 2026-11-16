# Albert Luis · Portfólio

Portfólio pessoal de Albert Luis, desenvolvedor de software. Uma página única guiada pelo scroll: o conteúdo vive em um palco fixo e um cenário 3D acompanha cada capítulo.

## Tecnologias

- [Vite](https://vite.dev/) + [React 18](https://react.dev/)
- [GSAP](https://gsap.com/) (SplitText, DrawSVG e TextPlugin) para as animações
- [Lenis](https://lenis.darkroom.engineering/) para a rolagem suave
- [three.js](https://threejs.org/) para o cenário 3D
- Fontes Sora, Geist e Geist Mono (via Fontsource)

## Rodando localmente

Requer Node.js 20 ou superior.

```sh
npm install
npm run dev
```

O site abre em http://localhost:5173.

```sh
npm run build    # gera a versão de produção em ./build
npm run preview  # serve a versão de produção localmente
```

## Estrutura

```
src/
├─ data/content.js     todo o texto e os links do site
├─ lib/
│  ├─ journey.js       converte o scroll em um valor contínuo (J) e guia as timelines
│  ├─ smooth.js        rolagem suave e navegação por teclado
│  ├─ fx.js            blocos de animação reutilizados pelas cenas
│  └─ decode.js        efeito de texto "decodificando"
├─ world/              cenário 3D
│  ├─ engine.js        renderização, peças, monograma e piso
│  ├─ formations.js    formações das peças e roteiro da câmera
│  ├─ icons.js         ícones (usados no DOM e nas texturas 3D)
│  └─ bridge.js        comunicação entre as cenas e o motor 3D
├─ components/         cabeçalho, HUD, abertura, cursor e painel de contato
├─ scenes/             uma cena por trecho da página
└─ styles/             tokens, camadas fixas e layout das cenas
```

### Como o scroll funciona

A página tem um espaçador com a altura total da rolagem. `journey.js` transforma a posição do scroll em um valor `J`; cada cena registra uma timeline pausada do GSAP com um `J` inicial, e a cada frame a timeline é posicionada em `J atual - J inicial`. O cenário 3D lê o mesmo `J` para interpolar câmera, tema e formação das peças.

Para mudar um texto, edite `src/data/content.js`. Para mudar o ritmo de um capítulo, ajuste `SEGMENTS` em `src/lib/journey.js`.

## Deploy

O push na branch `main` dispara o workflow em `.github/workflows/deploy.yml`, que roda `npm run build` e publica a pasta `build/` no GitHub Pages.
