<template>
  <div>
    <div class="g2a-subtitle-dark mb-4">About This Activity</div>

    <div class="g2a-text-14">
      {{ expanded ? description : shortText }}
    </div>

    <a
      v-if="description?.length > 180"
      class="text-brandColor2 g2a-text-12 g2a-text-bold-600"
      @click="expanded = !expanded"
      style="cursor: pointer"
    >
      {{ expanded ? "Read Less" : "Read More" }}
    </a>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  description: String,
});

const expanded = ref(false);

const shortText = computed(() => {
  if (!props.description) return "";
  return props.description.length > 180
    ? props.description.slice(0, 180) + "..."
    : props.description;
});
</script>
