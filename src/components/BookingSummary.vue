<template>
  <div class="sticky">
    <v-card elevation="0" sticky class="g2a-rounded-border border bg-white">
      <v-alert color="background"
        ><div class="g2a-text-20 g2a-text-bold-600">
          Booking Summary
        </div></v-alert
      >
      <v-divider />
      <v-container>
        <!-- Bike Image and Title -->
        <div>
          <v-row align="center" no-gutters>
            <v-col cols="auto" class="me-3">
              <v-card class="rounded-lg" elevation="0" width="100" height="60">
                <v-img
                  cover
                  height="80"
                  :src="productInfo.productThumbnailUrl"
                />
              </v-card>
            </v-col>

            <v-col>
              <p class="g2a-text-bold-600 g2a-text-14 mb-0">
                {{ productInfo.label }} -
                {{ bookingData.selectedLocation?.name }}
              </p>
              <p class="g2a-text-13 text-grey mb-0">
                {{ bookingData.quantity }} Vehicle(s)
              </p>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-4" color="grey" />

        <!-- Summary Details -->
        <div class="my-4">
          <!-- Duration -->
          <v-row class="my-1" dense no-gutters>
            <v-col cols="5">
              <p class="g2a-text-13 text-grey">Duration</p>
            </v-col>
            <v-col cols="7" align="end">
              <p class="g2a-text-bold-500 g2a-text-14">
                {{ calculateDuration }} Days
              </p>
            </v-col>
          </v-row>

          <!-- Dates -->
          <v-row class="my-1" dense no-gutters>
            <v-col cols="5">
              <p class="g2a-text-13 text-grey">Dates</p>
            </v-col>
            <v-col cols="7" align="end">
              <p class="g2a-text-bold-500 g2a-text-14">{{ formatDateRange }}</p>
            </v-col>
          </v-row>

          <!-- Pickup -->
          <v-row class="my-1" dense no-gutters>
            <v-col cols="5">
              <p class="g2a-text-13 text-grey">Pickup</p>
            </v-col>
            <v-col cols="7" align="end">
              <p class="g2a-text-bold-500 g2a-text-14">{{ pickupDisplay }}</p>
            </v-col>
          </v-row>

          <!-- Dropoff -->
          <v-row class="my-1" dense no-gutters>
            <v-col cols="5">
              <p class="g2a-text-13 text-grey">Dropoff</p>
            </v-col>
            <v-col cols="7" align="end">
              <p class="g2a-text-bold-500 g2a-text-14">{{ dropoffDisplay }}</p>
            </v-col>
          </v-row>
        </div>

        <v-divider color="grey" />

        <!-- Pricing -->
        <div class="my-4">
          <v-row dense no-gutters>
            <v-col cols="7">
              <p class="g2a-text-15">
                Rental ({{ calculateDuration }}d x ₹{{
                  bookingData.selectedLocation?.pricing?.amount || 0
                }})
              </p>
            </v-col>
            <v-col cols="5" align="end">
              <p class="g2a-text-bold-500 g2a-text-15">₹{{ rentalTotal }}</p>
            </v-col>
          </v-row>
        </div>

        <v-divider color="grey" />

        <!-- Total -->
        <v-row class="mt-3" dense no-gutters>
          <v-col cols="5">
            <p class="g2a-text-bold-600 g2a-text-20">Total</p>
          </v-col>
          <v-col cols="7" align="end">
            <p class="g2a-text-bold-700 g2a-text-24 text-warning">
              ₹{{ totalPrice }}
            </p>
          </v-col>
        </v-row>
      </v-container>
      <!-- No Hidden Charges -->
      <v-alert :icon="false" color="surface" density="compact">
        <div class="d-flex align-center justify-center w-100">
          <v-icon color="grey" size="14" class="me-2">
            mdi-shield-check
          </v-icon>
          <span class="g2a-text-13 text-grey">No hidden charges</span>
        </div>
      </v-alert>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import moment from "moment";

const props = defineProps({
  productInfo: {
    type: Object,
    required: true,
  },
  bookingData: {
    type: Object,
    required: true,
  },
  locationData: {
    type: Object,
    required: false,
  },
  rentalCost: {
    type: Number,
    required: true,
  },
});

const calculateDuration = computed(() => {
  if (props.bookingData.pickupDate && props.bookingData.returnDate) {
    const pickup = moment(props.bookingData.pickupDate);
    const dropoff = moment(props.bookingData.returnDate);
    return dropoff.diff(pickup, "days") || 1;
  }
  return 0;
});

const formatDateRange = computed(() => {
  if (props.bookingData.pickupDate && props.bookingData.returnDate) {
    const pickup = moment(props.bookingData.pickupDate);
    const dropoff = moment(props.bookingData.returnDate);
    return `${pickup.format("DD MMM")} - ${dropoff.format("DD MMM")}`;
  }
  return "Not selected";
});

const pickupDisplay = computed(() => {
  if (props.bookingData.pickupType === "self-pickup") {
    return "Self Pickup";
  } else if (props.bookingData.pickupType === "hotel") {
    return "Hotel Pickup";
  }
  return "Not Selected";
});

const dropoffDisplay = computed(() => {
  if (props.bookingData.dropType === "self-drop") {
    return "Self Drop";
  } else if (props.bookingData.pickupType === "hotel") {
    return "Hotel Drop";
  }
  return "Not Selected";
});

const rentalTotal = computed(() => {
  return (
    calculateDuration.value *
    (props.bookingData.selectedLocation?.pricing?.amount || 600) *
    props.bookingData.quantity
  );
});

const totalPrice = computed(() => {
  return rentalTotal.value;
});
</script>

<style scoped>
.sticky {
  position: sticky !important;
  top: 80px !important;
}
</style>
