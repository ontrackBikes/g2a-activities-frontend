<template>
  <div>
    <!-- Header -->
    <div class="mb-8">
      <h1 class="g2a-title text-capitalize">
        {{ title }}
      </h1>

      <div class="g2a-text-14 text-medium-emphasis mt-2">
        Explore experiences and activities.
      </div>
    </div>

    <!-- Collections -->
    <template
      v-for="collection in collections"
      :key="collection.id"
    >
      <ProductCollectionSection
        :collection="collection"
        class="mb-10"
      />
    </template>

    <!-- Filters -->
    <ProductFilters
      class="mb-6"
      @change="updateFilters"
    />

    <!-- Products -->
    <InfiniteProductList
      :product-type-slug="productTypeSlug"
      :filters="filters"
    />
  </div>
</template>

<script setup>
import apiClient from "@/services/api";

import {
  ref,
  computed,
  onMounted,
  watch,
} from "vue";

import { useRoute } from "vue-router";

import ProductFilters from "../../../components/activities/discovery/ProductFilters.vue";
import InfiniteProductList from "../../../components/activities/discovery/InfiniteProductList.vue";
import ProductCollectionSection from "../../../components/activities/discovery/ProductCollectionSection.vue";

const route = useRoute();

const collections = ref([]);
const filters = ref({});

const categorySlug = computed(
  () => route.params.category
);

const productTypeSlug = computed(
  () => route.params.productType
);

const title = computed(() =>
  productTypeSlug.value
    ?.replaceAll("-", " ")
    ?.replace(/\b\w/g, (c) =>
      c.toUpperCase()
    )
);

const loadCollections =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/v1/product-collections/with-products",
          {
            params: {
              entity_type:
                "product_type",

              entity_slug:
                productTypeSlug.value,
            },
          }
        );

      collections.value =
        response.data?.data ||
        [];
    } catch (err) {
      console.error(
        "[ActivitiesProductType]",
        err
      );
    }
  };

const updateFilters = (
  value
) => {
  filters.value = value;
};

watch(
  () => route.params.productType,
  () => {
    loadCollections();
  }
);

onMounted(loadCollections);
</script>