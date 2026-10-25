import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig, loadEnv } from "vite";

import { blogDevPlugin } from "./vite/blog-dev-plugin.js";
import { seoPlugin } from "./vite/seo-plugin.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  // Read as src/blog/config.js reads it, so the blog is built exactly when it is linked.
  const blogApi = (loadEnv(mode, __dirname, "VITE_").VITE_BLOG_API_URL ?? "").trim().replace(/\/+$/, "");

  return {
    plugins: [react(), tailwindcss(), seoPlugin(), blogDevPlugin()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      // Blog images and videos, as vercel.json routes them in production.
      proxy: blogApi
        ? {
            "/blog/media": {
              target: blogApi,
              changeOrigin: true,
              rewrite: (requestPath) => requestPath.replace(/^\/blog\/media/, "/v1/blog/media"),
            },
          }
        : undefined,
    },
    build: {
      // The three.js cloud layer is one lazy chunk (~135 kB gzip) loaded after first paint.
      chunkSizeWarningLimit: 1000,
      rolldownOptions: {
        // blog.html is the template scripts/blog-prerender.js fills for every /blog page.
        input: {
          main: path.resolve(__dirname, "index.html"),
          ...(blogApi ? { blog: path.resolve(__dirname, "blog.html") } : {}),
        },
      },
    },
  };
});
