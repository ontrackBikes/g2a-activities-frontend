<template>
  <v-card rounded="lg" variant="outlined" elevation="0">
    <v-card-title class="py-4">
      <div class="g2a-subtitle">Payment Summary</div>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <div class="summary-row">
        <span>Activity</span>
        <strong>{{ booking.product?.name || "-" }}</strong>
      </div>

      <div class="summary-row">
        <span>Travel Date</span>
        <strong>{{ formattedDate }}</strong>
      </div>

      <div class="summary-row">
        <span>Guests</span>
        <strong>{{ guests }}</strong>
      </div>

      <div class="summary-row">
        <span>Price / Person</span>
        <strong>₹{{ price.toLocaleString() }}</strong>
      </div>

      <v-divider class="my-5" />

      <div class="summary-row align-center">
        <span class="g2a-text-bold-600"> Total Payable </span>

        <div class="g2a-title text-brandColor2">
          ₹{{ total.toLocaleString() }}
        </div>
      </div>

      <v-btn
        block
        flat
        size="large"
        rounded="xl"
        color="brandColor"
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

const router = useRouter();
const booking = bookingStore;

const guests = computed(() => {
  return Number(booking.form.guests || 1);
});

const price = computed(() => {
  return Number(booking.product?.starting_price || 0);
});

const total = computed(() => {
  return guests.value * price.value;
});

const formattedDate = computed(() => {
  if (!booking.form.travel_date) {
    return "-";
  }

  return new Date(booking.form.travel_date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
});

const proceed = () => {
  router.push({
    name: "Payment",
  });
};
</script>

<style scoped>
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}

.summary-row span:first-child {
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.75;
}
</style>
