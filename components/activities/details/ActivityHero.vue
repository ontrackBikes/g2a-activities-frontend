<template>
  <v-card rounded="lg" elevation="0" class="overflow-hidden">
    <v-img
      :src="image"
      height="400"
      cover
      gradient="to top, rgba(0,0,0,.75), rgba(0,0,0,.15)"
    >
      <div class="fill-height d-flex flex-column justify-end pa-6">
        <div class="g2a-title text-white">
          {{ title }}
        </div>

        <div class="d-flex align-center mt-2">
          <v-icon
            icon="mdi-map-marker"
            color="white"
            size="16"
            class="me-1"
          />

          <span class="text-white">
            {{ location }}
          </span>
        </div>
      </div>
    </v-img>
  </v-card>
</template>

<script setup>
defineProps({
  title: String,
  image: String,
  location: String,
});
</script>