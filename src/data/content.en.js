// Site content in English. It mirrors content.pt.js exactly; links,
// images and contact data are reused from the Portuguese file.
// Text between **asterisks** gets the animated gold highlight.

import * as pt from './content.pt';
import cvEn from '../assets/CV-EN.pdf';

export const meta = {
  htmlLang: 'en',
  title: 'Albert Luis · Software Developer',
  description:
    'Portfolio of Albert Luis, a software developer based in Belo Horizonte, Brazil. Applied AI, Python, APIs and automation.',
};

export const site = {
  ...pt.site,
  role: 'Software Developer',
  headline: 'Focused on Artificial Intelligence · Python, APIs and Automation',
  location: 'Belo Horizonte, Brazil',
};

export const nav = [
  { label: 'About', chapter: 'sobre' },
  { label: 'Projects', chapter: 'projetos' },
  { label: 'Journey', chapter: 'trajetoria' },
  { label: 'Stack', chapter: 'stack' },
];

export const intro = {
  title: `${site.name} · ${site.role}`,
  hint: 'Scroll to explore',
};

export const about = {
  chip: 'About',
  title: 'Software that leaves the drawing board and runs in production.',
  lead: "I'm Albert Luis, a software developer in Belo Horizonte, Brazil. I work with Python, APIs and automation, focused on Artificial Intelligence.",
  manifesto: ['On my machine, all code **works**.', 'In production, it has to **deliver**.'],
};

export const services = {
  label: 'What I do',
  more: "Let's talk",
  items: [
    {
      title: 'Applied AI',
      text: 'AI agents that talk, query data and get things done, like Nina: an SDR that answers, qualifies and books meetings on WhatsApp.',
      tags: ['AI agents', 'RAG', 'Tool calling'],
      icon: 'spark',
    },
    {
      title: 'APIs and back-end',
      text: 'Python and FastAPI services with well-defined REST APIs, ready to integrate.',
      tags: ['Python', 'FastAPI', 'REST APIs'],
      icon: 'api',
    },
    {
      title: 'Integrations and automation',
      text: 'Internal systems and partners talking to each other, and manual routines turned into automated processes.',
      tags: ['Integrations', 'Automation', 'Processes'],
      icon: 'plug',
    },
    {
      title: 'Data and SQL',
      text: 'Mapping, validating, transforming and querying data in PostgreSQL and MySQL.',
      tags: ['SQL', 'PostgreSQL', 'MySQL'],
      icon: 'database',
    },
  ],
};

export const projectsIntro = {
  chip: 'Projects',
  title: 'Projects that are already **live**.',
  card: {
    ...pt.projectsIntro.card,
    label: 'Featured: Navalha',
    text: 'Navalha is my main personal project: a management SaaS for barbershops. Each barbershop gets its own booking website and a dashboard with scheduling, PIX and card payments, memberships, cash register, reports and WhatsApp.',
    stats: [
      { label: 'Product', value: 'SaaS for barbershops' },
      { label: 'Type', value: 'Personal project' },
      { label: 'Architecture', value: 'Multi-tenant' },
    ],
    cta: 'Discover Navalha',
  },
};

const [navalha, nina, conselhos, glet] = pt.projects;

