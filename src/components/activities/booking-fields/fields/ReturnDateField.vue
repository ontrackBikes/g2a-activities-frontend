<template>
  <v-text-field
    v-model="model"
    type="date"
    label="Return Date"
    :min="minimumDate"
    variant="outlined"
    density="compact"
    hide-details="auto"
    class="mb-3"
    :error-messages="error ? [error] : []"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,

  form: {
    type: Object,
    required: true,
  },

  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const today = new Date().toISOString().split("T")[0];

const minimumDate = computed(() => {
  return props.form.pickup_date || today;
});

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>
