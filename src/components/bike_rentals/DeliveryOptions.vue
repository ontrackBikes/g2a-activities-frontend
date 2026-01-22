<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-card elevation="0" class="mb-6 g2a-rounded-border border bg-white">
        <!-- PROGRESS BAR -->
        <v-progress-linear color="brandColor" :model-value="66" height="6" />

        <v-container>
          <!-- HEADER -->
          <section>
            <div class="d-flex justify-space-between">
              <span class="g2a-text-13 text-grey">Step 2 of 3</span>
              <span class="g2a-text-13 text-grey">Details</span>
            </div>
            <div class="g2a-text-24 g2a-text-bold-600 my-4">
              Pickup & Delivery
            </div>
          </section>

          <!-- INCLUSIONS -->
          <section class="my-4" v-if="productInfo.inclusions?.length">
            <v-card class="border bg-light g2a-rounded-border" elevation="0">
              <v-container>
                <div
                  class="g2a-text-bold-600 text-blackLight3 d-flex align-center"
                >
                  <v-avatar
                    color="darkGreen1"
                    variant="tonal"
                    size="34"
                    class="mr-2"
                  >
                    <v-icon size="22" icon="mdi-motorbike" />
                  </v-avatar>
                  What's Included ?
                </div>
                <v-divider class="my-3" />
                <v-row dense>
                  <v-col
                    v-for="(item, index) in productInfo.inclusions"
                    :key="index"
                    cols="12"
                    sm="6"
                    class="d-flex align-center"
                  >
                    <v-icon color="darkGreen1" size="20" class="mr-2"
                      >mdi-check-circle</v-icon
                    >
                    <span class="g2a-text-15">{{ item }}</span>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </section>

          <!-- QUANTITY -->
          <section class="my-6">
            <div
              class="g2a-text-12 g2a-text-bold-600 text-grey my-4"
              style="letter-spacing: 0.1rem"
            >
              QUANTITY (Max {{ maxQuantity }})
            </div>
            <div class="d-flex align-center my-2">
              <v-btn
                icon
                variant="outlined"
                color="grey"
                :disabled="booking.quantity <= 1"
                size="small"
                @click="decreaseQuantity"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <div class="mx-6 g2a-text-bold-600 g2a-text-24">
                {{ booking.quantity }}
              </div>
              <v-btn
                icon
                variant="outlined"
                color="grey"
                size="small"
                @click="increaseQuantity"
              >
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </section>

          <v-divider class="my-5"></v-divider>

          <!-- PICKUP -->
          <section class="my-4">
            <div
              class="g2a-text-bold-600 my-4 d-flex align-center"
              style="letter-spacing: 0.04rem"
            >
              <v-icon color="brandColor" class="mr-2"
                >mdi-arrow-right-circle</v-icon
              >
              GETTING THE VEHICLE
            </div>
            <v-radio-group v-model="pickupType">
              <v-card
                v-for="(opt, i) in pickupOptions"
                :key="i"
                class="my-2 py-4 g2a-rounded-border"
                variant="outlined"
                @click="pickupType = opt.type"
                :class="{ active: pickupType === opt.type }"
              >
                <div class="d-flex align-center px-4">
                  <v-radio :value="opt.type" color="brandColor" />
                  <div class="ml-3">
                    <div class="g2a-text-bold-600">
                      {{ opt.title }}
                      <span class="text-darkGreen1">
                        ({{
                          opt.onlineCharge === 0
                            ? "FREE"
                            : "₹" + opt.onlineCharge
                        }})
                      </span>
                    </div>
                    <div class="g2a-text-12 text-greyDark">{{ opt.label }}</div>
                  </div>
                </div>

                <v-select
                  v-if="
                    pickupType === 'self-pickup' && opt.type === 'self-pickup'
                  "
                  v-model="booking.pickup"
                  :items="pickupAndDropPoints"
                  item-title="name"
                  item-value="name"
                  label="Select Outlet"
                  class="px-4 my-4"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                />

                <v-text-field
                  v-if="pickupType === 'hotel' && opt.type === 'hotel'"
                  v-model="booking.pickupHotelName"
                  label="Hotel Name"
                  class="px-4 my-4"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                />
              </v-card>
            </v-radio-group>
          </section>

          <!-- DROP -->
          <section class="mt-4">
            <div
              class="g2a-text-bold-600 my-4 d-flex align-center"
              style="letter-spacing: 0.04rem"
            >
              <v-icon color="brandColor" class="mr-2"
                >mdi-arrow-left-circle</v-icon
              >
              RETURNING THE VEHICLE
            </div>
            <v-radio-group v-model="dropType" color="brandColor" hide-details>
              <v-card
                v-for="(opt, i) in dropOptions"
                :key="i"
                class="my-2 py-4 g2a-rounded-border"
                variant="outlined"
                @click="dropType = opt.type"
                :class="{ active: dropType === opt.type }"
              >
                <div class="d-flex align-center px-4">
                  <v-radio :value="opt.type" />
                  <div class="ml-3">
                    <div class="g2a-text-bold-600">
                      {{ opt.title }}
                      <span class="text-darkGreen1">
                        ({{
                          opt.onlineCharge === 0
                            ? "FREE"
                            : "₹" + opt.onlineCharge
                        }})
                      </span>
                    </div>
                    <div class="g2a-text-12 text-greyDark">{{ opt.label }}</div>
                  </div>
                </div>

                <v-select
                  v-if="dropType === 'self-drop' && opt.type === 'self-drop'"
                  v-model="booking.drop"
                  :items="pickupAndDropPoints"
                  item-title="name"
                  item-value="name"
                  label="Select Outlet"
                  class="px-4 my-4"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                />

                <v-text-field
                  v-if="dropType === 'hotel' && opt.type === 'hotel'"
                  v-model="booking.dropHotelName"
                  label="Hotel Name"
                  class="px-4 my-4"
                  variant="outlined"
                  density="compact"
                  hide-details="auto"
                />
              </v-card>
            </v-radio-group>
          </section>

          <!-- <v-alert v-if="errorMessage" type="error" variant="tonal">{{
            errorMessage
          }}</v-alert> -->
        </v-container>

        <v-divider v-if="!smAndDown" />

        <v-container v-if="!smAndDown" class="bg-surface">
          <div class="text-end">
            <!-- <v-btn variant="text" @click="router.back()">
              <v-icon start color="grey">mdi-arrow-left</v-icon>
              <span
                class="g2a-text-bold-500 g2a-text-16 text-greyDark"
                style="letter-spacing: 0.05rem"
                >BACK</span
              >
            </v-btn> -->
            <v-btn
              flat
              color="brandColor"
              rounded="lg"
              size="large"
              :loading="loading"
              :disabled="!isStep2Valid"
              @click="goNext"
            >
              <span
                class="g2a-text-bold-600 g2a-text-16"
                style="letter-spacing: 0.05rem"
                >Continue</span
              >
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-col>

    <v-col cols="12" md="4" :class="smAndDown ? 'mb-16' : ''">
      <booking-summary :booking-data="booking" :product-info="productInfo" />
    </v-col>

    <v-sheet
      v-if="smAndDown"
      elevation="4"
      class="position-fixed bottom-0 left-0 right-0 px-4 py-3 d-flex align-center"
      style="z-index: 2000"
    >
      <v-row class="align-center">
        <v-col cols="6">
          <div class="g2a-text-12 text-decoration-line-through">
            Total: ₹{{ totalAmount }}
          </div>
          <div class="d-flex align-center">
            <span class="g2a-text-20 g2a-text-bold-700 text-darkGreen1"
              >₹{{ payNowAmountTotal }}</span
            >
            <span class="ml-1 g2a-text-12">now</span>
          </div>
        </v-col>
        <v-col cols="6"
          ><v-btn
            flat
            block
            color="brandColor"
            rounded="lg"
            size="large"
            :loading="loading"
            :disabled="!isStep2Valid"
            @click="goNext"
          >
            <span
              class="g2a-text-bold-600 g2a-text-16"
              style="letter-spacing: 0.05rem"
              >Continue</span
            >
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn></v-col
        >
      </v-row>
    </v-sheet>
  </v-row>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import moment from "moment";