export const projects = [
  {
    ...navalha,
    status: 'Personal project',
    title: 'End-to-end management for barbershops',
    text: 'Multi-tenant SaaS where each barbershop gets its own booking website and a dashboard to run scheduling, cash register, memberships and reports. Customers book, pay and subscribe from their phones.',
    features: ['Online booking', 'PIX and cards', 'Membership club', 'Cash register', 'WhatsApp', 'PWA'],
    link: 'See a sample barbershop',
  },
  {
    ...nina,
    status: 'AI case study',
    title: 'An AI SDR on WhatsApp',
    text: "AW Code's AI agent that handles and prospects leads on WhatsApp, in production. It understands text and voice, searches the knowledge base, remembers each contact and books, reschedules and cancels demos on the real calendar.",
    features: ['Gemini', 'RAG', 'Tool calling', 'Voice and audio', 'Follow-up', 'Sales funnel'],
    link: 'Talk about this project',
  },
  {
    ...conselhos,
    status: 'Live',
    title: 'Civic participation within everyone’s reach',
    text: 'A tool for following the participatory institutions of the state of Minas Gerais. I contributed directly to building and launching the new version during my internship at CGE-MG.',
    features: ['Council members', 'Meeting minutes', 'Regulations', 'Contacts and links'],
    meta: 'CGE-MG · Public sector',
    link: 'Visit the portal',
  },
  {
    ...glet,
    status: 'Academic project',
    title: 'Logistics with routes and metrics',
    text: 'A web platform for logistics and transportation, with fleet, staff and service management, plus a map to plan and track routes.',
    features: ['Service flow', 'Fleet', 'Staff', 'Route map'],
    meta: 'PUC Minas · Academic project',
    link: 'View on GitHub',
  },
];

// Fictional conversation used in Nina's illustrative screen.
export const ninaDemo = {
  name: 'Nina',
  role: 'SDR at AW Code',
  messages: [
    { from: 'lead', text: 'Hi! I saw Navalha on Instagram. How does it work?' },
    {
      from: 'nina',
      text: 'Hi! It handles the barbershop’s schedule, cash register and memberships. Can I show you in a quick demo?',
    },
    { from: 'lead', audio: '0:09', text: 'Could it be Thursday afternoon?' },
    { from: 'tools', tools: ['check_availability', 'create_appointment'] },
    { from: 'nina', text: 'Booked: Thursday, 3 pm. I sent the invite with the Meet link.' },
  ],
  flowTitle: 'How a message flows',
  flow: [
    { name: 'Webhook', text: 'The message arrives from WhatsApp' },
    { name: 'Grouper', text: 'Groups messages and transcribes audio' },
    { name: 'Orchestrator', text: 'Prompt, memory and RAG on Gemini' },
    { name: 'Tools', text: 'Calendar, invite and follow-up' },
    { name: 'Sender', text: 'The reply goes back to WhatsApp' },
  ],
  stack: ['Gemini', 'Supabase', 'Deno'],
};

export const journeyPath = {
  chip: 'Journey',
  title: 'From my first internship to code in production.',
  lead: 'Three jobs, a degree in progress and a lot of learning along the way.',
  steps: [
    {
      key: 'PUC Minas',
      short: 'Software Eng. · 2023',
      title: 'Software Engineering at PUC Minas.',
      text: "Bachelor's degree in Software Engineering, expected to finish in July 2027. Along the way: Java, Spring Boot, C++ and process modeling.",
      terminal: ['> PUC MINAS → FEB 2023 — JUL 2027', 'JAVA · SPRING BOOT · C++ · BPMN'],
    },
    {
      key: 'Esmeraldas',
      short: 'Geoprocessing · 2023',
      title: 'Data that becomes maps.',
      text: 'Geoprocessing Systems intern at the Esmeraldas City Hall: urban planning, land management and technical analysis with GIS, QGIS and databases.',
      terminal: ['> ESMERALDAS CITY HALL → OCT 2023 — MAY 2024', 'GIS · QGIS · GOOGLE EARTH PRO · DATABASES'],
    },
    {
      key: 'CGE-MG',
      short: 'Development · 2024',
      title: 'From local code to production.',
      text: "Two years as a development intern at Minas Gerais' Comptroller General Office: new features, tests, fixes and code reviews on systems people actually use.",
      terminal: ['> CGE-MG → AUG 2024 — JUL 2026', 'PHP · LARAVEL · LIVEWIRE · MYSQL · TAILWIND'],
    },
    {
      key: 'Central dos Benefícios',
      short: 'Web Developer · 2026',
      title: 'APIs, data and automation.',
      text: "Today I'm a Web Developer at Central dos Benefícios. I work on the back-end with Python and FastAPI, on REST APIs, partner integrations and process automation.",
      terminal: ['> CENTRAL DOS BENEFÍCIOS → JUL 2026 — NOW', 'PYTHON · FASTAPI · POSTGRESQL · MYSQL'],
    },
  ],
  details: 'Good software solves a real problem.',
};

