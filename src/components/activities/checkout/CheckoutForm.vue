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
      <v-btn color="error" variant="outlined" size="large" @click="loadQuote">
        Try Again
      </v-btn>
    </div>
  </v-alert>

  <v-form v-else ref="form" validate-on="submit">
    <v-container>
      <v-row :no-gutters="mobile">
        <!-- LEFT -->
        <v-col cols="12" lg="7">
          <CheckoutRenderer
            :booking-template="quote.product?.bookingTemplate"
            :quote="quote"
          />

          <div v-if="quote.product?.highlights?.length > 0">
            <v-card
              rounded="lg"
              flat
              class="border my-4"
              v-for="(higlight, index) in quote.product?.highlights"
              :key="index"
            >
              <v-container>
                <div>
                  <div class="d-flex">
                    <v-icon
                      :icon="getIcon(higlight.title)"
                      size="24"
                      color="brandColor2"
                      class="mt-1"
                    />
                    <div class="ml-2">
                      <div class="g2a-title-lg">{{ higlight.title }}</div>
                      <div class="mt-1">{{ higlight.content }}</div>
                    </div>
                  </div>
                </div>
              </v-container>
            </v-card>
          </div>

          <!-- cancellation_policies -->

          <v-card
            rounded="lg"
            flat
            v-if="quote.product?.cancellation_policies?.length > 0"
            class="border my-4"
          >
            <v-container>
              <div class="d-flex">
                <v-icon
                  icon="mdi-swap-horizontal"
                  size="24"
                  color="brandColor2"
                  class="mt-1"
                />
                <div class="ml-2">
                  <div class="g2a-title-lg">Cancellation & Refund Policy</div>
                  <div
                    v-for="(policy, index) in quote.product
                      .cancellation_policies"
                    :key="index"
                    class="my-2"
                  >
                    <div v-if="policy.title" class="g2a-title-md">
                      {{ policy.title }}
                    </div>
                    <div>{{ policy.content }}</div>
                  </div>
                </div>
              </div>
            </v-container>
          </v-card>

          <!-- FAQs -->
          <G2AExpansionPanel
            title="FAQs"
            class="my-4"
            v-if="quote.product?.faqs?.length > 0"
          >
            <v-container>
              <div
                v-for="(faq, index) in quote.product.faqs"
                :key="index"
                class="mb-3"
              >
                <div class="g2a-title-lg">{{ faq.question }}</div>
                <div>{{ faq.answer }}</div>
              </div>
            </v-container>
          </G2AExpansionPanel>

          <!-- Terms & Conditions -->
          <G2AExpansionPanel
            class="my-4"
            title="Terms & Conditions"
            v-if="quote.product?.terms?.length > 0"
          >
            <v-container>
              <div
                v-for="(term, index) in quote.product.terms"
                :key="index"
                class="d-flex mb-1"
              >
                <div>-</div>
                <div class="ml-2">{{ term.content }}</div>
              </div>
            </v-container>
          </G2AExpansionPanel>
        </v-col>

        <!-- RIGHT -->
        <v-col cols="12" lg="5">
          <CheckoutSidebar
            
            :quote="quote"
            :submitting="submitting"
            :error="checkoutError"
            @proceed="continueToPayment"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup>
import { onMounted, ref, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";

import CheckoutRenderer from "./CheckoutRenderer.vue";
import CheckoutSidebar from "./CheckoutSidebar.vue";

import apiClient from "@/services/api.js";
import { bookingStore } from "@/store/booking.js";
import { useDisplay } from "vuetify";
import G2AExpansionPanel from "@/components/common/G2AExpansionPanel.vue";

const router = useRouter();
const route = useRoute();
const { mobile } = useDisplay();

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

const getIcon = (title) => {
  if (title == "Security Deposits") {
    return "mdi-shield-lock-outline";
  } else if (title == "Damage Policy") {
    return "mdi-information-outline";
  }
  return "mdi-crown-outline";
};

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

const scrollToFirstError = async () => {
  await nextTick();

  const formEl = form.value?.$el;
  if (!formEl) return;

  const firstInvalid = formEl.querySelector(
    ".v-input--error, .v-field--error, [aria-invalid='true']",
  );
  if (!firstInvalid) return;

  firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });

  const focusable = firstInvalid.querySelector(
    "input, textarea, select, [tabindex]",
  );
  focusable?.focus({ preventScroll: true });
};

const continueToPayment = async () => {
  checkoutError.value = "";

  const { valid } = await form.value.validate();

  if (!valid) {
    scrollToFirstError(); // <-- only new line inside continueToPayment
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
    const response = err.response?.data;

    if (response?.errors?.length) {
      checkoutError.value = response.errors
        .flatMap((section) => section.errors)
        .join("\n");
    } else {
      checkoutError.value =
        response?.message ||
        err.message ||
        "Unable to proceed to payment. Please try again.";
    }
  } finally {
    submitting.value = false;
  }
};
</script>
