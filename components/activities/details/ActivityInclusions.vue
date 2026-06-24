<template>
  <v-card variant="outlined">
    <v-card-title>
      Inclusions
    </v-card-title>

    <v-list density="compact">
      <v-list-item
        v-for="item in inclusions"
        :key="item.id"
      >
        {{ item.content }}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
defineProps({
  inclusions: Array,
});
</script>