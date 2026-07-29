<template>
  <v-container class="py-12">
    <v-card
      max-width="620"
      class="mx-auto"
      rounded="lg"
      elevation="0"
      variant="outlined"
    >
      <v-card-text class="text-center py-10 px-6 px-sm-10">
        <v-avatar size="72" color="success" variant="tonal">
          <v-icon size="44" color="success"> mdi-check-bold </v-icon>
        </v-avatar>

        <div class="g2a-title-2xl mt-6">Booking Confirmed</div>

        <div class="mt-2">
          Thank you for booking with Go2Andaman. Your payment has been received
          successfully.
        </div>

        <v-divider class="my-8" />

        <div class="text-greyDark">Order ID</div>

        <div class="d-flex align-center justify-center ga-1 mt-1">
          <span class="g2a-title-lg">
            {{ route.params.order_id }}
          </span>
          <v-btn
            :icon="copied ? 'mdi-check' : 'mdi-content-copy'"
            :color="copied ? 'success' : 'greyDark'"
            size="small"
            variant="text"
            aria-label="Copy order ID"
            @click="copyOrderId"
          />
        </div>

        <v-alert
          class="mt-8 text-left"
          variant="tonal"
          rounded="lg"
          type="success"
          icon="mdi-email-check-outline"
        >
          A confirmation email and booking voucher will be sent shortly.
        </v-alert>

        <div class="d-flex flex-wrap justify-center ga-4 mt-8">
          <v-btn
            size="large"
            flat
            rounded="lg"
            color="brandColor2"
            prepend-icon="mdi-ticket-confirmation-outline"
            @click="viewOrder"
          >
            View Booking
          </v-btn>

          <v-btn
            size="large"
            flat
            rounded="lg"
            color="brandColor2"
            variant="outlined"
            prepend-icon="mdi-home-outline"
            @click="$router.push('/')"
          >
            Back Home
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();
const copied = ref(false);

const viewOrder = () => {
  router.replace({
    name: "Order",
    params: {
      order_id: route.params.order_id,
    },
  });
};

const copyOrderId = async () => {
  try {
    await navigator.clipboard.writeText(route.params.order_id);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  } catch (e) {
    // clipboard not available, ignore
  }
};
</script>
