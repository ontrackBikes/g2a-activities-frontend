<template>
  <v-select
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :items="slots"
    item-title="slot_name"
    item-value="id"
    :label="field.label || 'Select Slot'"
    density="compact"
    variant="outlined"
    rounded="lg"
    :rules="rules"
    hide-details="auto"
    :required="field.required"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: [Number, String],

  slots: {
    type: Array,
    default: () => [],
  },

  field: {
    type: Object,
    required: true,
  },
});

defineEmits(["update:modelValue"]);

// Self-contained validation: only add a required rule when the backend
// schema actually marks this field as required, so v-form picks it up
// automatically without any parent-side error bookkeeping.
const rules = computed(() => {
  if (!props.field.required) return [];

  return [(v) => !!v || `${props.field.label || "Slot"} is required`];
});
</script>
