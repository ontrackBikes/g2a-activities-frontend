<template>
  <div>
    <!-- Main Content Card -->
    <v-card elevation="0" class="mb-6 g2a-rounded-border border">
      <v-progress-linear color="warning" model-value="100" :height="6" />

      <div class="d-flex align-center justify-space-between px-4 mt-4">
        <span class="g2a-text-12 text-greyDark">Step 3 of 3</span>
        <span class="g2a-text-12 text-greyDark">Payment</span>
      </div>

      <v-container>
        <h3 class="g2a-title-3 mb-8">Review & Pay</h3>

        <!-- Guest Details -->
        <div class="mb-8">
          <p class="g2a-text-bold-600 g2a-text-16 mb-6 text-greyDark">
            GUEST DETAILS
          </p>

          <v-row class="mb-4">
            <v-col cols="12" sm="3">
              <v-select
                v-model="customer.title"
                :items="['Mr', 'Mrs', 'Ms', 'Dr']"
                label="Title"
                variant="outlined"
                density="comfortable"
                @update:model-value="emitCustomer"
              />
            </v-col>

            <v-col cols="12" sm="4">
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
                v-model="customer.mobileNumber"
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
                v-model="customer.alternativeMobile"
                label="Alternate Mobile (Optional)"
                variant="outlined"
                density="comfortable"
                @update:model-value="emitCustomer"
              />
            </v-col>
          </v-row>
        </div>

        <!-- Payment Modes -->
        <v-card
          elevation="0"
          class="pa-6 mb-8 g2a-rounded-border"
          style="background: #fff9e6; border-left: 4px solid #ffb84d"
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
                <!-- <v-chip
                  color="#FF8C00"
                  size="small"
                  class="mr-3"
                  text-color="white"
                >
                  TO RESERVE
                </v-chip> -->
                <span
                  class="g2a-text-bold-700"
                  style="font-size: 18px; color: #ff8c00"
                >
                  ₹{{ mode.amount * quantity * duration }}
                </span>
              </v-col>
            </v-row>
          </v-radio-group>

          <v-divider class="my-4" />

          <p class="g2a-text-14 text-greyDark">
            By clicking Pay, you agree to the
            <a href="#" style="color: #ff8c00">Terms of Service</a>.
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
            color="warning"
            rounded="lg"
            size="large"
            :disabled="!isStep3Valid || !paymentType"
            @click="processPayment"
          >
            Pay ₹{{ payNowAmount }}
          </v-btn>
        </div>
      </v-alert>
    </v-card>
  </div>
</template>

<script setup>
import moment from "moment";
import { ref, computed, watch } from "vue";

const props = defineProps({
  bookingData: Object,
  rentalCost: Number,
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
    /^[0-9]{10}$/.test(customer.value.mobileNumber) &&
    /.+@.+\..+/.test(customer.value.email)
);

const paymentModes = computed(
  () => props.bookingData.selectedLocation?.paymentModes || []
);

const emitCustomer = () => {};

const processPayment = () => {
  console.log("FINAL BOOKING:", props.bookingData);
  alert("Payment initiated");
};

const goBack = () => emit("prev-step");
</script>

<style scoped>
.w-100 {
  width: 100%;
}
</style>
