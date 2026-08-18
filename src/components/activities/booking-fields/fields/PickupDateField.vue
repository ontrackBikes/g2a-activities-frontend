<template>
  <v-text-field
    v-model="model"
    type="date"
    label="Pickup Date"
    :min="today"
    :rules="rules"
    variant="outlined"
    density="compact"
    hide-details="auto"
    :hint="field.description || undefined"
    :persistent-hint="!!field.description"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,

  field: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

const today = new Date().toISOString().split("T")[0];

const model = computed({
  get: () => props.modelValue,
  set: (v) => emit("update:modelValue", v),
});

const rules = computed(() => {
  if (!props.field?.required) return [];

  return [(v) => !!v || "Pickup date is required"];
});
</script>
