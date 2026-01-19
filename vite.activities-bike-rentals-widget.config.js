import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    vue(),
    vuetify({ autoImport: true }), // Vuetify auto-import components
  ],

  resolve: {
    alias: {
      "@": resolve(__dirname, "src"), // for @ imports
    },
  },

  build: {
    outDir: "dist-activities-bike-rentals-widget",
    emptyOutDir: true, // clear folder before build

    lib: {
      entry: resolve(
        __dirname,
        "src/widgets/activities-bike-rentals-widget-entry.js",
      ),
      name: "ActivitiesBikeRentalsWidget",
      fileName: "activities-bike-rentals-widget",
      formats: ["iife"], // standalone widget
    },

    rollupOptions: {
      output: {
        inlineDynamicImports: true, // ensure single JS file
        manualChunks: undefined, // avoid splitting
        assetFileNames: (assetInfo) => {
          if (assetInfo.name?.endsWith(".css")) {
            return "activities-bike-rentals-widget.css";
          }
          return assetInfo.name;
        },
      },
    },

    cssCodeSplit: false, // single CSS file
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: true, // remove console.log
        drop_debugger: true,
      },
    },
  },

  define: {
    "process.env": {}, // prevent errors in Vuetify
  },
});
