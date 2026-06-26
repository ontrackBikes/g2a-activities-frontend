<template>
  <v-select
    :model-value="modelValue"
    @update:modelValue="$emit('update:modelValue', $event)"
    :items="slots"
    item-title="slot_name"
    item-value="id"
    :label="field.label || 'Select Slot'"
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

defineEmits([
  "update:modelValue",
]);
</script>