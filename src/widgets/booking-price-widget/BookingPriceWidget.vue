<template>
  <div class="g2a-book-widget">
    <div class="g2a-book-widget__price">
      <div class="g2a-book-widget__label">
        {{ label }}
      </div>

      <div class="g2a-book-widget__amount">
        ₹ {{ product.starting_price }}
        <span>/ guest</span>
      </div>
    </div>

    <button class="g2a-book-widget__button" @click="bookNow">Book Now</button>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

// Change this when you deploy
const BASE_URL = "http://localhost:5173";

const label = computed(() =>
  props.product.price_type === "SLOT" ? "Starts from" : "Flat price",
);

const bookNow = () => {
  if (!props.product.redirectUrl) {
    console.error("Missing redirectUrl");
    return;
  }

  window.location.href = `${BASE_URL}${props.product.redirectUrl}`;
};
</script>
