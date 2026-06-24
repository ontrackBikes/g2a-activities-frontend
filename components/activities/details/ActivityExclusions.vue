<template>
  <v-card variant="outlined">
    <v-card-title>
      Exclusions
    </v-card-title>

    <v-list density="compact">
      <v-list-item
        v-for="item in exclusions"
        :key="item.id"
      >
        {{ item.content }}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
defineProps({
  exclusions: Array,
});
</script>