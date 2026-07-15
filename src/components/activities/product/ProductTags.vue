<template>
  <div>
    <div class="g2a-title-2xl mb-4">
      Perfect For
    </div>

    <v-chip
      v-for="tag in tags"
      :key="tag.id"
      class="me-2 mb-2"
      color="primary"
      variant="outlined"
    >
      {{ tag.name }}
    </v-chip>
  </div>
</template>

<script setup>
defineProps({
  tags: Array,
});
</script>