<template>
  <div v-if="activeHighlights.length">
    <div class="g2a-title-heading mb-3">Highlights</div>

    <ul class="things-list g2a-text-18">
      <li v-for="item in activeHighlights" :key="item.id" class="things-item">
        <v-icon
          icon="mdi-star-circle-outline"
          size="18"
          color="warning"
          class="mt-1"
        />

        <div class="g2a-text-18 text-greyDark">
          {{ item.content }}
        </div>
      </li>
    </ul>
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

<style scoped>
.things-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.things-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  line-height: 1.6;
}

.things-item:last-child {
  margin-bottom: 0;
}
</style>
