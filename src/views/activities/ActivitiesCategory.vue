<template>
  <div class="my-4">
    <!-- Loading -->
    <template v-if="loading">
      <v-skeleton-loader type="image" height="280" class="rounded-lg mb-10" />

      <section class="mb-14">
        <v-skeleton-loader type="heading" width="240" class="mb-2" />
        <v-skeleton-loader type="text" width="320" class="mb-6" />

        <v-row>
          <v-col v-for="n in 6" :key="n" cols="6" sm="4" md="3" lg="2">
            <v-skeleton-loader type="card" rounded="lg" height="96" />
          </v-col>
        </v-row>
      </section>

      <section class="mb-10">
        <v-skeleton-loader type="heading" width="200" class="mb-2" />
        <v-skeleton-loader type="text" width="360" class="mb-6" />
        <v-row>
          <v-col v-for="n in 4" :key="n" cols="12" sm="6" lg="3">
            <v-skeleton-loader type="card" rounded="lg" />
          </v-col>
        </v-row>
      </section>
    </template>

    <template v-else>
      <!-- Header -->
      <CategoryHero :category="catetoryInfo" class="mb-10" />

      <!-- Product Types -->
      <!-- Activity Types -->
      <section v-if="productTypes.length" class="mb-14">
        <div class="d-flex justify-space-between align-center mb-6">
          <div>
            <div class="g2a-title-2xl">Explore by Activity</div>

            <div class="">Browse experiences based on your interests.</div>
          </div>
        </div>

        <v-row>
          <v-col
            v-for="type in productTypes"
            :key="type.id"
            cols="6"
            sm="4"
            md="3"
            lg="2"
          >
            <v-card
              class="border"
              rounded="lg"
              flat
              @click="goToProductType(type)"
            >
              <v-container class="text-center py-4">
                <v-icon :icon="type.icon" size="34" color="brandColor2" />

                <div class="g2a-title-md text-brandColor2 my-2">
                  {{ type.name }}
                </div>
              </v-container>
            </v-card>
          </v-col>
        </v-row>
      </section>

      <!-- Collections -->

      <div v-for="collection in collections" :key="collection.id" class="mb-10">
        <ProductCollectionSection :collection="collection" />
      </div>

      <!-- Products -->
      <section class="mb-10">
        <div class="d-flex justify-space-between align-center mb-4">
          <div>
            <div class="g2a-title-2xl">All {{ catetoryInfo.name }}</div>
            <div class="">
              Browse every experience available in this category.
            </div>
          </div>
        </div>

        <!-- Filters later -->

        <!-- <ProductFilters
        class="mb-6"
        @change="updateFilters"
  /> -->

        <InfiniteProductList :category-slug="categorySlug" :filters="filters" />
      </section>
    </template>
  </div>
</template>

<script setup>
import apiClient from "@/services/api";

import { computed, ref, watch, onMounted } from "vue";

import { useRoute, useRouter } from "vue-router";

import InfiniteProductList from "../../components/activities/discovery/InfiniteProductList.vue";

import ProductCollectionSection from "../../components/activities/discovery/ProductCollectionSection.vue";
import CategoryHero from "@/components/activities/common/CategoryHero.vue";

const router = useRouter();
const route = useRoute();

const productTypes = ref([]);
const collections = ref([]);
const filters = ref({});
const catetoryInfo = ref({});
const loading = ref(true);

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
  "Airport Transfer": "mdi-plane-car",
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
  "Airport Transfers": "mdi-plane-car",
  "Bike Rentals": "mdi-motorbike-electric",
  "Ferry Transfers": "mdi-ferry",
  "Private Cab": "mdi-taxi",
  Trek: "mdi-image-filter-hdr",
  Walks: "mdi-ski-cross-country",
  "Boat Trip": "mdi-sail-boat",
  Fishing: "mdi-fish",
};

/**
 * Category Info
 */
const loadCategoryInfo = async () => {
  try {
    const { data } = await apiClient.get(
      `/v1/product-categories/slug/${categorySlug.value}`,
    );

    catetoryInfo.value = data.data;
  } catch (err) {
    console.error("[ActivitiesCategory] loadProductTypes", err);
  }
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
  loading.value = true;

  try {
    collections.value = [];
    productTypes.value = [];

    await Promise.all([
      loadProductTypes(),
      loadCollections(),
      loadCategoryInfo(),
    ]);
  } catch (error) {
    console.error("[ActivitiesCategory] loadPage", error);
  } finally {
    loading.value = false;
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

<style scoped></style>
