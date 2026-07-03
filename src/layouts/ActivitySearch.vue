<template>
  <div>


    <div v-if="loading">
      <v-row class="ga-y-2">
        <v-col v-for="i in 4" :key="i" cols="12" sm="6" class="pa-2">
          <v-skeleton-loader
            class="border rounded-xl"
            type="list-item-avatar-two-line"
          />
        </v-col>
      </v-row>
    </div>

    <template v-else-if="filteredResults.length">
      <div class="g2a-text-14 font-weight-bold text-grey-darken-3 mb-4">
        Found {{ filteredResults.length }} result{{
          filteredResults.length > 1 ? "s" : ""
        }}
      </div>

      <v-row>
        <v-col
          v-for="product in filteredResults"
          :key="product.slug"
          cols="12"
          sm="12"
          class="pa-4"
        >
          <product-card :product="product" :mini="true"></product-card>
          <!-- <v-card
            variant="flat"
            color="white"
            class="border rounded-xl pa-3 d-flex align-center cursor-pointer"
            @click="goToItem(item)"
          >
            <v-avatar
              size="64"
              rounded="lg"
              color="grey-lighten-4"
              class="mr-4"
            >
              <v-img
                :src="
                  item.image ||
                  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=120'
                "
                cover
              />
            </v-avatar>

            <div class="d-flex flex-column justify-center overflow-hidden">
              <div
                class="g2a-text-14 font-weight-bold text-truncate"
              >
                {{ item.name }}
              </div>
              <div class="g2a-text-11 text-medium-emphasis mt-0.5 capitalize">
                {{
                  item.product_type?.slug ||
                  item.productType?.slug ||
                  "Experience"
                }}
              </div>
            </div>

            <v-spacer />
            <v-icon color="grey-lighten-1" size="20">mdi-chevron-right</v-icon>
          </v-card> -->
        </v-col>
      </v-row>
    </template>

    <div v-else-if="props.searchTerm" class="text-center py-12">
      <v-icon size="64" color="grey-lighten-1">mdi-magnify-close</v-icon>
      <div class="g2a-text-16 font-weight-bold mt-3">No results found</div>
      <div class="g2a-text-14 text-grey mt-1">
        Try modifying your query terms or selection tags.
      </div>
    </div>

    <div v-else>
      <div v-if="recent.length" class="mb-5">
        <div class="d-flex align-center justify-space-between mb-3">
          <span class="g2a-text-14 font-weight-bold">Recent Searches</span>
          <v-btn
            variant="text"
            density="compact"
            color="brandColor2"
            class="text-none g2a-text-12"
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
            color="grey-darken-2"
            class="text-none font-weight-medium px-3 cursor-pointer"
            label
            size="small"
            @click="selectRecent(item)"
          >
            {{ item }}
          </v-chip>
        </div>
      </div>

      <div>
        <div v-if="trendingMock.length">
          <div v-for="collection in trendingMock" :key="collection.id">
            <!-- Header -->
            <div class="d-flex align-center justify-space-between my-2">
              <div>
                <div class="g2a-text-15">
                  {{ collection.name }}
                </div>
              </div>
            </div>

            <!-- Products -->
            <v-row no-gutters>
              <v-col
                v-for="product in collection.products"
                :key="product.slug"
                cols="12"
                class="my-2"
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
  fetchResults(term);
};

const fetchResults = async (query) => {
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


  const productType = product.productType;
  const category = productType.category;

  const slug = location ? `${product.slug}-in-${location.slug}` : product.slug;

  router.push({
    name: "ProductDetails",
    params: {
      category: category.slug,
      productType: productType.slug,
      product: slug,
    },
  });
    emit("close")
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