import apiClient from "@/services/api";
import BookingSummary from "../BookingSummary.vue";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();

const LOCAL_STORAGE_KEY = "bikeRentalBooking";
const route = useRoute();
const router = useRouter();

const DEFAULT_BOOKING = {
  selectedLocation: null,
  pickupDate: moment().add(2, "days").format("YYYY-MM-DD"),
  returnDate: moment().add(3, "days").format("YYYY-MM-DD"),
  quantity: 1,
  pickupType: "self-pickup",
  pickup: null,
  pickupHotelName: "",
  dropType: "self-drop",
  drop: null,
  dropHotelName: "",
  availability: null,
  productInfo: null,
  customer: {
    title: "",
    firstName: "",
    lastName: "",
    email: "",
    mobile: "",
  },
  paymentType: "partial",
};

const booking = ref(
  JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY)) || { ...DEFAULT_BOOKING },
);
const productInfo = ref({});
const pickupAndDropPoints = ref([]);
const loading = ref(false);
const errorMessage = ref("");

const pickupType = ref(booking.value.pickupType);
const dropType = ref(booking.value.dropType);

const pickupOptions = computed(
  () => booking.value.selectedLocation?.deliveryOptions || [],
);
const dropOptions = computed(
  () => booking.value.selectedLocation?.dropOptions || [],
);
const maxQuantity = computed(
  () =>
    booking.value.selectedLocation?.maxQtyPerBooking ||
    productInfo.value.maxQuantity ||
    5,
);

