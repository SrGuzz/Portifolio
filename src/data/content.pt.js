// Conteúdo do site em português. A versão em inglês fica em content.en.js
// e precisa ter exatamente a mesma estrutura.
// Fonte dos dados: perfil do LinkedIn (linkedin.com/in/albert-luis) e,
// para o Navalha e a Nina, a documentação dos próprios projetos.
// Trechos entre **asteriscos** recebem o destaque dourado animado.

import navalha from '../assets/projects/navalha.webp';
import portalConselhos from '../assets/projects/portal-conselhos.webp';
import glet from '../assets/projects/glet.webp';
import cvPt from '../assets/CV-PT.pdf';

export const meta = {
  htmlLang: 'pt-BR',
  title: 'Albert Luis · Desenvolvedor de Software',
  description:
    'Portfólio de Albert Luis, desenvolvedor de software em Belo Horizonte. IA aplicada, Python, APIs e automação.',
};

export const site = {
  name: 'Albert Luis',
  fullName: 'Albert Luis Pereira de Jesus',
  role: 'Desenvolvedor de Software',
  headline: 'Foco em Inteligência Artificial · Python, APIs e Automação',
  location: 'Belo Horizonte, MG',
  email: 'albertluis123y88@gmail.com',
  social: [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/albert-luis' },
    { label: 'GitHub', href: 'https://github.com/SrGuzz' },
    { label: 'Instagram', href: 'https://www.instagram.com/albertluis__/' },
  ],
  // Função serverless (api/contact.js) que envia o contato por e-mail via Resend.
  contactEndpoint: '/api/contact',
};

export const nav = [
  { label: 'Sobre', chapter: 'sobre' },
  { label: 'Projetos', chapter: 'projetos' },
  { label: 'Trajetória', chapter: 'trajetoria' },
  { label: 'Stack', chapter: 'stack' },
];

export const intro = {
  title: `${site.name} · ${site.role}`,
  hint: 'Role para explorar',
};

export const about = {
  chip: 'Sobre',
  title: 'Software que sai do papel e roda em produção.',
  lead: 'Sou Albert Luis, desenvolvedor de software em Belo Horizonte. Trabalho com Python, APIs e automação, com foco em Inteligência Artificial.',
  manifesto: [
    'Na minha máquina, todo código **funciona**.',
    'Em produção, ele precisa **resolver**.',
  ],
};

export const services = {
  label: 'O que eu faço',
  more: 'Vamos conversar',
  items: [
    {
      title: 'IA aplicada',
      text: 'Agentes de IA que conversam, consultam dados e executam tarefas, como a Nina: uma SDR que atende, qualifica e agenda pelo WhatsApp.',
      tags: ['Agentes de IA', 'RAG', 'Tool calling'],
      icon: 'spark',
    },
    {
      title: 'APIs e back-end',
      text: 'Serviços em Python e FastAPI, com APIs REST bem definidas e prontas para integrar.',
      tags: ['Python', 'FastAPI', 'APIs REST'],
      icon: 'api',
    },
    {
      title: 'Integrações e automação',
      text: 'Sistemas internos e parceiros conversando entre si, e rotinas manuais virando processos automáticos.',
      tags: ['Integrações', 'Automação', 'Processos'],
      icon: 'plug',
    },
    {
      title: 'Dados e SQL',
      text: 'Mapeamento, validação, transformação e consulta de dados em PostgreSQL e MySQL.',
      tags: ['SQL', 'PostgreSQL', 'MySQL'],
      icon: 'database',
    },
  ],
};

export const projectsIntro = {
  chip: 'Projetos',
  title: 'Projetos que já estão **no ar**.',
  card: {
    label: 'Em destaque: Navalha',
    text: 'O Navalha é o meu principal projeto autoral: um SaaS de gestão para barbearias. Cada barbearia ganha um site próprio para agendamentos e um painel com agenda, PIX e cartão, assinaturas, caixa, relatórios e WhatsApp.',
    stats: [
      { label: 'Produto', value: 'SaaS para barbearias' },
      { label: 'Tipo', value: 'Projeto autoral' },
      { label: 'Arquitetura', value: 'Multi-tenant' },
    ],
    stackLabel: 'STACK',
    stack: 'Laravel · React · TypeScript · PostgreSQL',
    cta: 'Conhecer o Navalha',
    href: 'https://navalhacode.com.br/',
  },
};

