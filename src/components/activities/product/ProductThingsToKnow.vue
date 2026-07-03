<template>
  <div v-if="activeItems.length">
    <div class="g2a-title-heading mb-3">Things to Know</div>

    <ul class="things-list g2a-text-18">
      <li
        v-for="(item, index) in activeItems"
        :key="item.id || index"
        class="things-item"
      >
        <v-icon
          icon="mdi-check-circle-outline"
          size="18"
          color="success"
          class="mt-1"
        />

        <span class="g2a-text-18 font-weight-medium line-height-relaxed">
          {{ item.content }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  items: {
    type: Array,
    default: () => [],
  },
});

const activeItems = computed(() => props.items || []);
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
