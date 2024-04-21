import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "https://e-shop-d4oaqv83k-alexandra2888s-projects.vercel.app",
      "/uploads/": "https://e-shop-d4oaqv83k-alexandra2888s-projects.vercel.app",

      
      // "/api/": "http://localhost:5000",
      // "/uploads/": "http://localhost:5000",
    },
   
    },

});
