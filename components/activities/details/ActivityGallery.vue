<template>
  <v-slide-group v-if="images?.length" class="hide-slide-arrows">
    <v-slide-group-item
      v-for="(image, index) in images.filter((img) => img.active)"
      :key="image.id"
    >
      <v-card class="me-3" @click="$emit('select', index)">
        <v-img
          rounded="lg"
          :src="image.image_url"
          width="140"
          height="90"
          cover
        />
      </v-card>
    </v-slide-group-item>
  </v-slide-group>
</template>

<script setup>
defineProps({
  images: Array,
});

defineEmits(["select"]);
</script>

<style scoped>
.hide-slide-arrows :deep(.v-slide-group__prev),
.hide-slide-arrows :deep(.v-slide-group__next) {
  display: none !important;
}
</style>
