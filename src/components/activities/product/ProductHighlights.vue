<template>
  <div v-if="activeHighlights.length">
    <!-- <div class="g2a-title-2xl mb-3">Highlights</div> -->

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
              :icon="getIcon(item.title)"
              size="18"
              color="amber-darken-3"
              class="mt-1"
            />

            <div class="ml-1">
              <div class="g2a-title-lg">
              {{ item.title }}
            </div>

            <div>
              {{ item.content }}
            </div>
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

const getIcon = (title) => {
  if (title == "Security Deposits") {
    return "mdi-shield-lock-outline";
  } else if (title == "Damage Policy") {
    return "mdi-information-outline";
  } else if (title == "Information") {
    return "mdi-information-outline";
  } else if (title == "Timings") {
    return "mdi-clock-outline";
  } else if (title == "Duration") {
    return "mdi-timer-outline";
  }
  return "mdi-crown-outline";
};

</script>

<style scoped></style>
