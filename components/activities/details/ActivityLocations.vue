<template>
  <div>
    <div class="g2a-subtitle mb-4">
      Available At
    </div>

    <v-row>
      <v-col
        cols="12"
        md="4"
        v-for="location in locations"
        :key="location.id"
      >
        <v-card variant="outlined">
          <v-card-text>
            <v-icon
              icon="mdi-map-marker"
              class="me-2"
            />
            {{ location.name }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
defineProps({
  locations: Array,
});
</script>