<template>
  <div class="sticky-card">
    <!-- Loading skeleton -->
    <v-card
      v-if="loading"
      rounded="lg"
      variant="outlined"
      elevation="0"
      class=""
    >
      <v-card-item class="pa-5">
        <template #prepend>
          <v-skeleton-loader type="avatar" width="60" height="60" />
        </template>
        <v-skeleton-loader type="heading" class="mb-2" />
        <v-skeleton-loader type="text" width="60%" />
      </v-card-item>
      <v-divider />
      <v-card-text>
        <v-skeleton-loader type="list-item-two-line@3" />
      </v-card-text>
      <v-divider />
      <v-card-text>
        <v-skeleton-loader type="button" height="48" />
      </v-card-text>
    </v-card>

    <!-- Quote card -->
    <v-card
      v-else-if="quote"
      rounded="lg"
      variant="outlined"
      elevation="0"
      class=""
    >
      <!-- Product -->
      <v-card-item class="pa-5">
        <template #prepend>
          <v-avatar rounded="lg" size="60" class="g2a-rounded-border">
            <v-img
              :src="quote.product?.thumbnail_url"
              :alt="quote.product?.name || 'Product image'"
              cover
            >
              <template #error>
                <div
                  class="d-flex align-center justify-center fill-height bg-grey-lighten-3"
                >
                  <v-icon color="grey" size="24">mdi-image-off-outline</v-icon>
                </div>
              </template>
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate size="20" width="2" />
                </div>
              </template>
            </v-img>
          </v-avatar>
        </template>

        <v-card-title
          class="g2a-title-xl  truncate-two-lines"
        >
          {{ quote.product?.name || "Selected activity" }}
        </v-card-title>

        <v-card-subtitle
          v-if="quote.location?.name"
          class="g2a-title-2xl-2-light text-greyDark"
        >
          <v-icon size="14" class="mr-1">mdi-map-marker-outline</v-icon>
          {{ quote.location.name }}
        </v-card-subtitle>
      </v-card-item>

      <v-divider />

      <!-- Important details -->
      <v-card-text v-if="bookingRows.length || selectedSlot" class="pb-0">
        <div
          v-for="item in bookingRows.slice(0, 3)"
          :key="item.label"
          class="d-flex justify-space-between mb-3"
        >
          <span class="text-greyDark g2a-title-2xl-2">{{ item.label }}</span>
          <span class=" text-right">{{ item.value }}</span>
        </div>

        <div v-if="selectedSlot" class="d-flex justify-space-between mb-3">
          <span class="text-greyDark g2a-title-2xl-2">
            {{ selectedSlot.slot_type === "TIME" ? "Time" : "Variant" }}
          </span>

          <span class=" text-right">
            <template v-if="selectedSlot.slot_type === 'TIME'">
              {{ selectedSlot.start_time }} - {{ selectedSlot.end_time }}
            </template>
            <template v-else>
              {{ selectedSlot.name }}
            </template>
          </span>
        </div>
      </v-card-text>

      <!-- More details -->
      <v-expansion-panels
        v-if="hasMoreDetails"
        flat
        variant="accordion"
        class="no-padding-title"
      >
        <v-expansion-panel>
          <v-expansion-panel-title class="g2a-title-2xl-2 text-greyDark">
            More details
          </v-expansion-panel-title>

          <v-expansion-panel-text>
            <!-- Remaining booking rows -->

            <div
              v-for="item in bookingRows.slice(3)"
              :key="item.label"
              class="d-flex justify-space-between mb-2"
            >
              <span class="g2a-title-2xl-2 text-greyDark">{{
                item.label
              }}</span>
              <strong class="g2a-title-2xl-2 text-right">{{
                item.value
              }}</strong>
            </div>

            <v-divider v-if="dailyPricing.length" class="my-4" />

            <!-- Daily pricing -->
            <template v-if="dailyPricing.length">
              <div class=" g2a-title-2xl-2 mb-3">
                Daily pricing
              </div>

              <div
                v-for="day in previewDailyPricing"
                :key="day.date"
                class="d-flex justify-space-between mb-2"
              >
                <span class="g2a-title-2xl-2 text-greyDark">{{
                  formatDate(day.date)
                }}</span>
                <strong class="g2a-title-2xl-2">{{
                  formatCurrency(day.unit_price)
                }}</strong>
              </div>

              <button
                v-if="hasMorePricing"
                type="button"
                class="g2a-link g2a-title-2xl-2 bg-transparent border-0 pa-0"
                @click.stop="pricingDialog = true"
              >
                View all {{ dailyPricing.length }} days
              </button>
            </template>

            <v-divider class="my-4" />

            <!-- Price breakdown -->
            <div class="d-flex justify-space-between mb-2">
              <span class="g2a-title-2xl-2 text-greyDark">
                Subtotal{{
                  pricing.quantity > 1 ? ` (x${pricing.quantity})` : ""
                }}
              </span>
              <strong class="g2a-title-2xl-2">{{
                formatCurrency(pricing.subtotal)
              }}</strong>
            </div>

            <div
              v-if="pricing.discount"
              class="d-flex justify-space-between mb-2"
            >
              <span class="g2a-title-2xl-2 text-greyDark">Discount</span>
              <strong class="g2a-title-2xl-2 text-success">
                -{{ formatCurrency(pricing.discount) }}
              </strong>
            </div>

            <div v-if="pricing.tax" class="d-flex justify-space-between">
              <span class="g2a-title-2xl-2 text-greyDark"
                >Taxes &amp; fees</span
              >
              <strong class="g2a-title-2xl-2">{{
                formatCurrency(pricing.tax)
              }}</strong>
            </div>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>

      <v-divider />

      <!-- Error -->
      <v-card-text v-if="error" class="pb-0">
        <v-alert
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="g2a-title-2xl-2"
          role="alert"
        >
          {{ error }}
        </v-alert>
      </v-card-text>

      <!-- Total -->
      <v-card-text>
        <div class="d-flex justify-space-between align-center mb-1">
          <span class="">Total payable</span>

          <div class="text-right">
            <div
              v-if="pricing.discount"
              class="g2a-title-2xl-2 text-greyDark text-decoration-line-through"
            >
              {{ formatCurrency(pricing.subtotal + pricing.tax) }}
            </div>
            <div class="g2a-title-xl text-brandColor2">
              {{ formatCurrency(pricing.grand_total) }}
            </div>
          </div>
        </div>

        <div
          v-if="pricing.tax"
          class="g2a-text-caption text-greyDark text-right mb-3"
        >
          Inclusive of taxes &amp; fees
        </div>

        <v-btn
          flat
          block
          rounded="lg"
          color="brandColor"
          class="mt-3"
          size="large"
          :loading="submitting"
          :disabled="!canProceed"
          aria-label="Continue to payment"
          @click="$emit('proceed')"
        >
          Continue to Payment
        </v-btn>

        <div
          class="d-flex align-center justify-center g2a-text-caption text-greyDark mt-3"
        >
          <v-icon size="14" class="mr-1">mdi-shield-check-outline</v-icon>
          Secure checkout
        </div>
      </v-card-text>
    </v-card>

    <!-- Empty / no quote state -->
    <v-card v-else rounded="lg" variant="outlined" elevation="0" class="">
      <v-card-text class="text-center py-10">
        <v-icon size="40" color="grey">mdi-receipt-text-outline</v-icon>
        <div class="g2a-text-16 text-medium-emphasis mt-2">
          {{ error || "No booking summary available." }}
        </div>
      </v-card-text>
    </v-card>
  </div>

  <!-- Full daily pricing dialog -->
  <v-dialog v-model="pricingDialog" scrollable max-width="450">
    <v-card rounded="lg">
      <div class="pa-4 d-flex align-center justify-space-between">
        <div class="g2a-title">Daily Pricing</div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="large"
          aria-label="Close daily pricing"
          @click="pricingDialog = false"
        />
      </div>

      <v-divider />

      <v-list class="no-scrollbar" style="max-height: 360px; overflow-y: auto">
        <v-list-item v-for="day in dailyPricing" :key="day.date">
          <template #title>
            <span class="g2a-title-2xl-2">{{ formatDate(day.date) }}</span>
          </template>

          <template #append>
            <strong class="g2a-title-2xl-2">{{
              formatCurrency(day.unit_price)
            }}</strong>
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <div class="pa-2">
        <v-btn
          block
          color="primary"
          variant="text"
          @click="pricingDialog = false"
        >
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
    default: null,
  },
  submitting: {
    type: Boolean,
    default: false,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  error: {
    type: String,
    default: "",
  },
});

