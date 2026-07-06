<template>
  <div
    class="d-flex align-center justify-space-between pa-3 rounded-lg mb-4"
    style="border:1px solid rgba(0,0,0,.12)"
  >
    <span class="g2a-text-13 g2a-text-bold-600">
      {{ field.label || "Quantity" }}
    </span>

    <div class="d-flex align-center ga-2">
      <v-btn
        icon
        size="x-small"
        variant="outlined"
        @click="decrease"
      >
        <v-icon>mdi-minus</v-icon>
      </v-btn>

      <span class="g2a-text-15 g2a-text-bold-700">
        {{ guestCount }}
      </span>

      <v-btn
        icon
        size="x-small"
        variant="outlined"
        @click="increase"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </div>
  </div>
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

const emit = defineEmits([
  "update:modelValue",
]);

const guestCount = computed(() => props.modelValue || 1);

const increase = () => {
  if(guestCount.value >= props.maxQuantity) {
    alert("Max Allowed Reached")
    return
  }
  
  emit(
    "update:modelValue",
    Number(guestCount.value + 1),
  );
};

const decrease = () => {
  if (guestCount.value <= 1) return;

  emit(
    "update:modelValue",
    guestCount.value - 1,
  );
};
</script>