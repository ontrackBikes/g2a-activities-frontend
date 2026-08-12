<template>
  <v-card rounded="lg" flat class="border">
    <v-container class="py-4">
      <div class="g2a-title-xl">
        {{ config.title || "Medical Declaration" }}
      </div>

      <div class="mt-1">
        {{
          config.description ||
          "Please go through this before your activity. Your safety is our highest priority."
        }}
      </div>
    </v-container>

    <v-divider />

    <v-container>
      <div class="g2a-title-md">All the participants</div>

      <div class="mt-2">
        This is the Scuba Medical Form. No need to fill it - just go through
        it as a pre-emptive reference check list. It’s a standard ask before
        any adventure sport.
      </div>

      <div class="mt-2">
        If the answer is a NO to everything, then nothing to worry and no
        other medical certificate is needed.
      </div>

      <div class="mt-2">
        If there is a YES, then you need to produce a doctor certificate that
        you can do this activity.
      </div>

      <div class="mt-2">
        If anyone is above the age of 50, they need to get the form signed by
        a Doctor - irrespective of the answers - as per the local
        administration rules.
      </div>

      <v-btn
        :href="scubaMedicalFormUrl"
        target="_blank"
        rel="noopener noreferrer"
        download
        variant="outlined"
        color="brandColor2"
        rounded="lg"
        class="mt-4"
        prepend-icon="mdi-download"
      >
        Download Scuba Medical Form
      </v-btn>

      <v-checkbox
        v-model="medical.acknowledged"
        class="mt-2"
        color="primary"
        hide-details="auto"
        density="compact"
        :rules="[
          (v) => !!v || 'Please confirm you have gone through the Scuba Medical Form',
        ]"
      >
        <template #label>
          I confirm all participants have gone through the Scuba Medical Form
          and the declaration above.
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
});

const booking = bookingStore;

const scubaMedicalFormUrl = "/uploads/scuba-medical-form.pdf";

const medical = computed({
  get() {
    if (!booking.form.medical_declaration) {
      booking.form.medical_declaration = {
        acknowledged: false,
      };
    }

    return booking.form.medical_declaration;
  },

  set(value) {
    booking.form.medical_declaration = value;
  },
});
</script>
