<template>
  <div v-if="activeImages.length">
    <v-row no-gutters>
      <!-- Main Image -->
      <v-col cols="12">
        <div class="gallery-main mb-2" @click="openLightbox(0)">
          <v-img
            :src="activeImages[0].image_url"
            height="195"
            cover
            rounded="lg"
          />
        </div>
      </v-col>

      <!-- Second Image -->
      <v-col v-if="activeImages[1]" cols="12">
        <div class="gallery-thumb" @click="openLightbox(1)">
          <v-img
            :src="activeImages[1].image_url"
            height="195"
            cover
            rounded="lg"
          />

          <div v-if="activeImages.length > 2" class="gallery-overlay">
            <span class="g2a-text-18 g2a-text-bold-700 text-white">
              +{{ activeImages.length - 2 }}
            </span>
          </div>
        </div>
      </v-col>
    </v-row>

    <!-- Lightbox -->
    <v-dialog
      v-model="lightboxOpen"
      width="800"
      transition="dialog-bottom-transition"
    >
      <v-card color="#0f0f0f" elevation="0" class="lightbox-container">
        <!-- Top Bar -->
        <div class="lightbox-header">
          <v-chip
            size="small"
            color="white"
            variant="flat"
            class="font-weight-bold"
          >
            {{ lightboxIndex + 1 }} / {{ activeImages.length }}
          </v-chip>

          <v-btn
            icon
            variant="tonal"
            color="white"
            @click="lightboxOpen = false"
          >
            <v-icon icon="mdi-close" />
          </v-btn>
        </div>

        <!-- Main Image -->
        <div class="lightbox-body">
          <v-img
            :src="activeImages[lightboxIndex]?.image_url"
            contain
            class="lightbox-image"
          />

          <!-- Prev -->
          <v-btn
            v-if="lightboxIndex > 0"
            class="lightbox-arrow lightbox-arrow--left"
            icon
            size="large"
            color="white"
            variant="flat"
            @click="lightboxIndex--"
          >
            <v-icon icon="mdi-chevron-left" size="28" />
          </v-btn>

          <!-- Next -->
          <v-btn
            v-if="lightboxIndex < activeImages.length - 1"
            class="lightbox-arrow lightbox-arrow--right"
            icon
            size="large"
            color="white"
            variant="flat"
            @click="lightboxIndex++"
          >
            <v-icon icon="mdi-chevron-right" size="28" />
          </v-btn>
        </div>

        <!-- Thumbnail Strip -->
        <div v-if="activeImages.length > 1" class="lightbox-thumbs">
          <div
            v-for="(img, index) in activeImages"
            :key="img.id || index"
            class="thumb-item"
            :class="{ active: index === lightboxIndex }"
            @click="lightboxIndex = index"
          >
            <v-img
              :src="img.image_url"
              width="72"
              height="72"
              cover
              rounded="lg"
            />
          </div>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

const activeImages = computed(() => props.images.filter((img) => img.active));

const lightboxOpen = ref(false);
const lightboxIndex = ref(0);

const openLightbox = (index) => {
  lightboxIndex.value = index;
  lightboxOpen.value = true;
};
</script>

<style scoped>
.gallery-main,
.gallery-thumb {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border-radius: 12px;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
}

.lightbox-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.lightbox-header {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.lightbox-body {
  flex: 1;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  padding: 24px;
}

.lightbox-image {
  max-width: 100%;
  max-height: 50vh;
  border-radius: 12px;
}

.lightbox-arrow {
  position: absolute !important;
  top: 50%;
  transform: translateY(-50%);

  backdrop-filter: blur(10px);
  background: rgba(255, 255, 255, 0.15) !important;
}

.lightbox-arrow--left {
  left: 24px;
}

.lightbox-arrow--right {
  right: 24px;
}

.lightbox-thumbs {
  display: flex;
  gap: 10px;

  overflow-x: auto;

  padding: 16px 24px 24px;
  justify-content: center;
}

.thumb-item {
  cursor: pointer;
  opacity: 0.55;
  transition: all 0.2s ease;
}

.thumb-item:hover {
  opacity: 1;
}

.thumb-item.active {
  opacity: 1;
  transform: scale(1.08);
}
</style>
