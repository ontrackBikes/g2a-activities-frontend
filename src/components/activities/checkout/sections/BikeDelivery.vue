<template>
  <v-card rounded="lg" variant="outlined" elevation="0">
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
            :rules="[(v) => !!v || 'Pickup Location is required']"
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
            :rules="[(v) => !!v || 'Return Location is required']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="bike.pickup_time"
            type="time"
            label="Pickup Time"
            prepend-inner-icon="mdi-clock-outline"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[(v) => !!v || 'Pickup Time is required']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="bike.return_time"
            type="time"
            label="Return Time"
            prepend-inner-icon="mdi-clock-check-outline"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[(v) => !!v || 'Return Time is required']"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
<script setup>
import { computed, watch } from "vue";
import { bookingStore } from "@/store/booking";

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },

  quote: {
    type: Object,
    required: true,
  },
});

const booking = bookingStore;

const STORAGE_KEY = "g2a_bike_delivery_v1";

const defaultBikeDelivery = () => ({
  pickup_location: "",
  drop_location: "",
  pickup_time: "",
  return_time: "",
});

/*
|--------------------------------------------------------------------------
| Local Storage
|--------------------------------------------------------------------------
*/

const loadBikeDelivery = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultBikeDelivery();
    }

    return {
      ...defaultBikeDelivery(),
      ...JSON.parse(raw),
    };
  } catch {
    return defaultBikeDelivery();
  }
};

const saveBikeDelivery = (value) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        pickup_location: value.pickup_location,
        drop_location: value.drop_location,
        pickup_time: value.pickup_time,
        return_time: value.return_time,
      }),
    );
  } catch {
    // Ignore storage failures
  }
};

/*
|--------------------------------------------------------------------------
| Bike Delivery
|--------------------------------------------------------------------------
*/

const bike = computed({
  get() {
    if (!booking.form.bike_delivery) {
      booking.form.bike_delivery = loadBikeDelivery();
    }

    return booking.form.bike_delivery;
  },

  set(value) {
    booking.form.bike_delivery = value;
  },
});

/*
|--------------------------------------------------------------------------
| Auto Save
|--------------------------------------------------------------------------
*/

watch(
  bike,
  (value) => {
    saveBikeDelivery(value);
  },
  {
    deep: true,
  },
);
</script>