// Save booking to localStorage
const saveBooking = () =>
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(booking.value));

// Watchers
watch([pickupType, dropType, () => booking.value.quantity], () => {
  booking.value.pickupType = pickupType.value;
  booking.value.dropType = dropType.value;
  saveBooking();
});

// Watch pickupType changes
watch(pickupType, (val) => {
  booking.value.pickupType = val;
  if (val === "self-pickup") {
    booking.value.pickupHotelName = "";
  }
  if (val === "hotel") {
    booking.value.pickup = "";
  }
  saveBooking();
});

// Watch dropType changes
watch(dropType, (val) => {
  booking.value.dropType = val;
  if (val === "self-drop") {
    booking.value.dropHotelName = "";
  }
  if (val === "hotel") {
    booking.value.drop = "";
  }
  saveBooking();
});

// Quantity
const increaseQuantity = () => {
  if (booking.value.quantity < maxQuantity.value) {
    booking.value.quantity++;
    saveBooking();
  }
};
const decreaseQuantity = () => {
  if (booking.value.quantity > 1) {
    booking.value.quantity--;
    saveBooking();
  }
};

// Validation
const isStep2Valid = computed(() => {
  if (pickupType.value === "self-pickup" && !booking.value.pickup) return false;
  if (pickupType.value === "hotel" && !booking.value.pickupHotelName)
    return false;
  if (dropType.value === "self-drop" && !booking.value.drop) return false;
  if (dropType.value === "hotel" && !booking.value.dropHotelName) return false;
  return true;
});

const hotelDeliveryCharge = computed(() => {
  const option = booking.value.selectedLocation?.deliveryOptions?.find(
    (x) => x.type === booking.value.pickupType,
  );
  return option?.onlineCharge || 0;
});

const hotelPickupCharge = computed(() => {
  const option = booking.value.selectedLocation?.dropOptions?.find(
    (x) => x.type === booking.value.dropType,
  );
  return option?.onlineCharge || 0;
});

