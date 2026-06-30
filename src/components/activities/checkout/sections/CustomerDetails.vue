<template>
  <v-card
    rounded="lg"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        {{ config.title || "Customer Details" }}
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-row>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer.first_name"
            label="First Name"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'First Name is required'
            ]"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer.last_name"
            label="Last Name"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'Last Name is required'
            ]"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer.mobile"
            label="Mobile Number"
            prepend-inner-icon="mdi-phone"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="mobileRules"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer.email"
            label="Email Address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="emailRules"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="customer.country"
            label="Country"
            prepend-inner-icon="mdi-earth"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'Country is required'
            ]"
          />
        </v-col>

      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

const booking = bookingStore;

const customer = computed({
  get() {
    if (!booking.form.customer) {
      booking.form.customer = {
        first_name: "",
        last_name: "",
        mobile: "",
        email: "",
        country: "",
      };
    }

    return booking.form.customer;
  },

  set(value) {
    booking.form.customer = value;
  },
});

const emailRules = [
  (v) => !!v || "Email Address is required",
  (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    "Please enter a valid email address",
];

const mobileRules = [
  (v) => !!v || "Mobile Number is required",
  (v) =>
    /^[6-9]\d{9}$/.test(v) ||
    "Please enter a valid mobile number",
];
</script>