<template>
  <v-card
    variant="outlined"
    rounded="lg"
  >
    <v-card-text>
      <v-row>
        <!-- Search -->
        <v-col
          cols="12"
          md="3"
        >
          <v-text-field
            v-model="localFilters.search"
            label="Search"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </v-col>

        <!-- Location -->
        <v-col
          cols="12"
          md="2"
        >
          <v-select
            v-model="localFilters.location_slug"
            :items="locations"
            item-title="name"
            item-value="slug"
            label="Location"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </v-col>

        <!-- Tag -->
        <v-col
          cols="12"
          md="2"
        >
          <v-select
            v-model="localFilters.tag_slug"
            :items="tags"
            item-title="name"
            item-value="slug"
            label="Tag"
            density="compact"
            variant="outlined"
            hide-details
            clearable
          />
        </v-col>

        <!-- Sort -->
        <v-col
          cols="12"
          md="2"
        >
          <v-select
            v-model="localFilters.sort"
            :items="sortOptions"
            label="Sort"
            density="compact"
            variant="outlined"
            hide-details
          />
        </v-col>

        <!-- Featured -->
        <v-col
          cols="12"
          md="2"
        >
          <v-checkbox
            v-model="localFilters.featured"
            label="Featured"
            hide-details
          />
        </v-col>

        <!-- Button -->
        <v-col
          cols="12"
          md="1"
        >
          <v-btn
            block
            color="primary"
            @click="applyFilters"
          >
            Go
          </v-btn>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>

<script setup>
import apiClient from "@/services/api";

import {
  ref,
  reactive,
  onMounted,
} from "vue";

const emit =
  defineEmits(["change"]);

const props =
  defineProps({
    filters: {
      type: Object,
      default: () => ({}),
    },
  });

const localFilters =
  reactive({
    search:
      props.filters.search || "",

    location_slug:
      props.filters
        .location_slug || null,

    tag_slug:
      props.filters.tag_slug ||
      null,

    featured:
      props.filters.featured ||
      false,

    sort:
      props.filters.sort ||
      "recommended",
  });

const locations =
  ref([]);

const tags =
  ref([]);

const sortOptions = [
  {
    title:
      "Recommended",
    value:
      "recommended",
  },

  {
    title:
      "Price Low → High",
    value:
      "price_asc",
  },

  {
    title:
      "Price High → Low",
    value:
      "price_desc",
  },

  {
    title:
      "Newest",
    value:
      "newest",
  },

  {
    title:
      "A → Z",
    value:
      "name_asc",
  },
];

const loadLocations =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/v1/locations"
        );

      locations.value =
        response.data?.data ||
        [];
    } catch (err) {
      console.error(err);
    }
  };

const loadTags =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/v1/product-tags"
        );

      tags.value =
        response.data?.data ||
        [];
    } catch (err) {
      console.error(err);
    }
  };

const applyFilters =
  () => {
    emit(
      "change",
      JSON.parse(
        JSON.stringify(
          localFilters
        )
      )
    );
  };

onMounted(async () => {
  await Promise.all([
    loadLocations(),
    loadTags(),
  ]);
});
</script>