<template>
  <v-card rounded="lg" flat class="border">
    <v-container class="py-4">
      <div class="g2a-title-xl">
        {{ config.title || "Pickup & Drop" }}
      </div>

      <div class="mt-1">
        {{
          config.description ||
          "Let us know if you'd like to opt for pickup and drop for this activity. If you choose to opt for pickup and drop, our team will contact you to confirm the details. Price starts from ₹450."
        }}
      </div>
    </v-container>

    <v-divider />

    <v-container>
      <v-checkbox
        v-model="optForPickupAndDrop"
        color="primary"
        hide-details="auto"
        density="compact"
      >
        <template #label>
          {{
            config.checkbox_label ||
            "Yes, I'd like to opt for pickup and drop"
          }}
        </template>
      </v-checkbox>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },

  quote: {
    type: Object,
    default: () => ({}),
  },
});

const booking = bookingStore;

const optForPickupAndDrop = computed({
  get() {
    return booking.form.opt_for_pickup_and_drop ?? false;
  },

  set(value) {
    booking.form.opt_for_pickup_and_drop = value;
  },
});
</script>
