<template>
  <div>
    <!-- Categories -->
    <div class="d-flex align-center g2a-subtitle g2a-text-bold-600 mb-4">
      <v-icon
        icon="mdi-compass-outline"
        size="22"
        color="brandColor2"
        class="me-2"
      />
      What are you looking for today?
    </div>

    <v-row>
      <v-col
        v-for="category in categories"
        :key="category.id"
        cols="6"
        sm="4"
        md="3"
      >
        <v-card
          variant="outlined"
          rounded="lg"
          elevation="0"
          class="pa-4 d-flex flex-column align-center justify-center text-center h-100 cursor-pointer"
          :to="category.route"
        >
          <v-icon :icon="category.icon" size="40" color="brandColor2" />

          <div class="g2a-text-14 text-brandColor2 g2a-text-bold-600 mt-3">
            {{ category.name }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Dynamic Collections -->
    <template v-for="collection in collections" :key="collection.id">
      <product-collection-section
        :collection="collection"
      ></product-collection-section>
    </template>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/services/api";
import ProductCollectionSection from "./ProductCollectionSection.vue";

const router = useRouter();

const categories = ref([]);
const collections = ref([]);

const categoryIcons = {
  "Water Sports": "mdi-water",
  "Day Trips": "mdi-island",
  "Exclusive Experiences": "mdi-star-four-points",
  "Getting Around": "mdi-car",
  "History & Culture": "mdi-bank",
  "Treks and Walks": "mdi-hiking",
  Stargazing: "mdi-telescope",
};

const loadCategories = async () => {
  try {
    const response = await apiClient.get("/v1/product-categories");

    categories.value = (response.data?.data || []).map((category) => ({
      id: category.id,
      name: category.name,
      icon: categoryIcons[category.name] || "mdi-shape-outline",
      route: `/v2/${category.slug}`,
    }));
  } catch (error) {
    console.error("[HomePage] loadCategories", error);
  }
};

const loadCollections = async () => {
  try {
    const response = await apiClient.get(
      "/v1/product-collections/with-products?entity_type=global",
    );

    collections.value = response.data?.data || [];
  } catch (error) {
    console.error("[HomePage] loadCollections", error);
  }
};

const getProductImage = (product) => {
  return product.thumbnail_url || product.images?.[0]?.image_url || null;
};

const onProductClick = (product) => {
  router.push(`/activities/product/${product.slug}`);
};

onMounted(async () => {
  await Promise.all([loadCategories(), loadCollections()]);
});
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.product-card {
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-card__no-img {
  height: 180px;
  background: rgba(0, 0, 0, 0.03);
}
</style>
