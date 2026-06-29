<template>
  <v-card
    v-if="activeInclusions.length"
    rounded="lg"
    variant="outlined"
    height="100%"
  >
    <v-card-text>
      <div class="g2a-title-4 mb-4 text-brandColor2">Included</div>

      <div
        v-for="item in activeInclusions"
        :key="item.id"
        class="d-flex align-start ga-2 mb-3"
      >
        <v-icon
          icon="mdi-check"
          size="18"
          color="success"
          class="mt-1 flex-shrink-0"
        />

        <span class="g2a-text-18">
          {{ item.content }}
        </span>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  inclusions: {
    type: Array,
    default: () => [],
  },
});

const activeInclusions = computed(() =>
  props.inclusions.filter((item) => item.active),
);
</script>
