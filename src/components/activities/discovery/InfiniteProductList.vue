<template>
  <div class="infinite-product-list">
    
    <!-- ─── Filter bar ────────────────────────────────────────────── -->
    <ProductFilter
      v-model="filters"
      :locations="locations"
      :tags="tags"
      :product-types="productTypes"
      @reset="resetFilters"
    >
      <template #results-count>
        <template v-if="!loading">
          {{ totalCount }}
          {{ totalCount === 1 ? "activity" : "activities" }} found
        </template>
      </template>
    </ProductFilter>

    <!-- ─── Main grid ─────────────────────────────────────────────── -->
    <div class="my-4">
      <!-- Skeleton: first load -->
      <v-row v-if="loading && products.length === 0">
        <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="4">
          <v-skeleton-loader type="card" rounded="lg" />
        </v-col>
      </v-row>

      <!-- Empty state -->
      <div
        v-else-if="!loading && products.length === 0"
        class="d-flex flex-column align-center justify-center py-16 text-center empty-state"
      >
        <v-icon
          icon="mdi-magnify-close"
          size="56"
          color="greyLight"
          class="mb-4"
        />
        <div class="g2a-subtitle-dark mb-1">No activities found</div>
        <div class="g2a-text-13 text-greyDark mb-4">
          Try adjusting your filters or browse all activities.
        </div>
        <v-btn
          variant="outlined"
          rounded="lg"
          color="brandColor2"
          class="g2a-text-bold-600"
          @click="resetFilters"
        >
          Clear Filters
        </v-btn>
      </div>

      <!-- Product grid -->
      <v-row v-else>
        <v-col
          v-for="product in products"
          :key="product.id"
          cols="12"
          sm="6"
          lg="3"
        >
          <ProductCard :product="product" @click="openProduct(product)" />
        </v-col>
      </v-row>

      <!-- Infinite scroll sentinel -->
      <div
        ref="infiniteSentinel"
        style="height: 1px; width: 100%"
        class="mt-4"
      />

      <!-- Loading more -->
      <div v-if="loadingMore" class="d-flex justify-center py-6">
        <v-progress-circular indeterminate color="brandColor2" size="32" />
      </div>

      <!-- End of list -->
      <!-- <div
        v-if="!hasMore && products.length > 0"
        class="d-flex flex-column align-center text-center"
      >
        <v-divider class="w-100 mb-4" />
        <div class="g2a-text-12 text-greyDark">
          You've seen all {{ totalCount }} activities
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  computed,
  watch,
  onMounted,
  onBeforeUnmount,
  nextTick,
} from "vue";
import apiClient from "@/services/api";
import ProductCard from "@/components/activities/discovery/cards/ProductCard.vue";
import ProductFilter from "./ProductFilters.vue";
import { useRouter } from "vue-router";

const router = useRouter();

// ─── Props ───────────────────────────────────────────────────────
const props = defineProps({
  categorySlug: { type: String, default: null },
});

const emit = defineEmits(["product-click"]);

// ─── Constants ───────────────────────────────────────────────────
const PAGE_SIZE = 12;

const DEFAULT_FILTERS = {
  sortBy: "recommended",
  locationIds: [],
  tagIds: [],
  productTypeId: null,
  minPrice: 0,
  maxPrice: 50000,
};

// ─── State ───────────────────────────────────────────────────────
const products = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const totalCount = ref(0);
const currentPage = ref(1);

// Filter metadata
const locations = ref([]);
const tags = ref([]);
const productTypes = ref([]);

// Active filters — v-model bound to ProductFilter
const filters = ref({ ...DEFAULT_FILTERS });

// Internal category (driven by prop)
const activeCategorySlug = ref(props.categorySlug || null);

// Infinite scroll
const infiniteSentinel = ref(null);
let observer = null;

// ─── Computed ────────────────────────────────────────────────────
const hasMore = computed(() => products.value.length < totalCount.value);

