<template>
  <v-row>
    <v-col>
      <v-text-field
        v-model="pickupDate"
        type="date"
        label="Pickup Date"
        :min="today"
        :error-messages="error ? [error] : []"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        class="mb-3"
      />
    </v-col>
    <v-col>
      <v-text-field
        v-model="returnDate"
        type="date"
        label="Drop Date"
        :min="minimumReturnDate"
        :error-messages="error ? [error] : []"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
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

const pickupDate = computed({
  get() {
    return props.form.pickup_date || today;
  },
  set(value) {
    props.form.pickup_date = value;
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
