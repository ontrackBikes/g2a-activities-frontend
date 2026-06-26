<template>
  <div v-if="activeItems.length">
    <div class="g2a-subtitle-dark mb-4">Things To Know</div>

    <v-row>
      <v-col v-for="(col, index) in chunkedItems" :key="index" cols="12" sm="6">
        <div
          v-for="item in col"
          :key="item.id"
          class="d-flex align-start ga-2 mb-3"
        >
          <v-icon
            icon="mdi-check-circle-outline"
            size="16"
            color="brandColor2"
            class="mt-1 flex-shrink-0"
          />

          <span class="g2a-text-14 text-greyDark">
            {{ item.content }}
          </span>
        </div>
      </v-col>
    </v-row>
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

const activeItems = computed(() => props.items.filter((item) => item.active));

const chunkedItems = computed(() => {
  const items = activeItems.value;
  const size = Math.ceil(items.length / 2);

  return [items.slice(0, size), items.slice(size)].filter((col) => col.length);
});
</script>
