<template>
  <div>
    <div class="d-flex align-center mb-4">
      <div class="g2a-subtitle g2a-text-bold-700">Explore by Location</div>
    </div>

    <v-row>
      <v-col v-for="location in locations" :key="location.id" cols="6" md="3">
        <v-card
          rounded="xl"
          elevation="0"
          class="location-card"
          @click="openLocation(location)"
        >
          <v-img
            :src="location.image || fallbackImage"
            height="220"
            cover
            gradient="to top, rgba(0,0,0,.8), rgba(0,0,0,.05)"
          >
            <div class="fill-height d-flex flex-column justify-end pa-4">
              <div class="g2a-text-18 g2a-text-bold-700 text-white">
                {{ location.name }}
              </div>

              <div class="g2a-text-12 text-white mt-1">
                {{ location.product_count || 0 }}
                Activities
              </div>
            </div>
          </v-img>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import apiClient from "@/services/api";

import { ref, onMounted } from "vue";

import { useRouter } from "vue-router";

const router = useRouter();

const locations = ref([]);

const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1000";

const loadLocations = async () => {
  try {
    const response = await apiClient.get("/v1/locations");

    locations.value = response.data?.data || [];
  } catch (err) {
    console.error("[LocationGrid]", err);
  }
};

const openLocation = (location) => {
  router.push({
    name: "ActivitiesLocation",

    params: {
      location_slug: location.slug,
    },
  });
};

onMounted(loadLocations);
</script>

<style scoped>
.location-card {
  cursor: pointer;

  overflow: hidden;

  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

</style>
