<template>
  <v-card rounded="lg" flat class="border">
    <v-container>
      <div class="agree-to-description" v-html="config.description" />
    </v-container>
    <v-divider />
    <v-container>
      <v-checkbox
        v-model="agreed"
        color="primary"
        hide-details="auto"
        density="compact"
        :rules="
          required
            ? [
                (v) =>
                  !!v || `You must agree to &quot;${config.agree_text}&quot;.`,
              ]
            : []
        "
      >
        <template #label>
          {{ config.agree_text }}
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

<style scoped>
.agree-to-description :deep(p) {
  margin-bottom: 0.75rem;
}

.agree-to-description :deep(ul),
.agree-to-description :deep(ol) {
  margin-bottom: 0.75rem;
  padding-inline-start: 1.5rem;
}

.agree-to-description :deep(*:last-child) {
  margin-bottom: 0;
}
</style>
