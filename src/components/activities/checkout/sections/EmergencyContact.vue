<template>
  <v-card
    rounded="xl"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        {{ config.title || "Emergency Contact" }}
      </div>

      <div class="g2a-text-13 text-medium-emphasis mt-1">
        {{
          config.description ||
          "We'll contact this person only in case of an emergency."
        }}
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <v-row>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="contact.name"
            label="Full Name"
            prepend-inner-icon="mdi-account"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'Full Name is required'
            ]"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="contact.mobile"
            label="Mobile Number"
            prepend-inner-icon="mdi-phone"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'Mobile Number is required',
              v => /^[6-9]\\d{9}$/.test(v) || 'Enter a valid mobile number'
            ]"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-select
            v-model="contact.relationship"
            :items="relationships"
            label="Relationship"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !!v || 'Relationship is required'
            ]"
          />
        </v-col>

        <v-col
          cols="12"
          md="6"
        >
          <v-text-field
            v-model="contact.email"
            label="Email (Optional)"
            prepend-inner-icon="mdi-email-outline"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            :rules="[
              v => !v || /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(v) || 'Enter a valid email address'
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

const relationships = [
  "Father",
  "Mother",
  "Spouse",
  "Brother",
  "Sister",
  "Friend",
  "Guardian",
  "Other",
];

const defaultEmergencyContact = {
  name: "",
  mobile: "",
  relationship: "",
  email: "",
};

const contact = computed({
  get() {
    if (!booking.form.emergency_contact) {
      booking.form.emergency_contact = {
        ...defaultEmergencyContact,
      };
    }

    return booking.form.emergency_contact;
  },

  set(value) {
    booking.form.emergency_contact = value;
  },
});
</script>