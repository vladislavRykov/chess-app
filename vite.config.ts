import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig({
  base: "chess-app",
  plugins: [react()],
  server: {
    host: "127.0.0.1",
  },
});
