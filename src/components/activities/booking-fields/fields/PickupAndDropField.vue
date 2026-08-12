<template>
  <v-card class="border" flat rounded="lg">
    <v-container>
      <v-row>
      <v-col cols="12" md="6">
        <v-text-field
          v-model="pickupDate"
          type="date"
          label="Pickup Date"
          :min="tomorrowString"
          :error-messages="error ? [error] : []"
          variant="outlined"
          density="compact"
          hide-details="auto"
          rounded="lg"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="pickupTime"
          :items="pickupTimeOptions"
          item-title="title"
          item-value="value"
          label="Pickup Time"
          variant="outlined"
          density="compact"
          hide-details="auto"
          rounded="lg"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-text-field
          v-model="returnDate"
          type="date"
          label="Drop Date"
          :min="minimumReturnDate"
          :error-messages="error ? [error] : []"
          variant="outlined"
          density="compact"
          hide-details="auto"
          rounded="lg"
        />
      </v-col>

      <v-col cols="12" md="6">
        <v-select
          v-model="pickupTime"
          :items="pickupTimeOptions"
          item-title="title"
          item-value="value"
          label="Drop Time"
          variant="outlined"
          density="compact"
          hide-details="auto"
          rounded="lg"
          readonly
          disabled
        />
      </v-col>
    </v-row>

    <v-card flat class="border mt-4" rounded="lg">
      <v-container class="text-warning my-auto d-flex align-center">
        <v-icon class="mr-2">mdi-information</v-icon> Drop time is
        automatically set to 24 hours after pickup time. You can contact us
        if you need a different drop time.
      </v-container>
    </v-card>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, watch } from "vue";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },

  error: {
    type: String,
    default: "",
  },
});

const todayDate = new Date();

const tomorrow = new Date(todayDate);
tomorrow.setDate(tomorrow.getDate() + 1);

const tomorrowString = tomorrow.toISOString().split("T")[0];

const dayAfterTomorrow = new Date(todayDate);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

const dayAfterTomorrowString = dayAfterTomorrow.toISOString().split("T")[0];

const pickupTimeOptions = [
  { title: "10:00 AM", value: "10:00" },
  { title: "10:30 AM", value: "10:30" },
  { title: "11:00 AM", value: "11:00" },
  { title: "11:30 AM", value: "11:30" },
  { title: "12:00 PM", value: "12:00" },
  { title: "12:30 PM", value: "12:30" },
  { title: "1:00 PM", value: "13:00" },
  { title: "1:30 PM", value: "13:30" },
  { title: "2:00 PM", value: "14:00" },
  { title: "2:30 PM", value: "14:30" },
  { title: "3:00 PM", value: "15:00" },
  { title: "3:30 PM", value: "15:30" },
  { title: "4:00 PM", value: "16:00" },
  { title: "4:30 PM", value: "16:30" },
  { title: "5:00 PM", value: "17:00" },
  { title: "5:30 PM", value: "17:30" },
  { title: "6:00 PM", value: "18:00" },
];

const pickupDate = computed({
  get() {
    return props.form.pickup_date || tomorrowString;
  },
  set(value) {
    props.form.pickup_date = value;
  },
});

const pickupTime = computed({
  get() {
    return props.form.pickup_time || "10:00";
  },
  set(value) {
    props.form.pickup_time = value;
  },
});

const returnDate = computed({
  get() {
    return props.form.return_date || dayAfterTomorrowString;
  },
  set(value) {
    props.form.return_date = value;
  },
});

const minimumReturnDate = computed(() => {
  return pickupDate.value || tomorrowString;
});

watch(
  pickupDate,
  (newPickup) => {
    const pickup = new Date(newPickup);
    const drop = new Date(returnDate.value);

    if (drop <= pickup) {
      pickup.setDate(pickup.getDate() + 1);
      props.form.return_date = pickup.toISOString().split("T")[0];
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => props.form,
  () => {
    if (!props.form.pickup_date) {
      props.form.pickup_date = tomorrowString;
    }

    if (!props.form.pickup_time) {
      props.form.pickup_time = "10:00";
    }

    if (!props.form.return_date) {
      props.form.return_date = dayAfterTomorrowString;
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>

<style scoped>
/* Native date inputs shrink to fit their text, so the browser's
   calendar icon ends up right after the value instead of at the far
   right of the field - force it to fill the input so the icon lands
   at the field's right edge. */
:deep(input[type="date"]) {
  width: 100%;
}
</style>