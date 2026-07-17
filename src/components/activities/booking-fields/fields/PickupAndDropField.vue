<template>
  <v-row class="my-2">
    <v-col cols="12" md="8">
      <v-text-field
        v-model="pickupDate"
        type="date"
        label="Pickup Date"
        :min="today"
        :error-messages="error ? [error] : []"
        variant="outlined"
        density="compact"
        hide-details="auto"
        rounded="lg"
      />
    </v-col>

    <v-col cols="12" md="4">
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

    <v-col cols="12" md="8">
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

    <v-col cols="12" md="4">
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

const today = todayDate.toISOString().split("T")[0];

const tomorrow = new Date(todayDate);
tomorrow.setDate(tomorrow.getDate() + 1);

const tomorrowString = tomorrow.toISOString().split("T")[0];

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
    return props.form.pickup_date || today;
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
    return props.form.return_date || tomorrowString;
  },
  set(value) {
    props.form.return_date = value;
  },
});

const minimumReturnDate = computed(() => {
  return pickupDate.value || today;
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
      props.form.pickup_date = today;
    }

    if (!props.form.pickup_time) {
      props.form.pickup_time = "10:00";
    }

    if (!props.form.return_date) {
      props.form.return_date = tomorrowString;
    }
  },
  {
    immediate: true,
    deep: true,
  },
);
</script>