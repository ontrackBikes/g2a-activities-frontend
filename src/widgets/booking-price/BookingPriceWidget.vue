<template>
  <div
    class="g2a-book-widget"
    :class="{
      'g2a-book-widget--disabled': product.out_of_stock,
    }"
  >
    <img
      v-if="settings.showImage && product.thumbnail_url"
      :src="product.thumbnail_url"
      :alt="product.name"
      class="g2a-book-widget__image"
    />

    <div class="g2a-book-widget__body">
      <div class="g2a-book-widget__header">
        <h3 v-if="settings.showProductName" class="g2a-book-widget__title">
          {{ product.name }}
        </h3>

        <div
          v-if="settings.showLocation && product.selectedLocation"
          class="g2a-book-widget__location"
        >
          📍 {{ product.selectedLocation.name }}
        </div>
      </div>

      <p
        v-if="settings.showDescription && shortDescription"
        class="g2a-book-widget__description"
      >
        {{ shortDescription }}
      </p>

      <div
        v-if="settings.showPrice && !product.out_of_stock"
        class="g2a-book-widget__price-section"
      >
        <div class="g2a-book-widget__label">
          {{ priceLabel }}
        </div>

        <div class="g2a-book-widget__amount">
          ₹{{ formatPrice(product.starting_price) }}

          <span
            >/
            {{
              product.slug == "bike-rentals"
                ? "bike"
                : product.slug == "airport-transfers"
                  ? "vehicle"
                  : product.pricing_mode
            }}</span
          >
        </div>
      </div>

      <div v-else-if="product.out_of_stock" class="g2a-book-widget__status">
        {{ settings.outOfStockText }}
      </div>

      <div v-if="settings.showMeta" class="g2a-book-widget__meta">
        <div v-if="settings.showGuests && product.max_bookable_per_booking">
          👥 Max {{ product.max_bookable_per_booking }} /
          {{
            product.slug == "bike-rentals"
              ? "bike"
              : product.slug == "airport-transfers"
                ? "vehicle"
                : product.pricing_mode
          }}
        </div>

        <div v-if="settings.showLocations && product.locations?.length">
          📍 {{ product.locations.map((l) => l.name).join(", ") }}
        </div>
      </div>

      <button
        v-if="settings.showButton"
        class="g2a-book-widget__button"
        :disabled="product.out_of_stock"
        @click="bookNow"
      >
        {{
          product.out_of_stock
            ? settings.outOfStockButtonText
            : settings.buttonText
        }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },

  baseUrl: {
    type: String,
    default: "https://activities.go2andaman.com",
  },

  options: {
    type: Object,
    default: () => ({}),
  },
});

const settings = computed(() => ({
  showImage: true,
  showDescription: true,
  showLocation: true,
  showPrice: true,
  showGuests: true,
  showLocations: false,
  showMeta: true,
  showButton: true,
  showProductName: true,

  buttonText: "Book Now",

  outOfStockText: "Currently Unavailable",

  outOfStockButtonText: "Unavailable",

  ...props.options,
}));

const bookingUrl = computed(() => {
  if (!props.product.redirectUrl) return null;

  return `${props.baseUrl}${props.product.redirectUrl}`;
});

const shortDescription = computed(() => {
  if (!props.product.short_description) return "";

  return props.product.short_description.length > 120
    ? props.product.short_description.substring(0, 120) + "..."
    : props.product.short_description;
});

const priceLabel = computed(() => {
  return ["SLOT", "KM_BASED"].includes(props.product.price_type)
    ? "Starting from"
    : "Flat Price";
});

function formatPrice(price) {
  if (!price) return "-";

  return Number(price).toLocaleString("en-IN");
}

function bookNow() {
  if (!bookingUrl.value) return;

  window.open(bookingUrl.value, "_blank", "noopener,noreferrer");
}
</script>

<style scoped>
.g2a-book-widget {
  width: 100%;
  max-width: 380px;
  overflow: hidden;
  background: #fff;
  border: 1px solid #e8e8e8;
  border-radius: 14px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
}

.g2a-book-widget__image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.g2a-book-widget__body {
  padding: 18px;
}

.g2a-book-widget__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  color: #222;
}

.g2a-book-widget__location {
  margin-top: 6px;
  font-size: 14px;
  color: #666;
}

.g2a-book-widget__description {
  margin: 14px 0;
  font-size: 14px;
  line-height: 1.6;
  color: #555;
}

.g2a-book-widget__price-section {
  margin: 18px 0;
}

.g2a-book-widget__label {
  font-size: 13px;
  color: #777;
}

.g2a-book-widget__amount {
  margin-top: 4px;
  font-size: 30px;
  font-weight: 700;
  color: #111;
}

.g2a-book-widget__amount span {
  font-size: 15px;
  color: #777;
  font-weight: 400;
}

.g2a-book-widget__status {
  margin: 18px 0;
  color: #d32f2f;
  font-weight: 700;
}

.g2a-book-widget__meta {
  margin: 18px 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
  color: #666;
  font-size: 14px;
}

.g2a-book-widget__button {
  width: 100%;
  padding: 14px;
  border: none;
  border-radius: 20px;
  background: #ffc107;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
}

.g2a-book-widget__button:hover:not(:disabled) {
  background: #f5b904;
}

.g2a-book-widget__button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.g2a-book-widget--disabled {
  opacity: 0.95;
}

@media (max-width: 640px) {
  .g2a-book-widget {
    max-width: 100%;
  }

  .g2a-book-widget__image {
    height: 180px;
  }

  .g2a-book-widget__title {
    font-size: 20px;
  }

  .g2a-book-widget__amount {
    font-size: 26px;
  }
}
</style>
