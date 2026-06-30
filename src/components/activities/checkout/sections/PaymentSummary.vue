<template>
  <v-card rounded="lg" variant="outlined" elevation="0">
    <v-card-title class="py-4">
      <div class="g2a-subtitle">Booking Summary</div>
    </v-card-title>

    <v-divider />

    <v-card-text>
      <!-- Product -->

      <div class="d-flex align-center mb-5">
        <v-avatar rounded="lg" size="58" class="mr-3">
          <v-img :src="booking.product?.thumbnail_url" cover />
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

      <!-- Travel Date -->

      <div v-if="bookingInfo.travel_date" class="summary-row">
        <span>Travel Date</span>

        <strong>
          {{ formatDate(bookingInfo.travel_date) }}
        </strong>
      </div>

      <!-- Pickup -->

      <div v-if="bookingInfo.pickup_date" class="summary-row">
        <span>Pickup</span>

        <strong>
          {{ formatDate(bookingInfo.pickup_date) }}
        </strong>
      </div>

      <!-- Return -->

      <div v-if="bookingInfo.return_date" class="summary-row">
        <span>Return</span>

        <strong>
          {{ formatDate(bookingInfo.return_date) }}
        </strong>
      </div>

      <!-- Rental Days -->

      <div v-if="bookingInfo.rental_days" class="summary-row">
        <span>Rental Days</span>

        <strong>
          {{ bookingInfo.rental_days }}
        </strong>
      </div>

      <!-- Guests -->

      <div v-if="pricing.quantity" class="summary-row">
        <span>Guests</span>

        <strong>
          {{ pricing.quantity }}
        </strong>
      </div>

      <v-divider class="my-5" />

      <!-- Pricing -->

      <div class="summary-row">
        <span>
          ₹{{ currency(pricing.unit_price) }}

          ×

          {{ pricing.quantity }}
        </span>

        <strong> ₹{{ currency(pricing.subtotal) }} </strong>
      </div>

      <div v-if="pricing.discount > 0" class="summary-row">
        <span>Discount</span>

        <strong class="text-success">
          - ₹{{ currency(pricing.discount) }}
        </strong>
      </div>

      <div v-if="pricing.tax > 0" class="summary-row">
        <span>Taxes</span>

        <strong> ₹{{ currency(pricing.tax) }} </strong>
      </div>

      <v-divider class="my-5" />

      <div class="summary-row total-row">
        <span>Total Payable</span>

        <div class="g2a-title text-brandColor2">
          ₹{{ currency(pricing.grand_total) }}
        </div>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useRouter } from "vue-router";
import { bookingStore } from "@/store/booking";

const router = useRouter();

const booking = bookingStore;

/**
 * Quote returned from
 * POST /check-available
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

const currency = (value) => {
  return Number(value || 0).toLocaleString("en-IN");
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const proceed = () => {
  router.push({
    name: "Payment",
  });
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
