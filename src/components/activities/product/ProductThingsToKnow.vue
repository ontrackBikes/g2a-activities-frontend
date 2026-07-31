<template>
  <div v-if="activeItems.length">
    <div class="g2a-title-2xl mb-3">Things to Know</div>

    <v-card flat rounded="lg" class="border">
      <v-container>
        <div
          v-for="item in activeItems"
          :key="item.id"
          class="d-flex align-start ga-2 mb-3"
        >
          <v-icon
            icon="mdi-circle-small"
            size="18"
            color="grey-darken-1"
            class="flex-shrink-0 mt-1"
          />
          <div>
            <div class="g2a-title-lg" v-if="item.title">
              {{ item.title }}
            </div>
            <span class="">
              {{ item.content }}
            </span>
          </div>
        </div>
      </v-container>
    </v-card>
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

