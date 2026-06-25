<template>
  <v-card
    v-if="activeExclusions.length"
    rounded="lg"
    variant="outlined"
    height="100%"
  >
    <v-card-text>
      <div class="g2a-text-15 g2a-text-bold-600 mb-4 text-error">
        Not Included
      </div>

      <div
        v-for="item in activeExclusions"
        :key="item.id"
        class="d-flex align-start ga-2 mb-3"
      >
        <v-icon
          icon="mdi-close"
          size="16"
          color="error"
          class="mt-1 flex-shrink-0"
        />

        <span class="g2a-text-14">
          {{ item.content }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  exclusions: {
    type: Array,
    default: () => [],
  },
});

const activeExclusions = computed(() =>
  props.exclusions.filter((item) => item.active),
);
</script>
