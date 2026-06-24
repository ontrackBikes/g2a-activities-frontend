<template>
  <v-slide-group v-if="images?.length">
    <v-slide-group-item
      v-for="(image,index) in images"
      :key="image.id"
    >
      <v-card
        class="me-3"
        @click="$emit('select', index)"
      >
        <v-img
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