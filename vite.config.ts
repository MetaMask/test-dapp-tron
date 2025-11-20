import react from '@vitejs/plugin-react-swc';
import { type UserConfig, defineConfig } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vite.dev/config/
// biome-ignore lint/style/noDefaultExport: <explanation>
export default defineConfig({
  base: '/',
  build: {
    outDir: 'dist',
  },
  plugins: [
    react(),
    nodePolyfills({
      include: ['buffer'],
      globals: {
        Buffer: true,
      },
    }),
  ],
  test: {
    // 👋 add the line below to add jsdom to vite
    environment: 'jsdom',
  },
} as UserConfig);
