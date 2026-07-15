<template>
  <div v-if="activeFaqs.length">
    <div class="g2a-title-2xl mb-3">FAQ's</div>

    <v-expansion-panels variant="accordion" elevation="0" class="faq-panels">
      <v-expansion-panel v-for="faq in activeFaqs" :key="faq.id">
        <v-expansion-panel-title class="g2a-title-lg g2a-title-lg-600">
          {{ faq.question }}
        </v-expansion-panel-title>

        <v-expansion-panel-text class="g2a-text-18 text-grey-darken-2 py-4">
          {{ faq.answer }}
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  faqs: {
    type: Array,
    default: () => [],
  },
});

// const activeFaqs = computed(() => props.faqs.filter((faq) => faq.active));
const activeFaqs = computed(() => props.faqs|| []);
</script>

<style scoped>
.faq-panels :deep(.v-expansion-panel) {
  margin-bottom: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 10px !important;
  overflow: hidden;
}

.faq-panels :deep(.v-expansion-panel::after) {
  display: none !important;
}

.faq-panels :deep(.v-expansion-panel-title) {
  padding: 14px 16px !important;
}

.faq-panels :deep(.v-expansion-panel-text__wrapper) {
  padding: 0 16px 14px !important;
}
</style>
