<template>
  <v-app class="bg-white">
    <!-- Header -->
    <v-app-bar elevation="0" class="bg-white border">
      <v-container>
        <v-row align="center" class="justify-space-between">
          <v-col cols="auto">
            <div class="d-flex align-center">
              <span class="g2a-text-22 g2a-text-bold-800 text-warning"
                >Go2</span
              >
              <span class="g2a-text-22 g2a-text-bold-800">Andaman</span>
            </div>
          </v-col>
          <v-col cols="auto">
            <span class="g2a-text-14 text-greyDark">Secure Booking</span>
            <v-icon size="16" class="ml-2 text-success">mdi-lock</v-icon>
          </v-col>
        </v-row>
      </v-container>
    </v-app-bar>

    <!-- Main Content -->
    <v-container class="py-8">
      <v-progress-linear
        v-if="loadingLocations"
        indeterminate
        color="#FF8C00"
        class="mb-4"
      />

      <v-row class="my-10">
        <!-- Left -->
        <v-col cols="12" md="8">
          <component
            :is="currentStepComponent"
            :booking-data="bookingData"
            :location-data="locationData"
            @update-booking="updateBooking"
            @next-step="nextStep"
            @prev-step="prevStep"
          />
        </v-col>

        <!-- Right -->
        <v-col cols="12" md="4">
          <BookingSummary
            :booking-data="bookingData"
            :location-data="locationData"
            :rental-cost="rentalCost"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import moment from "moment";
import axios from "axios";
// import api from "@/services/api";

import Step1LocationDates from "./components/Step1LocationDates.vue";
import Step2PickupDelivery from "./components/Step2PickupDelivery.vue";
import Step3ReviewPay from "./components/Step3ReviewPay.vue";
import BookingSummary from "./components/BookingSummary.vue";

/* -------------------- STATE -------------------- */

const currentStep = ref(1);
const loadingLocations = ref(false);

const locationData = ref({
  locations: [],
  pickupOptions: [],
  dropoffOptions: [],
  outlets: [],
});

const bookingData = ref({
  selectedLocation: null,
  selectedBike: null,
  pickupDate: moment().add(2, "days").format("YYYY-MM-DD"),
  returnDate: moment().add(3, "days").format("YYYY-MM-DD"),
  quantity: 1,
  pickupOption: null,
  dropoffOption: null,
  pickupOutlet: null,
  pickupHotelName: "",
  dropoffHotelName: "",
  guestDetails: {
    title: "Mr",
    firstName: "",
    lastName: "",
    countryCode: "+91",
    mobileNumber: "",
    email: "",
    alternativeMobile: "",
  },
  vehicleImage:
    "https://images.unsplash.com/photo-1558981403-c5f9899a28bc?q=80&w=2070&auto=format&fit=crop",
});

/* -------------------- API -------------------- */

const fetchLocations = async () => {
  try {
    loadingLocations.value = true;

    const res = await axios.get(
      "http://localhost:3000/api/bike-rentals/locations"
    );

    // 1. Match the API structure: the array is directly inside res.data.data
    const locationsArray = res.data.data;

    // 2. Map the API data to your local state
    locationData.value = {
      locations: locationsArray || [],
      // Based on your JSON, pickup/drop options seem to be derived from the location
      pickupOptions: [
        { id: "airport", name: "Airport" },
        { id: "hotel", name: "Hotel Delivery" },
      ],
      dropoffOptions: [
        { id: "airport", name: "Airport" },
        { id: "hotel", name: "Hotel Delivery" },
      ],
      outlets: locationsArray.map((loc) => loc.name) || [],
    };

    // 3. SAFE DEFAULTS (Check if data exists first)
    if (locationData.value.locations.length > 0) {
      bookingData.value.selectedLocation = locationData.value.locations[0];

      // Ensure dailyRate exists to prevent NaN in your computed property
      if (!bookingData.value.selectedLocation.dailyRate) {
        bookingData.value.selectedLocation.dailyRate = 500; // Default fallback price
      }
    }

    bookingData.value.pickupOption =
      locationData.value.pickupOptions[0]?.id || null;
    bookingData.value.dropoffOption =
      locationData.value.dropoffOptions[0]?.id || null;
    bookingData.value.pickupOutlet = locationData.value.outlets[0] || null;
  } catch (err) {
    console.error("Failed to fetch locations", err);
  } finally {
    loadingLocations.value = false;
  }
};

/* -------------------- COMPUTED -------------------- */

const rentalCost = computed(() => {
  if (
    !bookingData.value.selectedLocation ||
    !bookingData.value.pickupDate ||
    !bookingData.value.returnDate
  ) {
    return 0;
  }

  const pickup = moment(bookingData.value.pickupDate);
  const dropoff = moment(bookingData.value.returnDate);
  const days = dropoff.diff(pickup, "days") || 1;

  return (
    days *
    bookingData.value.selectedLocation.dailyRate *
    bookingData.value.quantity
  );
});

const steps = [Step1LocationDates, Step2PickupDelivery, Step3ReviewPay];
const currentStepComponent = computed(() => steps[currentStep.value - 1]);

/* -------------------- METHODS -------------------- */

const updateBooking = (updates) => {
  bookingData.value = { ...bookingData.value, ...updates };
};

const nextStep = () => {
  if (currentStep.value < 3) currentStep.value++;
};

const prevStep = () => {
  if (currentStep.value > 1) currentStep.value--;
};

/* -------------------- LIFECYCLE -------------------- */

onMounted(fetchLocations);
</script>
