<template>
  <component
    v-if="fieldComponent"
    :is="fieldComponent"
    :model-value="modelValue"
    :field="field"
    :slots="slots"
    @update:modelValue="updateValue"
  />

  <v-alert
    v-else
    type="warning"
    variant="tonal"
    density="compact"
  >
    Unknown booking field:
    <strong>{{ field.field }}</strong>
  </v-alert>
</template>

<script setup>
import { computed } from "vue";

import fieldRegistry from "./fieldRegistry";

const props = defineProps({
  field: {
    type: Object,
    required: true,
  },

  modelValue: {
    required: true,
  },

  slots: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits([
  "update:modelValue",
]);

const fieldComponent = computed(() => {
  return fieldRegistry[props.field.field];
});

const updateValue = (value) => {
  emit("update:modelValue", value);
};
</script>