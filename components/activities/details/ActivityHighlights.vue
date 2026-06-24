<template>
  <div>
    <div class="g2a-subtitle mb-4">
      Highlights
    </div>

    <v-row>
      <v-col
        cols="12"
        md="6"
        v-for="item in highlights"
        :key="item.id"
      >
        <v-card variant="outlined">
          <v-card-text>
            {{ item.content }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
defineProps({
  highlights: Array,
});
</script>