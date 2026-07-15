import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

const widget = process.env.WIDGET;

if (!widget) {
  throw new Error("WIDGET environment variable is required.");
}

function toPascalCase(str) {
  return str
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join("");
}

const libraryName = `G2A${toPascalCase(widget)}`;

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  define: {
    "process.env": {},
  },

  build: {
    outDir: resolve(__dirname, `dist/widgets/${widget}`),

    emptyOutDir: true,

    lib: {
      entry: resolve(__dirname, `src/widgets/${widget}/entry.js`),

      name: libraryName,

      formats: ["iife"],

      fileName: () => "widget.js",
    },

    cssCodeSplit: false,

    minify: "terser",

    rollupOptions: {
      output: {
        inlineDynamicImports: true,

        manualChunks: undefined,

        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "widget.css";
          }

          return assetInfo.name;
        },
      },
    },

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});
