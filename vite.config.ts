import vue from '@vitejs/plugin-vue';
import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [vue()],

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src')
      }
    },

    server: {
      host: '0.0.0.0',
      port: Number(env.VITE_PORT) || 5173
    },

    build: {
      outDir: 'dist',
      emptyOutDir: true
    },

    base: env.VITE_PUBLIC_PATH || '/'
  };
});
