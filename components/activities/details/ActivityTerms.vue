<template>
  <v-card variant="outlined">
    <v-list>
      <v-list-item
        v-for="item in terms"
        :key="item.id"
      >
        {{ item.content }}
      </v-list-item>
    </v-list>
  </v-card>
</template>

<script setup>
defineProps({
  terms: Array,
});
</script>