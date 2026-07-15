<template>
  <div class="my-4">
    <section class="mb-4">
      <CategoryHero :category="locationInfo" />
    </section>

    <section v-if="productTypes.length" class="mb-4">
       <div class="g2a-title-heading mb-4">Explore by Types</div>

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
            class="activity-card"
            rounded="lg"
            variant="outlined"
            elevation="0"
            @click="goToProductType(type)"
          >
            <v-card-text class="py-8 text-center">
              <v-avatar size="72" color="blue-lighten-5" class="mb-4">
                <v-icon :icon="type.icon" size="34" color="primary" />
              </v-avatar>

              <div class="font-weight-bold">
                {{ type.name }}
              </div>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </section>

    <section class="mb-4">
      

       <div class="g2a-title-heading mb-4">Experiences in {{ locationInfo.name }}</div>

      <v-row v-if="collections.length > 0">
        <v-col
          v-for="product in collections"
          :key="product.slug"
          cols="12"
          sm="6"
          lg="3"
        >
          <ProductCard :product="product" @click="openProduct" />
        </v-col>
      </v-row>

      <div v-else>
        <div class="g2a-title-4">No activities in this location.</div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/api";

import CategoryHero from "@/components/activities/common/CategoryHero.vue";
import ProductCard from "@/components/activities/discovery/cards/ProductCard.vue";

const router = useRouter();
const route = useRoute();

const locationSlug = computed(() => route.params.location_slug);

const productTypes = ref([]);
const collections = ref([]);
const locationInfo = ref({});

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
  "Airport Transfers": "mdi-airplane",
  "Bike Rentals": "mdi-motorbike-electric",
  "Ferry Transfers": "mdi-ferry",
  "Private Cab": "mdi-taxi",
  Trek: "mdi-image-filter-hdr",
  Walks: "mdi-ski-cross-country",
  "Boat Trip": "mdi-sail-boat",
};

async function loadLocationInfo() {
  const { data } = await apiClient.get(
    `/v1/locations/app/${locationSlug.value}`,
  );

  locationInfo.value = data.data;
}

async function loadProductTypes() {
  const { data } = await apiClient.get(
    `/v1/product-types?location_slug=${locationSlug.value}`,
  );

  productTypes.value = (data.data || [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((type) => ({
      ...type,
      icon: type.icon || productTypeIcons[type.name] || "mdi-shape-outline",
    }));
}

async function loadCollections() {
  const { data } = await apiClient.get("/v1/products/app/products-list", {
    params: {
      location_slug: locationSlug.value,
    },
  });

  collections.value = data.data || [];
}

async function loadPage() {
  collections.value = [];
  productTypes.value = [];

  try {
    await Promise.all([
      loadLocationInfo(),
      loadProductTypes(),
      loadCollections(),
    ]);

    document.title = `${locationInfo.value.name} Activities | Go2Andaman`;
  } catch (err) {
    console.error(err);
  }
}

function goToProductType(productType) {
  router.push({
    name: "ActivitiesProductType",
    params: {
      category: productType.category.slug,
      productType: productType.slug,
    },
  });
}

function openProduct({ product, location } = {}) {
  if (!product?.slug) return;

  const slug = location?.slug
    ? `${product.slug}-in-${location.slug}`
    : product.slug;

  router.push({
    name: "ProductDetails",
    params: {
      category: product.category.slug,
      productType: product.product_type.slug,
      product: slug,
    },
  });
}

watch(locationSlug, loadPage);

onMounted(loadPage);
</script>

<style scoped></style>
