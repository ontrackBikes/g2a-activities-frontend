<template>
  <div>

    <SectionRenderer
      v-for="section in sections"
      :key="section.section"
      :section="section"
      :quote="quote"
      class="mb-8"
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
  return (
    props.bookingTemplate?.booking_page_schema?.sections || []
  );
});
</script>