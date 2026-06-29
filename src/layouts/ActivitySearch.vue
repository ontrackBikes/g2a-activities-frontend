<template>
  <div class="my-4">
    <div v-if="loading">
      <v-row>
        <v-col v-for="i in 4" :key="i" cols="12" sm="6" md="4" lg="3">
          <v-skeleton-loader class="border rounded-lg" type="image, article" />
        </v-col>
      </v-row>
    </div>

    <template v-else-if="results.length">
      <div class="g2a-subtitle-1 text-DarkGrey mb-4">
        Found {{ results.length }} result{{ results.length > 1 ? "s" : "" }} for
        "<strong>{{ route.query.q }}</strong
        >"
      </div>

      <v-row>
        <v-col
          v-for="(item, index) in results"
          :key="item.slug"
          cols="12"
          sm="6"
          md="4"
          lg="3"
        >
          <div
            :class="[
              'search-card',
              { 'search-card--active': selected === index },
            ]"
            @mouseenter="selected = index"
          >
            <ProductCard :product="item" @click="goToItem(item)" />
          </div>
        </v-col>
      </v-row>
    </template>

    <div v-else-if="route.query.q" class="text-center pa-8">
      <v-icon size="70" color="grey">mdi-magnify</v-icon>
      <div class="g2a-text-20 g2a-text-bold-600 mt-2">No results found</div>
      <div class="g2a-text-16 text-grey">
        Try searching for another activity or destination.
      </div>
    </div>

    <div v-else>
      <div class="d-flex align-center justify-space-between mb-3">
        <div class="g2a-subtitle-1 text-DarkGrey">Recent Searches</div>
        <div>
          <v-btn flat variant="text" color="brandColor2" @click="clearRecent"
            >Clear</v-btn
          >
        </div>
      </div>
      <v-chip
        class="mr-2 mb-2"
        v-for="item in recent"
        :key="item"
        label
        variant="outlined"
        @click="searchRecent(item)"
      >
        {{ item }}
      </v-chip>
      <div v-if="!recent.length" class="g2a-text-14 text-grey">
        Your recent searches will appear here.
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/api";
import ProductCard from "@/components/activities/discovery/cards/ProductCard.vue";

const route = useRoute();
const router = useRouter();

// State
const results = ref([]);
const loading = ref(false);
const selected = ref(0);
const recent = ref([]);
let abortController = null;

// ---- Local Storage Management ----
const loadRecent = () => {
  try {
    const stored = localStorage.getItem("search_recent");
    if (stored) recent.value = JSON.parse(stored);
  } catch (e) {
    console.warn("Could not load recent searches", e);
  }
};

const saveRecent = (term) => {
  if (!term || term.trim().length === 0) return;
  // Push to front, remove duplicates, limit to 10
  const updated = [term, ...recent.value.filter((t) => t !== term)].slice(
    0,
    10,
  );
  recent.value = updated;
  try {
    localStorage.setItem("search_recent", JSON.stringify(updated));
  } catch (e) {
    console.warn("Could not save recent searches", e);
  }
};

const clearRecent = () => {
  recent.value = [];
  localStorage.removeItem("search_recent");
};

loadRecent();

// ---- Fetch Data ----
const fetchResults = async (query) => {
  if (!query || !query.trim()) {
    results.value = [];
    return;
  }

  // Cancel previous request
  if (abortController) {
    abortController.abort();
  }

  abortController = new AbortController();
  loading.value = true;

  try {
    const { data } = await apiClient.get("/v1/products/search", {
      params: {
        q: query,
      },
      signal: abortController.signal,
    });

    results.value = data.data ?? [];
    selected.value = 0;
    saveRecent(query);
  } catch (error) {
    // Ignore cancelled requests
    if (
      error.name !== "CanceledError" &&
      error.name !== "AbortError" &&
      error.code !== "ERR_CANCELED"
    ) {
      console.error("Search fetch failed:", error);
      results.value = [];
    }
  } finally {
    loading.value = false;
  }
};

// Route query acts as the single source of truth for triggering searches
watch(
  () => route.query.q,
  (q) => fetchResults(q),
  { immediate: true },
);

// ---- Interactions ----
const searchRecent = (term) => {
  // Push to URL (MainLayout will catch this and sync its input automatically)
  const query = { ...route.query, q: term };
  router.push({ query });
};

const goToItem = (item) => {
  const categorySlug = item.category?.slug;

  const productTypeSlug = item.productType?.slug || item.product_type?.slug;

  if (!categorySlug || !productTypeSlug || !item.slug) return;

  router.push(`/${categorySlug}/${productTypeSlug}/${item.slug}`);
};
</script>

<style scoped>
.v-list-item {
  transition: 0.2s;
  cursor: pointer;
}
.v-list-item:hover {
  background: #f5f5f5;
}
.v-list-item--active {
  background: #e3f2fd !important;
}

/* Scoped properly so it only affects this component's marks */
:deep(mark) {
  background: #fff59d;
  padding: 0 2px;
  border-radius: 3px;
}
</style>
