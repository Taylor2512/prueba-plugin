import { defineConfig, loadEnv, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import { visualizer } from "rollup-plugin-visualizer";
import { fileURLToPath, URL } from "node:url";

const resolvePath = (value) => fileURLToPath(new URL(value, import.meta.url));

const normalizeBasePath = (rawBasePath) => {
  if (!rawBasePath || rawBasePath === "." || rawBasePath === "./") {
    return "./";
  }

  const normalizedSlashes = String(rawBasePath).replace(/\\/g, "/").trim();

  const withLeadingSlash = normalizedSlashes.startsWith("/")
    ? normalizedSlashes
    : `/${normalizedSlashes}`;

  return withLeadingSlash.endsWith("/")
    ? withLeadingSlash
    : `${withLeadingSlash}/`;
};

const parseBoolean = (value, defaultValue = false) => {
  if (value === undefined || value === null || value === "") {
    return defaultValue;
  }

  return ["1", "true", "yes", "on"].includes(String(value).toLowerCase());
};

const parseNumber = (value, defaultValue) => {
  if (value === undefined || value === null || String(value).trim() === "") {
    return defaultValue;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : defaultValue;
};

const normalizeId = (id) => id.split("?")[0].replace(/\\/g, "/");

const isSourceFile = (id) => {
  const normalized = normalizeId(id);

  return normalized.includes("/src/") && !normalized.includes("/node_modules/");
};

const hasJsxLikeSyntax = (code) => {
  return (
    /<[A-Za-z][A-Za-z0-9:._-]*(\s|>|\/)/.test(code) ||
    /<>[\s\S]*<\/>/.test(code)
  );
};

/**
 * Proyecto legacy SISAD:
 * - Hay archivos .js con JSX.
 * - Algunos .ts internos pueden contener JSX aunque no usen extensión .tsx.
 * - No se fuerza loader TSX global para no romper "import type".
 */
const legacyJsTsJsxLoader = () => ({
  name: "sisad-legacy-js-ts-jsx-loader",
  enforce: "pre",

  async transform(code, id) {
    const cleanId = normalizeId(id);

    if (!isSourceFile(cleanId)) {
      return null;
    }

    if (cleanId.endsWith(".js")) {
      return transformWithEsbuild(code, cleanId, {
        loader: "jsx",
        jsx: "automatic",
        sourcemap: true,
      });
    }

    if (cleanId.endsWith(".ts") && hasJsxLikeSyntax(code)) {
      return transformWithEsbuild(code, cleanId, {
        loader: "tsx",
        jsx: "automatic",
        sourcemap: true,
      });
    }

    return null;
  },
});

const API_PREFIXES = [
  "/Core",
  "/Core/api",
  "/Security",
  "/Security/api",
  "/DocumentaryManagement",
  "/DocumentaryManagement/api",
  "/FormsManagement",
  "/FormsManagement/api",
  "/Middleware",
  "/Middleware/api",
  "/WorkFlows",
  "/WorkFlows/api",
  "/Flow",
  "/Flow/api",
];

const createProxy = (proxyTarget) => {
  return Object.fromEntries(
    API_PREFIXES.map((prefix) => [
      prefix,
      {
        target: proxyTarget,
        changeOrigin: true,
        secure: false,
      },
    ])
  );
};

const SISAD_PDFME_DEPS = [
  "@sisad-pdfme/ui",
  "@sisad-pdfme/common",
  "@sisad-pdfme/editor",
  "@sisad-pdfme/converter",
  "@sisad-pdfme/generator",
  "@sisad-pdfme/documents",
  "@sisad-pdfme/assignments",
  "@sisad-pdfme/comments",
  "@sisad-pdfme/collaboration",
  "@sisad-pdfme/commands",
  "@sisad-pdfme/contracts",
  "@sisad-pdfme/schemas",
  "pdf-lib",
];

const DOMPURIFY_SHIM = resolvePath("./src/vendor/dompurify.ts");

const dompurifyResolver = () => ({
  name: "sisad-dompurify-resolver",
  enforce: "pre",

  resolveId(id) {
    if (id === "dompurify") {
      return DOMPURIFY_SHIM;
    }

    if (id.startsWith("dompurify/") || id.includes("/node_modules/dompurify/src/")) {
      return DOMPURIFY_SHIM;
    }

    return null;
  },
});

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  const isDevelopment = mode === "development";

  const shouldAnalyze = parseBoolean(env.ANALYZE ?? env.VITE_ANALYZE, false);
  const basePath = normalizeBasePath(env.VITE_BASE_PATH);

  const enableSourceMaps = parseBoolean(env.VITE_SOURCEMAP, false);
  const emitManifest = parseBoolean(env.VITE_MANIFEST, false);
  const dropConsole = parseBoolean(env.VITE_DROP_CONSOLE, false);
  const forceOptimizeDeps = parseBoolean(env.VITE_FORCE_OPTIMIZE_DEPS, false);
  const enableLegacyJsxLoader = parseBoolean(env.VITE_ENABLE_LEGACY_JSX_LOADER, true);

  const localProxyEnabled = parseBoolean(env.VITE_LOCAL_PROXY_ENABLED, false);
  const enableProxy = parseBoolean(env.VITE_ENABLE_PROXY, false);

  const chunkWarningLimit = parseNumber(env.VITE_CHUNK_WARNING_LIMIT, 8000);
  const assetsInlineLimit = parseNumber(env.VITE_ASSETS_INLINE_LIMIT, 4096);

  const devHost = env.VITE_HOST || "0.0.0.0";
  const devPort = parseNumber(env.VITE_PORT, 5173);

  const previewPort = parseNumber(env.VITE_PREVIEW_PORT, localProxyEnabled ? 4173 : 4173);

  const proxyTarget = env.VITE_PROXY_TARGET || "https://web.sisad.com.ec:2096";

  /**
   * HMR / Fast Refresh
   *
   * Valores por defecto pensados para desarrollo local:
   * - dev server siempre en 5173, salvo que VITE_PORT indique otro puerto.
   * - preview separado en 4173.
   * - strictPort evita que Vite cambie de puerto silenciosamente.
   * - clientPort permite que el navegador apunte al WebSocket correcto.
   *
   * Para LAN, Docker, túneles o proxy reverso, define explícitamente:
   * VITE_HMR_HOST, VITE_HMR_PORT, VITE_HMR_CLIENT_PORT y VITE_HMR_PROTOCOL.
   */
  const hmrDisabled = parseBoolean(env.VITE_HMR_DISABLED, false);
  const hmrProtocol = env.VITE_HMR_PROTOCOL || "ws";
  const hmrHost = env.VITE_HMR_HOST || undefined;
  const hmrPath = env.VITE_HMR_PATH || undefined;
  const hmrPort = parseNumber(env.VITE_HMR_PORT, devPort);
  const hmrClientPort = parseNumber(env.VITE_HMR_CLIENT_PORT, devPort);
  const hmrOverlay = parseBoolean(env.VITE_HMR_OVERLAY, true);

  /**
   * Watcher configurable.
   * En macOS normalmente no hace falta polling.
   * Actívalo si trabajas con Docker, red, carpeta sincronizada o volumen montado.
   */
  const usePolling = parseBoolean(env.VITE_USE_POLLING, false);
  const pollingInterval = parseNumber(env.VITE_POLLING_INTERVAL, 100);

  return {
    /**
     * En desarrollo se fuerza raíz para que el cliente HMR y los assets de Vite
     * no queden atados a un base path de despliegue.
     */
    base: isDevelopment ? "/" : basePath,

    plugins: [
      dompurifyResolver(),

      enableLegacyJsxLoader && legacyJsTsJsxLoader(),

      react({
        include: /\.(js|jsx|ts|tsx)$/,
      }),

      shouldAnalyze &&
        visualizer({
          filename: "dist/stats.html",
          open: true,
          gzipSize: true,
          brotliSize: true,
        }),
    ].filter(Boolean),

    esbuild: {
      jsx: "automatic",
      drop: dropConsole ? ["console"] : [],
    },

    resolve: {
      preserveSymlinks: false,

      alias: [
        {
          find: /^@\/(.*)$/,
          replacement: `${resolvePath("./src")}/$1`,
        },
        {
          find: /^\/src\/(.*)$/,
          replacement: `${resolvePath("./src")}/$1`,
        },

        /**
         * Alias raíz del fork local.
         * Cubre:
         * @sisad-pdfme/ui
         * @sisad-pdfme/common
         * @sisad-pdfme/schemas/text/index
         * pdf-lib
         */
        {
          find: /^@sisad-pdfme$/,
          replacement: resolvePath("./src/components/sisad-pdfme"),
        },
        {
          find: /^@sisad-pdfme\/(.*)$/,
          replacement: `${resolvePath("./src/components/sisad-pdfme")}/$1`,
        },

        /**
         * DOMPurify + Vite 3:
         * evita que Vite entre a node_modules/dompurify/src/*.ts
         * y fuerza el bundle compilado.
         */
        {
          find: /^dompurify$/,
          replacement: DOMPURIFY_SHIM,
        },
        {
          find: /^dompurify\/src\/.*$/,
          replacement: DOMPURIFY_SHIM,
        },
      ],

      /**
       * No deduplicar pdf-lib aquí porque el proyecto tiene:
       * - pdf-lib en node_modules
       * - pdf-lib como fork local
       */
      dedupe: ["react", "react-dom"],
    },

    publicDir: "public",

    optimizeDeps: {
      /**
       * No escanear todo src.
       * Escanear src/** hace que Vite intente optimizar el fork local
       * sisad-pdfme y aparecen errores de import type, csstype, estree y types.d.ts.
       */
      entries: ["index.html"],

      esbuildOptions: {
        loader: {
          ".js": "jsx",
          ".jsx": "jsx",
          ".ts": "ts",
          ".tsx": "tsx",
        },
        jsx: "automatic",
      },

      include: [
        /**
         * Dependencias que Vite ya detectó/preoptimizó o que dieron error.
         */
        "eventemitter3",
        "recharts",

        "acorn",
        "buffer",
        "date-fns",
        "date-fns/locale",
        "yjs",
        "y-protocols/awareness",
        "zod",

        /**
         * MUI/Emotion suelen ser costosos de resolver en dev.
         */
        "@mui/material",
        "@mui/icons-material",
        "@emotion/react",
        "@emotion/styled",
      ],

      exclude: [
        /**
         * Estos son código local del fork, no dependencias externas.
         */
        ...SISAD_PDFME_DEPS,

        /**
         * DOMPurify se resuelve al bundle compilado por alias.
         * No lo preoptimizamos para evitar que Vite entre al árbol src/.
         */
        "dompurify",

        /**
         * Compatibilidad por si queda algún import viejo de pdfme original.
         */
        "@pdfme/ui",
        "@pdfme/generator",
        "@pdfme/converter",
        "@pdfme/schemas",
        "@pdfme/common",
        "@pdfme/pdf-lib",
      ],

      force: forceOptimizeDeps,
    },

    build: {
      target: "es2019",
      sourcemap: enableSourceMaps,
      manifest: emitManifest,
      cssCodeSplit: true,
      assetsInlineLimit,
      chunkSizeWarningLimit: chunkWarningLimit,

      rollupOptions: {
        output: {
          entryFileNames: "assets/[name].[hash].js",
          chunkFileNames: "assets/[name].[hash].js",
          assetFileNames: "assets/[name].[hash].[ext]",

          manualChunks(id) {
            if (!id.includes("node_modules")) {
              return undefined;
            }

            if (
              id.includes("/react/") ||
              id.includes("/react-dom/") ||
              id.includes("react-router-dom")
            ) {
              return "vendor-react";
            }

            if (id.includes("@mui/") || id.includes("@emotion/")) {
              return "vendor-mui";
            }

            if (
              id.includes("ag-grid-community") ||
              id.includes("ag-grid-enterprise") ||
              id.includes("ag-grid-react") ||
              id.includes("@ag-grid-community") ||
              id.includes("@ag-grid-enterprise")
            ) {
              return "vendor-ag-grid";
            }

            if (id.includes("recharts") || id.includes("chart.js")) {
              return "vendor-charts";
            }

            if (
              id.includes("pdf-lib") ||
              id.includes("pdfjs-dist") ||
              id.includes("react-pdf")
            ) {
              return "vendor-pdf";
            }

            if (
              id.includes("@dnd-kit") ||
              id.includes("react-dnd") ||
              id.includes("react-moveable") ||
              id.includes("react-selecto") ||
              id.includes("react-rnd") ||
              id.includes("react-draggable")
            ) {
              return "vendor-interactions";
            }

            return "vendor";
          },
        },

        onwarn(warning, warn) {
          if (
            warning?.message?.includes(
              "Module level directives cause errors when bundled, 'use client' was ignored."
            )
          ) {
            return;
          }

          warn(warning);
        },
      },
    },

    server: {
      host: devHost,
      port: devPort,
      strictPort: true,

      hmr: hmrDisabled
        ? false
        : {
            overlay: hmrOverlay,
            protocol: hmrProtocol,
            host: hmrHost,
            port: hmrPort,
            clientPort: hmrClientPort,
            ...(hmrPath ? { path: hmrPath } : {}),
          },

      watch: {
        usePolling,
        interval: pollingInterval,
        ignored: [
          "**/node_modules/**",
          "**/dist/**",
          "**/build/**",
          "**/.git/**",
          "**/.vite/**",
          "**/coverage/**",
        ],
      },

      proxy: enableProxy ? createProxy(proxyTarget) : undefined,
    },

    preview: {
      host: devHost,
      port: previewPort,
      strictPort: true,
    },
  };
});
