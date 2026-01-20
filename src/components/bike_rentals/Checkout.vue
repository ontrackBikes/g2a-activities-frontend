<template>
  <v-btn v-if="smAndDown" variant="text" class="mb-4" @click="goBack">
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
          <v-card elevation="0" class="my-2 g2a-rounded-border">
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
                    <div class="ml-2">
                      <p class="g2a-text-bold-600 mt-1">{{ mode.label }}</p>
                      <p class="g2a-text-14 text-greyDark">
                        {{ mode.description || "Secure online payment" }}
                      </p>
                    </div>
                  </div>
                </v-col>
                <v-col align="end">
                  <span class="g2a-text-bold-700 g2a-text-18 text-darkGreen">
                    ₹{{ mode.totalAmount }}
                  </span>
                </v-col>
              </v-row>
            </v-radio-group>
          </v-card>

          <p class="g2a-text-14 text-greyDark">
            By clicking Pay, you agree to the
            <a href="#" class="text-brandColor">terms of service</a>.
          </p>
        </v-container>

        <v-divider v-if="!smAndDown" />

        <v-container v-if="!smAndDown" class="bg-surface">
          <div class="d-flex align-center justify-space-between">
            <v-btn variant="text" @click="goBack">
              <v-icon start color="grey">mdi-arrow-left</v-icon>
              <span
                class="g2a-text-bold-500 g2a-text-16 text-greyDark"
                style="letter-spacing: 0.05rem"
                >BACK</span
              >
            </v-btn>

            <v-btn
              flat
              color="brandColor"
              rounded="lg"
              size="large"
              :disabled="!isStep3Valid || !booking.paymentType || loading"
              @click="processPayment"
              :loading="loading"
            >
              <span class="g2a-text-bold-600 g2a-text-16"
                >Pay ₹{{ payNowAmountTotal }}</span
              >
            </v-btn>
          </div>
        </v-container>
      </v-card>
    </v-col>

    <v-col cols="12" md="4" :class="smAndDown ? 'mb-16' : ''">
      <booking-summary :booking-data="booking" :product-info="productInfo" />
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
          <div class="g2a-text-12 text-decoration-line-through">
            Total: ₹{{ totalAmount }}
          </div>
          <div class="d-flex align-center">
            <span class="g2a-text-20 g2a-text-bold-700 text-brandColor"
              >₹{{ payNowAmountTotal }}</span
            >
            <span class="ml-1 g2a-text-12">now</span>
          </div>
        </v-col>
        <v-col cols="6">
          <v-btn
            block
            flat
            color="brandColor"
            rounded="lg"
            size="large"
            :disabled="!isStep3Valid || !booking.paymentType || loading"
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
import BookingSummary from "../BookingSummary.vue";
import apiClient from "@/services/api";
import countries_list from "@/store/local_datas/countries_list.json";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();

const LOCAL_STORAGE_KEY = "bikeRentalBooking";
const router = useRouter();

const booking = ref({});
const customer = ref({});
// const countriesList = ["+91 (India)", "+1 (USA)", "+44 (UK)"];
const loading = ref(false);
const productInfo = ref({});

const snackbar = ref({
  show: false,
  message: "",
  color: "error",
});

const countriesList = computed(() =>
  countries_list.map((c) => ({
    title: `${c.dial_code} (${c.abbr})`,
    value: c.abbr,
    dialCode: c.dial_code,
  })),
);

watch(
  () => customer.value.countryAbbr,
  (newAbbr) => {
    const selectedCountry = countriesList.value.find(
      (c) => c.value === newAbbr,
    );
    if (selectedCountry) {
      customer.value.countryCode = `${selectedCountry.dialCode} (${selectedCountry.value})`;
      saveCustomer();
    }
  },
  { immediate: true },
);

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

const paymentModes = computed(() => {
  if (!booking.value.selectedLocation?.paymentModes) return [];
  const quantity = booking.value.quantity || 1;
  const days =
    booking.value.pickupDate && booking.value.returnDate
      ? moment(booking.value.returnDate).diff(
          moment(booking.value.pickupDate),
          "days",
        ) || 1
      : 1;

  const deliveryCharges = hotelDeliveryCharge.value + hotelPickupCharge.value;

  return booking.value.selectedLocation.paymentModes.map((mode) => ({
    ...mode,
    totalAmount: (mode.amount || 0) * quantity * days + deliveryCharges,
  }));
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

const saveBooking = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(booking.value));
};

const saveCustomer = () => {
  booking.value.customer = { ...customer.value };
  saveBooking();
};

const isStep3Valid = computed(() => {
  const phoneValid =
    validatePhoneNumber(
      customer.value.mobile,
      customer.value.countryAbbr,
      false,
    ) === true;
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

const fetchProductInfo = async () => {
  try {
    const { data } = await apiClient.get("/bike-rentals/product-info");
    if (data.success) productInfo.value = data.product;
  } catch (err) {
    console.error("Failed to fetch product info", err);
  }
};

const processPayment = async () => {
  loading.value = true;
  try {
    const payload = {
      locationName: booking.value.selectedLocation.name,
      startDate: booking.value.pickupDate,
      endDate: booking.value.returnDate,
      quantity: booking.value.quantity,
      paymentType: booking.value.paymentType,
      pickupType: booking.value.pickupType,
      dropType: booking.value.dropType,
      pickup: booking.value.pickup,
      drop: booking.value.drop,
      dropHotelName: booking.value.dropHotelName || "",
      pickupHotelName: booking.value.pickupHotelName || "",
      customer: { ...customer.value },
    };

    const { data } = await apiClient.post("/order/bike-rentals/order", payload);
    if (!data.success)
      throw new Error(data.message || "Failed to create order");

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID,
      amount: data.payment.amount * 100,
      currency: "INR",
      name: "Bike Rental",
      description: `Booking #${data.orderId}`,
      order_id: data.payment.id,
      handler(response) {
        router.push(`/payment/status?order_id=${data.payment.id}`);
      },
      prefill: {
        name: `${customer.value.firstName} ${customer.value.lastName}`,
        email: customer.value.email,
        contact: customer.value.mobile,
      },
      theme: { color: "#ff8c00" },
    };

    new window.Razorpay(options).open();
  } catch (err) {
    const message =
      err.response?.data?.message || err.message || "Payment failed";
    showError(message);
  } finally {
    loading.value = false;
  }
};

const goBack = () => router.back();

onMounted(async () => {
  await fetchProductInfo();
  const localBooking = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
  if (!localBooking?.selectedLocation) router.push("/step-1");
  booking.value = localBooking || {};
  customer.value = booking.value.customer || {};
});

function validatePhoneNumber(value, countryAbbr, isOptional = false) {
  if (!value && isOptional) return true;
  if (!value) return "Phone number is required";

  const isValidFormat = /^[0-9]+$/.test(value);
  if (!isValidFormat) return "Only numbers allowed";

  if (!countryAbbr) return "Select country code";

  const phoneNumber = parsePhoneNumberFromString(value.toString(), countryAbbr);

  return phoneNumber &&
    phoneNumber.isValid() &&
    phoneNumber.isPossible() &&
    phoneNumber.nationalNumber === value
    ? true
    : `Invalid number for ${countryAbbr}`;
}

function showError(message) {
  snackbar.value = { show: true, message, color: "error" };
  setTimeout(() => (snackbar.value.show = false), 5000);
}
</script>
