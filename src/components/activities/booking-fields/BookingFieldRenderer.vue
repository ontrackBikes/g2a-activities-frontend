<template>
  <component
    v-if="fieldComponent"
    :is="fieldComponent"
    :model-value="modelValue"
    :field="field"
    :slots="slots"
    :form="form"
    :serviceHours="serviceHours"
    :error="error"
    :maxQuantity="maxQuantity"
    :locationSlug="locationSlug"
    :productSlug="productSlug"
    @update:modelValue="updateValue"
  />

  <v-alert v-else type="warning" variant="tonal" density="compact">
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

  form: {
    type: Object,
    default: () => ({}),
  },

  serviceHours: {
    type: Array,
    default: () => [],
  },

  error: {
    type: String,
    default: "",
  },
  maxQuantity: {
    type: Number,
    default: 10,
  },

  locationSlug: {
    type: String,
    default: "",
  },
  productSlug: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const fieldComponent = computed(() => {
  return fieldRegistry[props.field.field];
});

const updateValue = (value) => {
  emit("update:modelValue", value);
};
</script>
