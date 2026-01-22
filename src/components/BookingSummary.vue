<template>
  <div>
    <v-card elevation="0" class="g2a-rounded-border border bg-white">
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
              <p class="g2a-text-bold-600 g2a-text-15 mb-0">
                {{ productInfo.label }} -
                {{ bookingData.selectedLocation?.name }}
              </p>
              <p class="g2a-text-13 text-grey mb-0">
                {{ bookingData.quantity }} Vehicle<span
                  v-if="bookingData.quantity > 1"
                  >s</span
                >
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
                {{ calculateDuration }} Day<span v-if="calculateDuration > 1"
                  >s</span
                >
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
        <div class="my-2">
          <v-row dense no-gutters>
            <v-col cols="7">
              <p class="g2a-text-14">
                Rental ({{ calculateDuration }}d x ₹{{ rentalTotalCost || 0 }} x
                {{ bookingData.quantity }} vehicle)
              </p>
            </v-col>
            <v-col cols="5" align="end">
              <p class="g2a-text-bold-500 g2a-text-15">
                ₹{{ rentalTotalCost }}
              </p>
            </v-col>
          </v-row>
        </div>

        <div class="my-2" v-if="onlineChargeApplicableforDelivery">
          <v-row dense no-gutters>
            <v-col cols="7">
              <p class="g2a-text-14">Delivery Charge</p>
            </v-col>
            <v-col cols="5" align="end">
              <p class="g2a-text-bold-500 g2a-text-15">
                ₹{{ hotelDeliveryCharge }}
              </p>
            </v-col>
          </v-row>
        </div>

        <div class="my-2" v-if="onlineChargeApplicableforPickup">
          <v-row dense no-gutters>
            <v-col cols="7">
              <p class="g2a-text-14">Pickup Charge</p>
            </v-col>
            <v-col cols="5" align="end">
              <p class="g2a-text-bold-500 g2a-text-15">
                ₹{{ hotelPickupCharge }}
              </p>
            </v-col>
          </v-row>
        </div>

        <v-divider color="grey" />

        <!-- Total -->
        <v-row class="mt-3" dense no-gutters>
          <v-col cols="5">
            <p class="g2a-text-bold-600 g2a-text-16">Total</p>
          </v-col>
          <v-col cols="7" align="end">
            <p class="g2a-text-bold-700 g2a-text-16">₹{{ totalPrice }}</p>
          </v-col>
        </v-row>

        <v-row dense no-gutters v-if="totalPrice - payNowAmountTotal > 0">
          <v-col cols="7">
            <p class="g2a-text-bold-600 g2a-text-16 text-brandColor">
              Pay After Confirmation
            </p>
          </v-col>
          <v-col cols="5" align="end">
            <p class="g2a-text-bold-700 g2a-text-16 text-brandColor">
              ₹{{ totalPrice - payNowAmountTotal }}
            </p>
          </v-col>
        </v-row>
        <v-divider class="my-2"></v-divider>
        <v-row dense no-gutters>
          <v-col cols="5">
            <p class="g2a-text-bold-600 g2a-text-18 text-darkGreen1">Payable</p>
          </v-col>
          <v-col cols="7" align="end">
            <p class="g2a-text-bold-700 g2a-text-18 text-darkGreen1">
              ₹{{ payNowAmountTotal }}
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
  onlineChargeApplicableforDelivery: {
    type: Boolean,
    default: false,
    required: false,
  },
  onlineChargeApplicableforPickup: {
    type: Boolean,
    default: false,
    required: false,
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
  } else if (props.bookingData.dropType === "hotel") {
    return "Hotel Drop";
  }
  return "Not Selected";
});

const hotelDeliveryCharge = computed(() => {
  const option = props.bookingData.selectedLocation?.deliveryOptions?.find(
    (x) => x.type === props.bookingData.pickupType,
  );
  return option?.onlineCharge || 0;
});

const hotelPickupCharge = computed(() => {
  const option = props.bookingData.selectedLocation?.dropOptions?.find(
    (x) => x.type === props.bookingData.dropType,
  );
  return option?.onlineCharge || 0;
});

const rentalTotalCost = computed(() => {
  const option = props.bookingData.selectedLocation?.paymentModes?.find(
    (x) => x.paymentType === "full",
  );
  return option?.amount || 0;
});

const payNowAmount = computed(() => {
  const option = props.bookingData.selectedLocation?.paymentModes?.find(
    (x) => x.paymentType === props.bookingData.paymentType,
  );
  return option?.amount || 0;
});

const rentalTotal = computed(() => {
  return (
    calculateDuration.value *
      rentalTotalCost.value *
      props.bookingData.quantity +
    hotelDeliveryCharge.value +
    hotelPickupCharge.value
  );
});

const payNowAmountTotal = computed(() => {
  return (
    calculateDuration.value * payNowAmount.value * props.bookingData.quantity +
    hotelDeliveryCharge.value +
    hotelPickupCharge.value
  );
});

const totalPrice = computed(() => {
  return rentalTotal.value;
});
</script>

<style scoped></style>
