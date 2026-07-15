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
        <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="3">
          <v-skeleton-loader type="card" rounded="lg" />
        </v-col>
      </v-row>

      <!-- Error state -->
      <div
        v-else-if="error && products.length === 0"
        class="d-flex flex-column align-center justify-center py-16 text-center empty-state"
      >
        <v-icon
          icon="mdi-alert-circle-outline"
          size="56"
          color="error"
          class="mb-4"
        />
        <div class="g2a-title-2xl-dark mb-1">Something went wrong</div>
        <div class="g2a-text-13 text-greyDark mb-4">
          {{ error }}
        </div>
        <v-btn
          variant="outlined"
          rounded="lg"
          color="brandColor2"
          class="g2a-text-bold-600"
          @click="fetchProducts(true)"
        >
          Try Again
        </v-btn>
      </div>

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
        <div class="g2a-title-2xl-dark mb-1">No activities found</div>
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

      <div v-else>
        <v-row>
          <v-col
            v-for="product in products"
            :key="product.id"
            cols="12"
            sm="6"
            lg="3"
          >
            <ProductCard :product="product" @click="openProduct" />
          </v-col>
        </v-row>
      </div>

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

      <!-- Inline error while loading more (keeps existing results visible) -->
      <div
        v-if="error && products.length > 0"
        class="d-flex flex-column align-center text-center py-6"
      >
        <div class="g2a-text-13 text-error mb-2">{{ error }}</div>
        <v-btn
          variant="text"
          size="large"
          color="brandColor2"
          @click="fetchProducts(false)"
        >
          Retry
        </v-btn>
      </div>

      <!-- End of list -->
      <div
        v-if="!loading && !hasMore && products.length > 0"
        class="d-flex flex-column align-center text-center"
      >
        <v-divider class="w-100 mb-4" />
        <div class="g2a-text-12 text-greyDark">
          You've seen all {{ totalCount }} activities
        </div>
      </div>
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
  productTypeSlug: { type: String, default: null },
});

const emit = defineEmits(["product-click"]);

// ─── Constants ───────────────────────────────────────────────────
const PAGE_SIZE = 12;
const FILTER_DEBOUNCE_MS = 350;

const DEFAULT_FILTERS = {
  sortBy: "recommended",
  locationIds: [],
  tagIds: [],
  productTypeSlug: null,
  minPrice: 0,
  maxPrice: 50000,
};

// ─── State ───────────────────────────────────────────────────────
const products = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const error = ref(null);
const totalCount = ref(0);
const currentPage = ref(1);

// Filter metadata
const locations = ref([]);
const tags = ref([]);
const productTypes = ref([]);

// Active filters — v-model bound to ProductFilter
const filters = ref({ ...DEFAULT_FILTERS });

// Internal category / product type (driven by props, can be overridden by filters)
const activeCategorySlug = ref(props.categorySlug || null);
const activeProductTypeSlug = ref(props.productTypeSlug || null);

// Infinite scroll
const infiniteSentinel = ref(null);
let observer = null;

// Request lifecycle guards
let metaAbortController = null;
let productsAbortController = null;
let filterDebounceTimer = null;
let isMounted = false;

// ─── Computed ────────────────────────────────────────────────────
const hasMore = computed(() => products.value.length < totalCount.value);

// ─── Helpers ─────────────────────────────────────────────────────
function extractErrorMessage(err) {
  return (
    err?.response?.data?.message ||
    err?.response?.data?.error ||
    err?.message ||
    "Unable to load activities right now. Please try again."
  );
}
// ─── Filter metadata ─────────────────────────────────────────────
const metaError = ref(null); // optional: expose in template if you want a visible error state

// ─── Filter metadata ─────────────────────────────────────────────

