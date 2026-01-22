<template>
  <v-btn variant="text" class="mb-4" @click="router.go(-1)" rounded="xl">
    <v-icon start color="grey">mdi-arrow-left</v-icon>
    <span
      class="g2a-text-bold-500 g2a-text-15 text-greyDark"
      style="letter-spacing: 0.05rem"
      >BACK</span
    >
  </v-btn>
  <v-row>
    <v-col cols="12" md="8">
      <v-card elevation="0" class="mb-6 g2a-rounded-border border bg-white">
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
                <div class="g2a-text-bold-600 d-flex align-center">
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
                    v-for="(item, i) in productInfo.inclusions"
                    :key="i"
                    cols="12"
                    sm="6"
                    class="d-flex align-center"
                  >
                    <v-icon color="darkGreen1" size="20" class="mr-2">
                      mdi-check-circle
                    </v-icon>
                    <span class="g2a-text-15">{{ item }}</span>
                  </v-col>
                </v-row>
              </v-container>
            </v-card>
          </section>

          <!-- QUANTITY -->
          <section class="my-6">
            <div class="g2a-text-12 g2a-text-bold-600 text-grey my-4">
              QUANTITY (Max {{ maxQuantity }})
            </div>
            <div class="d-flex align-center">
              <v-btn
                icon
                variant="outlined"
                :disabled="booking.quantity <= 1"
                @click="changeQty(-1)"
              >
                <v-icon>mdi-minus</v-icon>
              </v-btn>
              <div class="mx-6 g2a-text-24 g2a-text-bold-600">
                {{ booking.quantity }}
              </div>
              <v-btn icon variant="outlined" @click="changeQty(1)">
                <v-icon>mdi-plus</v-icon>
              </v-btn>
            </div>
          </section>

          <v-divider class="my-5" />

          <!-- PICKUP -->
          <section>
            <div class="g2a-text-bold-600 my-4 d-flex align-center">
              <v-icon color="brandColor" class="mr-2"
                >mdi-arrow-right-circle</v-icon
              >
              GETTING THE VEHICLE
            </div>

            <v-radio-group v-model="booking.pickupType">
              <v-card
                v-for="opt in pickupOptions"
                :key="opt.type"
                class="my-2 py-4 g2a-rounded-border"
                variant="outlined"
                :class="{ active: booking.pickupType === opt.type }"
              >
                <div
                  class="d-flex align-center px-4 my-2"
                  @click="booking.pickupType = opt.type"
                >
                  <v-radio :value="opt.type" />
                  <div class="ml-3">
                    <div class="g2a-text-bold-600">
                      {{ opt.title }}
                      <span
                        v-if="opt.onlineChargeApplicable"
                        class="text-darkGreen1"
                      >
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
                    booking.pickupType === 'self-pickup' &&
                    opt.type === 'self-pickup'
                  "
                  v-model="booking.pickup"
                  :items="pickupAndDropPoints"
                  item-title="name"
                  item-value="name"
                  label="Select Outlet"
                  class="px-4 my-4"
                  density="compact"
                  variant="outlined"
                />

                <v-text-field
                  hide-details="auto"
                  v-if="booking.pickupType === 'hotel' && opt.type === 'hotel'"
                  v-model="booking.pickupHotelName"
                  label="Hotel Name"
                  class="px-4 my-4"
                  density="compact"
                  variant="outlined"
                />

                <v-container v-if="opt.infoText">
                  <v-alert color="info" variant="tonal" border="start">
                    {{ opt.infoText }}
                  </v-alert>
                </v-container>
              </v-card>
            </v-radio-group>
          </section>

          <!-- DROP -->
          <section class="mt-4">
            <div class="g2a-text-bold-600 my-4 d-flex align-center">
              <v-icon color="brandColor" class="mr-2"
                >mdi-arrow-left-circle</v-icon
              >
              RETURNING THE VEHICLE
            </div>

            <v-radio-group v-model="booking.dropType">
              <v-card
                v-for="opt in dropOptions"
                :key="opt.type"
                class="my-2 py-4 g2a-rounded-border"
                variant="outlined"
                :class="{ active: booking.dropType === opt.type }"
              >
                <div class="d-flex align-center px-4 my-2">
                  <v-radio :value="opt.type" />
                  <div class="ml-3">
                    <div class="g2a-text-bold-600">
                      {{ opt.title }}
                      <span
                        v-if="opt.onlineChargeApplicable"
                        class="text-darkGreen1"
                      >
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
                    booking.dropType === 'self-drop' && opt.type === 'self-drop'
                  "
                  v-model="booking.drop"
                  :items="pickupAndDropPoints"
                  item-title="name"
                  item-value="name"
                  label="Select Outlet"
                  class="px-4 my-4"
                  density="compact"
                  variant="outlined"
                />

                <v-text-field
                  hide-details="auto"
                  v-if="booking.dropType === 'hotel' && opt.type === 'hotel'"
                  v-model="booking.dropHotelName"
                  label="Hotel Name"
                  class="px-4"
                  density="compact"
                  variant="outlined"
                />

                <v-container v-if="opt.infoText">
                  <v-alert color="info" variant="tonal" border="start">
                    {{ opt.infoText }}
                  </v-alert>
                </v-container>
              </v-card>
            </v-radio-group>
          </section>

          <section class="mb-4">
            <v-alert v-if="errorMessage" type="error" variant="tonal" class="">
              {{ errorMessage }}
            </v-alert>
          </section>
        </v-container>
      </v-card>
    </v-col>

    <!-- SUMMARY -->
    <v-col cols="12" md="4" :class="smAndDown ? 'mb-16' : ''">
      <div class="sticky">
        <booking-summary
          :booking-data="booking"
          :product-info="productInfo"
          :online-charge-applicablefor-delivery="onlineChargeDelivery"
          :online-charge-applicablefor-pickup="onlineChargePickup"
        />
        <div class="mt-5" v-if="!smAndDown">
          <v-btn
            :loading="loading"
            :disabled="!isFormValid"
            @click="goNext"
            flat
            color="brandColor"
            rounded="xl"
            size="x-large"
            block
            >Next</v-btn
          >
        </div>
      </div>
    </v-col>

    <v-sheet
      v-if="smAndDown"
      elevation="4"
      class="position-fixed bottom-0 left-0 right-0 px-4 py-3 d-flex align-center"
      style="z-index: 2000"
    >
      <v-row class="align-center">
        <v-col cols="12">
          <v-btn
            :loading="loading"
            :disabled="!isFormValid"
            @click="goNext"
            flat
            color="brandColor"
            rounded="xl"
            size="large"
            block
            >Next</v-btn
          >
        </v-col>
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

