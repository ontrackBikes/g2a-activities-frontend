<template>
  <v-card class="border" variant="outlined" rounded="lg">
    <div class="pa-2 px-4">
      <div class="d-flex align-center justify-space-between">
        <div>
          <span class="g2a-title-md">
            {{ field.label || "Number of Guests" }}
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
            :disabled="guestCount >= maxGuests"
            @click="increase"
          >
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>

      <div v-if="perQtyGuests > 1" class="text-greyDark text-caption mt-1">
        <template v-if="perQtyDescription">{{ perQtyDescription }}</template>
        <template v-else>
          {{ derivedQuantity }}
          {{ derivedQuantity === 1 ? unitLabel : unitLabelPlural }} will be
          allocated for up to {{ capacity }}
          {{ capacity === 1 ? "guest" : "guests" }}. You will receive a
          confirmation call.
        </template>
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

const perQtyGuests = computed(() => props.field?.config?.per_qty_guests || 1);
const unitLabel = computed(() => props.field?.config?.unit_label || "unit");
const unitLabelPlural = computed(() => `${unitLabel.value}s`);
const perQtyDescription = computed(
  () => props.field?.config?.per_qty_description || null,
);
const guestCount = computed(() => props.modelValue || 1);
const maxGuests = computed(() => (props.maxQuantity || 10) * perQtyGuests.value);
const derivedQuantity = computed(() =>
  Math.ceil(guestCount.value / perQtyGuests.value),
);
const capacity = computed(() => derivedQuantity.value * perQtyGuests.value);

const increase = () => {
  if (guestCount.value >= maxGuests.value) return;

  emit("update:modelValue", guestCount.value + 1);
};

const decrease = () => {
  if (guestCount.value <= 1) return;

  emit("update:modelValue", guestCount.value - 1);
};
</script>
