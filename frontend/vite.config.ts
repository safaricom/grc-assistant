import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  envDir: "..",
  server: {
    host: "::",
    port: 8080,
    // Dev proxy for /api during local development. If VITE_API_HOST is set use that, otherwise
    // forward to localhost:3001 for local backend dev.
    proxy: {
      '/api': {
        target: process.env.VITE_API_HOST || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api')
      }
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
