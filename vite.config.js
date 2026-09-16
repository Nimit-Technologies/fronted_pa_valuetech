import { defineConfig, loadEnv } from "vite";
import { defaultExclude } from "vitest/config";
import path from "path";
import { fileURLToPath } from "url";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  if (!env.VITE_SERVER_BASE_URL) {
    throw new Error(
      `VITE_SERVER_BASE_URL is not defined in the environment variables for mode "${mode}".`,
    );
  }

  const serverBaseUrl = env.VITE_SERVER_PORT
    ? `${env.VITE_SERVER_BASE_URL}:${env.VITE_SERVER_PORT}`
    : env.VITE_SERVER_BASE_URL;

  return {
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
    server: {
      proxy: {
        "/api": {
          target: serverBaseUrl,
          changeOrigin: true,
          secure: false,
        },
      },
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
      exclude: [...defaultExclude, "tests/**"],
      setupFiles: ["./src/test/setup.js"],
      pool: "forks",
      maxWorkers: 6,
      coverage: {
        provider: "v8",
        reporter: ["text", "html"],
      },
    },
    build: {
      target: "es2020",
      minify: "terser",
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
        format: {
          comments: false,
        },
      },
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            if (
              id.includes("node_modules/react/") ||
              id.includes("node_modules/react-dom/") ||
              id.includes("node_modules/react-router")
            ) {
              return "react-vendor";
            }
            if (
              id.includes("node_modules/@radix-ui/") ||
              id.includes("node_modules/class-variance-authority") ||
              id.includes("node_modules/clsx") ||
              id.includes("node_modules/tailwind-merge")
            ) {
              return "ui-vendor";
            }
            if (id.includes("node_modules/lucide-react")) {
              return "icons";
            }
            if (
              id.includes("node_modules/@reduxjs/") ||
              id.includes("node_modules/react-redux/") ||
              id.includes("node_modules/redux/")
            ) {
              return "redux-vendor";
            }
            if (
              id.includes("node_modules/react-hook-form/") ||
              id.includes("node_modules/zod/")
            ) {
              return "form-vendor";
            }
          },
        },
      },

      reportCompressedSize: false,
      sourcemap: false,
      chunkSizeWarningLimit: 500,
    },
  };
});