const payNowAmountTotal = computed(() => {
  const selected = booking.value.paymentType;
  const mode = booking.value.selectedLocation?.paymentModes?.find(
    (x) => x.paymentType === selected,
  );
  const quantity = booking.value.quantity || 1;
  const days =
    booking.value.pickupDate && booking.value.returnDate
      ? moment(booking.value.returnDate).diff(
          moment(booking.value.pickupDate),
          "days",
        ) || 1
      : 1;

  const deliveryCharges = hotelDeliveryCharge.value + hotelPickupCharge.value;

  return (mode?.amount || 0) * quantity * days + deliveryCharges;
});

const totalAmount = computed(() => {
  const quantity = booking.value.quantity || 1;
  const days =
    booking.value.pickupDate && booking.value.returnDate
      ? moment(booking.value.returnDate).diff(
          moment(booking.value.pickupDate),
          "days",
        ) || 1
      : 1;

  const baseMode = booking.value.selectedLocation?.paymentModes?.[0];
  const deliveryCharges = hotelDeliveryCharge.value + hotelPickupCharge.value;

  return (baseMode?.amount || 0) * quantity * days + deliveryCharges;
});

// Fetch location info
const fetchLocationInfo = async () => {
  try {
    const name = booking.value.selectedLocation?.name;
    if (!name) return;
    const { data } = await apiClient.get(
      `/bike-rentals/location/${encodeURIComponent(name)}`,
    );
    if (data?.success) booking.value.selectedLocation = data.data;
    saveBooking();
  } catch (err) {
    console.error("Failed to fetch location info", err);
  }
};

// Fetch product info
const fetchProductInfo = async () => {
  try {
    const { data } = await apiClient.get("/bike-rentals/product-info");
    if (data?.success) {
      productInfo.value = data.product;
      booking.value.productInfo = data.product;
      saveBooking();
    }
  } catch (err) {
    console.error("Failed to fetch product info", err);
  }
};

// Fetch pickup/drop points
const fetchPickupDropPoints = async () => {
  try {
    const name = booking.value.selectedLocation?.name;
    if (!name) return;
    const { data } = await apiClient.get(
      `/bike-rentals/pickup-drop-points/${encodeURIComponent(name)}`,
    );
    pickupAndDropPoints.value = data?.data || [];
  } catch (err) {
    pickupAndDropPoints.value = [];
  }
};

// Check availability
const checkAvailability = async () => {
  if (
    !booking.value.selectedLocation?.name ||
    !booking.value.pickupDate ||
    !booking.value.returnDate
  )
    return false;
  loading.value = true;
  errorMessage.value = "";
  try {
    const payload = {
      locationName: booking.value.selectedLocation.name,
      startDate: booking.value.pickupDate,
      endDate: booking.value.returnDate,
      quantity: booking.value.quantity,
    };
    const { data } = await apiClient.post(
      "/bike-rentals/check-availability",
      payload,
    );
    if (!data.success) {
      errorMessage.value = data.message || "Not available";
      return false;
    }
    booking.value.availability = data.data;
    saveBooking();
    return true;
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Availability check failed";
    return false;
  } finally {
    loading.value = false;
  }
};

// Initialize
onMounted(async () => {
  const { location, startDate, endDate } = route.query;
  if (!location || !startDate || !endDate) return router.push("/");

  booking.value.selectedLocation = {
    name: decodeURIComponent(location).replace(/-/g, " "),
  };
  booking.value.pickupDate = startDate;
  booking.value.returnDate = endDate;
  saveBooking();

  await fetchLocationInfo();
  await fetchProductInfo();
  await fetchPickupDropPoints();

  const ok = await checkAvailability();
  if (!ok) router.push("/");
});

// Go next
const goNext = async () => {
  const ok = await checkAvailability();
  if (ok) router.push("/bike-rentals-checkout");
};
</script>

<style scoped>
.active {
  border: 1px solid #ffbb00 !important;
  background: #ffbb0018;
}
</style>
