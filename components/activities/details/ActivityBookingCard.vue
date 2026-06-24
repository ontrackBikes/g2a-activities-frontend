<template>
  <v-card
    variant="outlined"
    class="sticky-card"
  >
    <v-card-text>

      <div class="g2a-subtitle mb-4">
        Book Your Ticket
      </div>

      <v-text-field
        v-model="date"
        type="date"
        label="Date"
      />

      <v-select
        v-if="slots.length"
        v-model="slot"
        :items="slots"
        item-title="slot_name"
        item-value="id"
        label="Slot"
      />

      <v-text-field
        v-model="guests"
        type="number"
        label="Guests"
      />

      <div class="d-flex justify-space-between mt-4">
        <div>
          <div class="g2a-text-20 font-weight-bold">
            ₹{{ price }}
          </div>

          <div class="text-caption">
            Starting Price
          </div>
        </div>

        <v-btn
          color="primary"
          size="large"
        >
          Check Availability
        </v-btn>
      </div>

    </v-card-text>
  </v-card>
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