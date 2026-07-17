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
    sets: {
      mdi,
    },
  },

  theme: {
    defaultTheme: "light", // change to "light" if needed

    themes: {
      light: {
        dark: false,

        colors: {
          background: "#F4F5FA",
          surface: "#FAFAFA",

          primary: "#1E88E5",
          secondary: "#FFC107",

          brandColor: "#FFBB00",
          brandColor2: "#29339B",
          brandColor2Dark: "#1a2490",

          brandColorFade: "#f4d582",
          

          success: "#006300",
          successLight1: "#E2EDE2",
          successLight2: "#F0F6F0",

          warning: "#FB8C00",
          warningLight1: "#FFFBF0",
          warningLight2: "#FFF8E2",

          error: "#FF6B36",
          errorLight2: "#FAF4F4",

          infoLight: "#F2F6FF",

          blue: "#29339B",

          darkGreen: "#006400",
          darkGreen1: "#388E3C",

          black: "#000000",
          blackLight1: "#212121",
          blackLight2: "#616161",
          blackLight3: "#424242",

          grey: "#808080",
          greyLight: "#E1E1E1",
          greyDark: "#666666",

          white: "#FFFFFF",

          // Water Sports
          "cat-blue": "#E3F2FD",
          "cat-blue-text": "#1565C0",
          "cat-blue-icon": "#64B5F6",

          // Day Trips
          "cat-orange": "#FFF3E0",
          "cat-orange-text": "#E65100",
          "cat-orange-icon": "#FB8C00",

          // Exclusive Experiences
          "cat-purple": "#F3E5F5",
          "cat-purple-text": "#6A1B9A",
          "cat-purple-icon": "#AB47BC",

          // Getting Around
          "cat-pink": "#FCE4EC",
          "cat-pink-text": "#C2185B",
          "cat-pink-icon": "#EC407A",

          // History & Culture
          "cat-amber": "#FFF8E1",
          "cat-amber-text": "#F9A825",
          "cat-amber-icon": "#FBC02D",

          // Treks and Walks
          "cat-green": "#E8F5E9",
          "cat-green-text": "#2E7D32",
          "cat-green-icon": "#4CAF50",

          // Stargazing
          "cat-deep-purple": "#EDE7F6",
          "cat-deep-purple-text": "#512DA8",
          "cat-deep-purple-icon": "#7E57C2",

          // Scuba Diving
          "cat-cyan": "#E0F7FA",
          "cat-cyan-text": "#00838F",
          "cat-cyan-icon": "#26C6DA",

          // Kayaking
          "cat-teal": "#E0F2F1",
          "cat-teal-text": "#00695C",
          "cat-teal-icon": "#26A69A",
        },

        variables: {
          "font-family": "Roobert, sans-serif",
        },
      },

      dark: {
        dark: true,

        colors: {
          background: "#121212",
          surface: "#1E1E1E",

          primary: "#64B5F6",
          secondary: "#FFD54F",

          brandColor: "#FFBB00",
          brandColor2: "#5C6BC0",

          success: "#4CAF50",
          successLight1: "#1B5E20",
          successLight2: "#263B28",

          warning: "#FFA726",
          warningLight1: "#4E3B18",
          warningLight2: "#5C4520",

          error: "#EF5350",
          errorLight2: "#3A1E1E",

          infoLight: "#1F2937",

          blue: "#64B5F6",

          darkGreen: "#81C784",
          darkGreen1: "#66BB6A",

          black: "#FFFFFF",
          blackLight1: "#F5F5F5",
          blackLight2: "#E0E0E0",
          blackLight3: "#BDBDBD",

          grey: "#9E9E9E",
          greyLight: "#424242",
          greyDark: "#BDBDBD",

          white: "#FFFFFF",

          // Water Sports
          "cat-blue": "#102A43",
          "cat-blue-text": "#90CAF9",
          "cat-blue-icon": "#64B5F6",

          // Day Trips
          "cat-orange": "#3E2723",
          "cat-orange-text": "#FFCC80",
          "cat-orange-icon": "#FFB74D",

          // Exclusive Experiences
          "cat-purple": "#311B3F",
          "cat-purple-text": "#CE93D8",
          "cat-purple-icon": "#BA68C8",

          // Getting Around
          "cat-pink": "#3B1725",
          "cat-pink-text": "#F48FB1",
          "cat-pink-icon": "#F06292",

          // History & Culture
          "cat-amber": "#40320C",
          "cat-amber-text": "#FFE082",
          "cat-amber-icon": "#FFD54F",

          // Treks and Walks
          "cat-green": "#1B4332",
          "cat-green-text": "#A5D6A7",
          "cat-green-icon": "#81C784",

          // Stargazing
          "cat-deep-purple": "#24143A",
          "cat-deep-purple-text": "#B39DDB",
          "cat-deep-purple-icon": "#9575CD",

          // Scuba Diving
          "cat-cyan": "#0A3740",
          "cat-cyan-text": "#80DEEA",
          "cat-cyan-icon": "#4DD0E1",

          // Kayaking
          "cat-teal": "#103530",
          "cat-teal-text": "#80CBC4",
          "cat-teal-icon": "#4DB6AC",
        },

        variables: {
          "font-family": "Roobert, sans-serif",
        },
      },
    },
  },
});
