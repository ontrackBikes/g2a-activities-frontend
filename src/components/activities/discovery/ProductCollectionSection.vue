<template>
  <div v-if="collections.length">
    <div v-for="collection in collections" :key="collection.id" class="mb-10">
      <!-- Header -->
      <div class="d-flex align-center justify-space-between mb-4">
        <div>
          <div
            class="g2a-title-heading"
            
          >
            {{ collection.name }}
          </div>
        </div>

        <v-btn
          v-if="showViewAll"
          variant="text"
          color="primary"
          @click="viewCollection(collection)"
        >
          View All
        </v-btn>
      </div>

      <!-- Products -->
      <v-slide-group show-arrows>
        <v-slide-group-item
          v-for="product in collection.products"
          :key="product.slug"
        >
          <div class="pa-2" style="width: 280px">
            <ProductCard :product="product" @click="openProduct" />
          </div>
        </v-slide-group-item>
      </v-slide-group>
    </div>
  </div>

  <div v-else-if="loading" class="py-8 text-center">
    <v-progress-circular indeterminate color="primary" />
  </div>
</template>

<script setup>
import apiClient from "@/services/api";
import ProductCard from "@/components/activities/discovery/cards/ProductCard.vue";

import { ref, watch, onMounted } from "vue";

import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  entityType: {
    type: String,
    required: true,
  },

  entitySlug: {
    type: String,
    default: null,
  },

  showViewAll: {
    type: Boolean,
    default: false,
  },
});

const collections = ref([]);

const loading = ref(false);

const loadCollections = async () => {
  try {
    loading.value = true;

    const params = {
      entity_type: props.entityType,
    };

    if (props.entitySlug) {
      params.entity_slug = props.entitySlug;
    }

    const response = await apiClient.get(
      "/v1/product-collections/with-products",
      {
        params,
      },
    );

    collections.value = response.data?.data || [];
  } catch (err) {
    console.error("[ProductCollectionSection]", err);
  } finally {
    loading.value = false;
  }
};

const openProduct = ({ product, location }) => {
  const productType = product.productType;
  const category = productType.category;

  const slug = location
    ? `${product.slug}-in-${location.slug}`
    : product.slug;

  router.push({
    name: "ProductDetails",
    params: {
      category: category.slug,
      productType: productType.slug,
      product: slug,
    },
  });
};

const viewCollection = (collection) => {
  router.push(`/collections/${collection.slug}`);
};

watch(() => [props.entityType, props.entitySlug], loadCollections);

onMounted(loadCollections);
</script>
