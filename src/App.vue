<template>
  <v-app class="bg-white">
    <!-- Header -->
    <v-app-bar elevation="0" class="bg-white border">
      <v-container>
        <v-row align="center" class="justify-space-between">
          <v-col cols="auto">
            <div class="d-flex align-center">
              <span class="g2a-text-22 g2a-text-bold-800 text-error">Go2</span>
              <span class="g2a-text-22 g2a-text-bold-800">Andaman</span>
            </div>
          </v-col>
          <v-col cols="auto">
            <span class="g2a-text-14 text-grey">Secure Booking</span>
            <v-icon size="20" class="ml-2 text-green">mdi-lock</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <v-main>
      <v-container class="my-1">
        <v-row>
          <!-- Step Component -->
          <v-col cols="12" md="8">
            <div class="pb-4">
              <v-chip
                class="g2a-text-bold-600 text-uppercase"
                size="small"
                color="warning"
                >{{ productInfo.label }}</v-chip
              >
              <div class="g2a-text-28 my-1 g2a-text-bold-600">
                {{ productInfo.description }} -
                {{ booking?.selectedLocation?.name || "Select Location" }}
              </div>
              <div class="text-grey">
                <v-icon size="16">mdi-map-marker</v-icon>
                {{ booking?.selectedLocation?.name || "-" }}
              </div>
            </div>

            <component
              :is="currentStepComponent"
              :product-info="productInfo"
              :booking-data="booking"
              :location-data="locationData"
              @update="updateBooking"
              @next-step="nextStep"
              @prev-step="prevStep"
            />
          </v-col>

          <!-- Summary -->
          <v-col cols="12" md="4">
            <BookingSummary
              :product-info="productInfo"
              :booking-data="booking"
              :rental-cost="rentalCost"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import axios from "axios";
import moment from "moment";

import Step1LocationDates from "./components/Step1LocationDates.vue";
import Step2PickupDelivery from "./components/Step2PickupDelivery.vue"; // placeholder for step 2
import Step3ReviewPay from "./components/Step3ReviewPay.vue"; // placeholder for step 3
import BookingSummary from "./components/BookingSummary.vue";

/* -------------------- STATE -------------------- */
const booking = ref({
  selectedLocation: null,
  pickupDate: moment().add(2, "days").format("YYYY-MM-DD"),
  returnDate: moment().add(3, "days").format("YYYY-MM-DD"),
  quantity: 1,
  pickupType: "self-pickup",
  dropType: "self-drop",
  pickup: null,
  drop: null,
  pickupHotelName: null,
  dropoffHotelName: null,
  customer: {
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  },
  paymentType: "full",
});

const productInfo = ref({});
const locationData = ref({ locations: [] });

const currentStep = ref(1);
const stepComponents = {
  1: Step1LocationDates,
  2: Step2PickupDelivery,
  3: Step3ReviewPay,
};
const currentStepComponent = computed(() => stepComponents[currentStep.value]);

/* -------------------- API -------------------- */
const fetchLocations = async () => {
  try {
    const res = await axios.get(
      "http://localhost:3000/api/bike-rentals/product-info"
    );
    productInfo.value = res.data?.product || {};
    locationData.value.locations = res.data?.locations || [];
    if (locationData.value.locations.length) {
      booking.value.selectedLocation = locationData.value.locations[0];
    }
  } catch (err) {
    console.error("Failed to fetch locations", err);
  }
};

/* -------------------- COMPUTED -------------------- */
const rentalCost = computed(() => {
  if (!booking.value.selectedLocation) return 0;
  const days =
    moment(booking.value.returnDate).diff(
      moment(booking.value.pickupDate),
      "days"
    ) || 1;
  return (
    days * booking.value.selectedLocation.dailyRate * booking.value.quantity
  );
});

/* -------------------- HANDLERS -------------------- */
const updateBooking = (payload) => {
  booking.value = { ...booking.value, ...payload };
};

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

onMounted(fetchLocations);
</script>
