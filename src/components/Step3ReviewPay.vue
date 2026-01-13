<template>
  <div>
    <!-- Main Content Card -->
    <v-card elevation="0" class="mb-6 g2a-rounded-border border">
      <v-progress-linear color="warning" model-value="100" :height="6" />

      <div class="d-flex justify-space-between px-4 mt-4">
        <span class="g2a-text-13 text-grey">Step 3 of 3</span>
        <span class="g2a-text-13 text-grey">Payment</span>
      </div>

      <v-container>
        <div class="g2a-text-22 g2a-text-bold-600 my-2">Review & Pay</div>

        <!-- Guest Details -->
        <div>
          <span class="text-blackLight2 g2a-text-bold-600">GUEST DETAILS</span>

          <v-row class="my-2">
            <v-col cols="12" sm="2">
              <v-select
                v-model="customer.title"
                :items="['Mr', 'Mrs', 'Ms', 'Dr']"
                label="Title"
                variant="outlined"
                density="comfortable"
                @update:model-value="emitCustomer"
              />
            </v-col>

            <v-col cols="12" sm="5">
              <v-text-field
                v-model="customer.firstName"
                label="First Name"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Required']"
                @update:model-value="emitCustomer"
              />
            </v-col>

            <v-col cols="12" sm="5">
              <v-text-field
                v-model="customer.lastName"
                label="Last Name"
                variant="outlined"
                density="comfortable"
                :rules="[(v) => !!v || 'Required']"
                @update:model-value="emitCustomer"
              />
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="12" sm="4">
              <v-select
                v-model="customer.countryCode"
                :items="countryCodes"
                label="Country Code"
                variant="outlined"
                density="comfortable"
                @update:model-value="emitCustomer"
              />
            </v-col>

            <v-col cols="12" sm="8">
              <v-text-field
                v-model="customer.mobile"
                label="Mobile Number"
                variant="outlined"
                density="comfortable"
                :rules="[
                  (v) => !!v || 'Required',
                  (v) => /^[0-9]{10}$/.test(v) || 'Invalid number',
                ]"
                @update:model-value="emitCustomer"
              />
            </v-col>
          </v-row>

          <v-row class="mb-4">
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
                @update:model-value="emitCustomer"
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
                  (v) => !!v || 'Required',
                  (v) => /^[0-9]{10}$/.test(v) || 'Invalid number',
                ]"
                @update:model-value="emitCustomer"
              />
            </v-col>
          </v-row>
        </div>

        <!-- Payment Modes -->
        <v-card
          elevation="0"
          class="pa-6 mb-8 g2a-rounded-border"
          style="background: #e5dac8; border: 1px dashed #ffb84d"
        >
          <p class="g2a-text-caption text-greyDark mb-6">PAYMENT MODES</p>

          <v-radio-group v-model="paymentType">
            <v-row
              no-gutters
              v-for="(mode, i) in paymentModes"
              :key="i"
              class="mb-4 cursor-pointer"
              align="center"
              @click="paymentType = mode.paymentType"
            >
              <v-col cols="9">
                <div class="d-flex">
                  <div>
                    <v-radio :value="mode.paymentType" />
                  </div>
                  <div>
                    <p class="g2a-text-bold-600 mt-1">{{ mode.label }}</p>
                    <p class="g2a-text-14 text-greyDark">
                      Secure online payment
                    </p>
                  </div>
                </div>
              </v-col>

              <v-col align="end">
                <span class="g2a-text-bold-700 g2a-text-18 text-error">
                  ₹{{ mode.amount * quantity * duration }}
                </span>
              </v-col>
            </v-row>
          </v-radio-group>

          <v-divider class="my-4" />

          <p class="g2a-text-14 text-greyDark">
            By clicking Pay, you agree to the
            <a href="#" class="text-error">Terms of Service</a>.
          </p>
        </v-card>
      </v-container>

      <v-divider />

      <v-alert color="background" density="compact" :icon="false">
        <div class="d-flex justify-space-between align-center w-100">
          <v-btn variant="text" color="#999" @click="goBack">
            <v-icon start>mdi-arrow-left</v-icon> BACK
          </v-btn>

          <v-btn
            color="error"
            rounded="lg"
            size="large"
            :disabled="!isStep3Valid || !paymentType || loading"
            @click="processPayment"
            :loading="loading"
          >
            Pay ₹{{ payNowAmount }}
          </v-btn>
        </div>
      </v-alert>
    </v-card>

    <!-- error message  -->
    <v-snackbar
      v-model="snackbar.show"
      :color="snackbar.color"
      top
      right
      timeout="4000"
    >
      {{ snackbar.message }}
    </v-snackbar>
  </div>