async function loadFilterMeta() {
  metaAbortController?.abort();
  metaAbortController = new AbortController();
  const signal = metaAbortController.signal;

  try {
    const params = {
      category_slug: activeCategorySlug.value || undefined,
      product_type_slug: activeProductTypeSlug.value || undefined,
    };

    const [locRes, tagRes, ptRes] = await Promise.all([
      apiClient.get("/v1/locations", { params, signal }),
      apiClient.get("/v1/product-tags", { params, signal }),
      apiClient.get("/v1/product-types", { params, signal }),
    ]);

    if (!isMounted) return;

    locations.value = locRes.data?.data || locRes.data || [];
    tags.value = tagRes.data?.data || tagRes.data || [];
    productTypes.value = ptRes.data?.data || ptRes.data || [];
    metaError.value = null;
  } catch (err) {
    if (err?.name === "CanceledError" || err?.name === "AbortError") return;
    console.error("[InfiniteProductList] loadFilterMeta error:", err);

    if (!isMounted) return;

    // No dummy fallback — surface the real state instead of faking data.
    locations.value = [];
    tags.value = [];
    productTypes.value = [];
    metaError.value = extractErrorMessage(err);
  }
}
// ─── Fetch products ───────────────────────────────────────────────
async function fetchProducts(reset = false) {
  if (reset) {
    currentPage.value = 1;
    products.value = [];
  }

  // Guard: don't stack requests of the same kind
  if (reset ? loading.value : loadingMore.value) return;

  // Cancel any in-flight request so stale responses can't overwrite fresh state
  productsAbortController?.abort();
  productsAbortController = new AbortController();
  const signal = productsAbortController.signal;

  error.value = null;
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

    // productTypeSlug can come from the page prop (route) or from the filter bar;
    // the filter bar's choice takes precedence once the user has picked one.
    const productTypeSlug = f.productTypeSlug || activeProductTypeSlug.value;
    if (productTypeSlug) params.product_type_slug = productTypeSlug;

    if (f.minPrice > 0) params.min_price = f.minPrice;
    if (f.maxPrice < 50000) params.max_price = f.maxPrice;
    if (f.locationIds?.length) params.location_slugs = f.locationIds.join(",");
    if (f.tagIds?.length) params.tag_ids = f.tagIds.join(",");

    const res = await apiClient.get("/v1/products/app/products-list", {
      params,
      signal,
    });

    if (!isMounted) return;

    const fetched = res.data?.data || res.data?.products || res.data || [];
    totalCount.value = res.data?.total ?? res.data?.count ?? fetched.length;

    if (reset) products.value = fetched;
    else products.value.push(...fetched);

    currentPage.value += 1;
  } catch (err) {
    if (err?.name === "CanceledError" || err?.name === "AbortError") return;
    console.error("[InfiniteProductList] fetchProducts error:", err);
    error.value = extractErrorMessage(err);
  } finally {
    if (isMounted) {
      loading.value = false;
      loadingMore.value = false;
    }
  }
}

// ─── Reset ───────────────────────────────────────────────────────
function resetFilters() {
  filters.value = { ...DEFAULT_FILTERS };
  activeCategorySlug.value = props.categorySlug || null;
  activeProductTypeSlug.value = props.productTypeSlug || null;
  fetchProducts(true);
}

// ─── Navigation ──────────────────────────────────────────────────
const openProduct = ({ product, location } = {}) => {
  if (!product?.slug) {
    console.error(
      "[InfiniteProductList] openProduct: missing product slug",
      product,
    );
    return;
  }

  const productType = product.product_type || {};
  const category = product.category || {};

  if (!category.slug || !productType.slug) {
    console.error(
      "[InfiniteProductList] openProduct: missing category/product-type slug",
      product,
    );
    return;
  }

  const slug = location?.slug
    ? `${product.slug}-in-${location.slug}`
    : product.slug;

  router
    .push({
      name: "ProductDetails",
      params: {
        category: category.slug,
        productType: productType.slug,
        product: slug,
      },
    })
    .catch((err) => {
      // Ignore duplicate-navigation errors, log anything else
      if (err?.name !== "NavigationDuplicated") {
        console.error("[InfiniteProductList] navigation error:", err);
      }
    });

  emit("product-click", { product, location });
};

// ─── Watch: filters v-model → refetch (debounced) ────────────────
watch(
  filters,
  () => {
    clearTimeout(filterDebounceTimer);
    filterDebounceTimer = setTimeout(() => {
      fetchProducts(true);
    }, FILTER_DEBOUNCE_MS);
  },
  { deep: true },
);

// ─── Watch: category / productType props ─────────────────────────
watch(
  () => props.categorySlug,
  (slug) => {
    activeCategorySlug.value = slug || null;
    loadFilterMeta();
    fetchProducts(true);
  },
);

watch(
  () => props.productTypeSlug,
  (slug) => {
    activeProductTypeSlug.value = slug || null;
    loadFilterMeta();
    fetchProducts(true);
  },
);

// ─── Infinite scroll ─────────────────────────────────────────────
function setupObserver() {
  if (!infiniteSentinel.value || typeof IntersectionObserver === "undefined") {
    return;
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      if (
        entry.isIntersecting &&
        hasMore.value &&
        !loadingMore.value &&
        !loading.value
      ) {
        fetchProducts(false);
      }
    },
    { rootMargin: "200px" },
  );
  observer.observe(infiniteSentinel.value);
}

// ─── Lifecycle ───────────────────────────────────────────────────
onMounted(async () => {
  isMounted = true;
  await loadFilterMeta();
  await fetchProducts(true);
  await nextTick();
  setupObserver();
});

onBeforeUnmount(() => {
  isMounted = false;
  observer?.disconnect();
  clearTimeout(filterDebounceTimer);
  metaAbortController?.abort();
  productsAbortController?.abort();
});
</script>

<style scoped>
.empty-state {
  min-height: 300px;
}
</style>