/* ------------------ SAFE STORAGE ------------------ */
const safeParse = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};

/* ------------------ STATE ------------------ */
const booking = ref(
  safeParse(LOCAL_STORAGE_KEY, {
    selectedLocation: null,
    pickupDate: moment().add(2, "days").format("YYYY-MM-DD"),
    returnDate: moment().add(3, "days").format("YYYY-MM-DD"),
    quantity: 1,
    pickupType: "self-pickup",
    dropType: "self-drop",
    paymentType: null,
  }),
);

const productInfo = ref({});
const pickupAndDropPoints = ref([]);

/* ------------------ watchers ------------------ */

watch(
  () => booking.value.pickupType,
  (val) => {
    if (val !== "self-pickup") booking.value.pickup = null;
    if (val == "self-pickup") booking.value.pickupHotelName = null;
  },
);

watch(
  () => booking.value.dropType,
  (val) => {
    if (val !== "self-drop") booking.value.drop = null;
    if (val == "self-drop") booking.value.dropHotelName = null;
  },
);

/* ------------------ COMPUTED ------------------ */
const pickupOptions = computed(
  () => booking.value.selectedLocation?.deliveryOptions || [],
);
const dropOptions = computed(
  () => booking.value.selectedLocation?.dropOptions || [],
);

const selectedDeliveryOption = computed(() =>
  pickupOptions.value.find((x) => x.type === booking.value.pickupType),
);
const selectedDropOption = computed(() =>
  dropOptions.value.find((x) => x.type === booking.value.dropType),
);

