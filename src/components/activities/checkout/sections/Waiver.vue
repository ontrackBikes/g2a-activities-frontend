<template>
  <v-card
    rounded="xl"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        Liability Waiver
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>

      <v-alert
        type="info"
        variant="tonal"
        class="mb-5"
      >
        Adventure activities involve inherent risks. Please read and accept
        the declaration before proceeding.
      </v-alert>

      <v-card
        variant="tonal"
        class="pa-4 mb-5"
        max-height="250"
        style="overflow:auto"
      >
        <p>
          I understand that participation in this activity involves certain
          risks. I confirm that the information provided is true and accurate.
          I agree to follow all instructions provided by the operator and
          release the organizer from liabilities arising from my negligence.
        </p>

        <p class="mt-4">
          I certify that I am medically fit for participation and understand
          that false declarations may result in cancellation without refund.
        </p>
      </v-card>

      <v-checkbox
        v-model="booking.form.waiver.accepted"
        color="primary"
        hide-details
      >
        <template #label>
          I have read and agree to the waiver and terms.
        </template>
      </v-checkbox>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { bookingStore } from "@/store/booking";

const booking = bookingStore;
</script>