// ─── Filter metadata ─────────────────────────────────────────────
async function loadFilterMeta() {
  try {
    const [locRes, tagRes, ptRes] = await Promise.all([
      apiClient.get("/v1/locations/options", {
        params: {
          category_slug: props.categorySlug,
        },
      }),
      apiClient.get("/v1/product-tags/api", {
        params: {
          category_slug: props.categorySlug,
        },
      }),
      apiClient.get("/v1/product-types", {
        params: {
          category_slug: props.categorySlug,
        },
      }),
    ]);
    locations.value = locRes.data?.data || locRes.data || [];
    tags.value = tagRes.data?.data || tagRes.data || [];
    productTypes.value = ptRes.data?.data || ptRes.data || [];
  } catch (err) {
    console.error("[InfiniteProductList] loadFilterMeta error:", err);
    // Fallback dummy data
    locations.value = [
      { id: 1, label: "Port Blair", slug: "port-blair" },
      { id: 2, label: "Havelock", slug: "havelock" },
      { id: 3, label: "Neil Island", slug: "neil-island" },
      { id: 4, label: "Baratang", slug: "baratang" },
    ];
    tags.value = [
      { id: 1, name: "Beginner Friendly", slug: "beginner" },
      { id: 2, name: "Certified Divers", slug: "certified" },
      { id: 3, name: "Family", slug: "family" },
    ];
    productTypes.value = [
      { id: 1, name: "Water Activity", slug: "water-activity" },
      { id: 2, name: "Land Tour", slug: "land-tour" },
    ];
  }
}

// ─── Fetch products ───────────────────────────────────────────────
async function fetchProducts(reset = false) {
  if (reset) {
    currentPage.value = 1;
    products.value = [];
  }

  // Guard: don't stack requests
  if (reset ? loading.value : loadingMore.value) return;

  if (reset) loading.value = true;
  else loadingMore.value = true;

  try {
    const f = filters.value;
    const params = {
      page: currentPage.value,
      limit: PAGE_SIZE,
      sort: f.sortBy,
    };

    if (activeCategorySlug.value)
      params.category_slug = activeCategorySlug.value;
    if (f.productTypeId) params.product_type_slug = f.productTypeId;
    if (f.minPrice > 0) params.min_price = f.minPrice;
    if (f.maxPrice < 50000) params.max_price = f.maxPrice;
    if (f.locationIds?.length) params.location_ids = f.locationIds.join(",");
    if (f.tagIds?.length) params.tag_ids = f.tagIds.join(",");

    const res = await apiClient.get("/v1/products/app/products-list", {
      params,
    });

    const fetched = res.data?.data || res.data?.products || res.data || [];
    totalCount.value = res.data?.total || res.data?.count || fetched.length;

    if (reset) products.value = fetched;
    else products.value.push(...fetched);

    currentPage.value++;
  } catch (err) {
    console.error("[InfiniteProductList] fetchProducts error:", err);
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

// ─── Reset ───────────────────────────────────────────────────────
function resetFilters() {
  filters.value = { ...DEFAULT_FILTERS };
  activeCategorySlug.value = null;
  fetchProducts(true);
}

// ─── Navigation ──────────────────────────────────────────────────
function openProduct(product) {
  router.push(
    `/${product.product_type.category.slug}/${product.product_type.slug}/${product.slug}`,
  );
}

// ─── Watch: filters v-model → refetch ────────────────────────────
// ProductFilter emits update:modelValue; v-model updates filters.value
// We watch it deeply to trigger a fresh fetch on any change.
watch(filters, () => fetchProducts(true), { deep: true });

// ─── Watch: category prop ─────────────────────────────────────────
watch(
  () => props.categorySlug,
  (slug) => {
    activeCategorySlug.value = slug;
    fetchProducts(true);
  },
);

// ─── Infinite scroll ─────────────────────────────────────────────
function setupObserver() {
  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting && hasMore.value && !loadingMore.value) {
        fetchProducts(false);
      }
    },
    { rootMargin: "200px" },
  );
  if (infiniteSentinel.value) observer.observe(infiniteSentinel.value);
}

// ─── Lifecycle ───────────────────────────────────────────────────
onMounted(async () => {
  await loadFilterMeta();
  await fetchProducts(true);
  await nextTick();
  setupObserver();
});

onBeforeUnmount(() => observer?.disconnect());
</script>

<style scoped>
.empty-state {
  min-height: 300px;
}
</style>
