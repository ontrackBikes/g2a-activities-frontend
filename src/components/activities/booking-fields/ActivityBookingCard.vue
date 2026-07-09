<template>
  <div class="sticky-card">
    <v-card
      rounded="lg"
      variant="outlined"
      elevation="0"
      class="pa-4"
      v-if="outOfStock"
    >
      <div class="g2a-title-4 mb-4">Book your ticket</div>
      <div class="g2a-title-4 text-error">Out of Stock</div>
    </v-card>
    <v-card rounded="lg" variant="outlined" elevation="0" class="pa-4" v-else>
      <!-- Price -->

      <div class="g2a-title-4 mb-4">Book your ticket</div>

      <!-- Booking Fields -->

      <!-- <BookingFieldRenderer
        v-for="field in fields"
        :key="field.field"
        :field="field"
        :slots="slots"
        :error="errors[field.field]"
        :form="form"
        v-model="form[field.field]"
        :maxQuantity="maxQuantity"
      />

      <div class="text-success">
        <v-icon>mdi-information</v-icon> Next Available Date:
        {{ nextAvailableDate }}
      </div>

      <v-alert
        v-if="error"
        type="error"
        variant="outlined"
        density="compact"
        class="my-4"
      >
        {{ error }}
      </v-alert> -->

      <!-- Button -->

      <v-divider class="my-4"></v-divider>

      <v-row>
        <v-col cols="7" class="align-content-center">
          <div class="g2a-text-18 g2a-text-bold">
            <div class="g2a-text-12 text-capitalize line-height-tight">
              {{ priceType === "starts_from" ? "starts from" : "flat price" }}
            </div>
            ₹ {{ price }} / guest
          </div>
        </v-col>

        <v-col cols="5">
          <!-- <v-btn
            block
            flat
            rounded="xl"
            color="brandColor"
            :loading="loading"
            @click="submit"
          >
            Check Estimate
          </v-btn> -->

          <v-btn
            block
            flat
            rounded="xl"
            color="brandColor"
            size="large"
            :loading="loading"
            @click="goToBooking()"
            >Book Now</v-btn
          >
        </v-col>
      </v-row>
    </v-card>
    <v-card rounded="lg" variant="outlined" class="mt-3">
      <v-card-text>
        <div class="g2a-title-4 mb-2">Location</div>

        <v-card
          variant="outlined"
          rounded="lg"
          :disabled="props.locations.length < 2"
          class="px-4 py-3 d-flex align-center cursor-pointer"
          @click="$emit('showLocationDialog')"
        >
          <v-icon
            icon="mdi-map-marker-outline"
            color="primary"
            size="20"
            class="me-3"
          />

          <div class="flex-grow-1" style="min-width: 0">
            <div class="g2a-text-13 g2a-text-bold-600 text-truncate">
              {{ locationSelected || "Select location" }}
            </div>

            <div
              v-if="props.locations.length > 1"
              class="text-caption text-medium-emphasis"
            >
              Tap to change location
            </div>
          </div>

          <v-icon
            v-if="props.locations.length > 1"
            icon="mdi-chevron-down"
            color="medium-emphasis"
          />
        </v-card>
      </v-card-text>
    </v-card>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

import BookingFieldRenderer from "./BookingFieldRenderer.vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const props = defineProps({
  bookingTemplate: {
    type: Object,
    required: true,
  },

  price: {
    type: Number,
    default: 0,
  },

  slots: {
    type: Array,
    default: () => [],
  },
  outOfStock: {
    type: Boolean,
    default: true,
  },
  nextAvailableDate: {
    type: String,
    default: "",
  },

  error: {
    type: String,
    default: "",
  },

  locationSelected: {
    type: String,
    default: "",
  },

  priceType: {
    type: String,
    default: "",
  },

  showSelectLocation: {
    type: Boolean,
    default: true,
  },
  locations: {
    type: String,
    default: "",
  },

  maxQuantity: {
    type: Number,
    default: 10,
  },
});

const emit = defineEmits(["submit", "showLocationDialog"]);
const form = reactive({});

const errors = reactive({});

const loading = ref(false);

const fields = computed(() => {
  return props.bookingTemplate?.product_page_schema?.fields || [];
});

/**
 * Initialize Form
 */
watch(
  fields,
  (value) => {
    const today = new Date();

    const todayStr = today.toISOString().split("T")[0];

    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    value.forEach((field) => {
      if (form[field.field] !== undefined) return;

      switch (field.field) {
        case "guests":
          form.guests = 1;
          break;

        case "quantity":
          form.quantity = 1;
          break;

        case "date":
          form.date = todayStr;
          form.min = props.nextAvailableDate;
          break;

        case "pickup_date":
          form.pickup_date = todayStr;
          break;

        case "return_date":
          form.return_date = tomorrowStr;
          break;

        default:
          form[field.field] = null;
      }
    });
  },
  {
    immediate: true,
  },
);

watch(
  () => form.pickup_date,
  (pickupDate) => {
    if (!pickupDate) return;

    const pickup = new Date(pickupDate);
    const nextDay = new Date(pickup);
    nextDay.setDate(pickup.getDate() + 1);

    const nextDayStr = nextDay.toISOString().split("T")[0];

    if (!form.return_date || form.return_date <= pickupDate) {
      form.return_date = nextDayStr;
    }
  },
);

watch(
  form,
  () => {
    Object.keys(errors).forEach((key) => {
      const value = form[key];

      if (value !== null && value !== undefined && value !== "") {
        delete errors[key];
      }
    });
  },
  { deep: true },
);
/**
 * Total
 */

const totalPrice = computed(() => {
  const qty = form.guests || form.quantity || 1;

  return Number(props.price) * Number(qty);
});

const goToBooking = () => {
  router.push({
    name: "ProductBooking",
    params: {
      category: route.params.category,
      productType: route.params.productType,
      product: route.params.product,
    },
  });
};

/**
 * Validation
 */

const validate = () => {
  Object.keys(errors).forEach((key) => {
    delete errors[key];
  });

  let valid = true;

  fields.value.forEach((field) => {
    if (!field.required) return;

    const value = form[field.field];

    const empty = value === null || value === undefined || value === "";

    if (empty) {
      errors[field.field] = `${field.label || pretty(field.field)} is required`;

      valid = false;
    }
  });

  if (
    form.pickup_date &&
    form.return_date &&
    form.return_date < form.pickup_date
  ) {
    errors.return_date = "Return date must be after pickup date";

    valid = false;
  }

  return valid;
};

/**
 * Pretty Name
 */

const pretty = (field) => {
  return field.replaceAll("_", " ").replace(/\b\w/g, (c) => c.toUpperCase());
};

/**
 * Submit
 */

const submit = async () => {
  if (!validate()) {
    return;
  }

  loading.value = true;

  await emit("submit", {
    ...form,
  });

  loading.value = false;
};
</script>

<style scoped>
.sticky-card {
  position: sticky !important;
  top: 24px;
}
</style>
