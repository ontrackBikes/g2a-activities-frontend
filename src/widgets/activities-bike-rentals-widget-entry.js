// src/widgets/activities-bike-rentals-widget-entry.js
import { createApp } from "vue";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";
import "vuetify/styles";
import "@mdi/font/css/materialdesignicons.css";

import "@/styles/variables.scss";
import "@/assets/custom.css";

// ✅ Updated widget component
import BikeRentalsCheckAvailabilityWidget from "@/components/bikeRentalsCheckAvailabilityWidget.vue";

import moment from "moment";

class ActivitiesBikeRentalsEmbedWidget {
  constructor(config = {}) {
    this.config = {
      selector: "#activities-bike-rentals-widget",
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
    const container = document.querySelector(this.config.selector);
    if (!container) {
      console.error(
        `Activities Bike Rentals Widget: Container ${this.config.selector} not found`,
      );
      return false;
    }

    // Clear container & append wrapper
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
              brandColor: "#FF6B36",
              background: "#f5f5f5",
              surface: "#ffffff",
              error: "#F14336",
              warning: "#F97D2C",
              success: "#006300",
              grey: "#808080",
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

    // Prefill booking data
    const bookingData = {
      location: this.config.location,
      pickupDate:
        this.config.pickupDate || moment().add(2, "days").format("YYYY-MM-DD"),
      returnDate:
        this.config.returnDate || moment().add(3, "days").format("YYYY-MM-DD"),
      quantity: this.config.quantity,
    };

    // Mount Vue component
    this.app = createApp(BikeRentalsCheckAvailabilityWidget, {
      bookingData,
      apiBaseUrl: this.config.apiBaseUrl,
      onContinue: (payload) => {
        Object.assign(bookingData, payload);
        this.config.onContinue?.(bookingData);
      },
    });

    this.app.use(vuetify);
    this.app.mount(wrapper);

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
          apiBaseUrl: el.dataset.apiBaseUrl,
          location: el.dataset.location,
          pickupDate: el.dataset.pickupDate,
          returnDate: el.dataset.returnDate,
          quantity: el.dataset.quantity ? Number(el.dataset.quantity) : 1,
          onContinue: (bookingData) => {
            console.log("Step 1 complete – proceed to Step 2", bookingData);
          },
        }).mount();
      });
  });
}
