import BookingPriceWidget from "./BookingPriceWidget.vue";

import { mountWidget } from "../shared/mount";
import { getProduct } from "../shared/api";

function getBoolean(value, defaultValue = true) {
  if (value === undefined) {
    return defaultValue;
  }

  return value.toLowerCase() === "true";
}

function getString(value, defaultValue = "") {
  return value ?? defaultValue;
}

document
  .querySelectorAll(".g2a-book-price-widget")
  .forEach((element) => {
    mountWidget({
      element,

      component: BookingPriceWidget,

      loader: async () => {
        const {
          slug,
          baseUrl = "http://localhost:5173",
        } = element.dataset;

        if (!slug) {
          throw new Error("Missing data-slug.");
        }

        const product = await getProduct(slug);

        return {
          product,

          baseUrl,

          options: {

            showProductName: getBoolean(
              element.dataset.showProductName,
              true
            ),

            showImage: getBoolean(
              element.dataset.showImage,
              true
            ),

            showDescription: getBoolean(
              element.dataset.showDescription,
              true
            ),

            showLocation: getBoolean(
              element.dataset.showLocation,
              true
            ),

            showPrice: getBoolean(
              element.dataset.showPrice,
              true
            ),

            showGuests: getBoolean(
              element.dataset.showGuests,
              true
            ),

            showLocations: getBoolean(
              element.dataset.showLocations,
              false
            ),

            showMeta: getBoolean(
              element.dataset.showMeta,
              true
            ),

            showButton: getBoolean(
              element.dataset.showButton,
              true
            ),

            buttonText: getString(
              element.dataset.buttonText,
              "Book Now"
            ),

            outOfStockText: getString(
              element.dataset.outOfStockText,
              "Currently Unavailable"
            ),

            outOfStockButtonText: getString(
              element.dataset.outOfStockButtonText,
              "Unavailable"
            ),
          },
        };
      },
    });
  });