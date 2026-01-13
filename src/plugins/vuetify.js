// src/plugins/vuetify.js
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import { aliases, mdi } from "vuetify/iconsets/mdi";

export default createVuetify({
  components,
  directives,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: { mdi },
  },
  theme: {
    defaultTheme: "light",
    themes: {
      light: {
        dark: false,
        colors: {
          success: "#006300",
          primary: "#1e88e5", // blue
          secondary: "#ffc107", // amber
          background: "#f5f5f5",
          surface: "#FAFAFA",
          brandColor: "FFBB00",
          brandColor2: "29339B",
          error: "#FF6B36",
          successLight1: "#E2EDE2",
          successLight2: "#f0f6f0",
          warningLight1: "#fffbf0",
          warningLight2: "#fff8e2",
          errorLight2: "#faf4f4",
          infoLight: "#F2F6FF",
          blue: "#29339b",
          darkGreen: "#006400",
          black: "#000",
          blackLight1: "#212121",
          blackLight2: "#616161",
          grey: "#808080",
          greyLight: "#e1e1e1",
          greyDark: "#666666",
          warning: "#FB8C00",
          white: "#FFFFFF",
        },
        variables: {
          // fallback
          "font-family": "Roobert, sans-serif",
        },
      },
    },
  },
  typography: {
    defaultFontFamily: "Roobert, sans-serif",
  },
});