</template>

<script setup>
import moment from "moment";
import { ref, computed, watch } from "vue";
import axios from "axios";

const rzp_key = import.meta.env.VITE_RAZORPAY_KEY_ID;

const props = defineProps({
  bookingData: Object,
  rentalCost: Number,
});

const loading = ref(false);
const snackbar = ref({
  show: false,
  message: "",
  color: "error",
});

const emit = defineEmits(["update", "prev-step"]);

const countryCodes = ["+91 (India)", "+1 (USA)", "+44 (UK)"];

const customer = ref({ ...props.bookingData.customer });

watch(customer, () => emit("update", { customer: { ...customer.value } }), {
  deep: true,
});

const paymentType = ref(props.bookingData.paymentType || null);
watch(paymentType, (v) => emit("update", { paymentType: v }));

const duration = computed(() => {
  if (!props.bookingData.pickupDate || !props.bookingData.returnDate) return 1;
  return (
    moment(props.bookingData.returnDate).diff(
      moment(props.bookingData.pickupDate),
      "days"
    ) || 1
  );
});

const quantity = computed(() => props.bookingData.quantity || 1);

const paymentModes = computed(
  () => props.bookingData.selectedLocation?.paymentModes || []
);

const payNowAmount = computed(() => {
  if (!paymentType.value) return 0;
  const mode = paymentModes.value.find(
    (m) => m.paymentType === paymentType.value
  );
  if (!mode) return 0;
  return mode.amount * quantity.value * duration.value;
});

const isStep3Valid = computed(
  () =>
    customer.value.firstName &&
    customer.value.lastName &&
    /^[0-9]{10}$/.test(customer.value.mobile) &&
    /.+@.+\..+/.test(customer.value.email)
);

const emitCustomer = () => {};

const processPayment = async () => {
  loading.value = true;
  try {
    const payload = {
      locationName: props.bookingData.selectedLocation.name,
      startDate: props.bookingData.pickupDate,
      endDate: props.bookingData.returnDate,
      quantity: quantity.value,
      paymentType: paymentType.value,
      pickupType: props.bookingData.pickupType,
      dropType: props.bookingData.dropType,
      pickup: props.bookingData.pickup,
      drop: props.bookingData.drop,
      dropHotelName: props.bookingData.dropHotelName || "",
      pickupHotelName: props.bookingData.pickupHotelName || "",
      customer: {
        ...customer.value,
      },
    };

    const { data } = await axios.post(
      "http://localhost:3000/api/order/bike-rentals/order",
      payload
    );

    if (!data.success) {
      alert(data.message || "Failed to create order");
      return;
    }

    // Open Razorpay modal
    const options = {
      key: rzp_key, // your Razorpay key
      amount: data.payment.amount || payNowAmount.value * 100, // in paise
      currency: "INR",
      name: "Bike Rental",
      description: `Booking #${data.orderId}`,
      order_id: data.payment.id, // Razorpay order ID
      handler(response) {
        alert(
          `Payment successful! Razorpay Payment ID: ${response.razorpay_payment_id}`
        );
      },
      prefill: {
        name: `${customer.value.firstName} ${customer.value.lastName}`,
        email: customer.value.email,
        contact: customer.value.mobileNumber,
      },
      theme: { color: "#ff8c00" },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Payment error:", error);
    snackbar.value = {
      show: true,
      message:
        error.response.data.errors?.[0]?.message ||
        "Something went wrong during payment.",
      color: "error",
    };
  } finally {
    loading.value = false;
  }
};

const goBack = () => emit("prev-step");
</script>

<style scoped>
.w-100 {
  width: 100%;
}
</style>
