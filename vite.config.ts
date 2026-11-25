import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(() => {
  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'copy-and-fix-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, { recursive: true, force: true });
          }

          // Переписываем корневые /src/assets/ в относительные ./src/assets/ для GitHub Pages
          const rewriteRootAssetPaths = (dir: string) => {
            for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
              const fullPath = path.join(dir, entry.name);
              if (entry.isDirectory()) {
                rewriteRootAssetPaths(fullPath);
              } else if (/\.(html|js|css)$/i.test(entry.name)) {
                const raw = fs.readFileSync(fullPath, 'utf8');
                const fixed = raw.replace(/(["'`])\/src\/assets\//g, '$1./src/assets/');
                if (fixed !== raw) {
                  fs.writeFileSync(fullPath, fixed, 'utf8');
                }
              }
            }
          };

          if (fs.existsSync(distDir)) {
            rewriteRootAssetPaths(distDir);
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  };
});
