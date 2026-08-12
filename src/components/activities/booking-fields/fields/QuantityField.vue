<template>
  <v-card class="border" variant="outlined" rounded="lg">
    <v-container>
      <div class="d-flex align-center justify-space-between">
        <div>
          <span class="g2a-title-md">
            {{ field.label || "Quantity" }}
          </span>
          <div
            v-if="field.description"
            class="text-greyDark d-flex align-center"
          >
            <!-- <v-icon color="info" class="mr-2"> mdi-information </v-icon> -->
            <div>{{ field.description }}</div>
          </div>
          
        </div>

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
    </v-container>
  </v-card>



    <v-card v-if="isBikeRentals" flat class="border my-4" rounded="xl">
      <v-container class="text-primary my-auto d-flex align-center">
         <v-icon class="mr-2">mdi-information</v-icon>  1 Rider + 1 Pillion + 1 Child (less than 5 years old) per scooty.
      </v-container>
    </v-card>

  <!-- <div v-if="field.description" class="text-greyDark my-4 d-flex align-center">
    <v-icon color="info"> mdi-information </v-icon>
    <div class="ml-2">{{ field.description }}</div>
  </div> -->
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
  productTypeSlug: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const minAllowed = computed(() => props.field?.min ?? 1);
const quantityCount = computed(() => props.modelValue || minAllowed.value);
const maxAllowed = computed(() => props.maxQuantity || 10);
const isBikeRentals = computed(() => props.productTypeSlug === "bike-rentals");

const increase = () => {
  if (quantityCount.value >= maxAllowed.value) return;

  emit("update:modelValue", quantityCount.value + 1);
};

const decrease = () => {
  if (quantityCount.value <= minAllowed.value) return;

  emit("update:modelValue", quantityCount.value - 1);
};
</script>
