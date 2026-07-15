<template>
  <div v-if="activeTerms.length">
    <div class="g2a-title-heading mb-4">Terms & Conditions</div>
    <v-card flat class="rounded-lg pa-6">
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

        <span class="g2a-text-18">
          {{ item.content }}
        </span>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  terms: {
    type: Array,
    default: () => [],
  },
});

const activeTerms = computed(() => props.terms|| []);
</script>
