<template>
  <v-dialog
    :model-value="modelValue"
    max-width="650"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card rounded="xl">
      <!-- Header -->

      <v-card-title class="py-5">
        <div class="d-flex align-center">
          <v-icon color="success" size="30" class="me-3">
            mdi-check-circle
          </v-icon>

          <div>
            <div class="g2a-subtitle">Available for Booking</div>

            <div class="g2a-text-13 text-medium-emphasis mt-1">
              Your selected activity is available.
            </div>
          </div>
        </div>
      </v-card-title>

      <v-divider />

      <v-card-text class="pt-6">
        <!-- Product -->

        <div class="mb-5">
          <div class="g2a-text-bold-700 g2a-text-18">
            {{ quote.product?.name }}
          </div>

          <div class="g2a-text-13 text-medium-emphasis mt-1">
            {{ quote.location?.name }}
          </div>
        </div>

        <v-divider class="mb-5" />

        <!-- Booking -->

        <div class="g2a-text-bold-600 mb-3">Booking Details</div>

        <div v-for="item in bookingRows" :key="item.label" class="summary-row">
          <span>{{ item.label }}</span>

          <strong>{{ item.value }}</strong>
        </div>

        <v-divider class="my-5" />

        <!-- Slots -->

        <div v-if="slots.length" class="mb-5">
          <div class="g2a-text-bold-600 mb-3">Available Slots</div>

          <v-card
            class="my-2"
            variant="outlined"
            v-for="slot in slots"
            :key="slot.name"
          >
            <v-container>
              <div>
                <div>
                  {{ slot.name }}

                  ·

                  {{ slot.start_time }}

                  -

                  {{ slot.end_time }}
                </div>

                <div>
                  ₹{{ currency(slot.price) }}

                  ·

                  <span
                    :class="{
                      'text-success': slot.available > 1,
                      'text-warning': slot.available <= 1,
                    }"
                  >
                    {{ slot.available }} seat<span v-if="slot.available > 1">s</span> left
                  </span>
                </div>
              </div>
            </v-container>
          </v-card>
        </div>

        <v-divider class="my-5" />

        <!-- Pricing -->

        <div class="g2a-text-bold-600 mb-3">Price Summary</div>

        <div class="summary-row">
          <span>Unit Price</span>

          <strong> ₹{{ currency(pricing.unit_price) }} </strong>
        </div>

        <div class="summary-row">
          <span>Quantity</span>

          <strong>
            {{ pricing.quantity }}
          </strong>
        </div>

        <div class="summary-row">
          <span>Subtotal</span>

          <strong> ₹{{ currency(pricing.subtotal) }} </strong>
        </div>

        <div v-if="pricing.discount" class="summary-row">
          <span>Discount</span>

          <strong class="text-success">
            - ₹{{ currency(pricing.discount) }}
          </strong>
        </div>

        <div v-if="pricing.tax" class="summary-row">
          <span>Taxes</span>

          <strong> ₹{{ currency(pricing.tax) }} </strong>
        </div>

        <v-divider class="my-5" />

        <div class="summary-row">
          <span class="g2a-text-bold-700"> Total </span>

          <div class="g2a-title text-brandColor2">
            ₹{{ currency(pricing.grand_total) }}
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <v-card-actions class="pa-4">
        <v-btn variant="text" @click="emit('update:modelValue', false)">
          Cancel
        </v-btn>

        <v-spacer />

        <v-btn color="brandColor" rounded="xl" @click="emit('continue')">
          Continue Booking
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: Boolean,

  quote: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "continue"]);

const booking = computed(() => {
  return props.quote.booking || {};
});

const pricing = computed(() => {
  return props.quote.pricing || {};
});

const slots = computed(() => {
  return props.quote.availability?.slots || [];
});

const bookingRows = computed(() => {
  const labels = {
    travel_date: "Travel Date",
    guests: "Guests",
    pickup_date: "Pickup Date",
    return_date: "Return Date",
    rental_days: "Rental Days",
  };

  return Object.entries(booking.value)
    .filter(([, value]) => value !== null && value !== "")
    .map(([key, value]) => ({
      label: labels[key] || pretty(key),
      value: key.includes("date") ? formatDate(value) : value,
    }));
});

const currency = (value) => {
  return Number(value || 0).toLocaleString("en-IN");
};

const pretty = (value) => {
  return value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};
</script>

<style scoped>
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.summary-row span:first-child {
  color: rgba(0, 0, 0, 0.65);
}
</style>
