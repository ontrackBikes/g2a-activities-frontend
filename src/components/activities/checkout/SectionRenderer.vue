<template>
  <component
    :is="component"
    :config="section.config"
  />
</template>

<script setup>
import { computed } from "vue";
import registry from "./sectionRegistry";

const props = defineProps({
  section: Object,
});

const definition = computed(() => {
  return registry[props.section.section];
});

const component = computed(() => {
  return definition.value?.component;
});
</script>
