<template>
  <v-form ref="form" validate-on="submit">
    <v-row>
      <!-- LEFT -->

      <v-col cols="12" lg="8">
        <CheckoutRenderer :booking-template="booking.bookingTemplate" />
      </v-col>

      <!-- RIGHT -->

      <v-col cols="12" lg="4">
        <CheckoutSidebar
          :quote="quote"
          :loading="loadingQuote"
          @proceed="continueToPayment"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

import CheckoutRenderer from "./CheckoutRenderer.vue";
import CheckoutSidebar from "./CheckoutSidebar.vue";

import { bookingStore } from "@/store/booking";
import apiClient from "@/services/api.js";

const router = useRouter();
const route = useRoute();

const booking = bookingStore;

const form = ref(null);

const loading = ref(false);

const quote = ref(null);
const loadingQuote = ref(false);

onMounted(async () => {
  try {
    const { data } = await apiClient.get(
      `/v1/booking-estimates/${route.params.estimate_id}`,
    );

    quote.value = data.data;
  } finally {
    loadingQuote.value = false;
  }
});

const continueToPayment = async () => {
  const { valid } = await form.value.validate();

  if (!valid) {
    return;
  }

  loading.value = true;

  try {
    // Future:
    // await api.post("/checkout/validate", booking.form);
    // await api.post("/checkout/price", booking.form);

    router.push({
      name: "Payment",
    });
  } finally {
    loading.value = false;
  }
};
</script>
