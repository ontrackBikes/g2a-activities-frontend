<template>
  <div class="sticky-card">
    <v-card
      variant="outlined"
      rounded="xl"
      elevation="0"
      class="pa-5"
    >
      <!-- Price -->
      <div class="mb-5">
        <div class="g2a-text-12 text-greyDark">
          Starting from
        </div>

        <div class="d-flex align-end ga-1">
          <span
            class="g2a-text-28 g2a-text-bold-700 text-brandColor2"
          >
            ₹{{ price }}
          </span>

          <span class="g2a-text-13 text-greyDark mb-1">
            / person
          </span>
        </div>
      </div>

      <!-- Dynamic Fields -->

      <BookingFieldRenderer
        v-for="field in fields"
        :key="field.field"
        :field="field"
        :slots="slots"
        v-model="form[field.field]"
      />

      <!-- Total -->

      <div
        class="d-flex justify-space-between align-center mb-5"
      >
        <span
          class="g2a-text-13 g2a-text-bold-600"
        >
          Total
        </span>

        <span
          class="g2a-text-20 g2a-text-bold-700 text-brandColor2"
        >
          ₹{{ totalPrice }}
        </span>
      </div>

      <v-btn
        block
        size="large"
        rounded="xl"
        color="brandColor"
        flat
        @click="submit"
      >
        Check Availability
      </v-btn>
    </v-card>
  </div>
</template>

<script setup>
import { computed, reactive, watch } from "vue";

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
});

const emit = defineEmits([
  "submit",
]);

const form = reactive({});

const fields = computed(() => {
  return (
    props.bookingTemplate
      ?.product_page_schema?.fields || []
  );
});

/**
 * Initialize default values
 */
watch(
  fields,
  (value) => {
    value.forEach((field) => {
      if (
        form[field.field] !== undefined
      )
        return;

      switch (field.field) {
        case "guests":
          form.guests = 1;
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

const totalPrice = computed(() => {
  return (
    props.price *
    (form.guests || 1)
  );
});

const submit = () => {
  emit("submit", {
    ...form,
  });
};
</script>

<style scoped>
.sticky-card {
  position: sticky;
  top: 90px;
}
</style>