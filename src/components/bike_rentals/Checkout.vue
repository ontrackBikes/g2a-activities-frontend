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
      <v-card elevation="0" class="mb-6 g2a-rounded-border border">
        <v-progress-linear color="brandColor" model-value="100" :height="6" />

        <v-container>
          <div class="d-flex justify-space-between">
            <span class="g2a-text-13 text-grey">Step 3 of 3</span>
            <span class="g2a-text-13 text-grey">Payment</span>
          </div>

          <div class="g2a-text-24 g2a-text-bold-600 my-4">Review & Pay</div>
          <div
            class="g2a-text-12 g2a-text-bold-600 text-grey my-4"
            style="letter-spacing: 0.09rem"
          >
            RIDER DETAILS
          </div>

          <!-- Rider Details -->
          <div class="my-4">
            <v-row>
              <v-col cols="12" sm="2">
                <v-select
                  hide-details="auto"
                  v-model="customer.title"
                  :items="['Mr', 'Mrs', 'Ms', 'Dr']"
                  label="Title"
                  variant="outlined"
                  density="comfortable"
                  @update:model-value="saveCustomer"
                />
              </v-col>

              <v-col cols="12" sm="5">
                <v-text-field
                  hide-details="auto"
                  v-model="customer.firstName"
                  label="First Name"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Required']"
                  @update:model-value="saveCustomer"
                />
              </v-col>

              <v-col cols="12" sm="5">
                <v-text-field
                  hide-details="auto"
                  v-model="customer.lastName"
                  label="Last Name"
                  variant="outlined"
                  density="comfortable"
                  :rules="[(v) => !!v || 'Required']"
                  @update:model-value="saveCustomer"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12" sm="4">
                <v-select
                  hide-details="auto"
                  v-model="customer.countryAbbr"
                  :items="countriesList"
                  item-title="title"
                  item-value="value"
                  label="Country Code"
                  variant="outlined"
                  density="comfortable"
                  @update:model-value="saveCustomer"
                />
              </v-col>

              <v-col cols="12" sm="8">
                <v-text-field
                  hide-details="auto"
                  v-model="customer.mobile"
                  label="Mobile Number"
                  variant="outlined"
                  density="comfortable"
                  :rules="[
                    (v) => validatePhoneNumber(v, customer.countryAbbr, false),
                  ]"
                  @update:model-value="saveCustomer"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  hide-details="auto"
                  v-model="customer.email"
                  label="Email"
                  type="email"
                  variant="outlined"
                  density="comfortable"
                  :rules="[
                    (v) => !!v || 'Required',
                    (v) => /.+@.+\..+/.test(v) || 'Invalid email',
                  ]"
                  @update:model-value="saveCustomer"
                />
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <v-text-field
                  hide-details="auto"
                  v-model="customer.alternatePhone"
                  label="Alternate Mobile (Optional)"
                  variant="outlined"
                  density="comfortable"
                  :rules="[
                    (v) => !v || /^[0-9]{10}$/.test(v) || 'Invalid number',
                  ]"
                  @update:model-value="saveCustomer"
                />
              </v-col>
            </v-row>
          </div>

          <!-- Payment Modes -->
          <!-- only show if the payment modes are more than 1 -->
          <v-card
            elevation="0"
            class="my-2 g2a-rounded-border"
            v-if="paymentModes.length > 1"
          >
            <div
              class="g2a-text-12 g2a-text-bold-600 text-grey my-4"
              style="letter-spacing: 0.09rem"
            >
              PAYMENT MODES
            </div>

            <v-radio-group v-model="booking.paymentType" hide-details>
              <v-row
                no-gutters
                v-for="(mode, i) in paymentModes"
                :key="i"
                class="mb-4 cursor-pointer"
                align="center"
              >
                <v-col cols="9">
                  <div class="d-flex">
                    <div>
                      <v-radio
                        :value="mode.paymentType"
                        :disabled="!mode.enabled"
                        :style="!mode.enabled ? { color: 'red' } : {}"
                      />
                    </div>
                    <div
                      class="ml-2"
                      @click="booking.paymentType = mode.paymentType"
                    >
                      <p class="g2a-text-bold-600 mt-1">{{ mode.label }}</p>
                      <p class="g2a-text-14 text-greyDark">
                        {{ mode.description || "Secure online payment" }}
                      </p>
                    </div>
                  </div>
                </v-col>
                <v-col align="end">
                  <span class="g2a-text-bold-700 g2a-text-18 text-darkGreen1">
                    ₹{{ mode.totalAmount }}
                  </span>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-card>
        </v-container>
      </v-card>
    </v-col>

    <v-col cols="12" md="4" :class="smAndDown ? 'mb-16' : ''">
      <div class="sticky">
        <booking-summary :booking-data="booking" :product-info="productInfo" />
        <div class="mt-4">
          <p class="g2a-text-14 text-greyDark my-3">
            By clicking "Pay", you agree to the
            <a href="#" class="text-brandColor">terms of service</a>.
          </p>
          <v-btn
            v-if="!smAndDown"
            block
            flat
            color="brandColor"
            rounded="xl"
            size="x-large"
            :disabled="!isFormValid || !booking.paymentType || loading"
            @click="processPayment"
            :loading="loading"
          >
            <span class="g2a-text-bold-600 g2a-text-16"
              >Pay ₹{{ payNowAmountTotal }}</span
            >
          </v-btn>
        </div>
      </div>
    </v-col>

    <!-- error message -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      timeout="5000"
      top
      right
    >
      {{ snackbar.message }}
      <template #actions>
        <v-btn text @click="snackbar.show = false">Close</v-btn>
      </template>
    </v-snackbar>

    <!-- Small screen sticky footer for Continue/Pay button -->
    <v-sheet
      v-if="smAndDown"
      elevation="4"
      class="position-fixed bottom-0 left-0 right-0 px-4 py-3 d-flex align-center"
      style="z-index: 2000"
    >
      <v-row class="align-center">
        <v-col cols="6">
          <div class="g2a-text-12">Payable</div>
          <div class="d-flex align-center">
            <span class="g2a-text-20 g2a-text-bold-700 text-darkGreen1"
              >₹{{ payNowAmountTotal }}</span
            >
          </div>
        </v-col>
        <v-col cols="6">
          <v-btn
            block
            flat
            color="brandColor"
            rounded="xl"
            size="large"
            :disabled="!isFormValid || !booking.paymentType || loading"
            @click="processPayment"
            :loading="loading"
          >
            <span class="g2a-text-bold-600 g2a-text-16">Pay Now </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-sheet>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import { useDisplay } from "vuetify";
