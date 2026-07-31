<template>
  <div v-if="activeItems.length">
    <div class="g2a-title-2xl mb-3">Things to Know</div>

    <ul>
      <li
        v-for="(item, index) in activeItems"
        :key="item.id || index"
      >
        
        <div class="g2a-title-lg" v-if="item.title">
          {{ item.title }}
        </div>
        <div>
          {{ item.content }}
        </div>
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