export const stack = {
  chip: 'Stack',
  title: 'From the database to the interface.',
  lead: 'The technologies I use every day and the ones that brought me here.',
  layers: [
    { index: '01', name: 'Interface', role: 'Front-end' },
    { index: '02', name: 'Rules', role: 'Back-end' },
    { index: '03', name: 'Data', role: 'Database' },
  ],
  items: [
    { title: 'Generative AI and agents', text: 'Gemini, RAG, tool calling and conversation automation, as in Nina.', icon: 'spark' },
    { title: 'Python and FastAPI', text: 'REST APIs, integrations and process automation on the back-end.', icon: 'api' },
    { title: 'SQL, PostgreSQL and MySQL', text: 'Mapping, validating, transforming and querying data.', icon: 'database' },
    { title: 'PHP and Laravel', text: 'From Navalha to public sector systems, with Livewire and Joomla 5.', icon: 'layers' },
    { title: 'React and TypeScript', text: 'Interfaces built with React, Tailwind CSS and well-crafted HTML.', icon: 'dashboard' },
    { title: 'Git and teamwork', text: 'Version control, code reviews and agile methodologies.', icon: 'loop' },
  ],
};

export const contact = {
  chip: 'Contact',
  title: "Let's build something together.",
  lead: 'Have a project, an idea or just want to talk tech? Tell me what you need.',
  cta: 'Get in touch',
  cv: 'Résumé',
  cvHref: cvEn,
  cvFile: 'Albert-Luis-Resume.pdf',
  services: ['Python', 'APIs', 'Automation', 'AI'],
  rights: 'All rights reserved.',
};

export const drawer = {
  title: "Let's talk.",
  lead: "Tell me a bit about what you need. I'll reply with the next steps.",
  needs: ['Project', 'Opportunity', 'Partnership', 'Just saying hi'],
  privacy: 'Your data is only used to reply to this message.',
};

export const ui = {
  skip: 'Skip to content',
  backHome: 'back to the top',
  mainNav: 'Main navigation',
  menu: 'Menu',
  openMenu: 'Open menu',
  closeMenu: 'Close menu',
  contact: 'Contact',
  chapter: 'Chapter',
  chapters: {
    inicio: 'Home',
    sobre: 'About',
    projetos: 'Projects',
    trajetoria: 'Journey',
    stack: 'Stack',
    contato: 'Contact',
  },
  language: 'Language',
  scenes: {
    intro: 'Home',
    about: 'About',
    manifesto: 'Manifesto',
    services: 'What I do',
    projects: 'Projects',
    gallery: 'Project gallery',
    path: 'Journey',
    steps: 'Journey steps',
    details: 'Journey closing',
    stack: 'Stack',
    tech: 'Technologies',
    contact: 'Contact',
  },
  technologies: 'Technologies',
  features: 'Features',
  openProject: 'Open project',
  talk: "Let's talk",
  area: 'AREA',
  copy: 'Copy',
  copied: 'Copied',
  audio: 'Transcribed audio',
  form: {
    close: 'Close',
    name: 'Name',
    email: 'Email',
    company: 'Company (optional)',
    subject: 'What would you like to talk about?',
    message: 'Message',
    send: 'Send message',
    sending: 'Sending…',
    defaultSubject: 'Contact from the portfolio',
    errName: 'Please enter your name.',
    errEmail: 'Please enter a valid email.',
    errMessage: 'Please write a message with at least 10 characters.',
    sent: 'Message sent. Thanks for reaching out, I will reply soon!',
    failed: "Couldn't send it right now. If you prefer, write to",
  },
};
