<template>
  <v-card
    rounded="lg"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        {{ config.title || "Bike Delivery Details" }}
      </div>

      <div
        v-if="config.description"
        class="g2a-text-13 text-medium-emphasis mt-1"
      >
        {{ config.description }}
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-row>

        <v-col cols="12">
          <v-text-field
            v-model="bike.pickup_location"
            label="Pickup Location"
            prepend-inner-icon="mdi-map-marker"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'Pickup Location is required'
            ]"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="bike.drop_location"
            label="Return / Drop Location"
            prepend-inner-icon="mdi-map-marker-radius"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'Return Location is required'
            ]"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="bike.pickup_time"
            type="time"
            label="Pickup Time"
            prepend-inner-icon="mdi-clock-outline"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'Pickup Time is required'
            ]"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="bike.return_time"
            type="time"
            label="Return Time"
            prepend-inner-icon="mdi-clock-check-outline"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'Return Time is required'
            ]"
          />
        </v-col>

      </v-row>
    </v-card-text>
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
});

const booking = bookingStore;

const bike = computed({
  get() {
    if (!booking.form.bike_delivery) {
      booking.form.bike_delivery = {
        pickup_location: "",
        drop_location: "",
        pickup_time: "",
        return_time: "",
      };
    }

    return booking.form.bike_delivery;
  },

  set(value) {
    booking.form.bike_delivery = value;
  },
});
</script>