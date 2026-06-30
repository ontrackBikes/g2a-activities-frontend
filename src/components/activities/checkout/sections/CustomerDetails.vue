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
        <v-col
          v-if="visible('first_name')"
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="customer.first_name"
            label="First Name"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="rules('first_name')"
          />
        </v-col>

        <v-col
          v-if="visible('last_name')"
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="customer.last_name"
            label="Last Name"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="rules('last_name')"
          />
        </v-col>

        <v-col
          v-if="visible('mobile')"
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="customer.mobile"
            label="Mobile Number"
            prepend-inner-icon="mdi-phone"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="rules('mobile')"
          />
        </v-col>

        <v-col
          v-if="visible('email')"
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="customer.email"
            label="Email Address"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="rules('email')"
          />
        </v-col>

        <v-col
          v-if="visible('country')"
          cols="12"
        >
          <v-text-field
            v-model="customer.country"
            label="Country"
            prepend-inner-icon="mdi-earth"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="rules('country')"
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

const defaultCustomer = {
  first_name: "",
  last_name: "",
  mobile: "",
  email: "",
  country: "",
};

const customer = computed({
  get() {
    if (!booking.form.customer) {
      booking.form.customer = { ...defaultCustomer };
    }

    return booking.form.customer;
  },

  set(value) {
    booking.form.customer = value;
  },
});

const fields = computed(() => {
  return props.config?.fields || [];
});

const fieldConfig = (name) => {
  return fields.value.find((x) => x.field === name);
};

const visible = (name) => {
  const field = fieldConfig(name);

  if (!field) return true;

  return field.visible !== false;
};

const rules = (name) => {
  const field = fieldConfig(name);

  const validations = [];

  if (field?.required) {
    validations.push((v) => !!v || `${pretty(name)} is required`);
  }

  if (name === "email") {
    validations.push((v) => {
      if (!v) return true;

      return (
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ||
        "Please enter a valid email"
      );
    });
  }

  if (name === "mobile") {
    validations.push((v) => {
      if (!v) return true;

      return (
        /^[0-9]{10}$/.test(v) ||
        "Please enter a valid mobile number"
      );
    });
  }

  return validations;
};

const pretty = (value) => {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};
</script>