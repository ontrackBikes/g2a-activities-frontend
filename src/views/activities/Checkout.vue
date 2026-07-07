<template>
  <div v-if="booking.product">
    <CheckoutForm />
  </div>

  <div v-else-if="loading" class="text-center py-16">
    <v-progress-circular indeterminate size="60" color="primary" />
  </div>

  <v-container v-else class="py-16 text-center">
    <v-icon size="80" color="grey"> mdi-cart-outline </v-icon>

    <div class="text-h5 mt-4">No booking found</div>

    <div class="text-medium-emphasis mt-2">
      Please select an activity first.
    </div>

    <v-btn class="mt-6" color="brandColor" @click="$router.push('/')">
      Browse Activities
    </v-btn>
  </v-container>
</template>

<script setup>
import { onMounted, ref } from "vue";

import CheckoutForm from "@/components/activities/checkout/CheckoutForm.vue";

import { bookingStore, loadBooking } from "@/store/booking";

const booking = bookingStore;

const loading = ref(true);

onMounted(() => {
  loadBooking();
  loading.value = false;
});
</script>
