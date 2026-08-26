<template>
  <v-card rounded="lg" flat class="border">
    <v-container>
      <v-checkbox
        v-model="agreed"
        color="primary"
        hide-details="auto"
        density="compact"
        :rules='
          required
            ? [(v) => !!v || `You must agree to "${config.description}".`]
            : []
        '
      >
        <template #label>
          {{ config.description }}
        </template>
      </v-checkbox>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },

  required: {
    type: Boolean,
    default: false,
  },

  quote: {
    type: Object,
    default: () => ({}),
  },
});

const booking = bookingStore;

// config.key isn't unique across products, but within a single template's
// sections array it is - and booking.form.agree_to only ever holds the
// keys for one product's booking, so keying off it directly is safe.
const agreed = computed({
  get() {
    return booking.form.agree_to?.[props.config.key] ?? false;
  },

  set(value) {
    if (!booking.form.agree_to) {
      booking.form.agree_to = {};
    }

    booking.form.agree_to[props.config.key] = value;
  },
});
</script>
