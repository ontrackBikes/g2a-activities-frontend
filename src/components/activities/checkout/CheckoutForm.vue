<template>
  <!-- Loading quote -->

  <v-row v-if="loadingQuote">
    <v-col cols="12" lg="8">
      <v-skeleton-loader type="article" />
    </v-col>
    <v-col cols="12" lg="4">
      <v-skeleton-loader type="card" />
    </v-col>
  </v-row>

  <!-- Error loading quote -->
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
      <v-btn color="error" variant="outlined" size="small" @click="loadQuote">
        Try Again
      </v-btn>
    </div>
  </v-alert>

  <v-form v-else ref="form" validate-on="submit">
    <v-row>
      <!-- LEFT -->
      <v-col cols="12" lg="8">
        <CheckoutRenderer
          :booking-template="quote.product.bookingTemplate"
          :quote="quote"
        />
      </v-col>

      <!-- RIGHT -->
      <v-col cols="12" lg="4">
        <CheckoutSidebar
          :quote="quote"
          :submitting="submitting"
          :error="checkoutError"
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

import apiClient from "@/services/api.js";
import { bookingStore } from "@/store/booking.js";

const router = useRouter();
const route = useRoute();

// bookingStore already holds `product`, `bookingTemplate`, and `form`
// (populated in ProductDetails.vue via saveBooking(), then reloaded in
// Checkout.vue via loadBooking()). The section components (CustomerDetails,
// Participants, MedicalDeclaration, BikeDelivery, FerrySeatSelection,
// EmergencyContact) all write directly into bookingStore.form, so this is
// the single source of truth for the checkout payload.
const booking = bookingStore;

const form = ref(null);
const submitting = ref(false);
const checkoutError = ref("");

const quote = ref(null);
const loadingQuote = ref(true);
const quoteError = ref("");

const loadQuote = async () => {
  loadingQuote.value = true;
  quoteError.value = "";

  try {
    const { data } = await apiClient.get(
      `/v1/booking-estimates/${route.params.estimate_id}`,
    );

    // This endpoint only supplies pricing/product display data for the
    // sidebar — it is NOT the source of the form payload, so we don't
    // touch `booking` here.
    quote.value = data.data;
  } catch (err) {
    quoteError.value =
      err.response?.data?.message ||
      err.message ||
      "Unable to load your booking summary. Please try again.";
  } finally {
    loadingQuote.value = false;
  }
};

onMounted(loadQuote);

const continueToPayment = async () => {
  checkoutError.value = "";

  const { valid } = await form.value.validate();

  if (!valid) {
    return;
  }

  submitting.value = true;

  console.log("Booking details", booking.form);

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
    checkoutError.value =
      err.response?.data?.message ||
      err.message ||
      "Unable to proceed to payment. Please try again.";
  } finally {
    submitting.value = false;
  }
};
</script>
