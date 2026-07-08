<template>
  <!-- Quote Loading -->
  <v-row v-if="loadingQuote">
    <v-col cols="12" lg="8">
      <v-skeleton-loader type="article" />
    </v-col>

    <v-col cols="12" lg="4">
      <v-skeleton-loader type="card" />
    </v-col>
  </v-row>

  <!-- Quote Error -->
  <v-alert
    v-else-if="quoteError"
    type="error"
    variant="tonal"
    rounded="lg"
    class="my-6"
  >
    <div
      class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3"
    >
      <span>{{ quoteError }}</span>

      <v-btn
        color="error"
        variant="outlined"
        size="small"
        :loading="loadingQuote"
        @click="loadQuote"
      >
        Try Again
      </v-btn>
    </div>
  </v-alert>

  <!-- Checkout -->
  <v-form v-else ref="form" validate-on="submit">
    <v-row>
      <!-- LEFT -->
      <v-col cols="12" lg="8">
        <CheckoutRenderer
          :quote="quote"
          :booking-template="booking.bookingTemplate"
        />
      </v-col>

      <!-- RIGHT -->
      <v-col cols="12" lg="4">
        <CheckoutSidebar
          :quote="quote"
          :loading="loadingQuote"
          :submitting="submitting"
          :error="checkoutError"
          @proceed="continueToPayment"
        />
      </v-col>
    </v-row>
  </v-form>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import CheckoutRenderer from "./CheckoutRenderer.vue";
import CheckoutSidebar from "./CheckoutSidebar.vue";

import { bookingStore } from "@/store/booking";
import apiClient from "@/services/api";

const router = useRouter();
const route = useRoute();

const booking = bookingStore;

const form = ref(null);

// Quote
const quote = ref(null);
const loadingQuote = ref(true);
const quoteError = ref("");

// Order submission
const submitting = ref(false);
const checkoutError = ref("");

/**
 * Fetch Booking Quote
 */
const loadQuote = async () => {
  loadingQuote.value = true;
  quoteError.value = "";

  try {
    const { data } = await apiClient.get(
      `/v1/booking-estimates/${route.params.estimate_id}`,
    );

    quote.value = data.data;
  } catch (err) {
    console.error(err);

    quote.value = null;

    quoteError.value =
      err.response?.data?.message ||
      "Unable to load your booking summary. Please try again.";
  } finally {
    loadingQuote.value = false;
  }
};

/**
 * Continue to Payment
 */
const continueToPayment = async () => {
  if (submitting.value || loadingQuote.value) return;

  checkoutError.value = "";

  const validation = await form.value?.validate();

  if (!validation?.valid) return;

  submitting.value = true;

  try {
    const { data } = await apiClient.post(
      `/v1/orders/${route.params.estimate_id}`,
      booking.form,
    );

    router.push({
      name: "OrderDetails",
      params: {
        order_id: data.data.order_id,
      },
    });
  } catch (err) {
    console.error(err);

    checkoutError.value =
      err.response?.data?.message ||
      "Unable to proceed to payment. Please try again.";
  } finally {
    submitting.value = false;
  }
};

/**
 * Initial Load
 */
onMounted(loadQuote);

/**
 * Reload quote if estimate changes
 */
watch(
  () => route.params.estimate_id,
  () => {
    loadQuote();
  },
);
</script>
