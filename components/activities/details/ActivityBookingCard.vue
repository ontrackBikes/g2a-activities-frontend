<template>
  <div class="sticky-card">
    <v-card variant="outlined" rounded="xl" elevation="0" class="pa-5">
      <div class="mb-4">
        <div class="g2a-text-12 text-greyDark">Starting from</div>

        <div class="d-flex align-end ga-1">
          <span class="g2a-text-28 g2a-text-bold-700 text-brandColor2">
            ₹{{ price }}
          </span>

          <span class="g2a-text-13 text-greyDark mb-1"> / person </span>
        </div>
      </div>

      <v-text-field
        v-model="date"
        type="date"
        label="Select Date"
        density="comfortable"
        variant="outlined"
        rounded="lg"
        hide-details
        class="mb-3"
      />

      <v-select
        v-if="slots.length"
        v-model="slot"
        :items="slots"
        item-title="slot_name"
        item-value="id"
        label="Choose Slot"
        density="comfortable"
        variant="outlined"
        rounded="lg"
        hide-details
        class="mb-3"
      />

      <div
        class="d-flex align-center justify-space-between pa-3 rounded-lg mb-4"
        style="border: 1px solid rgba(0, 0, 0, 0.12)"
      >
        <span class="g2a-text-13 g2a-text-bold-600"> Guests </span>

        <div class="d-flex align-center ga-2">
          <v-btn
            icon
            size="x-small"
            variant="outlined"
            @click="guests > 1 && guests--"
          >
            <v-icon icon="mdi-minus" />
          </v-btn>

          <span class="g2a-text-14 g2a-text-bold-600">
            {{ guests }}
          </span>

          <v-btn icon size="x-small" variant="outlined" @click="guests++">
            <v-icon icon="mdi-plus" />
          </v-btn>
        </div>
      </div>

      <div class="d-flex justify-space-between align-center mb-4">
        <span class="g2a-text-13 g2a-text-bold-600"> Total </span>

        <span class="g2a-text-18 g2a-text-bold-700 text-brandColor2">
          ₹{{ price * guests }}
        </span>
      </div>

      <v-btn block size="large" flat color="brandColor" rounded="xl">
        Check Availability
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  slots: Array,
  price: Number,
});

const date = ref(null);
const slot = ref(null);
const guests = ref(1);
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 90px;
}
</style>
