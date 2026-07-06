<template>
  <component
    :is="component"
    :config="section.config"
    :quote="quote"
  />
</template>

<script setup>
import { computed } from "vue";
import registry from "./sectionRegistry";

const props = defineProps({
  section: {
    type: Object,
    required: true,
  },
  quote: {
    type: Object,
    required: true,
  },
});

const definition = computed(() => {
  return registry[props.section.section];
});

const component = computed(() => {
  return definition.value?.component;
});
</script>