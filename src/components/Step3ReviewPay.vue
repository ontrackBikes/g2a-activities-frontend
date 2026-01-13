<template>
  <div>
    <!-- Dynamic header with selected location and cost -->
    <v-card class="mb-6" elevation="0">
      <v-container>
        <v-chip
          size="small"
          color="warning"
          class="g2a-text-12 g2a-text-bold-700"
          >VEHICLE RENTAL</v-chip
        >
        <h2 class="g2a-title-1 mt-2">
          Scooty Rental - {{ bookingData.selectedLocation?.name }}
        </h2>
        <p class="text-greyDark g2a-text-14 mt-1">
          <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
          {{ bookingData.selectedLocation?.name }}
        </p>
      </v-container>
    </v-card>

    <!-- Main Content Card -->
    <v-card elevation="0" class="mb-6 g2a-rounded-border border">
      <v-progress-linear
        color="warning"
        model-value="100"
        :height="6"
      ></v-progress-linear>
      <div class="d-flex align-center justify-space-between px-4 mt-4">
        <span class="g2a-text-12 text-greyDark">Step 3 of 3</span>
        <span class="g2a-text-12 text-greyDark">Payment</span>
      </div>
      <v-container>
        <h3 class="g2a-title-3 mb-8">Review & Pay</h3>

        <!-- Guest Details Section -->
        <div class="mb-8">
          <p class="g2a-text-bold-600 g2a-text-16 mb-6 text-greyDark">
            GUEST DETAILS
          </p>

          <v-row class="mb-4">
            <v-col cols="12" sm="3">
              <v-select
                v-model="guestDetails.title"
                :items="['Mr', 'Mrs', 'Ms', 'Dr']"
                label="Title"
                variant="outlined"
                density="comfortable"
                class="custom-border"
                @update:model-value="updateGuestDetails"
              />
            </v-col>
            <v-col cols="12" sm="4">
              <v-text-field
                v-model="guestDetails.firstName"
                label="First Name"
                variant="outlined"
                density="comfortable"
                class="custom-border"
                :rules="[(v) => !!v || 'First name is required']"
                @update:model-value="updateGuestDetails"
              />
            </v-col>
            <v-col cols="12" sm="5">
              <v-text-field
                v-model="guestDetails.lastName"
                label="Last Name"
                variant="outlined"
                density="comfortable"
                class="custom-border"
                :rules="[(v) => !!v || 'Last name is required']"
                @update:model-value="updateGuestDetails"
              />
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="12" sm="4">
              <v-select
                v-model="guestDetails.countryCode"
                :items="countryCodes"
                label="Country Code"
                variant="outlined"
                density="comfortable"
                class="custom-border"
                @update:model-value="updateGuestDetails"
              />
            </v-col>
            <v-col cols="12" sm="8">
              <v-text-field
                v-model="guestDetails.mobileNumber"
                label="Mobile Number"
                variant="outlined"
                density="comfortable"
                class="custom-border"
                :rules="[
                  (v) => !!v || 'Mobile number is required',
                  (v) => /^[0-9]{10}$/.test(v) || 'Enter valid 10-digit number',
                ]"
                @update:model-value="updateGuestDetails"
              />
            </v-col>
          </v-row>

          <v-row class="mb-4">
            <v-col cols="12">
              <v-text-field
                v-model="guestDetails.email"
                label="Email Address"
                type="email"
                variant="outlined"
                density="comfortable"
                class="custom-border"
                :rules="[
                  (v) => !!v || 'Email is required',
                  (v) => /.+@.+\..+/.test(v) || 'Enter valid email',
                ]"
                @update:model-value="updateGuestDetails"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12">
              <v-text-field
                v-model="guestDetails.alternativeMobile"
                label="Alternate Mobile (Optional)"
                variant="outlined"
                density="comfortable"
                class="custom-border"
                @update:model-value="updateGuestDetails"
              />
            </v-col>
          </v-row>
        </div>

        <!-- Payment Breakdown Section -->
        <v-card
          elevation="0"
          class="pa-6 mb-8 g2a-rounded-border"
          :style="{
            backgroundColor: '#FFF9E6',
            borderLeft: '4px solid #FFB84D',
          }"
        >
          <p class="g2a-text-caption text-greyDark mb-6">PAYMENT BREAKDOWN</p>

          <v-row align="center" class="mb-4">
            <v-col>
              <p class="g2a-text-bold-600">Pay Now</p>
              <p class="g2a-text-14 text-greyDark">Secure online payment</p>
            </v-col>
            <v-col align="end">
              <v-chip
                color="#FF8C00"
                text-color="white"
                size="small"
                class="mr-3"
                >TO RESERVE</v-chip
              >
              <span
                class="g2a-text-bold-700"
                style="font-size: 18px; color: #ff8c00"
                >₹{{ payNowAmount }}</span
              >
            </v-col>
          </v-row>

          <v-divider class="my-4" />

          <v-row align="center">
            <v-col>
              <p class="g2a-text-bold-600">Pay after confirmation</p>
            </v-col>
            <v-col align="end">
              <span class="g2a-text-16 text-greyDark"
                >₹{{ payLaterAmount }}</span
              >
            </v-col>
          </v-row>

          <p class="g2a-text-14 text-greyDark mt-6 mb-0">
            By clicking Pay, you agree to the
            <a href="#" style="color: #ff8c00; text-decoration: none"
              >Terms of Service</a
            >. Cancellation allowed up to 48hrs before pickup.
          </p>
        </v-card>
      </v-container>

      <v-divider> </v-divider>
      <v-alert
        :icon="false"
        color="background"
        text-color="grey"
        density="compact"
      >
        <div class="d-flex align-center justify-space-between w-100">
          <v-btn
            variant="text"
            color="#999999"
            size="large"
            @click="goBack"
            class="px-2"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            BACK
          </v-btn>

          <v-btn
            color="warning"
            rounded="lg"
            size="large"
            :disabled="!isStep3Valid"
            @click="processPayment"
          >
            <v-icon left>mdi-check</v-icon>
            Pay ₹{{ payNowAmount }}
          </v-btn>
        </div>
      </v-alert>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  bookingData: {
    type: Object,
    required: true,
  },
  rentalCost: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(["update-booking", "prev-step"]);

const countryCodes = [
  "+91 (India)",
  "+1 (USA)",
  "+44 (UK)",
  "+61 (Australia)",
  "+81 (Japan)",
];

const guestDetails = ref(props.bookingData.guestDetails);

const payNowAmount = computed(() => {
  return Math.floor(props.rentalCost / 3);
});

const payLaterAmount = computed(() => {
  return props.rentalCost - payNowAmount.value;
});

const isStep3Valid = computed(() => {
  return (
    guestDetails.value.firstName &&
    guestDetails.value.lastName &&
    guestDetails.value.mobileNumber &&
    guestDetails.value.email &&
    /^[0-9]{10}$/.test(guestDetails.value.mobileNumber) &&
    /.+@.+\..+/.test(guestDetails.value.email)
  );
});

const updateGuestDetails = () => {
  emit("update-booking", { guestDetails: { ...guestDetails.value } });
};

const processPayment = () => {
  if (isStep3Valid.value) {
    alert("Payment processed! Booking confirmed.");
    console.log("Complete Booking Data:", props.bookingData);
  }
};

const goBack = () => {
  emit("prev-step");
};
</script>

<style scoped>
.w-100 {
  width: 100%;
}
</style>
