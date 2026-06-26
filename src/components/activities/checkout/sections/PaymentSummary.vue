<template>
  <v-card rounded="xl" variant="outlined">
    <v-card-title> Payment Summary </v-card-title>

    <v-divider />

    <v-card-text>
      <div class="summary-row">
        <span>Activity</span>
        <strong>{{ booking.product.name }}</strong>
      </div>

      <div class="summary-row">
        <span>Date</span>
        <strong>{{ booking.form.travel_date }}</strong>
      </div>

      <div class="summary-row">
        <span>Guests</span>
        <strong>{{ booking.form.guests }}</strong>
      </div>

      <div class="summary-row">
        <span>Price</span>
        <strong>₹{{ booking.product.starting_price }}</strong>
      </div>

      <v-divider class="my-4" />

      <div class="summary-row">
        <span>Total</span>

        <div class="g2a-title text-brandColor2">₹{{ total }}</div>
      </div>

      <v-btn
        block
        color="brandColor"
        size="large"
        class="mt-6"
        @click="proceed"
      >
        Continue to Payment
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { bookingStore } from "@/store/booking";

const booking = bookingStore;
const router = useRouter();

const total = computed(() => {
  return (
    Number(booking.product.starting_price || 0) *
    Number(booking.form.guests || 1)
  );
});

function proceed() {
  router.push("/payment");
}
</script>

<style scoped>
.summary-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
}
</style>
