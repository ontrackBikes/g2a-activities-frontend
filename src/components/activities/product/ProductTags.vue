<template>
  <div>
    <div class="g2a-title-2xl mb-4">
      Tags
    </div>

    <div class="d-flex flex-wrap ga-2">
      <v-chip
        v-for="tag in tags"
        :key="tag.id"
        rounded="lg"
        class="border"
      >
        {{ tag.name }}
      </v-chip>
    </div>
  </div>
</template>

<script setup>
defineProps({
  tags: {
    type: Array,
    default: () => [],
  },
});
</script>