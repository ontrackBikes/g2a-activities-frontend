<template>
  <div>
    <div class="g2a-subtitle mb-4">
      About This Activity
    </div>

    <div>
      {{ expanded ? description : shortText }}
    </div>

    <v-btn
      v-if="description?.length > 180"
      variant="text"
      @click="expanded = !expanded"
    >
      {{ expanded ? "Read Less" : "Read More" }}
    </v-btn>
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
    ? props.description.slice(0,180)+"..."
    : props.description;
});
</script>