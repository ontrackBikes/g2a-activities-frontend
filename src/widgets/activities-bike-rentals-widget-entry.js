// src/widgets/activities-bike-rentals-widget-entry.js
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import "@/styles/variables.scss";
import "@/assets/custom.css";

// Widget component
import moment from "moment";
import BikeRentalsCheckAvailabilityWidget from "@/components/bikeRentalsCheckAvailabilityWidget.vue";

class ActivitiesBikeRentalsEmbedWidget {
  constructor(config = {}) {
    this.config = {
      selector: "#activities-bike-rentals-widget",
      baseUrl: import.meta.env.VITE_BASE_URL || "https://ferry.go2andaman.com",
      apiBaseUrl:
        import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
      location: null,
      pickupDate: null,
      returnDate: null,
      quantity: 1,
      onContinue: null,

      ...config,
    };

    this.app = null;
    this.resizeObserver = null;
    this.lastHeight = 0;
  }

  mount() {
    // Select container
    let container = document.querySelector(this.config.selector);
    if (!container) {
      console.error(
        `Activities Bike Rentals Widget: Container ${this.config.selector} not found`,
      );
      return false;
    }

    // Clear container & create wrapper
    container.innerHTML = "";
    const wrapper = document.createElement("div");
    wrapper.className =
      "activities-widget-wrapper activities-bike-rentals-widget";
    wrapper.setAttribute("data-activities-bike-rentals-widget", "true");
    container.appendChild(wrapper);

    // Vuetify instance
    const vuetify = createVuetify({
      components,
      directives,
      theme: {
        themes: {
          light: {
            colors: {
              success: "#006300",
              primary: "#1e88e5", // blue
              secondary: "#ffc107", // amber
              background: "#f5f5f5",
              surface: "#FAFAFA",
              brandColor: "#FFBB00",
              brandColor2: "#29339B",
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
          },
        },
      },
      defaults: {
        VCard: { elevation: 0 },
        VBtn: { elevation: 0 },
      },
    });

    // Mount Vue component with individual props
    this.app = createApp(BikeRentalsCheckAvailabilityWidget, {
      location: this.config.location || "Port Blair",
      pickupDate:
        this.config.pickupDate || moment().add(2, "days").format("YYYY-MM-DD"),
      returnDate:
        this.config.returnDate || moment().add(3, "days").format("YYYY-MM-DD"),
      quantity: this.config.quantity || 1,
      apiBaseUrl: this.config.apiBaseUrl,
      baseUrl: this.config.baseUrl,
      onContinue: (payload) => {
        // ✅ Redirect to booking page
        const params = new URLSearchParams({
          location: payload.locationName,
          startDate: payload.startDate,
          endDate: payload.endDate,
        }).toString();

        // window.location.href = `/select-pickup-delivery?${params}`;
        // Or open in new tab:
        window.open(
          `${this.config.baseUrl}/select-pickup-delivery?${params}`,
          "_blank",
        );
      },
    });

    this.app.use(vuetify);
    this.app.mount(wrapper);

    // Setup auto-resize
    this.setupResizeHandling(wrapper);
    setTimeout(() => this.checkResize(wrapper), 100);

    return true;
  }

  setupResizeHandling(element) {
    if (window.ResizeObserver) {
      this.resizeObserver = new ResizeObserver(() => this.checkResize(element));
      this.resizeObserver.observe(element);
    }

    new MutationObserver(() => this.checkResize(element)).observe(element, {
      childList: true,
      subtree: true,
      attributes: true,
    });

    element.addEventListener("transitionend", () => this.checkResize(element));
  }

  checkResize(element) {
    const height = element.scrollHeight;
    if (Math.abs(height - this.lastHeight) > 5) {
      this.lastHeight = height;
      window.dispatchEvent(
        new CustomEvent("activitiesBikeRentalsWidgetResize", {
          detail: { height, selector: this.config.selector },
        }),
      );

      const container = document.querySelector(this.config.selector);
      if (container) {
        container.style.minHeight = `${height}px`;
        container.style.transition = "min-height 0.3s ease";
      }
    }
  }

  destroy() {
    if (this.resizeObserver) this.resizeObserver.disconnect();
    if (this.app) this.app.unmount();
    this.app = null;
  }
}

/* -------------------- AUTO MOUNT -------------------- */
if (typeof window !== "undefined") {
  window.ActivitiesBikeRentalsWidget = ActivitiesBikeRentalsEmbedWidget;

  document.addEventListener("DOMContentLoaded", () => {
    document
      .querySelectorAll("[data-activities-bike-rentals-widget-auto]")
      .forEach((el) => {
        new ActivitiesBikeRentalsEmbedWidget({
          selector: `#${el.id}`,
          baseUrl:
            el.dataset.baseUrl ||
            import.meta.env.VITE_BASE_URL ||
            "https://ferry.go2andaman.com",
          apiBaseUrl: el.dataset.apiBaseUrl,
          location: el.dataset.location || "Port Blair",
          pickupDate:
            el.dataset.pickupDate ||
            moment().add(2, "days").format("YYYY-MM-DD"),
          returnDate:
            el.dataset.returnDate ||
            moment().add(3, "days").format("YYYY-MM-DD"),
          quantity: el.dataset.quantity ? Number(el.dataset.quantity) : 1,
        }).mount();
      });
  });
}
