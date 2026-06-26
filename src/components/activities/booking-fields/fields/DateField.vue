<template>
  <v-text-field
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    type="date"
    :label="field.label || 'Travel Date'"
    density="comfortable"
    variant="outlined"
    rounded="lg"
    hide-details
    class="mb-3"
    :required="field.required"
  />
</template>

<script setup>
defineProps({
  modelValue: [String, Date],

  field: {
    type: Object,
    required: true,
  },
});

defineEmits([
  "update:modelValue",
]);
</script>