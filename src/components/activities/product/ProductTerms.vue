<template>
  <div v-if="activeTerms.length">
    <div class="g2a-title-2xl mb-4">Terms & Conditions</div>
    <v-card flat rounded="lg" class="border">
      <v-container>
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

        <span class="">
          {{ item.content }}
        </span>
      </div>
      </v-container>
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
