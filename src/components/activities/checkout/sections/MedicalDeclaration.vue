<template>
  <v-card
    rounded="xl"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        Medical Declaration
      </div>

      <div class="g2a-text-13 text-medium-emphasis mt-1">
        Please answer honestly. Your safety is our highest priority.
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>

      <v-checkbox
        v-for="question in questions"
        :key="question.key"
        v-model="medical[question.key]"
        :label="question.label"
        color="primary"
        hide-details
        class="mb-2"
      />

      <v-textarea
        v-if="hasMedicalIssue"
        v-model="medical.other_details"
        label="Please provide more details"
        variant="outlined"
        rows="4"
        class="mt-6"
      />

      <v-alert
        v-if="hasMedicalIssue"
        type="warning"
        variant="tonal"
        class="mt-4"
      >
        Certain medical conditions may require approval from the dive instructor
        before participation.
      </v-alert>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

const booking = bookingStore;

const defaultMedical = {
  asthma: false,
  heart_disease: false,
  epilepsy: false,
  pregnant: false,
  diabetes: false,
  recent_surgery: false,
  ear_problem: false,
  other: false,
  other_details: "",
};

const medical = computed({
  get() {
    if (!booking.form.medical) {
      booking.form.medical = { ...defaultMedical };
    }

    return booking.form.medical;
  },

  set(value) {
    booking.form.medical = value;
  },
});

const questions = [
  {
    key: "asthma",
    label: "I have Asthma",
  },
  {
    key: "heart_disease",
    label: "I have Heart Disease",
  },
  {
    key: "epilepsy",
    label: "I have Epilepsy",
  },
  {
    key: "pregnant",
    label: "I am Pregnant",
  },
  {
    key: "diabetes",
    label: "I have Diabetes",
  },
  {
    key: "recent_surgery",
    label: "I have undergone recent surgery",
  },
  {
    key: "ear_problem",
    label: "I have Ear / Sinus Problems",
  },
  {
    key: "other",
    label: "Other Medical Condition",
  },
];

const hasMedicalIssue = computed(() => {
  return questions.some((question) => medical.value[question.key]);
});
</script>