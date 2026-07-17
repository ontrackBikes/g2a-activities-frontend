<template>
  <div>
    <h1 class="mb-6 text-capitalize">
      Explore {{ categorySlug.replaceAll("-", " ") }}
    </h1>

    <!-- <v-row>
      <v-col cols="6" md="2" v-for="cat in categories" :key="cat.id">
        <v-card
          variant="outlined"
          rounded="lg"
          class="cursor-pointer h-100"
          @click="setCategory(cat)"
        >
          <v-container class="text-center py-6">
            <v-icon :icon="cat.icon" size="36" color="primary" />

            <div class="mt-3 font-weight-medium">
              {{ cat.name }}
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row> -->

    <template v-for="collection in collections" :key="collection.id">
      <product-collection-section
        :collection="collection"
      ></product-collection-section>
    </template>

    <div class="my-4">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import ProductCollectionSection from "@/components/activities/ProductCollectionSection.vue";
import apiClient from "@/services/api";
import { computed, onMounted, ref, watch } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const categories = ref([]);

const categorySlug = computed(() => route.params.id);

/**
 * Product Type Icons
 */
const productTypeIcons = {
  "Scuba Diving": "mdi-diving-scuba-mask",
  Kayaking: "mdi-kayaking",
  Snorkelling: "mdi-swim",
  Parasailing: "mdi-paraglide",
  Seakarting: "mdi-speedometer",
  "Game Fishing": "mdi-fish",
  Ferry: "mdi-ferry",
  Transfer: "mdi-car",
  Rental: "mdi-motorbike",
  "Bike Rental": "mdi-motorbike",
  "Day Trip": "mdi-island",
  Stargazing: "mdi-telescope",
  "Nature Walk": "mdi-hiking",
  Trekking: "mdi-hiking",
  Cruise: "mdi-sail-boat",
  "History Tour": "mdi-bank",
  Birdwatching: "mdi-bird",
  "Light & Sound Show": "mdi-speaker-wireless",
  "Airport Transfer": "mdi-plane-car",
  "Jetty Transfer": "mdi-ferry",
};

/**
 * Load Product Types for Category
 */
const loadProductTypes = async () => {
  try {
    const response = await apiClient.get(
      `/v1/product-types?category_slug=${categorySlug.value}`,
    );

    categories.value = (response.data?.data || []).map((item) => ({
      ...item,
      icon: item.icon || productTypeIcons[item.name] || "mdi-shape-outline",
    }));
  } catch (err) {
    console.error("[ActivitiesView] loadProductTypes", err);
  }
};
const collections = ref([]);

const loadCollections = async () => {
  try {
    const response = await apiClient.get(
      "/v1/product-collections/with-products?entity_type=product_type",
    );

    collections.value = response.data?.data || [];
  } catch (error) {
    console.error("[HomePage] loadCollections", error);
  }
};

/**
 * Navigate to Product Type
 */
const setCategory = (productType) => {
  router.push({
    name: "ActivitiesCategory",
    params: {
      id: categorySlug.value,
      slug: productType.slug,
    },
  });
};

/**
 * Reload when category changes
 */
watch(
  () => route.params.id,
  () => {
    loadProductTypes();
  },
);

onMounted(async () => {
  await Promise.all([loadProductTypes(), loadCollections()]);
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.v-card {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}


</style>
