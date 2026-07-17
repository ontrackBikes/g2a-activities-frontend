<template>
  <div class="sticky-card">
    <v-card
      rounded="lg"
      variant="outlined"
      elevation="0"
      class="pa-4"
      v-if="outOfStock"
    >
      <div class="g2a-title-lg mb-4">Book your ticket</div>
      <div class="g2a-title-lg text-error">Out of Stock</div>
    </v-card>
    <v-card flat rounded="lg" class="pa-4 border" v-else>
     

      <!-- Price & CTA -->
      <div class="d-flex align-center justify-space-between">
        <div>
          <div class="g2a-title-2xl-2-light text-greyDark text-uppercase">
            {{ priceType === "SLOT" ? "Starts from" : "Flat price" }}
          </div>

          <div class=" mt-1">
            <span class="g2a-title-xl">₹{{ price }}</span>
            <span class="g2a-title-2xl-2-light text-greyDark">
              /
              {{
                props.bookingTemplate.name
                  ?.toLowerCase()
                  .includes("bike rentals")
                  ? "quantity"
                  : "guest"
              }}
            </span>
          </div>
        </div>

        <v-btn
          color="brandColor"
          rounded="lg"
          size="x-large"
          flat
          min-width="150"
          :loading="loading"
          @click="goToBooking()"
        >
          Book Now
        </v-btn>
      </div>
    </v-card>
    <v-card
      class="my-4 border"
      flat 
      rounded="lg"
      :disabled="props.locations.length < 2"
      :class="{ 'cursor-pointer': props.locations.length > 1 }"
      @click="props.locations.length > 1 && $emit('showLocationDialog')"
    >
      <v-container>
        <div class="d-flex align-center">
          <v-avatar size="40" color="brandColor" variant="tonal" class="me-4">
            <v-icon size="20">mdi-map-marker</v-icon>
          </v-avatar>

          <div class="flex-grow-1" style="min-width: 0">
            <div class="g2a-title-lg  text-truncate">
              {{ locationSelected || "Select Location" }}
            </div>

            <div class="g2a-title-2xl-2-light text-greyDark">
              {{
                props.locations.length > 1
                  ? "Tap to change location"
                  : "Only one location available"
              }}
            </div>
          </div>

          <v-icon v-if="props.locations.length > 1" color="grey">
            mdi-chevron-right
          </v-icon>
        </div>
      </v-container>
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
