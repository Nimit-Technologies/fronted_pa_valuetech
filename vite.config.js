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

  if (!env.VITE_BACKEND_URL) {
    throw new Error(
      `VITE_BACKEND_URL is not defined in the environment variables for mode "${mode}".`,
    );
  }

  if (!env.VITE_API_URL) {
    throw new Error(
      `VITE_API_URL is not defined in the environment variables for mode "${mode}".`,
    );
  }

  // A production bundle hard-codes whatever VITE_API_URL held at build time, so
  // building on a dev machine ships a bundle pointing at that machine's
  // localhost — which works for the person who built it and for nobody else.
  // The failure surfaces only in someone else's browser, long after the build
  // looked fine, so it is caught here instead.
  //
  // ALLOW_INSECURE_API_URL=true opts out, for the legitimate case of building a
  // production bundle to run against a local API (`npm run preview`).
  // The hatch disables a guard that exists to stop a broken bundle shipping,
  // so a build that uses it says so loudly rather than passing silently. If
  // this banner ever appears in a deploy log, that build must not be
  // released: it is pointed at someone's localhost.
  if (mode === "production" && env.ALLOW_INSECURE_API_URL === "true") {
    const banner = "!".repeat(72);
    console.warn(
      `\n${banner}\n` +
        "ALLOW_INSECURE_API_URL=true — the production API URL check is OFF.\n" +
        `This bundle targets ${env.VITE_API_URL}\n` +
        "Fine for a local `npm run preview`. Never release this build.\n" +
        `${banner}\n`,
    );
  }

  if (mode === "production" && env.ALLOW_INSECURE_API_URL !== "true") {
    let apiUrl;
    try {
      apiUrl = new URL(env.VITE_API_URL);
    } catch {
      throw new Error(
        `VITE_API_URL ("${env.VITE_API_URL}") is not a valid absolute URL.`,
      );
    }

    const isLoopback = ["localhost", "127.0.0.1", "::1", "[::1]"].includes(
      apiUrl.hostname,
    );

    if (isLoopback || apiUrl.protocol !== "https:") {
      throw new Error(
        `VITE_API_URL ("${env.VITE_API_URL}") is not usable for a production ` +
          "build: it must be https and must not point at localhost. Set the " +
          "real API URL, or set ALLOW_INSECURE_API_URL=true to build against " +
          "a local API deliberately.",
      );
    }
  }

  const serverBaseUrl = env.VITE_SERVER_PORT
    ? `${env.VITE_BACKEND_URL}:${env.VITE_SERVER_PORT}`
    : env.VITE_BACKEND_URL;

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
        "/api/v1/": {
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
      // The default is 5s, and the heaviest userEvent form tests (every field
      // of the create-case form, typed a character at a time in jsdom) already
      // sit at ~5.2s on their own. They passed only while the suite was small
      // enough to leave them a whole core; they began timing out purely from
      // the parallel load of more test files, which is a scheduling artefact
      // rather than anything about the code under test.
      testTimeout: 20_000,
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
