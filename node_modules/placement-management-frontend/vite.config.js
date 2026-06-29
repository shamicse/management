import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  // The `base` option is essential for Cloudflare Pages deployments.
  // It ensures that asset paths in the built HTML are correct.
  // If you deploy to the root of a domain (e.g., `my-app.pages.dev`), use '/'.
  // If you deploy to a sub-path (e.g., `your-domain.com/my-app/`), use '/my-app/'.
  // We'll default to '/' which is the most common case for Cloudflare Pages.
  base: '/',
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': 'http://localhost:5000',
      '/uploads': 'http://localhost:5000',
    },
  },
});
