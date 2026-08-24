<template>
  <v-card rounded="lg" flat class="border">
    <v-container class="py-4">
      <div class="g2a-title-xl">
        {{ config.title || "Permit Charges" }}
      </div>

      <div class="mt-1">
        <p>
          Permits are mandatory for this trip and the permit charges are not
          included in the booking amount.
        </p>

        <p>Indian Nationals: <strong>INR 500 per person</strong></p>
        <p>Foreign Nationals: <strong>INR 2,500 per person</strong></p>

        <p>
          Our agent will contact you after booking to assist with the permit
          process and collect the applicable permit payment.
        </p>

        <p>
          Please note: Failure to obtain the required permit may result in
          the cancellation of your booking.
        </p>
      </div>
    </v-container>

    <v-divider />

    <v-container>
      <v-checkbox
        v-model="hasAgreedToPermitCharge"
        color="primary"
        hide-details="auto"
        density="compact"
        :rules="[
          (v) => !!v || 'Please confirm you agree to the permit charges',
        ]"
      >
        <template #label>
          {{
            config.checkbox_label ||
            "Yes, I agree to the permit charges and terms mentioned above"
          }}
        </template>
      </v-checkbox>
    </v-container>
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

  quote: {
    type: Object,
    default: () => ({}),
  },
});

const booking = bookingStore;

const hasAgreedToPermitCharge = computed({
  get() {
    return booking.form.has_agreed_to_permit_charge ?? false;
  },

  set(value) {
    booking.form.has_agreed_to_permit_charge = value;
  },
});
</script>
