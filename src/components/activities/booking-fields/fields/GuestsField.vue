<template>
  <v-card class="border" variant="outlined" rounded="lg">
    <div class="pa-2 px-4">
      <div class="d-flex align-center justify-space-between">
        <div>
          <span class="g2a-title-md">
            {{ field.label || "Quantity" }}
          </span>
          <div
            v-if="field.description"
            class="text-greyDark d-flex align-center"
          >
            <div>{{ field.description }}</div>
          </div>
        </div>

        <div class="d-flex align-center ga-2">
          <v-btn
            icon
            size="x-small"
            flat
            :disabled="guestCount <= 1"
            @click="decrease"
          >
            <v-icon>mdi-minus</v-icon>
          </v-btn>

          <span class="g2a-title-lg">
            {{ guestCount }}
          </span>

          <v-btn
            icon
            size="x-small"
            flat
            :disabled="guestCount >= maxAllowed"
            @click="increase"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
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

const guestCount = computed(() => props.modelValue || 1);
const maxAllowed = computed(() => props.maxQuantity || 10);

const increase = () => {
  if (guestCount.value >= maxAllowed.value) return;

  emit("update:modelValue", guestCount.value + 1);
};

const decrease = () => {
  if (guestCount.value <= 1) return;

  emit("update:modelValue", guestCount.value - 1);
};
</script>