import { parsePhoneNumberFromString } from "libphonenumber-js";

import BookingSummary from "../BookingSummary.vue";
import apiClient from "@/services/api";
import countries_list from "@/store/local_datas/countries_list.json";

/* ------------------ SETUP ------------------ */
const { smAndDown } = useDisplay();
const router = useRouter();
const LOCAL_STORAGE_KEY = "bikeRentalBooking";

/* ------------------ STATE ------------------ */
const booking = ref({});
const customer = ref({});
const loading = ref(false);
const productInfo = ref({});

const snackbar = ref({
  show: false,
  message: "",
  color: "error",
});

/* ------------------ COUNTRIES ------------------ */
const countriesList = computed(() =>
  countries_list.map((c) => ({
    title: `${c.dial_code} (${c.abbr})`,
    value: c.abbr,
    dialCode: c.dial_code,
  })),
);

watch(
  () => customer.value.countryAbbr,
  (abbr) => {
    const country = countriesList.value.find((c) => c.value === abbr);
    if (country) {
      customer.value.countryCode = `${country.dialCode} (${country.value})`;
      saveCustomer();
    }
  },
  { immediate: true },
);

/* ------------------ HELPERS ------------------ */
const rentalDays = computed(() => {
  if (!booking.value.pickupDate || !booking.value.returnDate) return 1;
  return Math.max(
    moment(booking.value.returnDate).diff(
      moment(booking.value.pickupDate),
      "days",
    ),
    1,
  );
});

const quantity = computed(() => booking.value.quantity || 1);

/* ------------------ DELIVERY / PICKUP ------------------ */
const selectedDeliveryOption = computed(() =>
  booking.value.selectedLocation?.deliveryOptions?.find(
    (x) => x.type === booking.value.pickupType,
  ),
);

const selectedDropOption = computed(() =>
  booking.value.selectedLocation?.dropOptions?.find(
    (x) => x.type === booking.value.dropType,
  ),
);

const deliveryCharge = computed(() =>
  selectedDeliveryOption.value?.onlineChargeApplicable
    ? selectedDeliveryOption.value?.onlineCharge || 0
    : 0,
);

