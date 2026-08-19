<template>
  <div ref="galleryRoot" v-if="galleryImages.length">
    <v-row no-gutters>
      <v-col
        v-for="(image, index) in previewImages"
        :key="image.id || index"
        cols="12"
        class="mb-2"
      >
        <a
          :href="image.image_url"
          data-fancybox="product-gallery"
          :data-caption="image.alt || ''"
          class="gallery-item"
        >
          <v-img :src="image.image_url" height="205" cover rounded="lg" />

          <div
            v-if="index === 1 && remainingImages > 0"
            class="gallery-overlay"
          >
            <span class="text-h5 text-white"> +{{ remainingImages }} </span>
          </div>
        </a>
      </v-col>

      <!-- Hidden images -->
      <a
        v-for="(image, index) in hiddenImages"
        :key="`hidden-${image.id || index}`"
        :href="image.image_url"
        data-fancybox="product-gallery"
        :data-caption="image.alt || ''"
        class="d-none"
      />
    </v-row>
  </div>
</template>

<script setup>
import { computed, onMounted, onBeforeUnmount, ref } from "vue";
import { Fancybox } from "@fancyapps/ui";
import "@fancyapps/ui/dist/fancybox/fancybox.css";

const props = defineProps({
  images: {
    type: Array,
    default: () => [],
  },
});

const galleryImages = computed(() => props.images || []);

const previewImages = computed(() => galleryImages.value.slice(0, 2));

const hiddenImages = computed(() => galleryImages.value.slice(2));

const remainingImages = computed(() =>
  Math.max(galleryImages.value.length - 2, 0),
);

const galleryRoot = ref(null);

onMounted(() => {
  Fancybox.bind(galleryRoot.value, '[data-fancybox="product-gallery"]', {
    animated: true,
    dragToClose: true,
    Hash: false, // important
    placeFocusBack: false, // optional
  });
});

onBeforeUnmount(() => {
  Fancybox.unbind(galleryRoot.value);
  Fancybox.close();
});
</script>

<style scoped>
.gallery-item {
  position: relative;
  display: block;
  overflow: hidden;
  border-radius: 12px;
}

.gallery-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgb(0 0 0 / 55%);
}
</style>
