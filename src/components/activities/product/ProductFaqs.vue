<template>
  <div v-if="activeFaqs.length">
    <div class="g2a-title-2xl mb-3">FAQ's</div>

    <g2-a-expansion-panel
      class="mb-2"
      :title="faq.question"
      v-for="faq in activeFaqs"
      :key="faq.id"
    >
      <v-container>
        <div class="">
          {{ faq.answer }}
        </div>
      </v-container>
    </g2-a-expansion-panel>
  </div>
</template>

<script setup>
import G2AExpansionPanel from "@/components/common/G2AExpansionPanel.vue";
import { computed } from "vue";

const props = defineProps({
  faqs: {
    type: Array,
    default: () => [],
  },
});

// const activeFaqs = computed(() => props.faqs.filter((faq) => faq.active));
const activeFaqs = computed(() => props.faqs || []);
</script>
