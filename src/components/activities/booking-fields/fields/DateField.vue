<template>
  <v-text-field
    :model-value="value"
    @update:modelValue="updateValue"
    type="date"
    :label="field.label || 'Travel Date'"
    :min="minimumDate"
    :error-messages="error"
    density="comfortable"
    variant="outlined"
    rounded="lg"
    hide-details="auto"
    class="mb-3"
    :required="field.required"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: [String, Date],

  field: {
    type: Object,
    required: true,
  },

  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits([
  "update:modelValue",
]);

const today = new Date().toISOString().split("T")[0];

const minimumDate = computed(() => {
  // Default behaviour
  if (!props.field.min || props.field.min === "today") {
    return today;
  }

  // Static minimum date from schema
  return props.field.min;
});

const value = computed(() => {
  return props.modelValue || today;
});

const updateValue = (val) => {
  emit("update:modelValue", val);
};
</script>