// "visual" troca o screenshot por uma tela montada em código (ver scenes/NinaScreen.jsx).
export const projects = [
  {
    index: '01',
    badge: 'Navalha',
    status: 'Projeto autoral',
    title: 'Gestão completa para barbearias',
    text: 'SaaS multi-tenant em que cada barbearia ganha um site próprio para agendamentos e um painel para cuidar da agenda, do caixa, das assinaturas e dos relatórios. O cliente agenda, paga e assina pelo celular.',
    features: ['Agenda online', 'PIX e cartão', 'Clube de assinatura', 'Caixa e comandas', 'WhatsApp', 'PWA'],
    meta: 'Laravel · React · TypeScript · PostgreSQL',
    link: 'Ver uma barbearia de exemplo',
    href: 'https://navalha.navalhacode.com.br/',
    url: 'navalha.navalhacode.com.br',
    image: navalha,
  },
  {
    index: '02',
    badge: 'Nina',
    status: 'Case de IA',
    title: 'Uma SDR de IA no WhatsApp',
    text: 'Agente de IA da AW Code que atende e prospecta leads pelo WhatsApp, em produção. Entende texto e áudio, consulta a base de conhecimento, guarda a memória de cada contato e marca, remarca e cancela apresentações na agenda real.',
    features: ['Gemini', 'RAG', 'Tool calling', 'Áudio e voz', 'Follow-up', 'Funil de vendas'],
    meta: 'Supabase · Edge Functions · React · Gemini',
    link: 'Falar sobre o projeto',
    href: '',
    visual: 'nina',
  },
  {
    index: '03',
    badge: 'Portal dos Conselhos',
    status: 'Em produção',
    title: 'Participação social ao alcance de todos',
    text: 'Ferramenta de acompanhamento das Instituições Participativas de Minas Gerais. Contribuí diretamente para o desenvolvimento e o lançamento da nova versão, durante o estágio na CGE-MG.',
    features: ['Composição dos conselhos', 'Atas de reunião', 'Normas', 'Contatos e links'],
    meta: 'CGE-MG · Setor público',
    link: 'Acessar o portal',
    href: 'https://portaldosconselhos.mg.gov.br/',
    url: 'portaldosconselhos.mg.gov.br',
    image: portalConselhos,
  },
  {
    index: '04',
    badge: 'GLET',
    status: 'Projeto acadêmico',
    title: 'Logística com rotas e indicadores',
    text: 'Plataforma web de logística e transporte, com gestão de frota, funcionários e serviços, e um mapa para programar e acompanhar as rotas.',
    features: ['Fluxo de serviços', 'Frota', 'Funcionários', 'Mapa de rotas'],
    meta: 'PUC Minas · Projeto acadêmico',
    link: 'Ver no GitHub',
    href: 'https://github.com/SrGuzz/GLET',
    url: 'github.com/SrGuzz/GLET',
    image: glet,
  },
];

// Conversa fictícia usada na tela ilustrativa da Nina.
export const ninaDemo = {
  name: 'Nina',
  role: 'SDR da AW Code',
  messages: [
    { from: 'lead', text: 'Oi! Vi o Navalha no Instagram. Como funciona?' },
    {
      from: 'nina',
      text: 'Oi! Ele cuida da agenda, do caixa e das assinaturas da barbearia. Posso te mostrar em uma apresentação rápida?',
    },
    { from: 'lead', audio: '0:09', text: 'Pode ser na quinta à tarde?' },
    { from: 'tools', tools: ['check_availability', 'create_appointment'] },
    { from: 'nina', text: 'Agendado: quinta, 15h. Enviei o convite com o link do Meet.' },
  ],
  flowTitle: 'Fluxo de uma mensagem',
  flow: [
    { name: 'Webhook', text: 'A mensagem chega do WhatsApp' },
    { name: 'Agrupador', text: 'Junta mensagens e transcreve áudio' },
    { name: 'Orquestrador', text: 'Prompt, memória e RAG no Gemini' },
    { name: 'Ferramentas', text: 'Agenda, convite e follow-up' },
    { name: 'Envio', text: 'A resposta volta para o WhatsApp' },
  ],
  stack: ['Gemini', 'Supabase', 'Deno'],
};

export const journeyPath = {
  chip: 'Trajetória',
  title: 'Do primeiro estágio ao código em produção.',
  lead: 'Três experiências, uma graduação em andamento e muito aprendizado no caminho.',
  steps: [
    {
      key: 'PUC Minas',
      short: 'Eng. de Software · 2023',
      title: 'Engenharia de Software na PUC Minas.',
      text: 'Bacharelado em Engenharia de Software, com conclusão prevista para julho de 2027. No caminho, Java, Spring Boot, C++ e modelagem de processos.',
      terminal: ['> PUC MINAS → FEV. 2023 — JUL. 2027', 'JAVA · SPRING BOOT · C++ · BPMN'],
    },
    {
      key: 'Esmeraldas',
      short: 'Geoprocessamento · 2023',
      title: 'Dados que viram mapas.',
      text: 'Estágio em Sistemas de Geoprocessamento na Prefeitura de Esmeraldas: planejamento urbano, gestão territorial e análises técnicas com SIG, QGIS e banco de dados.',
      terminal: ['> PREF. DE ESMERALDAS → OUT. 2023 — MAI. 2024', 'SIG · QGIS · GOOGLE EARTH PRO · BANCO DE DADOS'],
    },
    {
      key: 'CGE-MG',
      short: 'Desenvolvimento · 2024',
      title: 'Do código local à produção.',
      text: 'Dois anos como estagiário de desenvolvimento na Controladoria-Geral do Estado de Minas Gerais: novas funcionalidades, testes, correções e revisões de código em sistemas usados de verdade.',
      terminal: ['> CGE-MG → AGO. 2024 — JUL. 2026', 'PHP · LARAVEL · LIVEWIRE · MYSQL · TAILWIND'],
    },
    {
      key: 'Central dos Benefícios',
      short: 'Desenvolvedor Web · 2026',
      title: 'APIs, dados e automação.',
      text: 'Hoje sou Desenvolvedor Web na Central dos Benefícios. Atuo no back-end com Python e FastAPI, em APIs REST, integrações com parceiros e automação de processos.',
      terminal: ['> CENTRAL DOS BENEFÍCIOS → JUL. 2026 — HOJE', 'PYTHON · FASTAPI · POSTGRESQL · MYSQL'],
    },
  ],
  details: 'Um bom software resolve um problema real.',
};

