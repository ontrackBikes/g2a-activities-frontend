<template>
  <div>
    <SectionRenderer
      v-for="section in sections"
      :key="section.section"
      :section="section"
      :quote="quote"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

import SectionRenderer from "./SectionRenderer.vue";

const props = defineProps({
  bookingTemplate: {
    type: Object,
    required: true,
  },
  quote: {
    type: Object,
    required: true,
  },

});

const sections = computed(() => {
  return (props.bookingTemplate?.booking_page_schema?.sections || [])
    .filter(section => section.enabled)
    .sort((a, b) => (b.sort_order ?? 0) - (a.sort_order ?? 0));
});

</script>