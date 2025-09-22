import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';
 
export default defineConfig({
  publicDir: 'public',
  build: {
    outDir: 'docs/',
    emptyOutDir: true,
  },
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
