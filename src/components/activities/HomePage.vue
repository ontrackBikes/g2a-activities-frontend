<template>
  <div>
    <category-grid />

    <ProductCollectionSection entity-type="global" class="mt-8" />

    <location-grid class="mt-8" />

    <!-- <product-filters class="mt-8" @change="filters = $event" /> -->
    <InfiniteProductList class="mt-8" :sort="filters.sort" />
  </div>
</template>

<script setup>
const filters = ref({});

import ProductCollectionSection from "./discovery/ProductCollectionSection.vue";

import InfiniteProductList from "./discovery/InfiniteProductList.vue";
import CategoryGrid from "./discovery/CategoryGrid.vue";
import ProductFilters from "./discovery/ProductFilters.vue";
import { ref } from "vue";
import LocationGrid from "./discovery/LocationGrid.vue";
</script>
