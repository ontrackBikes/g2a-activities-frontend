<template>
  <v-container class="my-1">
    <router-view
      :product-info="productInfo"
      :booking-data="booking"
      :location-data="locationData"
      @update="updateBooking"
    />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import axios from "axios";
import moment from "moment";
import BookingSummary from "../components/BookingSummary.vue";
import apiClient from "@/services/api";

const LOCAL_STORAGE_KEY = "bikeRentalBooking";

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
  dropHotelName: null,
  customer: {
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  },
  paymentType: "partial",
});

const productInfo = ref({});
const locationData = ref({ locations: [] });

/* -------------------- API -------------------- */
const fetchLocations = async () => {
  try {
    const res = await apiClient.get("/bike-rentals/product-info");
    productInfo.value = res.data?.product || {};
    locationData.value.locations = res.data?.locations || [];
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
      "days",
    ) || 1;
  return (
    days * booking.value.selectedLocation.dailyRate * booking.value.quantity
  );
});

/* -------------------- HANDLERS -------------------- */
const updateBooking = (payload) => {
  booking.value = { ...booking.value, ...payload };
};

/* -------------------- LOCAL STORAGE -------------------- */
watch(
  booking,
  (val) => {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(val));
  },
  { deep: true },
);

onMounted(fetchLocations);
</script>
