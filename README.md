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
├─ data/content.pt.js  texto e links em português
├─ data/content.en.js  mesma estrutura, em inglês
├─ i18n/language.jsx   idioma ativo (URL ?lang=, escolha salva ou navegador)
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

Para mudar um texto, edite `src/data/content.pt.js` e `src/data/content.en.js` (as duas versões têm a mesma estrutura). O seletor PT/EN fica no cabeçalho, e `?lang=en` na URL abre o site direto em inglês. Para mudar o ritmo de um capítulo, ajuste `SEGMENTS` em `src/lib/journey.js`.

## Formulário de contato

O formulário envia para `/api/contact` (`api/contact.js`), uma função serverless do Vercel que manda a mensagem por e-mail usando o [Resend](https://resend.com). O e-mail chega em `CONTACT_TO` (padrão: albertluis123y88@gmail.com), com resposta direta para quem escreveu.

Variáveis de ambiente (modelo em `.env.example`):

| Variável | Obrigatória | Uso |
|---|---|---|
| `RESEND_API_KEY` | sim | chave da API do Resend |
| `CONTACT_TO` | não | destino das mensagens |
| `CONTACT_FROM` | não | remetente; precisa ser de um domínio verificado no Resend. Sem domínio, `onboarding@resend.dev` só entrega para o e-mail dono da conta |

Para testar localmente, crie `.env.local` com essas variáveis: o `npm run dev` também serve `/api/contact`.

## Deploy

O site está no Vercel, ligado a este repositório: cada push na `main` publica uma nova versão. A configuração de build fica em `vercel.json`, e as variáveis do formulário são cadastradas em Settings › Environment Variables do projeto no Vercel.
