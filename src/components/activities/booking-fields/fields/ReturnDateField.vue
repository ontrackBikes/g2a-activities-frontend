<template>
  <v-text-field
    v-model="model"
    type="date"
    label="Return Date"
    variant="outlined"
    density="comfortable"
    hide-details
    class="mb-3"
  />
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: String,
});

const emit = defineEmits([
  "update:modelValue",
]);

const model = computed({
  get: () => props.modelValue,
  set: (v) =>
    emit("update:modelValue", v),
});
</script>