<template>
  <div class="sticky-card">
    <v-card rounded="lg" variant="outlined" elevation="0" class="pa-5">
      <!-- Price -->

      <div class="mb-5">
        <div class="g2a-text-12 text-greyDark">Starting from</div>

        <div class="d-flex align-end ga-1">
          <span class="g2a-text-28 g2a-text-bold-700 text-brandColor2">
            ₹{{ price }}
          </span>

          <span class="g2a-text-13 text-greyDark mb-1"> / person </span>
        </div>
      </div>

      <!-- Booking Fields -->

      <BookingFieldRenderer
        v-for="field in fields"
        :key="field.field"
        :field="field"
        :slots="slots"
        :error="errors[field.field]"
        :form="form"
        v-model="form[field.field]"
      />

      <v-card rounded="lg"  variant="outlined" class="pa-2" color="success">
        <v-icon>mdi-information</v-icon> Next Available Date: {{ nextAvailableDate }}
      </v-card>
      <!-- Total -->

      <!-- <div class="d-flex justify-space-between align-center my-5">
        <span class="g2a-title-4 g2a-text-bold-600"> Total (estimate only) </span>

        <span class="g2a-text-22 g2a-text-bold-700 text-brandColor2">
          ₹{{ totalPrice }}
        </span>
      </div> -->

      <!-- Error -->

      <v-alert
        v-if="error"
        type="error"
        variant="tonal"
        density="compact"
        class="my-4"
      >
        {{ error }}
      </v-alert>

      <!-- Button -->

      <v-btn
        class="mt-5"
        flat
        block
        rounded="xl"
        size="large"
        color="brandColor"
        :loading="loading"
        @click="submit"
      >
        Check Estimate
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { computed, reactive, ref, watch } from "vue";

import BookingFieldRenderer from "./BookingFieldRenderer.vue";

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

  nextAvailableDate: {
    type: String,
    default: "",
  },

  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["submit"]);

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
          form.min = props.nextAvailableDate
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
  position: sticky;
  top: 24px;
}
</style>
