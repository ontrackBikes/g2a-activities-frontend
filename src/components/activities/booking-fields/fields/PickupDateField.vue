<template>
  <v-text-field
    v-model="model"
    type="date"
    label="Pickup Date"
    :min="today"
    :error-messages="error ? [error] : []"
    variant="outlined"
    density="compact"
    hide-details="auto"
    class="mb-3"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,

  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:modelValue",
]);

const today = new Date().toISOString().split("T")[0];

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});
</script>