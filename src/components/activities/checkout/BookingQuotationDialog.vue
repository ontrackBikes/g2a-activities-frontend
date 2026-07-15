<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    width="600"
    persistent
    scrollable
    :fullscreen="mobile"
    transition="dialog-bottom-transition"
    scrim="rgba(15,23,42,.30)"
    :style="{
      backdropFilter: 'blur(5px)',
      webkitBackdropFilter: 'blur(5px)',
    }"
  >
    <v-card rounded="lg" :loading="selectingSlot">
      <!-- Header -->

      <v-card-item class="py-4">
        <template #prepend>
          <v-avatar rounded="lg">
            <v-img alt="John" :src="quote.product.thumbnail_url"></v-img>
          </v-avatar>
        </template>

        <v-card-title class="g2a-title-2xl">
          {{ quote.product?.name }}
        </v-card-title>

        <v-card-subtitle>
          {{ quote.location?.name }}
        </v-card-subtitle>

        <template #append>
          <v-btn icon variant="text" @click="emit('update:modelValue', false)">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-card-item>

      <v-divider />

      <!-- Scroll Area -->

      <v-container class="pb-2 pa-4">
        <!-- Booking Details -->

        <div
          v-for="item in bookingRows"
          :key="item.label"
          class="d-flex justify-space-between"
        >
          <span>{{ item.label }}</span>

          <strong>{{ item.value }}</strong>
        </div>

        <!-- SLOT -->

        <template v-if="hasSlots">
          <v-divider class="my-5" />

          <div class="g2a-title-lg-600 mb-3">Select Slot</div>

          <v-row no-gutters>
            <v-col cols="12" v-for="slot in slots" :key="slot.id" class="mb-2">
              <v-card
                rounded="lg"
                class="slot-card"
                :variant="selectedSlotId === slot.token ? 'tonal' : 'outlined'"
                :color="selectedSlotId === slot.token ? 'primary' : undefined"
                @click="selectSlot(slot)"
              >
                <v-card-text class="py-3">
                  <div class="d-flex justify-space-between">
                    <div>
                      <div class="g2a-title-lg-600">
                        {{ slot.name }}
                      </div>

                      <div class="g2a-text-13">
                        {{ slot.start_time }}
                        -
                        {{ slot.end_time }}
                      </div>
                    </div>

                    <div class="text-right">
                      <div class="g2a-title-lg-700">
                        ₹{{ currency(slot.price) }}
                      </div>

                      <div
                        class="g2a-text-12"
                        :class="
                          slot.available <= 2 ? 'text-warning' : 'text-success'
                        "
                      >
                        {{ slot.available }}
                        seats left
                      </div>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </template>

        <!-- Daily Pricing -->

        <template v-if="dailyPricing.length">
          <v-divider class="my-5" />

          <div class="g2a-title-lg-600 mb-3">Daily Pricing</div>

          <div
            v-for="day in dailyPricing"
            :key="day.date"
            class="d-flex justify-space-between"
          >
            <span>
              {{ formatDate(day.date) }}
            </span>

            <strong> ₹{{ currency(day.unit_price) }} </strong>
          </div>
        </template>
      </v-container>

      <!-- Bottom Summary -->

      <template v-if="finalPricing">
        <v-container class="pa-4">
          <div class="w-100">
            <div class="d-flex justify-space-between">
              <span>Guests</span>
              <strong>
                {{ finalPricing.quantity }}
              </strong>
            </div>

            <div class="d-flex justify-space-between">
              <span>Subtotal</span>
              <strong> ₹{{ currency(finalPricing.subtotal) }} </strong>
            </div>

            <div
              v-if="finalPricing.discount"
              class="d-flex justify-space-between"
            >
              <span>Discount</span>

              <strong class="text-success">
                - ₹{{ currency(finalPricing.discount) }}
              </strong>
            </div>

            <div v-if="finalPricing.tax" class="d-flex justify-space-between">
              <span>Tax</span>

              <strong> ₹{{ currency(finalPricing.tax) }} </strong>
            </div>

            <v-divider class="my-3" />

            <div class="d-flex justify-space-between align-center mb-4">
              <div>
                <div class="g2a-title-lg-700">Total Payable</div>

                <div class="g2a-text-12">Inclusive of taxes</div>
              </div>

              <div class="g2a-title text-brandColor2">
                ₹{{ currency(finalPricing.grand_total) }}
              </div>
            </div>

            <v-btn
              flat
              block
              rounded="lg"
              size="large"
              color="brandColor"
              :disabled="hasSlots && !selectedSlot"
              @click="continueBooking"
            >
              Continue Booking
            </v-btn>
          </div>
        </v-container>
      </template>
    </v-card>
  </v-dialog>
</template>
<script setup>
import apiClient from "@/services/api";
import { computed, ref } from "vue";
import { useDisplay } from "vuetify";

const props = defineProps({
  modelValue: Boolean,

  quote: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue", "continue"]);

const { mobile } = useDisplay();

/*
|--------------------------------------------------------------------------
| Quote
|--------------------------------------------------------------------------
*/

const booking = computed(() => props.quote.booking || {});

const pricing = computed(() => props.quote.pricing || {});

const availability = computed(() => props.quote.availability || {});

const slots = computed(() => availability.value.slots || []);

const dailyPricing = computed(() => availability.value.daily_pricing || []);

const hasSlots = computed(() => slots.value.length > 0);

/*
|--------------------------------------------------------------------------
| Slot Selection
|--------------------------------------------------------------------------
*/

const selectedSlotId = ref(null);

const selectingSlot = ref(false);

const selectedSlot = computed(() => {
  return (
    slots.value.find((slot) => slot.token === selectedSlotId.value) || null
  );
});

const selectSlot = async (slot) => {
  if (selectingSlot.value) {
    return;
  }

  selectingSlot.value = true;

  try {
    const { data } = await apiClient.post(
      `/v1/booking-estimates/${props.quote.estimate_id}/select-slot`,
      {
        slot_token: slot.token,
      },
    );

    selectedSlotId.value = slot.token;

    /**
     * Replace quotation
     */

    Object.assign(props.quote, data.data);
  } finally {
    selectingSlot.value = false;
  }
};

/*
|--------------------------------------------------------------------------
| Pricing
|--------------------------------------------------------------------------
*/

const finalPricing = computed(() => {
  if (hasSlots.value && !selectedSlot.value) {
    return null;
  }

  if (!selectedSlot.value) {
    return pricing.value;
  }

  const quantity = Number(pricing.value.quantity || 1);

  const unitPrice = Number(selectedSlot.value.price);

  return {
    ...pricing.value,

    unit_price: unitPrice,

    subtotal: unitPrice * quantity,

    grand_total: unitPrice * quantity,
  };
});

/*
|--------------------------------------------------------------------------
| Booking Summary
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
| Continue
|--------------------------------------------------------------------------
*/

const continueBooking = () => {
  emit("continue", {
    quote: {
      ...props.quote,

      pricing: finalPricing.value,

      selected_slot: selectedSlot.value,
    },
  });
};

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const currency = (value) => Number(value || 0).toLocaleString("en-IN");

const pretty = (value) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
</script>
