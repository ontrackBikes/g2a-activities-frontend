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

        <!-- Pickup Location -->

        <v-col
          v-if="visible('pickup_location')"
          cols="12"
        >
          <v-text-field
            v-model="bike.pickup_location"
            label="Pickup Location"
            prepend-inner-icon="mdi-map-marker"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="rules('pickup_location')"
          />
        </v-col>

        <!-- Drop Location -->

        <v-col
          v-if="visible('drop_location')"
          cols="12"
        >
          <v-text-field
            v-model="bike.drop_location"
            label="Return / Drop Location"
            prepend-inner-icon="mdi-map-marker-radius"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="rules('drop_location')"
          />
        </v-col>

        <!-- Pickup Time -->

        <v-col
          v-if="visible('pickup_time')"
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
            :rules="rules('pickup_time')"
          />
        </v-col>

        <!-- Return Time -->

        <v-col
          v-if="visible('return_time')"
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
            :rules="rules('return_time')"
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

const fields = computed(() => {
  return props.config?.fields || [];
});

const fieldConfig = (name) => {
  return fields.value.find((x) => x.field === name);
};

const visible = (name) => {
  const field = fieldConfig(name);

  if (!field) {
    return true;
  }

  return field.visible !== false;
};

const rules = (name) => {
  const field = fieldConfig(name);

  const validations = [];

  if (field?.required) {
    validations.push(
      (v) => !!v || `${pretty(name)} is required`
    );
  }

  return validations;
};

const pretty = (value) => {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>