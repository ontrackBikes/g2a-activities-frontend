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
      <div class="g2a-title-md">For all participants</div>


      <v-container>
        <ul>
        <li>This is for reference only. No need to fill it out.</li>
        <li>if all answers are "No", no medical certificate is required.</li>
        <li>if any answer is "Yes", you'll need a doctor's fitness certificate.</li>
        <li>Participants above 50 years must provide a signed doctor's certificate, regardless of their answers.</li>
      </ul>
      </v-container>
 
      <v-btn
        :href="scubaMedicalFormUrl"
        target="_blank"
        rel="noopener noreferrer"
        download
        variant="outlined"
        color="brandColor2"
        rounded="lg"
        class="my-2"
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
          I confirm that all participants have reviewed the Scuba Medical Form and declaration above.
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
