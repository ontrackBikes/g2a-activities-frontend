<template>
  <div v-if="activeHighlights.length">
    <div class="g2a-title-2xl mb-3">Highlights</div>

    <v-row>
      <v-col
        v-for="(item, index) in activeHighlights"
        :key="item.id || index"
        cols="12"
        sm="6"
        class="pa-2"
      >
        <v-card variant="flat" class="border rounded-lg fill-height pa-2">
          <div class="d-flex ga-2">
            <v-icon
              icon="mdi-crown-outline"
              size="18"
              color="amber-darken-3"
              class="mt-1"
            />

            <div class="g2a-title-lg">
              {{ item.content }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  highlights: {
    type: Array,
    default: () => [],
  },
});

const activeHighlights = computed(() =>
  props.highlights || []
);

</script>

<style scoped></style>
