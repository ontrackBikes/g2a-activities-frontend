<template>
  <v-card rounded="lg" class="border" flat>
    <v-container class="py-2">
      <div class="g2a-title-xl">
        {{ config.title || "Customer Details" }}
      </div>
    </v-container>

    <v-divider />

    <v-container>
      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer_details.first_name"
            placeholder="First Name"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="[(v) => !!v || 'First Name is required']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer_details.last_name"
            placeholder="Last Name"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="[(v) => !!v || 'Last Name is required']"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer_details.phone"
            placeholder="Mobile Number"
            prepend-inner-icon="mdi-phone"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="mobileRules"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer_details.email"
            placeholder="Email Address"
            prepend-inner-icon="mdi-email-outline"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="emailRules"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="customer_details.country"
            placeholder="Country"
            prepend-inner-icon="mdi-earth"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="[(v) => !!v || 'Country is required']"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, watch } from "vue";
import { bookingStore } from "@/store/booking";

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

const booking = bookingStore;

const STORAGE_KEY = "g2a_customer_details_v1";

const defaultCustomer = () => ({
  first_name: "",
  last_name: "",
  phone: "",
  email: "",
  country: "India",
});

/*
|--------------------------------------------------------------------------
| Local Storage
|--------------------------------------------------------------------------
*/

const loadCustomer = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return defaultCustomer();
    }

    return {
      ...defaultCustomer(),
      ...JSON.parse(raw),
    };
  } catch {
    return defaultCustomer();
  }
};

const saveCustomer = (customer) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        first_name: customer.first_name,
        last_name: customer.last_name,
        phone: customer.phone,
        email: customer.email,
        country: customer.country,
      }),
    );
  } catch {
    // Ignore storage failures
  }
};

/*
|--------------------------------------------------------------------------
| Customer Details
|--------------------------------------------------------------------------
*/

const customer_details = computed({
  get() {
    if (!booking.form.customer_details) {
      booking.form.customer_details = loadCustomer();
    }

    return booking.form.customer_details;
  },

  set(value) {
    booking.form.customer_details = value;
  },
});

/*
|--------------------------------------------------------------------------
| Auto Save
|--------------------------------------------------------------------------
*/

watch(
  customer_details,
  (value) => {
    saveCustomer(value);
  },
  {
    deep: true,
  },
);

/*
|--------------------------------------------------------------------------
| Validation
|--------------------------------------------------------------------------
*/

const emailRules = [
  (v) => !!v || "Email Address is required",
  (v) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
    "Please enter a valid email address",
];

const mobileRules = [
  (v) => !!v || "Mobile Number is required",
  (v) => /^[6-9]\d{9}$/.test(v) || "Please enter a valid mobile number",
];
</script>
