import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { copyFileSync } from "fs";
import { resolve } from "path";

// Plugin to copy _redirects file to build output
const copyRedirectsPlugin = () => {
  return {
    name: 'copy-redirects',
    writeBundle() {
      try {
        copyFileSync(
          resolve(__dirname, 'public/_redirects'),
          resolve(__dirname, 'dist/_redirects')
        );
        console.log('✅ _redirects file copied to build output');
      } catch (error) {
        console.warn('⚠️ Could not copy _redirects file:', error.message);
      }
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), copyRedirectsPlugin()],
  base: "/",
  build: {
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
  server: {
    proxy: {
      "/api/": "http://localhost:5001",
      "/uploads/": "http://localhost:5001",
    },
  },
});
