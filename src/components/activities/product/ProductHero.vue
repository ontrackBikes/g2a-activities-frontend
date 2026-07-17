<template>
  <v-card rounded="lg" elevation="0" class="overflow-hidden hero-card">
    <v-img
      :src="image || thumbnail_url"
      :aspect-ratio="aspectRatio"
      cover
      rounded="lg"
      gradient="to top, rgba(0,0,0,.75), rgba(0,0,0,.15)"
    >
      <template #placeholder>
        <div
          class="d-flex align-center justify-center fill-height bg-grey-lighten-3"
        >
          <v-progress-circular indeterminate color="brandColor" />
        </div>
      </template>

      <template #error>
        <div
          class="d-flex flex-column align-center justify-center fill-height bg-grey-lighten-3"
        >
          <v-icon icon="mdi-image-off-outline" size="32" color="grey" />
          <span class=" text-greyDark mt-1">Image unavailable</span>
        </div>
      </template>

      <div class="fill-height d-flex flex-column justify-end pa-4 pa-sm-6">
        <div class="g2a-heading text-white truncate-two-lines">
          {{ title || "Untitled Activity" }}
        </div>

        <div v-if="location" class="d-flex align-center mt-1">
          <v-icon
            icon="mdi-map-marker-outline"
            color="white"
            size="16"
            class="me-1"
          />
          <span class="g2a-text-14 text-white text-truncate">{{
            location
          }}</span>
        </div>
      </div>


      <div
          v-if="tags?.length > 0"
          class="position-absolute text-left"
          style="top: 12px; left: 8px"
        >
          <v-chip
            v-for="tag in tags"
            :key="tag.slug"
            size="large"
            class="glass text-white px-4 ma-1"
          >
            <v-icon
              v-if="tagIcons[tag.name]"
              :icon="tagIcons[tag.name]"
              size="14"
              start
            />

            <span class="g2a-title-sm font-weight-bold">{{ tag.name }}</span>
          </v-chip>
          
        </div>


    </v-img>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  title: String,
  image: String,
  location: String,
  thumbnail_url: String,
  tags: {
    type: Array,
    default: []
  }
});

const tagIcons = {
  Premium: "mdi-crown",
  "Best Seller": "mdi-fire",
  Trending: "mdi-trending-up",
  New: "mdi-star-circle",
  Popular: "mdi-thumb-up",
  Recommended: "mdi-thumb-up-outline",
  Featured: "mdi-star",
  Exclusive: "mdi-diamond-stone",
  Limited: "mdi-clock-alert-outline",
};

// Slightly taller on larger screens, wider/shorter on mobile so it doesn't
// dominate the viewport on phones — handled with one aspect-ratio value
// driven by a CSS custom media query instead of duplicating markup.
const aspectRatio = computed(() => 16 / 10);
</script>

<style scoped>
.hero-card :deep(.v-img) {
  max-height: 420px;
}

@media (max-width: 600px) {
  .hero-card :deep(.v-img) {
    max-height: 260px;
  }
}
</style>
