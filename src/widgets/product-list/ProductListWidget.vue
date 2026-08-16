<template>
  <div v-if="!products.length" class="g2a-empty">No products found.</div>

  <div v-else class="g2a-product-grid">
    <div
      v-for="(product, index) in products"
      :key="`${product.slug}-${product.locations?.[0]?.slug || index}`"
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
        <h3 class="g2a-book-widget__title">
          {{ product.name }}
        </h3>

        <div v-if="product.locations?.length" class="g2a-book-widget__location">
          📍 {{ product.locations[0].name }}
        </div>

        <p class="g2a-book-widget__description">
          {{ truncate(product.short_description) }}
        </p>

        <div
          v-if="!product.out_of_stock"
          class="g2a-book-widget__price-section"
        >
          ₹{{ formatPrice(product.starting_price) }}
        </div>

        <div v-else class="g2a-book-widget__status">
          {{ settings.outOfStockText }}
        </div>

        <button
          class="g2a-book-widget__button"
          :disabled="product.out_of_stock"
          @click="bookNow(product)"
        >
          {{
            product.out_of_stock
              ? settings.outOfStockButtonText
              : settings.buttonText
          }}
        </button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  products: {
    type: Array,
    default: () => [],
  },

  baseUrl: {
    type: String,
    default: "https://go2andaman.com",
  },

  options: {
    type: Object,
    default: () => ({}),
  },
});

const settings = computed(() => ({
  showImage: true,
  buttonText: "Book Now",
  outOfStockText: "Currently Unavailable",
  outOfStockButtonText: "Unavailable",
  redirectTemplate: "/{category}/{productType}/{product}-in-{location}/book",
  ...props.options,
}));

function truncate(text = "") {
  return text.length > 120 ? text.substring(0, 120) + "..." : text;
}

function formatPrice(price) {
  return Number(price || 0).toLocaleString("en-IN");
}

function bookNow(product) {
  const category = product.category?.slug;
  const productType = product.product_type?.slug;
  const location = product.locations?.[0]?.slug;

  if (!category || !productType || !location) {
    return;
  }

  const path = settings.value.redirectTemplate
    .replace("{category}", category)
    .replace("{productType}", productType)
    .replace("{product}", product.slug)
    .replace("{location}", location);

  window.open(`${props.baseUrl}${path}`, "_blank", "noopener,noreferrer");
}
</script>

<style scoped>
.g2a-product-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 24px;
  width: 100%;
}

.g2a-book-widget {
  overflow: hidden;
  background: #fff;
  border: 1px solid #e8edf3;
  border-radius: 18px;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.08);
  transition: all 0.25s ease;
  display: flex;
  flex-direction: column;
}

.g2a-book-widget:hover {
  transform: translateY(-6px);
  box-shadow: 0 18px 40px rgba(15, 23, 42, 0.16);
}

.g2a-book-widget--disabled {
  opacity: 0.75;
}

.g2a-book-widget__image {
  width: 100%;
  height: 220px;
  object-fit: cover;
  display: block;
}

.g2a-book-widget__body {
  display: flex;
  flex-direction: column;
  flex: 1;
  padding: 20px;
}

.g2a-book-widget__title {
  margin: 0;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.35;
  color: #1f2937;
}

.g2a-book-widget__location {
  margin: 8px 0 4px;
  color: #0f766e;
  font-size: 14px;
  font-weight: 600;
}

.g2a-book-widget__description {
  margin: 12px 0 18px;
  color: #6b7280;
  line-height: 1.7;
  font-size: 14px;
  min-height: 72px;
}

.g2a-book-widget__price-section {
  margin-top: auto;
  font-size: 30px;
  font-weight: 700;
  color: #0f172a;
}

.g2a-book-widget__price-section::before {
  content: "Starting from";
  display: block;
  margin-bottom: 4px;
  color: #94a3b8;
  font-size: 13px;
  font-weight: 500;
}

.g2a-book-widget__status {
  margin-top: auto;
  color: #dc2626;
  font-size: 15px;
  font-weight: 700;
}

.g2a-book-widget__button {
  margin-top: 20px;
  width: 100%;
  height: 20px;
  border: none;
  border-radius: 40px;
  background: #ffc107;
  color: #fff;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.g2a-book-widget__button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(255, 193, 7, 0.35);
}

.g2a-book-widget__button:active:not(:disabled) {
  transform: translateY(0);
}

.g2a-book-widget__button:disabled {
  background: #d1d5db;
  color: #6b7280;
  cursor: not-allowed;
  box-shadow: none;
}

.g2a-empty {
  padding: 60px 20px;
  border: 2px dashed #dbe4ef;
  border-radius: 16px;
  background: #fafbfd;
  color: #64748b;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}

@media (max-width: 1024px) {
  .g2a-product-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  }
}

@media (max-width: 768px) {
  .g2a-product-grid {
    grid-template-columns: 1fr;
    gap: 18px;
  }

  .g2a-book-widget__image {
    height: 200px;
  }

  .g2a-book-widget__title {
    font-size: 20px;
  }

  .g2a-book-widget__price-section {
    font-size: 26px;
  }
}
</style>
