<template>
  <v-container class="py-12">

    <v-card
      max-width="700"
      class="mx-auto"
      rounded="xl"
      elevation="0"
      variant="outlined"
    >

      <v-card-text class="text-center py-10">

        <v-avatar
          size="90"
          color="error"
        >
          <v-icon
            size="54"
            color="white"
          >
            mdi-close
          </v-icon>
        </v-avatar>

        <div class="text-h4 font-weight-bold mt-6">
          Payment Failed
        </div>

        <div class=" g2a-text-14 mt-3">
          We couldn't confirm your payment.
          Don't worry—your booking is still saved.
        </div>

        <v-divider class="my-8" />

        <div class="">
          Order ID
        </div>

        <div class="text-h6 font-weight-bold">
          {{ route.params.order_id }}
        </div>

        <v-alert
          class="mt-8"
          type="warning"
          variant="tonal"
        >
          If money was deducted from your account,
          it will either be confirmed shortly or automatically refunded by your bank.
        </v-alert>

        <div class="d-flex justify-center ga-4 mt-8">

          <v-btn
            color="primary"
            @click="retryPayment"
          >
            Retry Payment
          </v-btn>

          <v-btn
            variant="outlined"
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
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const retryPayment = () => {
  router.replace({
    name: "Order",
    params: {
      order_id: route.params.order_id,
    },
  });
};
</script>