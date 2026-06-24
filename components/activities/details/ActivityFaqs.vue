<template>
  <v-expansion-panels>
    <v-expansion-panel
      v-for="faq in faqs"
      :key="faq.id"
    >
      <v-expansion-panel-title>
        {{ faq.question }}
      </v-expansion-panel-title>

      <v-expansion-panel-text>
        {{ faq.answer }}
      </v-expansion-panel-text>
    </v-expansion-panel>
  </v-expansion-panels>
</template>

<script setup>
defineProps({
  faqs: Array,
});
</script>