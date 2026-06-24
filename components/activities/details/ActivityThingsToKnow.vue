<template>
  <div>
    <div class="g2a-subtitle mb-4">
      Things To Know
    </div>

    <div
      v-for="item in items"
      :key="item.id"
      class="py-2"
    >
      ✓ {{ item.content }}
    </div>
  </div>
</template>

<script setup>
defineProps({
  items: Array,
});
</script>