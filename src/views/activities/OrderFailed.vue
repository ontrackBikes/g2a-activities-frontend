<template>
  <v-container class="py-12">
    <v-card
      max-width="700"
      class="mx-auto"
      rounded="lg"
      elevation="0"
      variant="outlined"
    >
      <v-card-text class="text-center py-10 px-6 px-sm-10">
        <v-avatar size="72" color="error" variant="tonal">
          <v-icon size="44" color="error"> mdi-close-thick </v-icon>
        </v-avatar>

        <div class="g2a-title-xl mt-6">Payment Failed</div>

        <div class="mt-2">
          We couldn't confirm your payment. Don't worry — your booking is still
          saved.
        </div>

        <v-divider class="my-8" />

        <div class="text-greyDark">Order ID</div>

        <div class="g2a-title-2xl font-weight-bold mt-1">
          {{ route.params.order_id }}
        </div>

        <v-alert
          class="mt-8 text-left"
          type="warning"
          variant="tonal"
          rounded="lg"
          icon="mdi-bank-outline"
        >
          If money was deducted from your account, it will either be confirmed
          shortly or automatically refunded by your bank.
        </v-alert>

        <div class="d-flex flex-wrap justify-center ga-4 mt-8">
          <v-btn
            size="large"
            flat
            rounded="lg"
            color="brandColor2"
            prepend-icon="mdi-reload"
            @click="retryPayment"
          >
            Retry Payment
          </v-btn>

          <v-btn
            size="large"
            variant="outlined"
            flat
            rounded="lg"
            color="brandColor2"
            prepend-icon="mdi-home-outline"
            @click="$router.push('/')"
          >
            Back Home
          </v-btn>
        </div>

        <div class="g2a-title-sm text-greyDark mt-8">
          Still stuck?
          <a
            href="https://go2andaman.com/contact-us/"
            target="_blank"
            rel="noopener noreferrer"
            class="g2a-link"
            >Contact our support team</a
          >
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const retryPayment = () => {
  router.replace({
    name: "OrderDetails",
    params: {
      order_id: route.params.order_id,
    },
  });
};
</script>
