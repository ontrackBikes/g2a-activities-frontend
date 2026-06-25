<template>
  <div v-if="activeHighlights.length">
    <div class="g2a-subtitle-dark mb-4">Highlights</div>

    <div v-for="item in activeHighlights" :key="item.id" class="d-flex mb-3">
      <v-icon
        icon="mdi-star-circle-outline"
        size="18"
        color="amber-darken-2"
        class="flex-shrink-0 mr-2"
        style="margin-top: 1px"
      />

      <div class="g2a-text-14 text-greyDark">
        {{ item.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  highlights: {
    type: Array,
    default: () => [],
  },
});

const activeHighlights = computed(() =>
  props.highlights.filter((item) => item.active),
);
</script>
