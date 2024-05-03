import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
       "/api/": "https://e-shop-rust-five.vercel.app",
      "/uploads/": "https://e-shop-rust-five.vercel.app",
    },
   
    },

});
