<template>
  <v-card rounded="lg" variant="outlined" elevation="0">
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        Booking Summary
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <!-- Product -->

      <div class="d-flex align-center mb-5">
        <v-avatar
          rounded="lg"
          size="58"
          class="mr-3"
        >
          <v-img
            :src="booking.product?.thumbnail_url"
            cover
          />
        </v-avatar>

        <div>
          <div class="g2a-text-bold-600">
            {{ booking.product?.name }}
          </div>

          <div class="g2a-text-13 text-greyDark">
            {{ location.name || "-" }}
          </div>
        </div>
      </div>

      <v-divider class="mb-5" />

      <!-- Booking Details -->

      <div
        v-for="item in bookingRows"
        :key="item.label"
        class="summary-row"
      >
        <span>{{ item.label }}</span>

        <strong>{{ item.value }}</strong>
      </div>

      <v-divider class="my-5" />

      <!-- Pricing -->

      <div class="summary-row">
        <span>Unit Price</span>

        <strong>
          ₹{{ currency(pricing.unit_price) }}
        </strong>
      </div>

      <div class="summary-row">
        <span>Quantity</span>

        <strong>
          {{ pricing.quantity }}
        </strong>
      </div>

      <div class="summary-row">
        <span>Subtotal</span>

        <strong>
          ₹{{ currency(pricing.subtotal) }}
        </strong>
      </div>

      <div
        v-if="pricing.discount"
        class="summary-row"
      >
        <span>Discount</span>

        <strong class="text-success">
          - ₹{{ currency(pricing.discount) }}
        </strong>
      </div>

      <div
        v-if="pricing.tax"
        class="summary-row"
      >
        <span>Taxes</span>

        <strong>
          ₹{{ currency(pricing.tax) }}
        </strong>
      </div>

      <v-divider class="my-5" />

      <div class="summary-row total-row">
        <span>Total Payable</span>

        <div class="g2a-title text-brandColor2">
          ₹{{ currency(pricing.grand_total) }}
        </div>
      </div>

      <v-btn
        block
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
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

defineEmits(["proceed"]);

const booking = bookingStore;

/**
 * Availability quote
 */

const quote = computed(() => {
  return booking.form?.availability || {};
});

const bookingInfo = computed(() => {
  return quote.value.booking || {};
});

const location = computed(() => {
  return quote.value.location || {};
});

const pricing = computed(() => {
  return (
    quote.value.pricing || {
      quantity: 1,
      unit_price: 0,
      subtotal: 0,
      discount: 0,
      tax: 0,
      grand_total: 0,
    }
  );
});

/**
 * Booking rows
 */

const bookingRows = computed(() => {
  const rows = [];

  const labels = {
    travel_date: "Travel Date",
    pickup_date: "Pickup Date",
    return_date: "Return Date",
    rental_days: "Rental Days",
    guests: "Guests",
    slot: "Slot",
    pickup_location: "Pickup Location",
    drop_location: "Return Location",
    pickup_time: "Pickup Time",
    return_time: "Return Time",
    vehicle: "Vehicle",
  };

  Object.entries(bookingInfo.value).forEach(([key, value]) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return;
    }

    let display = value;

    if (key.includes("date")) {
      display = formatDate(value);
    }

    rows.push({
      label: labels[key] || pretty(key),
      value: display,
    });
  });

  return rows;
});

/**
 * Helpers
 */

const currency = (value) => {
  return Number(value || 0).toLocaleString("en-IN");
};

const pretty = (value) => {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString(
    "en-IN",
    {
      day: "numeric",
      month: "short",
      year: "numeric",
    }
  );
};
</script>

<style scoped>
.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.summary-row span:first-child {
  color: rgba(0, 0, 0, 0.65);
}

.total-row {
  font-weight: 700;
}

.v-avatar {
  border: 1px solid rgba(0, 0, 0, 0.08);
}
</style>