<template>
  <div class="sticky">
    <v-card elevation="0" sticky class="g2a-rounded-border border">
      <v-alert
        ><div class="g2a-text-20 g2a-text-bold-600">
          Booking Summary
        </div></v-alert
      >
      <v-container>
        <!-- Bike Image and Title -->
        <div class="mb-6">
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
              <p class="g2a-text-caption text-greyDark mb-0">
                {{ bookingData.quantity }} Vehicle(s)
              </p>
            </v-col>
          </v-row>
        </div>

        <!-- Summary Details -->
        <div class="mb-6">
          <!-- Duration -->
          <v-row class="mb-4" dense no-gutters>
            <v-col cols="5">
              <p class="g2a-text-caption text-greyDark">Duration</p>
            </v-col>
            <v-col cols="7" align="end">
              <p class="g2a-text-bold-600 g2a-text-14">
                {{ calculateDuration }} Days
              </p>
            </v-col>
          </v-row>

          <!-- Dates -->
          <v-row class="mb-4" dense no-gutters>
            <v-col cols="5">
              <p class="g2a-text-caption text-greyDark">Dates</p>
            </v-col>
            <v-col cols="7" align="end">
              <p class="g2a-text-bold-600 g2a-text-14">{{ formatDateRange }}</p>
            </v-col>
          </v-row>

          <!-- Pickup -->
          <v-row class="mb-4" dense no-gutters>
            <v-col cols="5">
              <p class="g2a-text-caption text-greyDark">Pickup</p>
            </v-col>
            <v-col cols="7" align="end">
              <p class="g2a-text-bold-600 g2a-text-14">{{ pickupDisplay }}</p>
            </v-col>
          </v-row>

          <!-- Dropoff -->
          <v-row class="mb-4" dense no-gutters>
            <v-col cols="5">
              <p class="g2a-text-caption text-greyDark">Dropoff</p>
            </v-col>
            <v-col cols="7" align="end">
              <p class="g2a-text-bold-600 g2a-text-14">{{ dropoffDisplay }}</p>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-6" />

        <!-- Pricing -->
        <div class="mb-5">
          <v-row class="mb-2" dense no-gutters>
            <v-col cols="7">
              <p class="g2a-text-caption text-greyDark">
                Rental ({{ calculateDuration }}d x ₹{{
                  bookingData.selectedLocation?.dailyRate || 600
                }})
              </p>
            </v-col>
            <v-col cols="5" align="end">
              <p class="g2a-text-bold-600 g2a-text-14">₹{{ rentalTotal }}</p>
            </v-col>
          </v-row>
        </div>

        <v-divider class="my-6" />

        <!-- Total -->
        <v-row class="mb-4" dense no-gutters>
          <v-col cols="5">
            <p class="g2a-text-bold-600 g2a-text-16">Total</p>
          </v-col>
          <v-col cols="7" align="end">
            <p
              class="g2a-text-bold-700"
              style="font-size: 18px; color: #ff8c00"
            >
              ₹{{ totalPrice }}
            </p>
          </v-col>
        </v-row>
      </v-container>
      <!-- No Hidden Charges -->
      <v-alert
        :icon="false"
        color="background"
        text-color="grey"
        density="compact"
      >
        <div class="d-flex align-center justify-center w-100">
          <v-icon color="grey" size="16" class="me-2">
            mdi-shield-check-outline
          </v-icon>
          <span class="g2a-text-caption">No hidden charges</span>
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
  if (props.bookingData.pickupOption === "self-pickup") {
    return "Self Pickup";
  }
  return "Hotel Delivery";
});

const dropoffDisplay = computed(() => {
  if (props.bookingData.dropoffOption === "self-dropoff") {
    return "Self Dropoff";
  }
  return "Hotel Collection";
});

const rentalTotal = computed(() => {
  return (
    calculateDuration.value *
    (props.bookingData.selectedLocation?.pricing.amount || 600) *
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
