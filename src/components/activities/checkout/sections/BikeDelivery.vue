<template>
  <v-card
    rounded="xl"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        Bike Delivery Details
      </div>

      <div class="g2a-text-13 text-medium-emphasis mt-1">
        Tell us where you'd like the bike to be delivered and collected.
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
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="bike.drop_location"
            label="Return / Drop Location"
            prepend-inner-icon="mdi-map-marker-radius"
            variant="outlined"
            density="comfortable"
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
          />
        </v-col>

      </v-row>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

const booking = bookingStore;

const defaultBike = {
  pickup_location: "",
  drop_location: "",
  pickup_time: "",
  return_time: "",
};

const bike = computed({
  get() {
    if (!booking.form.bike_delivery) {
      booking.form.bike_delivery = {
        ...defaultBike,
      };
    }

    return booking.form.bike_delivery;
  },

  set(value) {
    booking.form.bike_delivery = value;
  },
});
</script>