import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

import { seoPlugin } from "./vite/seo-plugin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [react(), tailwindcss(), seoPlugin()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, "index.html"),
        see: path.resolve(__dirname, "see/index.html"),
      },
    },
    // The three.js cloud layer is one lazy chunk (~135 kB gzip) loaded after first paint.
    chunkSizeWarningLimit: 1000,
  },
});
