import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      base: '/',
      server: {
        port: 3000,
        host: '0.0.0.0',
        // --- ADDED: Fix for the "Blocked request" issue ---
        allowedHosts: [
          'coldturkey-arleen-goadingly.ngrok-free.dev',
          // You can also add other development hosts here if needed,
          // but the ngrok URL is the specific fix for your error.
        ],
        // --------------------------------------------------
      },
      plugins: [react()],
      define: {
        'process.env.API_KEY': JSON.stringify("AIzaSyCrDirvLfp7Kaq85-TxXnoS90iAYHrGZvc"),
        'process.env.GEMINI_API_KEY': JSON.stringify("AIzaSyCrDirvLfp7Kaq85-TxXnoS90iAYHrGZvc"),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});