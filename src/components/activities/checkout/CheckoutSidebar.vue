<template>
  <div class="sticky-sidebar">
    <v-card
      rounded="lg"
      variant="outlined"
      elevation="0"
      class="overflow-hidden"
    >
      <!-- Image -->
      <v-img :src="booking.product?.thumbnail_url" height="180" cover />

      <v-card-text>
        <div class="g2a-subtitle g2a-text-bold-700">
          {{ booking.product?.name }}
        </div>

        <div
          class="g2a-text-13 text-medium-emphasis mt-1"
          v-if="booking.product?.location_text"
        >
          <v-icon icon="mdi-map-marker" size="14" class="me-1" />

          {{ booking.product.location_text }}
        </div>

        <v-divider class="my-5" />

        <!-- Booking Summary -->

        <div class="g2a-text-16 g2a-text-bold-600 mb-4">Booking Summary</div>

        <div class="summary-row">
          <span>Date</span>

          <strong>
            {{ booking.form.travel_date || "-" }}
          </strong>
        </div>

        <div class="summary-row" v-if="booking.form.slot">
          <span>Slot</span>

          <strong>
            {{ slotName }}
          </strong>
        </div>

        <div class="summary-row">
          <span>Guests</span>

          <strong>
            {{ booking.form.guests || 1 }}
          </strong>
        </div>

        <v-divider class="my-5" />

        <!-- Pricing -->

        <div class="summary-row">
          <span>Price</span>

          <strong> ₹{{ booking.product?.starting_price || 0 }} </strong>
        </div>

        <div class="summary-row">
          <span> × {{ booking.form.guests || 1 }} </span>

          <strong> ₹{{ subtotal }} </strong>
        </div>

        <div class="summary-row" v-if="discount > 0">
          <span>Discount</span>

          <span class="text-success"> - ₹{{ discount }} </span>
        </div>

        <div class="summary-row" v-if="taxes > 0">
          <span>Taxes</span>

          <strong> ₹{{ taxes }} </strong>
        </div>

        <v-divider class="my-5" />

        <div class="d-flex justify-space-between align-center">
          <div class="g2a-text-16 g2a-text-bold-700">Total</div>

          <div class="g2a-title text-brandColor2">₹{{ total }}</div>
        </div>

        <v-alert color="success" variant="tonal" density="compact" class="mt-5">
          Free cancellation available
        </v-alert>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

const booking = bookingStore;

const subtotal = computed(() => {
  return (
    Number(booking.product?.starting_price || 0) *
    Number(booking.form.guests || 1)
  );
});

const discount = computed(() => 0);

const taxes = computed(() => 0);

const total = computed(() => {
  return subtotal.value - discount.value + taxes.value;
});

const slotName = computed(() => {
  if (!booking.form.slot) return "-";

  const slot = booking.product?.slots?.find((x) => x.id === booking.form.slot);

  return slot?.slot_name || "-";
});
</script>

<style scoped>
.sticky-sidebar {
  position: sticky;
  top: 90px;
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
</style>
