<template>
  <!-- Trigger -->
  <v-text-field
    :model-value="displayValue"
    :label="label"
    placeholder="Select a location"
    prepend-inner-icon="mdi-map-marker"
    variant="outlined"
    density="compact"
    rounded="lg"
    readonly
    class="mb-4"
    hide-details="auto"
    @click="dialog = true"
  />

  <!-- Location Picker -->
  <v-dialog
    v-model="dialog"
    max-width="700"
    persistent
    scrollable
    :fullscreen="mobile"
    transition="dialog-bottom-transition"
    scrim="rgba(15,23,42,.30)"
    :style="{
      backdropFilter: 'blur(5px)',
      webkitBackdropFilter: 'blur(5px)',
    }"
  >
    <v-card rounded="lg" min-height="95vh">
      <!-- Header -->
      <v-toolbar density="comfortable" color="transparent">
        <v-toolbar-title>Select Location</v-toolbar-title>

        <v-spacer />

        <v-btn icon variant="text" @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />

      <v-card-text class="pa-4">
        <!-- Search -->
        <v-text-field
          v-model="search"
          placeholder="Search hotels, jetties, restaurants, or any address..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          clearable
          class="mb-4"
          :loading="searchingPlaces"
        />

        <!-- Categories (only relevant while browsing configured locations) -->
        <div v-if="!isSearching" class="d-flex flex-wrap ga-2 mb-4">
          <v-chip-group v-model="selectedCategory" mandatory>
            <v-chip value="all"> All </v-chip>

            <v-chip value="hotel"> Hotels </v-chip>

            <v-chip value="jetty"> Jetties </v-chip>

            <v-chip value="restaurant"> Restaurants </v-chip>

            <v-chip value="attraction"> Attractions </v-chip>

            <v-chip value="airport"> Airport </v-chip>
          </v-chip-group>
        </div>

        <!-- Configured Locations -->
        <v-list v-if="!isSearching" lines="two" density="comfortable">
          <v-list-item
            v-for="location in filteredLocations"
            :key="location.id"
            rounded="lg"
            @click="selectLocation(location)"
          >
            <template #prepend>
              <v-avatar color="primary" variant="tonal">
                <v-icon>
                  {{ getIcon(location.place_types) }}
                </v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              {{ location.name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ location.address }}
            </v-list-item-subtitle>
          </v-list-item>

          <!-- Empty -->
          <template v-if="filteredLocations.length === 0">
            <div class="text-center py-8">
              <v-icon size="48" color="grey"> mdi-map-search </v-icon>

              <div class="text-medium-emphasis mt-2">
                No matching locations found.
              </div>
            </div>
          </template>
        </v-list>

        <!-- Google Places Search Results -->
        <v-list v-else lines="two" density="comfortable">
          <v-list-item
            v-for="place in placeResults"
            :key="place.place_id"
            rounded="lg"
            @click="selectPlace(place)"
          >
            <template #prepend>
              <v-avatar color="primary" variant="tonal">
                <v-icon>
                  {{ getIcon(place.place_types) }}
                </v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              {{ place.name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ place.description }}
            </v-list-item-subtitle>
          </v-list-item>

          <!-- Loading -->
          <div v-if="searchingPlaces" class="text-center py-8">
            <v-progress-circular indeterminate color="primary" />
          </div>

          <!-- Empty / Error -->
          <template v-else-if="placeResults.length === 0">
            <div class="text-center py-8">
              <v-icon size="48" color="grey"> mdi-map-search </v-icon>

              <div class="text-medium-emphasis mt-2">
                {{ placeSearchError || "No matching places found." }}
              </div>
            </div>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";
import apiClient from "@/services/api";

const { mobile } = useDisplay();

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },

  label: {
    type: String,
    default: "Select Location",
  },

  locations: {
    type: Array,
    default: () => [],
  },

  locationSlug: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const dialog = ref(false);

const search = ref("");
const selectedCategory = ref("all");

const displayValue = computed(() => {
  if (!props.modelValue) return "";

  return props.modelValue.name || "";
});

const filteredLocations = computed(() => {
  let items = [...props.locations];

  if (selectedCategory.value !== "all") {
    items = items.filter((item) =>
      (item.place_types || []).includes(selectedCategory.value),
    );
  }

  if (search.value?.trim()) {
    const q = search.value.toLowerCase();

    items = items.filter((item) =>
      [item.name, item.address, ...(item.place_types || [])]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }

  return items;
});

/*
|--------------------------------------------------------------------------
| Google Places search
|--------------------------------------------------------------------------
| Once the query is long enough (and doesn't already match a configured
| location), fall back to a live Google Places text search via the backend
| (`GET /places/search`) so the customer can pick a real address with
| lat/lng — required for KM_BASED (distance-tier) pricing to work.
*/

const MIN_QUERY_LENGTH = 3;

const isSearching = computed(
  () => (search.value?.trim().length || 0) >= MIN_QUERY_LENGTH,
);

const placeResults = ref([]);
const searchingPlaces = ref(false);
const placeSearchError = ref("");

let searchTimer = null;
let searchToken = 0;

const runPlaceSearch = async (query) => {
  const token = ++searchToken;

  searchingPlaces.value = true;
  placeSearchError.value = "";

  try {
    const { data } = await apiClient.get("/v1/places/search", {
      params: { q: query, location_slug: props.locationSlug },
    });

    if (token !== searchToken) return;

    placeResults.value = data?.data || [];
  } catch (err) {
    if (token !== searchToken) return;

    console.error("Failed to search places", err);
    placeResults.value = [];
    placeSearchError.value =
      err?.response?.data?.message || "Unable to search locations right now.";
  } finally {
    if (token === searchToken) searchingPlaces.value = false;
  }
};

watch(search, (value) => {
  clearTimeout(searchTimer);

  const query = value?.trim() || "";

  if (query.length < MIN_QUERY_LENGTH) {
    placeResults.value = [];
    placeSearchError.value = "";
    return;
  }

  searchTimer = setTimeout(() => runPlaceSearch(query), 350);
});

const selectPlace = (place) => {
  emit("update:modelValue", {
    id: null,
    type: "custom",
    name: place.name,
    address: place.description,
    lat: place.lat,
    lng: place.lng,
    // Required alongside lat/lng when submitting a custom location -
    // opaque, server-generated, and tied to this exact lat/lng pair.
    signature: place.signature,
    place_types: place.place_types,
    is_custom: true,
  });

  dialog.value = false;

  search.value = "";
  placeResults.value = [];
};

const selectLocation = (location) => {
  emit("update:modelValue", location);

  dialog.value = false;

  search.value = "";
  selectedCategory.value = "all";
};

const getIcon = (placeTypes) => {
  const types = placeTypes || [];

  if (types.includes("jetty")) return "mdi-ferry";
  if (types.includes("airport")) return "mdi-airplane";
  if (types.includes("hotel") || types.includes("lodging")) return "mdi-bed";
  if (types.includes("restaurant")) return "mdi-silverware-fork-knife";
  if (types.includes("attraction") || types.includes("tourist_attraction"))
    return "mdi-camera";
  if (types.includes("landmark")) return "mdi-map-marker";

  return "mdi-map-marker";
};
</script>
