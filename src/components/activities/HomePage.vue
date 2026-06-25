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

import ProductCollectionSection from "../../../components/activities/discovery/ProductCollectionSection.vue";

import InfiniteProductList from "../../../components/activities/discovery/InfiniteProductList.vue";
import CategoryGrid from "../../../components/activities/discovery/CategoryGrid.vue";
import ProductFilters from "../../../components/activities/discovery/ProductFilters.vue";
import { ref } from "vue";
import LocationGrid from "../../../components/activities/location/LocationGrid.vue";
</script>