export const stack = {
  chip: 'Stack',
  title: 'Do banco de dados à interface.',
  lead: 'As tecnologias que uso no dia a dia e as que me trouxeram até aqui.',
  layers: [
    { index: '01', name: 'Interface', role: 'Front-end' },
    { index: '02', name: 'Regras', role: 'Back-end' },
    { index: '03', name: 'Dados', role: 'Banco de dados' },
  ],
  items: [
    { title: 'IA generativa e agentes', text: 'Gemini, RAG, tool calling e automação de conversas, como na Nina.', icon: 'spark' },
    { title: 'Python e FastAPI', text: 'APIs REST, integrações e automação de processos no back-end.', icon: 'api' },
    { title: 'SQL, PostgreSQL e MySQL', text: 'Mapeamento, validação, transformação e consulta de dados.', icon: 'database' },
    { title: 'PHP e Laravel', text: 'Do Navalha aos sistemas do setor público, com Livewire e Joomla 5.', icon: 'layers' },
    { title: 'React e TypeScript', text: 'Interfaces com React, Tailwind CSS e HTML bem acabado.', icon: 'dashboard' },
    { title: 'Git e trabalho em equipe', text: 'Versionamento, revisões de código e metodologias ágeis.', icon: 'loop' },
  ],
};

export const contact = {
  chip: 'Contato',
  title: 'Vamos construir algo juntos.',
  lead: 'Tem um projeto, uma ideia ou quer trocar uma ideia sobre tecnologia? Me conte o que você precisa.',
  cta: 'Entrar em contato',
  cv: 'Currículo',
  cvHref: cvPt,
  cvFile: 'Albert-Luis-Curriculo.pdf',
  services: ['Python', 'APIs', 'Automação', 'IA'],
  rights: 'Todos os direitos reservados.',
};

export const drawer = {
  title: 'Vamos conversar.',
  lead: 'Conte um pouco sobre o que você precisa. Eu respondo com os próximos passos.',
  needs: ['Projeto', 'Oportunidade', 'Parceria', 'Só um oi'],
  privacy: 'Seus dados são usados só para responder a este contato.',
};

// Textos de interface (rótulos, botões, mensagens e acessibilidade).
export const ui = {
  skip: 'Pular para o conteúdo',
  backHome: 'voltar ao início',
  mainNav: 'Navegação principal',
  menu: 'Menu',
  openMenu: 'Abrir menu',
  closeMenu: 'Fechar menu',
  contact: 'Contato',
  chapter: 'Capítulo',
  chapters: {
    inicio: 'Início',
    sobre: 'Sobre',
    projetos: 'Projetos',
    trajetoria: 'Trajetória',
    stack: 'Stack',
    contato: 'Contato',
  },
  language: 'Idioma',
  scenes: {
    intro: 'Início',
    about: 'Sobre',
    manifesto: 'Manifesto',
    services: 'O que eu faço',
    projects: 'Projetos',
    gallery: 'Galeria de projetos',
    path: 'Trajetória',
    steps: 'Etapas da trajetória',
    details: 'Fechamento da trajetória',
    stack: 'Stack',
    tech: 'Tecnologias',
    contact: 'Contato',
  },
  technologies: 'Tecnologias',
  features: 'Funcionalidades',
  openProject: 'Abrir projeto',
  talk: 'Conversar',
  area: 'ÁREA',
  copy: 'Copiar',
  copied: 'Copiado',
  audio: 'Áudio transcrito',
  form: {
    close: 'Fechar',
    name: 'Nome',
    email: 'E-mail',
    company: 'Empresa (opcional)',
    subject: 'Sobre o que você quer falar?',
    message: 'Mensagem',
    send: 'Enviar mensagem',
    sending: 'Enviando…',
    defaultSubject: 'Contato pelo portfólio',
    errName: 'Informe o seu nome.',
    errEmail: 'Informe um e-mail válido.',
    errMessage: 'Escreva uma mensagem com pelo menos 10 caracteres.',
    sent: 'Mensagem enviada. Obrigado pelo contato, respondo em breve!',
    failed: 'Não foi possível enviar agora. Se preferir, escreva para',
  },
};
