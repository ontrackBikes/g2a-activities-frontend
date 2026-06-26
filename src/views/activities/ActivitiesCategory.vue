<template>
  <div class="my-4">
    <!-- Header -->
    <div class="mb-8">
      <div class="g2a-text-24 g2a-text-bold-700">
        {{ categoryName }}
      </div>

      <div class="g2a-text-14 text-medium-emphasis">
        Discover the best experiences, activities and tours.
      </div>
    </div>

    <!-- Product Types -->
    <div v-if="productTypes.length" class="mb-10">
      <div class="g2a-subtitle g2a-text-bold-700 mb-4">
        Explore by Activity Type
      </div>

      <v-row>
        <v-col
          v-for="type in productTypes"
          :key="type.id"
          cols="6"
          md="3"
          lg="2"
        >
          <v-card
            variant="outlined"
            rounded="lg"
            class="h-100 cursor-pointer"
            @click="goToProductType(type)"
          >
            <v-container class="text-center py-6">
              <v-icon :icon="type.icon" size="36" color="brandColor2" />

              <div class="mt-3 font-weight-medium">
                {{ type.name }}
              </div>
            </v-container>
          </v-card>
        </v-col>
      </v-row>
    </div>

    <!-- Collections -->
    <template v-for="collection in collections" :key="collection.id">
      <ProductCollectionSection :collection="collection" class="mb-10" />
    </template>

    <!-- Filters -->
    <!-- <ProductFilters class="mb-6" @change="updateFilters" /> -->

    <!-- Products -->
    <InfiniteProductList :category-slug="categorySlug" :filters="filters" />
  </div>
</template>

<script setup>
import apiClient from "@/services/api";

import { computed, ref, watch, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";

import ProductFilters from "../../../components/activities/discovery/ProductFilters.vue";

import InfiniteProductList from "../../../components/activities/discovery/InfiniteProductList.vue";

import ProductCollectionSection from "../../../components/activities/discovery/ProductCollectionSection.vue";

const router = useRouter();
const route = useRoute();

const productTypes = ref([]);
const collections = ref([]);
const filters = ref({});

/**
 * Route Params
 */
const categorySlug = computed(() => route.params.category);

/**
 * Page Title
 */
const categoryName = computed(() => {
  if (!categorySlug.value) return "";

  return categorySlug.value
    .split("-")
    .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
    .join(" ");
});

/**
 * Product Type Icons
 */
const productTypeIcons = {
  "Scuba Diving": "mdi-diving-scuba-mask",
  Kayaking: "mdi-kayaking",
  Snorkelling: "mdi-swim",
  Parasailing: "mdi-paragliding",
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
  "Airport Transfer": "mdi-airplane",
};

/**
 * Product Types
 */
const loadProductTypes = async () => {
  try {
    const { data } = await apiClient.get(
      `/v1/product-types?category_slug=${categorySlug.value}`,
    );

    productTypes.value = (data?.data || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        ...item,
        icon: item.icon || productTypeIcons[item.name] || "mdi-shape-outline",
      }));
  } catch (err) {
    console.error("[ActivitiesCategory] loadProductTypes", err);
  }
};

/**
 * Collections
 */
const loadCollections = async () => {
  try {
    const response = await apiClient.get(
      "/v1/product-collections/with-products",
      {
        params: {
          entity_type: "category",

          entity_slug: categorySlug.value,
        },
      },
    );

    collections.value = response.data?.data || [];
  } catch (err) {
    console.error("[ActivitiesCategory] loadCollections", err);
  }
};

/**
 * Product Type Navigation
 */
const goToProductType = (productType) => {
  router.push({
    name: "ActivitiesProductType",

    params: {
      category: categorySlug.value,

      productType: productType.slug,
    },
  });
};

/**
 * Filters
 */
const updateFilters = (value) => {
  filters.value = value;
};

/**
 * Page Load
 */
const loadPage = async () => {
  try {
    collections.value = [];
    productTypes.value = [];

    await Promise.all([loadProductTypes(), loadCollections()]);
  } catch (error) {
    console.error("[ActivitiesCategory] loadPage", error);
  }
};

/**
 * Reload when route changes
 */
watch(
  () => route.params.category,
  () => {
    loadPage();
  },
);

/**
 * Dynamic title
 */
watch(
  categoryName,
  (value) => {
    if (value) {
      document.title = `${value} Activities | Go2Andaman`;
    }
  },
  {
    immediate: true,
  },
);

onMounted(loadPage);
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

.v-card:hover {
  transform: translateY(-2px);

  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.08);
}
</style>
