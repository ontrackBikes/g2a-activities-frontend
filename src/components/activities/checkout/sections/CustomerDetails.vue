<template>
  <v-card rounded="lg" variant="outlined" elevation="0">
    <v-card-title class="py-4">
      <div class="g2a-subtitle">Customer Details</div>
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
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer.last_name"
            label="Last Name"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer.mobile"
            label="Mobile Number"
            prepend-inner-icon="mdi-phone"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="customer.email"
            label="Email Address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="customer.country"
            label="Country"
            prepend-inner-icon="mdi-earth"
            variant="outlined"
            density="comfortable"
          />
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

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
</script>