const onlineChargeDelivery = computed(
  () => !!selectedDeliveryOption.value?.onlineChargeApplicable,
);
const onlineChargePickup = computed(
  () => !!selectedDropOption.value?.onlineChargeApplicable,
);

const maxQuantity = computed(
  () => booking.value.selectedLocation?.maxQtyPerBooking || 5,
);

/* ------------------ METHODS ------------------ */
const saveBooking = () =>
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(booking.value));

const changeQty = (delta) => {
  const next = booking.value.quantity + delta;
  if (next >= 1 && next <= maxQuantity.value) {
    booking.value.quantity = next;
    saveBooking();
  }
};

/* ------------------ API ------------------ */
const fetchLocationInfo = async () => {
  const name = booking.value.selectedLocation?.name;
  if (!name) return;

  const { data } = await apiClient.get(
    `/bike-rentals/location/${encodeURIComponent(name)}`,
  );

  booking.value.selectedLocation = data.data;
  booking.value.paymentType =
    data.data.paymentModes.find((m) => m.enabled)?.paymentType || null;

  saveBooking();
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

const fetchPickupDropPoints = async () => {
  const name = booking.value.selectedLocation?.name;
  if (!name) return;

  const { data } = await apiClient.get(
    `/bike-rentals/pickup-drop-points/${encodeURIComponent(name)}`,
  );
  pickupAndDropPoints.value = data?.data || [];
};

const isFormValid = computed(() => {
  const b = booking.value;

  // location must exist
  if (!b.selectedLocation) return false;

  // quantity safety
  if (!b.quantity || b.quantity < 1) return false;

  /* ---------- PICKUP VALIDATION ---------- */
  if (b.pickupType === "self-pickup") {
    if (!b.pickup) return false;
  }

  if (b.pickupType === "hotel") {
    if (!b.pickupHotelName?.trim()) return false;
  }

  /* ---------- DROP VALIDATION ---------- */
  if (b.dropType === "self-drop") {
    if (!b.drop) return false;
  }

  if (b.dropType === "hotel") {
    if (!b.dropHotelName?.trim()) return false;
  }

  return true;
});

const loading = ref(false);
const errorMessage = ref("");

const checkAvailability = async () => {
  const b = booking.value;

  if (!b.selectedLocation?.name || !b.pickupDate || !b.returnDate) {
    errorMessage.value = "Missing booking details";
    return false;
  }

  loading.value = true;
  errorMessage.value = "";

  try {
    const payload = {
      locationName: b.selectedLocation.name,
      startDate: b.pickupDate,
      endDate: b.returnDate,
      quantity: b.quantity,
    };

    const { data } = await apiClient.post(
      "/bike-rentals/check-availability",
      payload,
    );

    if (!data?.success) {
      errorMessage.value = data?.message || "Vehicle not available";
      return false;
    }

    b.availability = data.data;
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

const goNext = async () => {
  if (!isFormValid.value) return;
  const ok = await checkAvailability();
  if (ok) {
    router.push("/bike-rentals-checkout");
  }
};

/* ------------------ INIT ------------------ */
onMounted(async () => {
  const { location, startDate, endDate } = route.query;
  if (!location) return router.push("/");

  booking.value.selectedLocation = {
    name: decodeURIComponent(location).replace(/-/g, " "),
  };
  booking.value.pickupDate = startDate;
  booking.value.returnDate = endDate;
  saveBooking();

  await fetchProductInfo();
  await fetchLocationInfo();
  await fetchPickupDropPoints();
});
</script>

<style scoped>
.active {
  border: 1px solid #ffbb00 !important;
  background: #ffbb0018;
}
.sticky {
  position: sticky !important;
  top: 80px !important;
}
</style>
