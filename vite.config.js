import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// Em desenvolvimento, serve a função api/contact.js no próprio Vite,
// do mesmo jeito que o Vercel faz em produção. Variáveis em .env.local.
function localApi(env) {
  return {
    name: 'local-api',
    configureServer(server) {
      Object.assign(process.env, env);
      server.middlewares.use('/api/contact', async (req, res) => {
        const { default: handler } = await server.ssrLoadModule('/api/contact.js');
        await handler(req, res);
      });
    },
  };
}

export default defineConfig(({ mode }) => ({
  plugins: [react(), localApi(loadEnv(mode, process.cwd(), ''))],
  build: {
    outDir: 'build',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap', '@gsap/react', 'lenis'],
          react: ['react', 'react-dom'],
        },
      },
    },
  },
}));
