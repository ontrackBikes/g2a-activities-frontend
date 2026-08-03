<template>
  <div>
    <div v-if="loading">
      <v-row>
        <v-col v-for="i in 4" :key="i" cols="12" class="py-1">
          <v-skeleton-loader
            class="border rounded-lg"
            type="list-item-avatar-two-line"
          />
        </v-col>
      </v-row>
    </div>

    <template v-else-if="results.length">
      <v-chip-group v-model="activeCategory" mandatory class="mb-2">
        <v-chip
          v-for="category in filterCategories"
          :key="category"
          :value="category"
          filter
          variant="outlined"
          color="brandColor2"
          rounded="lg"
        >
          {{ category }}
        </v-chip>
      </v-chip-group>

      <div class="g2a-title-sm text-greyDark mb-3">
        Found {{ filteredResults.length }} result{{
          filteredResults.length === 1 ? "" : "s"
        }}
      </div>

      <v-row v-if="filteredResults.length" no-gutters>
        <v-col
          v-for="product in filteredResults"
          :key="product.slug"
          cols="12"
          class="py-1"
        >
          <product-card
            :product="product"
            :mini="true"
            @click="openProduct"
          ></product-card>
        </v-col>
      </v-row>

      <div v-else class="text-center text-greyDark py-8">
        No results in "{{ activeCategory }}". Try another category.
      </div>
    </template>

    <div
      v-else-if="props.searchTerm"
      class="d-flex flex-column align-center justify-center py-16 text-center empty-state"
    >
      <v-icon icon="mdi-magnify-close" size="56" color="greyLight" class="mb-4" />
      <div class="g2a-title-2xl mb-1">No results found</div>
      <div class="text-greyDark">
        Try modifying your query terms or selection tags.
      </div>
    </div>

    <div v-else>
      <div v-if="recent.length" class="mb-6">
        <div class="d-flex align-center justify-space-between mb-3">
          <span class="g2a-title-sm">Recent Searches</span>
          <v-btn
            variant="text"
            density="compact"
            color="brandColor2"
            class="text-none"
            @click="clearRecent"
          >
            Clear all
          </v-btn>
        </div>

        <div class="d-flex flex-wrap ga-2">
          <v-chip
            v-for="item in recent"
            :key="item"
            variant="outlined"
            color="brandColor2"
            rounded="lg"
            @click="selectRecent(item)"
          >
            {{ item }}
          </v-chip>
        </div>
      </div>

      <div v-if="trendingMock.length">
        <div
          v-for="collection in trendingMock"
          :key="collection.id"
          class="mb-6"
        >
          <div class="g2a-title-sm mb-3">
            {{ collection.name }}
          </div>

          <v-row no-gutters>
            <v-col
              v-for="product in collection.products"
              :key="product.slug"
              cols="12"
              class="py-1"
            >
              <product-card
                :mini="true"
                :product="product"
                @click="openProduct"
              />
            </v-col>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, computed, onUnmounted, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/services/api";
import ProductCard from "@/components/activities/discovery/cards/ProductCard.vue";

const props = defineProps({
  searchTerm: { type: String, default: "" },
});

const emit = defineEmits(["close", "update-loading", "update:searchTerm"]);
const router = useRouter();

const results = ref([]);
const loading = ref(false);
const recent = ref([]);
const activeCategory = ref("All");

let abortController = null;
let debounceTimeout = null;

const filterCategories = ["All", "Activities", "Water Sports", "Ferries"];

const trendingMock = ref([]);

const filteredResults = computed(() => {
  if (activeCategory.value === "All") return results.value;
  return results.value.filter((item) => {
    const type = (
      item.product_type?.slug ||
      item.productType?.slug ||
      ""
    ).toLowerCase();
    return type.includes(activeCategory.value.toLowerCase().replace(" ", ""));
  });
});

// Cache Handling
const loadRecent = () => {
  const stored = localStorage.getItem("g2a_dialog_recent");
  if (stored) recent.value = JSON.parse(stored);
};

const saveRecent = (term) => {
  if (!term?.trim()) return;
  const updated = [term, ...recent.value.filter((t) => t !== term)].slice(0, 6);
  recent.value = updated;
  localStorage.setItem("g2a_dialog_recent", JSON.stringify(updated));
};

const clearRecent = () => {
  recent.value = [];
  localStorage.removeItem("g2a_dialog_recent");
};

// Triggers active searching when clicking Chip or Trending items
const selectRecent = (term) => {
  emit("update:searchTerm", term);
};

const fetchResults = async (query) => {
  if (query.length < 2) return;
  if (!query?.trim()) {
    results.value = [];
    return;
  }
  if (abortController) abortController.abort();
  abortController = new AbortController();

  loading.value = true;
  emit("update-loading", true);

  try {
    const { data } = await apiClient.get("/v1/products/search", {
      params: { q: query },
      signal: abortController.signal,
    });
    results.value = data.data ?? [];
    saveRecent(query);
  } catch (error) {
    if (error.name !== "CanceledError" && error.name !== "AbortError") {
      results.value = [];
    }
  } finally {
    loading.value = false;
    emit("update-loading", false);
  }
};

// Clean Production Level Watcher with continuous timeout clearance
watch(
  () => props.searchTerm,
  (newVal) => {
    clearTimeout(debounceTimeout);
    if (!newVal?.trim()) {
      results.value = [];
      return;
    }
    debounceTimeout = setTimeout(() => {
      fetchResults(newVal);
    }, 350);
  },
);

const openProduct = ({ product, location }) => {
  // category is not nested to produdt type

  const productType = product.product_type;
  const category = product.category;

  const slug = location ? `${product.slug}-in-${location.slug}` : product.slug;

  router.push({
    name: "ProductDetails",
    params: {
      category: category.slug,
      productType: productType.slug,
      product: slug,
    },
  });
  emit("close");
};
onMounted(() => {
  loadTrending();
});

const loadTrending = async () => {
  try {
    const response = await apiClient.get(
      "/v1/product-collections/with-products",
      {
        params: {
          entity_type: "global",
        },
      },
    );

    trendingMock.value = response.data?.data || [];
  } catch (err) {
    console.error("[ActivitiesProductType]", err);
  }
};

onUnmounted(() => {
  clearTimeout(debounceTimeout);
  if (abortController) abortController.abort();
});

loadRecent();
</script>
