<template>
  <v-card rounded="lg" variant="outlined" elevation="0" v-if="quote">
    <!-- Product -->

    <v-card-item>
      <template #prepend>
        <v-avatar rounded="lg" size="58">
          <v-img :src="quote.product?.thumbnail_url" cover />
        </v-avatar>
      </template>

      <v-card-title class="g2a-text-bold-700">
        {{ quote.product?.name }}
      </v-card-title>

      <v-card-subtitle>
        {{ quote.location?.name }}
      </v-card-subtitle>
    </v-card-item>

    <v-divider />

    <v-card-text>
      <!-- Booking -->

      <div class="g2a-text-bold-600 mb-3">Booking Details</div>

      <div
        v-for="item in bookingRows"
        :key="item.label"
        class="d-flex justify-space-between"
      >
        <span>{{ item.label }}</span>
        <strong>{{ item.value }}</strong>
      </div>

      <!-- Selected Slot -->

      <template v-if="selectedSlot">
        <v-divider class="my-5" />

        <div class="g2a-text-bold-600 mb-3">Selected Slot</div>

        <div class="d-flex justify-space-between">
          <span>Time</span>

          <strong>
            {{ selectedSlot.start_time }}
            -
            {{ selectedSlot.end_time }}
          </strong>
        </div>
      </template>

      <!-- Daily Pricing -->

      <template v-if="dailyPricing.length">
        <v-divider class="my-5" />

        <div class="g2a-text-bold-600">Daily Pricing</div>

        <div
          v-for="day in previewDailyPricing"
          :key="day.date"
          class="d-flex justify-space-between mb-2"
        >
          <span>{{ formatDate(day.date) }}</span>

          <strong> ₹{{ currency(day.unit_price) }} </strong>
        </div>

        <div
          class="g2a-link"
          v-if="hasMorePricing"
          variant="text"
          size="small"
          color="primary"
          @click="pricingDialog = true"
        >
          View All ({{ dailyPricing.length }})
        </div>
      </template>
      <!-- Price -->

      <v-divider class="my-5" />

      <div class="g2a-text-bold-600 mb-3">Price Summary</div>

      <div class="d-flex justify-space-between">
        <span>Unit Price</span>
        <strong>₹{{ currency(pricing.unit_price) }}</strong>
      </div>

      <div class="d-flex justify-space-between">
        <span>Quantity</span>
        <strong>{{ pricing.quantity }}</strong>
      </div>

      <div class="d-flex justify-space-between">
        <span>Subtotal</span>
        <strong>₹{{ currency(pricing.subtotal) }}</strong>
      </div>

      <div v-if="pricing.discount" class="d-flex justify-space-between">
        <span>Discount</span>

        <strong class="text-success">
          - ₹{{ currency(pricing.discount) }}
        </strong>
      </div>

      <div v-if="pricing.tax" class="d-flex justify-space-between">
        <span>Tax</span>

        <strong> ₹{{ currency(pricing.tax) }} </strong>
      </div>

      <v-divider class="my-5" />

      <div class="d-flex justify-space-between align-center">
        <div>
          <div class="g2a-text-bold-700">Total Payable</div>

          <div class="g2a-text-12 text-medium-emphasis">
            Inclusive of all taxes
          </div>
        </div>

        <div class="g2a-title text-brandColor2">
          ₹{{ currency(pricing.grand_total) }}
        </div>
      </div>

      <v-btn
        block
        flat
        rounded="xl"
        size="large"
        color="brandColor"
        class="mt-6"
        @click="$emit('proceed')"
      >
        Continue to Payment
      </v-btn>
    </v-card-text>
  </v-card>
  <v-dialog v-model="pricingDialog" scrollable max-width="450">
    <v-card>
      <div class="pa-4">
        <div class="g2a-title">
          Daily Pricing
        </div>
      </div>

      <v-list>
        <v-list-item v-for="day in dailyPricing" :key="day.date">
          <template #title>
            {{ formatDate(day.date) }}
          </template>

          <template #append> ₹{{ currency(day.unit_price) }} </template>
        </v-list-item>
      </v-list>
      <v-spacer />
      <div class="pa-2">
        <v-btn block color="primary" variant="text" @click="pricingDialog = false">
        Close
      </v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref } from "vue";

defineEmits(["proceed"]);

const props = defineProps({
  quote: {
    type: Object,
    default: () => ({}),
  },
});

const pricingDialog = ref(false);

const previewDailyPricing = computed(() => {
  return dailyPricing.value.slice(0, 3);
});

const hasMorePricing = computed(() => {
  return dailyPricing.value.length > 3;
});

/*
|--------------------------------------------------------------------------
| Quote
|--------------------------------------------------------------------------
*/

const booking = computed(() => props.quote.booking || {});

const pricing = computed(() => ({
  currency: "INR",
  quantity: 1,
  unit_price: 0,
  subtotal: 0,
  discount: 0,
  tax: 0,
  grand_total: 0,
  ...props.quote.pricing,
}));

const availability = computed(() => ({
  slots: [],
  daily_pricing: [],
  selected_slot: null,
  ...props.quote.availability,
}));

const selectedSlot = computed(() => {
  return availability.value.selected_slot;
});

const dailyPricing = computed(() => {
  return availability.value.daily_pricing || [];
});

/*
|--------------------------------------------------------------------------
| Booking Details
|--------------------------------------------------------------------------
*/

const bookingRows = computed(() => {
  const labels = {
    travel_date: "Travel Date",
    pickup_date: "Pickup Date",
    return_date: "Return Date",
    rental_days: "Rental Days",
    guests: "Guests",
  };

  return Object.entries(booking.value)
    .filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    )
    .map(([key, value]) => ({
      label: labels[key] || pretty(key),
      value: key.includes("date") ? formatDate(value) : value,
    }));
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

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
