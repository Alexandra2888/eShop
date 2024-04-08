import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api/": "https://eshop-yn0p.onrender.com",
      "/uploads/": "https://eshop-yn0p.onrender.com",
    },
  },
});
