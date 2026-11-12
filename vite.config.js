import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { generatePortfolioReply, readJsonBody } from './server/groqChat.js';

function groqDevApiPlugin() {
  let serverEnv = {};
  return {
    name: 'groq-dev-api',
    configResolved(config) {
      serverEnv = loadEnv(config.mode, config.root, '');
    },
    configureServer(server) {
      server.middlewares.use('/api/chat', async (req, res, next) => {
        if (req.method !== 'POST') return next();
        res.setHeader('Content-Type', 'application/json');
        try {
          const body = await readJsonBody(req);
          const result = await generatePortfolioReply({
            message: body?.message,
            history: body?.history,
            env: { ...process.env, ...serverEnv }
          });
          res.statusCode = 200;
          res.end(JSON.stringify(result));
        } catch (err) {
          res.statusCode = err?.status || 500;
          res.end(JSON.stringify({ error: err?.message || 'Unable to generate reply' }));
        }
      });
    }
  };
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), groqDevApiPlugin()],
  server: {
    port: 3000,
    open: true
  }
});
