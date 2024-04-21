import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // "/api/": "https://e-shop-rust-five.vercel.app/",
      // "/uploads/": "https://e-shop-rust-five.vercel.app/",

      
      // "/api/": "http://localhost:5000",
      // "/uploads/": "http://localhost:5000",

      
        '/api/': {
          target: 'e-shop-rust-five.vercel.app', 
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, '')
      },
      '/uploads/': {
        target: 'e-shop-rust-five.vercel.app', 
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/uploads/, '')
  }
    },
   
    },

});
