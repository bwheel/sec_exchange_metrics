import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
 
export default defineConfig({
  base:"sec_exchange_metrics",
  publicDir: 'public',
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: 'public/data/',
          dest: '.',
        },
      ],
    }),
  ],
});
