<template>
  <v-container
    fluid
    class="py-8"
    v-if="booking.product"
  >
    <v-row>

      <!-- LEFT -->

      <v-col
        cols="12"
        lg="8"
      >
        <CheckoutRenderer
          :booking-template="booking.bookingTemplate"
        />
      </v-col>

      <!-- RIGHT -->

      <v-col
        cols="12"
        lg="4"
      >
        <CheckoutSidebar />
      </v-col>

    </v-row>
  </v-container>

  <div
    v-else
    class="text-center py-16"
  >
    <v-progress-circular
      indeterminate
      size="60"
    />
  </div>
</template>

<script setup>
import CheckoutRenderer from "@/components/activities/checkout/CheckoutRenderer.vue";
import CheckoutSidebar from "@/components/activities/checkout/CheckoutSidebar.vue";
import { bookingStore } from "@/store/booking";


const booking = bookingStore;
</script>