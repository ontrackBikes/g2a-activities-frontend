<template>
  <v-expansion-panels
    v-if="activeTerms.length"
    variant="accordion"
    elevation="0"
    class="term-panels"
  >
    <v-expansion-panel>
      <v-expansion-panel-title class="g2a-text-15 g2a-text-bold-600">
        Terms & Conditions
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        <div
          v-for="item in activeTerms"
          :key="item.id"
          class="d-flex align-start ga-2 mb-3"
        >
          <v-icon
            icon="mdi-circle-small"
            size="18"
            color="grey-darken-1"
            class="flex-shrink-0 mt-1"
          />

          <span class="g2a-text-14 text-grey-darken-2">
            {{ item.content }}
          </span>
        </div>
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  terms: {
    type: Array,
    default: () => [],
  },
});

const activeTerms = computed(() => props.terms.filter((item) => item.active));
</script>

<style scoped>
.term-panels :deep(.v-expansion-panel) {
  margin-bottom: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 10px !important;
  overflow: hidden;
}

.term-panels :deep(.v-expansion-panel::after) {
  display: none !important;
}

.term-panels :deep(.v-expansion-panel-title) {
  padding: 14px 16px !important;
}

.term-panels :deep(.v-expansion-panel-text__wrapper) {
  padding: 0 16px 14px !important;
}
</style>