const pickupCharge = computed(() =>
  selectedDropOption.value?.onlineChargeApplicable
    ? selectedDropOption.value?.onlineCharge || 0
    : 0,
);

/* ------------------ PAYMENT MODES ------------------ */
const paymentModes = computed(() => {
  const modes = booking.value.selectedLocation?.paymentModes || [];
  if (!modes.length) return [];

  const extraCharges = deliveryCharge.value + pickupCharge.value;

  return modes
    .filter((m) => m.enabled)
    .map((mode) => ({
      ...mode,
      totalAmount:
        (Number(mode.amount) || 0) * quantity.value * rentalDays.value +
        extraCharges,
    }));
});

/* auto-select first enabled payment mode */
watch(
  paymentModes,
  (modes) => {
    if (!booking.value.paymentType && modes.length) {
      booking.value.paymentType = modes[0].paymentType;
      saveBooking();
    }
  },
  { immediate: true },
);

/* ------------------ TOTALS ------------------ */
const payNowAmountTotal = computed(() => {
  const selected = paymentModes.value.find(
    (m) => m.paymentType === booking.value.paymentType,
  );
  return selected?.totalAmount || 0;
});

/* ------------------ FORM ------------------ */
const isFormValid = computed(() => {
  const phoneValid =
    validatePhoneNumber(customer.value.mobile, customer.value.countryAbbr) ===
    true;

  const emailValid =
    !!customer.value.email && /.+@.+\..+/.test(customer.value.email);

  return (
    !!customer.value.title &&
    !!customer.value.firstName &&
    !!customer.value.lastName &&
    phoneValid &&
    emailValid
  );
});

/* ------------------ STORAGE ------------------ */
function saveBooking() {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(booking.value));
}

function saveCustomer() {
  booking.value.customer = { ...customer.value };
  saveBooking();
}

/* ------------------ API ------------------ */
async function fetchProductInfo() {
  try {
    const { data } = await apiClient.get("/bike-rentals/product-info");
    if (data?.success) productInfo.value = data.product;
  } catch {
    showError("Unable to load product info");
  }
}

/* ------------------ PAYMENT ------------------ */
async function processPayment() {
  loading.value = true;
  try {
    const payload = {
      locationName: booking.value.selectedLocation.name,
      startDate: booking.value.pickupDate,
      endDate: booking.value.returnDate,
      quantity: quantity.value,
      paymentType: booking.value.paymentType,
      pickupType: booking.value.pickupType,
      dropType: booking.value.dropType,
      pickup: booking.value.pickup,
      drop: booking.value.drop,
      pickupHotelName: booking.value.pickupHotelName || "",
      dropHotelName: booking.value.dropHotelName || "",
      customer: { ...customer.value },
    };

    const { data } = await apiClient.post("/order/bike-rentals/order", payload);

    if (!data?.success) throw new Error(data?.message);

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.payment.amount * 100,
      currency: "INR",
      name: "Bike Rental",
      description: `Booking #${data.orderId}`,
      order_id: data.payment.id,
      handler() {
        router.push(`/payment/status?order_id=${data.payment.id}`);
      },
      modal: {
        ondismiss() {
          router.push(`/payment/status?order_id=${data.payment.id}`);
        },
      },
      prefill: {
        name: `${customer.value.firstName} ${customer.value.lastName}`,
        email: customer.value.email,
        contact: customer.value.mobile,
      },
      theme: { color: "#4C42D8" },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    showError(err?.message || "Payment failed");
  } finally {
    loading.value = false;
  }
}

/* ------------------ VALIDATION ------------------ */
function validatePhoneNumber(value, countryAbbr) {
  if (!value) return "Phone number required";
  if (!/^[0-9]+$/.test(value)) return "Only numbers allowed";
  if (!countryAbbr) return "Select country";

  const phone = parsePhoneNumberFromString(value, countryAbbr);
  return phone?.isValid() ? true : "Invalid phone number";
}

function showError(message) {
  snackbar.value = { show: true, message, color: "error" };
}

/* ------------------ INIT ------------------ */
onMounted(async () => {
  await fetchProductInfo();

  try {
    const stored = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    if (!stored?.selectedLocation) {
      router.push("/step-1");
      return;
    }
    booking.value = stored;
    customer.value = stored.customer || {};
  } catch {
    router.push("/step-1");
  }
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