const pricingDialog = ref(false);

/*
|--------------------------------------------------------------------------
| Quote
|--------------------------------------------------------------------------
*/

const booking = computed(() => props.quote?.booking || {});

const pricing = computed(() => ({
  currency: "INR",
  quantity: 1,
  unit_price: 0,
  subtotal: 0,
  discount: 0,
  tax: 0,
  grand_total: 0,
  ...props.quote?.pricing,
}));

const availability = computed(() => ({
  slots: [],
  daily_pricing: [],
  selected_slot: null,
  ...props.quote?.availability,
}));

const selectedSlot = computed(() => availability.value.selected_slot);

const dailyPricing = computed(() => availability.value.daily_pricing || []);

const previewDailyPricing = computed(() => dailyPricing.value.slice(0, 3));

const hasMorePricing = computed(() => dailyPricing.value.length > 3);

const canProceed = computed(() => {
  return Boolean(props.quote) && pricing.value.grand_total > 0 && !props.error;
});

/*
|--------------------------------------------------------------------------
| Booking Details
|--------------------------------------------------------------------------
*/

const ROW_LABELS = {
  travel_date: "Travel Date",
  pickup_date: "Pickup Date",
  pickup_time: "Pickup Time",
  return_date: "Return Date",
  drop_time: "Return Time",
  rental_days: "Rental Days",
  guests: "Guests",
};

const fieldLabels = computed(() => {
  const fields =
    props.quote?.product?.bookingTemplate?.product_page_schema?.fields || [];

  return fields.reduce((acc, field) => {
    acc[field.field] = field.label || prettyLabel(field.field);
    return acc;
  }, {});
});

const ROW_ORDER = Object.keys(ROW_LABELS);

const bookingRows = computed(() => {
  return Object.entries(booking.value)
    .filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    )
    .sort(([a], [b]) => {
      const indexA = ROW_ORDER.indexOf(a);
      const indexB = ROW_ORDER.indexOf(b);

      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;

      return indexA - indexB;
    })
    .map(([key, value]) => ({
      label: fieldLabels.value[key] || ROW_LABELS[key] || prettyLabel(key),
      value: key.includes("date") ? formatDate(value) : value,
    }));
});

const hasMoreDetails = computed(() => {
  return bookingRows.value.length > 3 || dailyPricing.value.length > 0;
});

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "-";

  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: pricing.value.currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
};

const prettyLabel = (value) => {
  return value
    .replaceAll("_", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

defineExpose({ formatCurrency, formatDate });
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 24px;
  z-index: 1;
}

@media (max-width: 960px) {
  .sticky-card {
    position: static;
    top: auto;
  }
}
</style>
