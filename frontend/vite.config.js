import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: "/",
  server: {
    proxy: {
      "/api/": "http://localhost:5001",
      "/uploads/": "http://localhost:5001",
    },
  },
});
