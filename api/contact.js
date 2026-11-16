// Função serverless do Vercel: recebe o formulário de contato do site e
// envia a mensagem por e-mail usando a API do Resend.
//
// Variáveis de ambiente (Vercel › Settings › Environment Variables):
//   RESEND_API_KEY  obrigatória. Chave da API do Resend.
//   CONTACT_TO      opcional. Destino das mensagens (padrão abaixo).
//   CONTACT_FROM    opcional. Remetente. Precisa ser de um domínio verificado
//                   no Resend; sem domínio próprio, use onboarding@resend.dev
//                   (que só entrega para o e-mail dono da conta do Resend).

const DEFAULT_TO = 'albertluis123y88@gmail.com';
const DEFAULT_FROM = 'Portfólio Albert Luis <onboarding@resend.dev>';
const RESEND_URL = 'https://api.resend.com/emails';

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LIMITS = { name: 120, email: 200, company: 160, subject: 120, message: 5000 };

// Limite simples por IP. Fica na memória da instância: segura rajadas,
// mas não substitui uma proteção distribuída.
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

// remove quebras de linha de campos que vão para cabeçalhos do e-mail
const singleLine = (value) => String(value ?? '').replace(/[\r\n]+/g, ' ').trim();

async function readBody(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string') return JSON.parse(req.body || '{}');
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > 64 * 1024) throw new Error('payload too large');
    chunks.push(chunk);
  }
  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function send(res, status, payload) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(payload));
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return send(res, 405, { error: 'method_not_allowed' });
  }

  let body;
  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { error: 'invalid_body' });
  }

  // honeypot: robôs preenchem, pessoas não. Responde sucesso sem enviar.
  if (body._gotcha) return send(res, 200, { ok: true });

  const data = {
    name: singleLine(body.name),
    email: singleLine(body.email),
    company: singleLine(body.company),
    subject: singleLine(body.subject),
    message: String(body.message ?? '').trim(),
  };

  const errors = {};
  if (data.name.length < 2) errors.name = 'required';
  if (!EMAIL_PATTERN.test(data.email)) errors.email = 'invalid';
  if (data.message.length < 10) errors.message = 'too_short';
  for (const [field, max] of Object.entries(LIMITS)) {
    if (data[field].length > max) errors[field] = 'too_long';
  }
  if (Object.keys(errors).length) return send(res, 422, { error: 'validation', fields: errors });

  const ip = String(req.headers['x-forwarded-for'] ?? req.socket?.remoteAddress ?? 'local')
    .split(',')[0]
    .trim();
  if (rateLimited(ip)) return send(res, 429, { error: 'rate_limited' });

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('[contact] RESEND_API_KEY não configurada');
    return send(res, 500, { error: 'not_configured' });
  }

  const subjectLine = `Portfólio · ${data.subject || 'Novo contato'} · ${data.name}`;
  const rows = [
    ['Nome', data.name],
    ['E-mail', data.email],
    ['Empresa', data.company || '—'],
    ['Assunto', data.subject || '—'],
  ];
  const html = `
    <div style="font-family:system-ui,-apple-system,Segoe UI,sans-serif;color:#08090b;max-width:600px">
      <h2 style="margin:0 0 16px">Nova mensagem pelo portfólio</h2>
      <table style="border-collapse:collapse;margin-bottom:16px">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#4a5268">${label}</td><td style="padding:4px 0"><b>${escapeHtml(value)}</b></td></tr>`,
          )
          .join('')}
      </table>
      <div style="padding:16px;border-left:3px solid #c9a227;background:#f5f6f8;white-space:pre-wrap">${escapeHtml(data.message)}</div>
      <p style="color:#8a93a6;font-size:12px;margin-top:16px">Responda este e-mail para falar direto com ${escapeHtml(data.name)}.</p>
    </div>`;
  const text = `${rows.map(([label, value]) => `${label}: ${value}`).join('\n')}\n\n${data.message}`;

  try {
    const response = await fetch(RESEND_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: process.env.CONTACT_FROM || DEFAULT_FROM,
        to: [process.env.CONTACT_TO || DEFAULT_TO],
        reply_to: data.email,
        subject: subjectLine,
        html,
        text,
      }),
    });
    if (!response.ok) {
      const detail = await response.text().catch(() => '');
      console.error('[contact] Resend respondeu', response.status, detail.slice(0, 300));
      return send(res, 502, { error: 'send_failed' });
    }
    return send(res, 200, { ok: true });
  } catch (error) {
    console.error('[contact] falha ao chamar o Resend', error);
    return send(res, 502, { error: 'send_failed' });
  }
}
