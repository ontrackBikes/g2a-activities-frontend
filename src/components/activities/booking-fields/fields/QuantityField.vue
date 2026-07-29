<template>
  <v-card class="border" variant="outlined" rounded="lg">
    <div class="pa-2 px-4">
      <div class="d-flex align-center justify-space-between">
        <span class="g2a-title-md">
          {{ field.label || "Quantity" }}
        </span>

        <div class="d-flex align-center ga-2">
          <v-btn
            icon
            size="x-small"
            flat
            :disabled="quantityCount <= minAllowed"
            @click="decrease"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>

          <span class="g2a-title-lg">
            {{ quantityCount }}
          </span>

          <v-btn
            icon
            size="x-small"
            flat
            :disabled="quantityCount >= maxAllowed"
            @click="increase"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-if="field.description" class="text-caption text-greyDark mt-1">
        {{ field.description }}
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Number,
    default: 1,
  },
  field: {
    type: Object,
    required: true,
  },
  maxQuantity: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["update:modelValue"]);

const minAllowed = computed(() => props.field?.min ?? 1);
const quantityCount = computed(() => props.modelValue || minAllowed.value);
const maxAllowed = computed(() => props.maxQuantity || 10);

const increase = () => {
  if (quantityCount.value >= maxAllowed.value) return;

  emit("update:modelValue", quantityCount.value + 1);
};

const decrease = () => {
  if (quantityCount.value <= minAllowed.value) return;

  emit("update:modelValue", quantityCount.value - 1);
};
</script>
