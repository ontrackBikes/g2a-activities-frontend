<template>
  <v-container class="py-12">

    <v-card
      max-width="700"
      class="mx-auto"
      rounded="lg"
      elevation="0"
      variant="outlined"
    >

      <v-card-text class="text-center py-10">

        <v-avatar
          size="90"
          color="success"
        >
          <v-icon
            size="54"
            color="white"
          >
            mdi-check
          </v-icon>
        </v-avatar>

        <div class="text-h4 font-weight-bold mt-6">
          Booking Confirmed 🎉
        </div>

        <div class=" g2a-text-14 mt-3">
          Thank you for booking with Go2Andaman.
          Your payment has been received successfully.
        </div>

        <v-divider class="my-8" />

        <div class="">
          Order ID
        </div>

        <div class="g2a-title-4 font-weight-bold">
          {{ route.params.order_id }}
        </div>

        <v-alert
          class="mt-8"
          variant="tonal"
          type="success"
        >
          A confirmation email and booking voucher will be sent shortly.
        </v-alert>

        <div class="d-flex justify-center ga-4 mt-8">

          <v-btn
            color="primary"
            @click="viewOrder"
          >
            View Booking
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

const viewOrder = () => {
  router.replace({
    name: "Order",
    params: {
      order_id: route.params.order_id,
    },
  });
};
</script>