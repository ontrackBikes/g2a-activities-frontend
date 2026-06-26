<template>
  <div v-if="locations.length">
    <div class="g2a-subtitle-dark mb-4">Available At</div>

    <div class="d-flex flex-wrap ga-2">
      <v-chip
        v-for="location in locations"
        :key="location.id"
        rounded="lg"
        variant="tonal"
        color="brandColor2"
        prepend-icon="mdi-map-marker-outline"
      >
        {{ location.name }}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
defineProps({
  locations: {
    type: Array,
    default: () => [],
  },
});
</script>
