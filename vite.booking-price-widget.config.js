import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"),
    },
  },

  define: {
    "process.env": {}, // Fix "process is not defined"
  },

  build: {
    outDir: "dist-booking-price-widget",
    emptyOutDir: true,

    lib: {
      entry: resolve(
        __dirname,
        "src/widgets/booking-price-widget/booking-price-widget-entry.js"
      ),
      name: "G2ABookingPriceWidget",
      fileName: "g2a-book-price-widget",
      formats: ["iife"],
    },

    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        manualChunks: undefined,

        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "g2a-book-price-widget.css";
          }

          return assetInfo.name;
        },
      },
    },

    cssCodeSplit: false,
    minify: "terser",

    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
  },
});