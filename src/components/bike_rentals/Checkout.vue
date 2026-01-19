<template>
  <v-row>
    <v-col cols="12" md="8">
      <v-card elevation="0" class="mb-6 g2a-rounded-border border">
        <v-progress-linear color="brandColor" model-value="100" :height="6" />

        <v-container>
          <div class="d-flex justify-space-between">
            <span class="g2a-text-13 text-grey">Step 3 of 3</span>
            <span class="g2a-text-13 text-grey">Payment</span>
          </div>

          <div class="g2a-text-22 g2a-text-bold-600 my-2">Review & Pay</div>
          <p class="text-blackLight2 g2a-text-bold-600">Rider Details</p>

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
                  v-model="customer.countryCode"
                  :items="countryCodes"
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
                    (v) => !!v || 'Required',
                    (v) => /^[0-9]{10}$/.test(v) || 'Invalid number',
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
          <v-card elevation="0" class="mt-4 g2a-rounded-border">
            <p class="text-blackLight2 g2a-text-bold-600 my-4">Payment Modes</p>

            <v-radio-group v-model="booking.paymentType">
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

          <p class="g2a-text-14 text-greyDark mt-4">
            By clicking Pay, you agree to the
            <a href="#" class="text-brandColor">terms of service</a>.
          </p>
        </v-container>

        <v-divider />

        <v-alert color="background" density="compact" :icon="false">
          <div class="d-flex justify-space-between align-center w-100">
            <v-btn variant="text" color="#999" @click="goBack">
              <v-icon start>mdi-arrow-left</v-icon> BACK
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
              Pay ₹{{ payNowAmountTotal }}
            </v-btn>
          </div>
        </v-alert>
      </v-card>
    </v-col>

    <v-col cols="12" md="4">
      <booking-summary :booking-data="booking" :product-info="productInfo" />
    </v-col>
  </v-row>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import moment from "moment";
import BookingSummary from "../BookingSummary.vue";
import apiClient from "@/services/api";

const LOCAL_STORAGE_KEY = "bikeRentalBooking";
const router = useRouter();

const booking = ref({});
const customer = ref({});
const countryCodes = ["+91 (India)", "+1 (USA)", "+44 (UK)"];
const loading = ref(false);
const productInfo = ref({});

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

const saveBooking = () => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(booking.value));
};

const saveCustomer = () => {
  booking.value.customer = { ...customer.value };
  saveBooking();
};

const isStep3Valid = computed(() => {
  return (
    customer.value.firstName &&
    customer.value.lastName &&
    customer.value.mobile &&
    customer.value.email
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
    alert(err.response?.data?.message || err.message || "Payment failed");
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
</script>
