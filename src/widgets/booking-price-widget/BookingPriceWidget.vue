<template>
  <div class="g2a-book-widget">
    <template v-if="!product.out_of_stock">
      <div class="g2a-book-widget__price">
        <div class="g2a-book-widget__label">
          {{ label }}
        </div>

        <div class="g2a-book-widget__amount">
          ₹ {{ product.starting_price }}
          <span>/ guest</span>
        </div>
      </div>

      <button
        class="g2a-book-widget__button"
        @click="bookNow"
      >
        Book Now
      </button>
    </template>

    <template v-else>
      <div class="g2a-book-widget__price">
        <div class="g2a-book-widget__label">
          Booking Status
        </div>

        <div class="g2a-book-widget__out-of-stock">
          Out of Stock
        </div>

        <div
          v-if="product.next_available_slot"
          class="g2a-book-widget__next-slot"
        >
          Next Available:
          {{ product.next_available_slot }}
        </div>
      </div>

      <button
        class="g2a-book-widget__button g2a-book-widget__button--disabled"
        disabled
      >
        Out of Stock
      </button>
    </template>
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
    default: "http://localhost:5137",
  },
});

const label = computed(() =>
  props.product.price_type === "SLOT"
    ? "Starts from"
    : "Flat price"
);

const bookNow = () => {
  if (!props.product.redirectUrl) return;

  window.location.href =
    `${props.baseUrl}${props.product.redirectUrl}`;
};
</script>