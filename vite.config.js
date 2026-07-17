import { defineConfig } from "vite";
import { defaultExclude } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => ({
  define: {
    "process.env.NODE_ENV": JSON.stringify(mode),
  },
  plugins: [
    react(),
    tailwindcss(),
    babel({
      presets: [reactCompilerPreset()],
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Production build settings
    target: "es2020",
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // Remove console logs in production
        drop_debugger: true,
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        // Code splitting configuration - using function form for better compatibility
        manualChunks: (id) => {
          if (
            id.includes("node_modules/react") ||
            id.includes("node_modules/react-dom") ||
            id.includes("node_modules/react-router-dom")
          ) {
            return "react-vendor";
          }
          if (
            id.includes("node_modules/class-variance-authority") ||
            id.includes("node_modules/clsx") ||
            id.includes("node_modules/tailwind-merge")
          ) {
            return "ui-vendor";
          }
          if (id.includes("node_modules/lucide-react")) {
            return "icons";
          }
        },
      },
    },
    // Optimization settings
    reportCompressedSize: false,
    sourcemap: false, // Disable source maps in production; use "hidden" to keep maps for debugging without exposing them
    chunkSizeWarningLimit: 500,
  },
  server: {
    // Development server settings
    headers: {
      "X-Content-Type-Options": "nosniff",
      "X-Frame-Options": "SAMEORIGIN",
      "X-XSS-Protection": "1; mode=block",
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    passWithNoTests: true,
    // "tests/" holds Playwright E2E specs (see playwright.config.js's
    // testDir) and must stay out of Vitest's own test run.
    exclude: [...defaultExclude, "tests/**"],
    setupFiles: ["./src/test/setup.js"],
    pool: "forks",
    maxWorkers: 6,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
    },
  },
}));
