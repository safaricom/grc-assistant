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
    // Proxy /api requests to the backend during development to avoid CORS and
    // to allow same-origin requests from the dev server. The target defaults
    // to localhost:3001 but can be overridden with the VITE_API_HOST env var.
    proxy: {
      '/api': {
        target: (process.env.VITE_API_HOST || 'http://localhost:3001').replace(/\/api\/$|\/api$/i, ''),
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
