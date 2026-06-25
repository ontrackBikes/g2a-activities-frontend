<template>
  <div class="infinite-product-list">
    <!-- ─── Filter bar (top: category tabs + quick chips) ────────────── -->
    <ProductFilter
      v-model="filters"
      :locations="locations"
      :tags="tags"
      :categories="categories"
      :product-types="productTypes"
      @reset="resetFilters"
      @update:model-value="onFilterChange"
    />

    <!-- ─── Main body: sidebar + grid ────────────────────────────────── -->
    <v-container class="g2a-container-width pt-4 pb-10">
      <!-- Skeleton loader while first load -->
      <v-row v-if="loading && products.length === 0">
        <v-col v-for="n in 6" :key="n" cols="12" sm="6" lg="4">
          <v-skeleton-loader type="card" rounded="lg" />
        </v-col>
      </v-row>

      <!-- Empty state -->
      <div
        v-else-if="!loading && products.length === 0"
        class="empty-state d-flex flex-column align-center justify-center py-16 text-center"
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
          lg="4"
        >
          <ProductCard :product="product" @click="onProductClick" />
        </v-col>
      </v-row>

      <!-- Infinite scroll sentinel -->
      <div ref="infiniteSentinel" class="sentinel mt-4" />

      <!-- Loading more indicator -->
      <div v-if="loadingMore" class="d-flex justify-center py-6">
        <v-progress-circular indeterminate color="brandColor2" size="32" />
      </div>

      <!-- End of list -->
      <div
        v-if="!hasMore && products.length > 0"
        class="d-flex flex-column align-center py-8 text-center"
      >
        <v-divider class="w-100 mb-4" />
        <div class="g2a-text-12 text-greyDark">
          You've seen all {{ totalCount }} activities
        </div>
      </div>
    </v-container>
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
import ProductCard from "@/components/activities/cards/ProductCard.vue";
import ProductFilter from "./ProductFilters.vue";

// ─── Props ──────────────────────────────────────────────────────────
const props = defineProps({
  // Optional: pre-selected category slug (set by parent category nav)
  categorySlug: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["product-click"]);

// ─── Sort options (matches backend sort values) ──────────────────
const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
];

// ─── State ──────────────────────────────────────────────────────────
const products = ref([]);
const loading = ref(false);
const loadingMore = ref(false);
const totalCount = ref(0);
const currentPage = ref(1);
const PAGE_SIZE = 12;
const hasMore = computed(() => products.value.length < totalCount.value);

// Filter metadata (loaded once)
const locations = ref([]);
const tags = ref([]);
const categories = ref([]);
const productTypes = ref([]);

// Active category (driven by prop or internal state)
const activeCategorySlug = ref(props.categorySlug || null);

// Filters state — matches backend query params
const filters = ref({
  sortBy: "recommended",
  locationIds: [],
  tagIds: [],
  categoryId: null,
  productTypeId: null,
  minPrice: 0,
  maxPrice: 50000,
});

// UI state
const locationMenuOpen = ref(false);
const sortMenuOpen = ref(false);
const infiniteSentinel = ref(null);
let observer = null;

// ─── Computed ────────────────────────────────────────────────────────
const activeSortLabel = computed(
  () =>
    SORT_OPTIONS.find((o) => o.value === filters.value.sortBy)?.label ||
    "Sort By",
);

const activeProductTypeLabel = computed(
  () =>
    productTypes.value.find((p) => p.slug === filters.value.productTypeId)
      ?.name || null,
);

// Dev helper: shows which endpoint is being hit
const activeEndpointLabel = computed(() => {
  if (activeCategorySlug.value) {
    return `/v1/products/app/products-list?category_slug=${activeCategorySlug.value}`;
  }
  return "/v1/products/app/products-list";
});

// ─── API calls ────────────────────────────────────────────────────────

// Load filter metadata in parallel
async function loadFilterMeta() {
  try {
    // TODO: GET /v1/locations/options
    const [locRes, tagRes, catRes, ptRes] = await Promise.all([
      apiClient.get("/v1/locations/options"),
      apiClient.get("/v1/product-tags"),
      apiClient.get("/v1/product-categories"),
      apiClient.get("/v1/product-types"),
    ]);
    locations.value = locRes.data?.data || locRes.data || [];
    tags.value = tagRes.data?.data || tagRes.data || [];
    categories.value = catRes.data?.data || catRes.data || [];
    productTypes.value = ptRes.data?.data || ptRes.data || [];
  } catch (err) {
    console.error("[InfiniteProductList] loadFilterMeta error:", err);

    // ── DUMMY DATA (remove when API is ready) ──────────────────────
    locations.value = [
      { id: 1, name: "Port Blair", slug: "port-blair" },
      { id: 2, name: "Havelock", slug: "havelock" },
      { id: 3, name: "Neil Island", slug: "neil-island" },
      { id: 4, name: "Baratang", slug: "baratang" },
    ];
    tags.value = [
      { id: 1, name: "Beginner Friendly", slug: "beginner" },
      { id: 2, name: "Certified Divers", slug: "certified" },
      { id: 3, name: "Family", slug: "family" },
    ];
    categories.value = [
      { id: 1, name: "Scuba Diving", slug: "scuba" },
      { id: 2, name: "Kayaking", slug: "kayaking" },
    ];
    productTypes.value = [
      { id: 1, name: "Water Activity", slug: "water-activity" },
      { id: 2, name: "Land Tour", slug: "land-tour" },
    ];
    // ──────────────────────────────────────────────────────────────
  }
}

async function fetchProducts(reset = false) {
  if (reset) {
    currentPage.value = 1;
    products.value = [];
  }

  if (loading.value || loadingMore.value) return;

  if (reset) loading.value = true;
  else loadingMore.value = true;

  try {
    // TODO: GET /v1/products/app/products-list
    // Supported query params: page, limit, sort, category_slug, product_type_slug,
    //                         min_price, max_price, search
    const params = {
      page: currentPage.value,
      limit: PAGE_SIZE,
      sort: filters.value.sortBy,
    };

    if (activeCategorySlug.value) {
      params.category_slug = activeCategorySlug.value;
    }

    if (filters.value.productTypeId) {
      params.product_type_slug = filters.value.productTypeId;
    }

    if (filters.value.minPrice > 0) params.min_price = filters.value.minPrice;
    if (filters.value.maxPrice < 50000)
      params.max_price = filters.value.maxPrice;

    // TODO: location filter — backend may need to add location_id[] support
    // For now, we filter client-side if locationIds are selected
    // params.location_ids = filters.value.locationIds.join(",");

    const res = await apiClient.get("/v1/products/app/products-list", {
      params,
    });

    let fetched = res.data?.data || res.data?.products || res.data || [];
    totalCount.value = res.data?.total || res.data?.count || fetched.length;

    // Client-side location filter (until backend supports it)
    if (filters.value.locationIds.length > 0) {
      fetched = fetched.filter(
        (p) =>
          filters.value.locationIds.includes(p.location_id) ||
          filters.value.locationIds.includes(p.location?.id),
      );
    }

    // Client-side tag filter
    if (filters.value.tagIds.length > 0) {
      fetched = fetched.filter((p) =>
        p.tags?.some((t) => filters.value.tagIds.includes(t.id)),
      );
    }

    if (reset) {
      products.value = fetched;
    } else {
      products.value.push(...fetched);
    }

    currentPage.value++;
  } catch (err) {
    console.error("[InfiniteProductList] fetchProducts error:", err);

    // ── DUMMY DATA (remove when API is ready) ──────────────────────
    if (reset) {
      products.value = DUMMY_PRODUCTS;
      totalCount.value = DUMMY_PRODUCTS.length;
    }
    // ──────────────────────────────────────────────────────────────
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
}

// ─── Infinite scroll via IntersectionObserver ────────────────────
function setupObserver() {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && hasMore.value && !loadingMore.value) {
        fetchProducts(false);
      }
    },
    { rootMargin: "200px" },
  );

  if (infiniteSentinel.value) {
    observer.observe(infiniteSentinel.value);
  }
}

// ─── Filter helpers ──────────────────────────────────────────────
function onFilterChange(newFilters) {
  filters.value = newFilters;
  fetchProducts(true);
}

function toggleLocationFilter(id) {
  const ids = [...filters.value.locationIds];
  const idx = ids.indexOf(id);
  if (idx === -1) ids.push(id);
  else ids.splice(idx, 1);
  filters.value = { ...filters.value, locationIds: ids };
  fetchProducts(true);
}

function toggleTagFilter(id) {
  const ids = [...filters.value.tagIds];
  const idx = ids.indexOf(id);
  if (idx === -1) ids.push(id);
  else ids.splice(idx, 1);
  filters.value = { ...filters.value, tagIds: ids };
  fetchProducts(true);
}

function clearCategory() {
  activeCategorySlug.value = null;
  fetchProducts(true);
}

function resetFilters() {
  filters.value = {
    sortBy: "recommended",
    locationIds: [],
    tagIds: [],
    categoryId: null,
    productTypeId: null,
    minPrice: 0,
    maxPrice: 50000,
  };
  activeCategorySlug.value = null;
  fetchProducts(true);
}

function onProductClick(product) {
  emit("product-click", product);
  // TODO: router.push({ name: "ActivityDetail", params: { slug: product.slug } });
}

// ─── Watch prop changes ──────────────────────────────────────────
watch(
  () => props.categorySlug,
  (slug) => {
    activeCategorySlug.value = slug;
    fetchProducts(true);
  },
);

// ─── Lifecycle ───────────────────────────────────────────────────
onMounted(async () => {
  await loadFilterMeta();
  await fetchProducts(true);
  await nextTick();
  setupObserver();
});

onBeforeUnmount(() => {
  observer?.disconnect();
});

// ─── Dummy products (delete when API is live) ─────────────────────
const DUMMY_PRODUCTS = [
  {
    id: 1,
    name: "Scuba Diving – Havelock Island",
    slug: "scuba-havelock",
    base_price: 6500,
    compare_price: 8000,
    duration: "3 hrs",
    featured: true,
    location: { id: 2, name: "Havelock" },
    category: { name: "Scuba" },
    tags: [{ id: 1, name: "Beginner Friendly" }],
    productTypes: [{ id: 1, name: "Water Activity" }],
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
        sort_order: 1,
      },
    ],
  },
  {
    id: 2,
    name: "Mangrove Kayaking – Baratang",
    slug: "kayak-baratang",
    base_price: 3500,
    compare_price: 4000,
    duration: "2.5 hrs",
    featured: false,
    location: { id: 4, name: "Baratang" },
    category: { name: "Kayaking" },
    tags: [],
    productTypes: [{ id: 1, name: "Water Activity" }],
    images: [
      {
        image_url:
          "https://go2andaman.com/wp-content/uploads/2025/08/pexels-ladyfern-photos-3230581-scaled-e1713328873135.jpg",
        sort_order: 1,
      },
    ],
  },
  {
    id: 3,
    name: "Sunset Cruise – Port Blair",
    slug: "sunset-cruise",
    base_price: 2500,
    compare_price: null,
    duration: "2 hrs",
    featured: true,
    location: { id: 1, name: "Port Blair" },
    category: { name: "Experiences" },
    tags: [{ id: 3, name: "Family" }],
    productTypes: [],
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600",
        sort_order: 1,
      },
    ],
  },
  {
    id: 4,
    name: "Baratang Island Day Trip",
    slug: "baratang-day-trip",
    base_price: 7500,
    compare_price: 10000,
    duration: "12 hrs",
    featured: true,
    location: { id: 4, name: "Baratang" },
    category: { name: "Day Trips" },
    tags: [{ id: 3, name: "Family" }],
    productTypes: [{ id: 2, name: "Land Tour" }],
    images: [
      {
        image_url:
          "https://go2andaman.com/wp-content/uploads/2025/09/go2andaman_baratang_8505-2.jpg",
        sort_order: 1,
      },
    ],
  },
  {
    id: 5,
    name: "Night Kayaking – Port Blair",
    slug: "night-kayak",
    base_price: 3500,
    compare_price: null,
    duration: "3 hrs",
    featured: false,
    location: { id: 1, name: "Port Blair" },
    category: { name: "Kayaking" },
    tags: [],
    productTypes: [{ id: 1, name: "Water Activity" }],
    images: [],
  },
  {
    id: 6,
    name: "Island Hopping – Neil Island",
    slug: "neil-hopping",
    base_price: 5000,
    compare_price: 6500,
    duration: "6 hrs",
    featured: false,
    location: { id: 3, name: "Neil Island" },
    category: { name: "Day Trips" },
    tags: [{ id: 3, name: "Family" }],
    productTypes: [{ id: 2, name: "Land Tour" }],
    images: [
      {
        image_url:
          "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600",
        sort_order: 1,
      },
    ],
  },
];
</script>

<style scoped>
/* ── Filter bar ── */
.filter-bar-wrap {
  background: #fff;
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  position: sticky;
  top: 0;
  z-index: 9;
}

/* ── Quick menu items (location/sort dropdowns) ── */
.quick-menu-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.1s;
}

.quick-menu-item:hover {
  background: rgba(41, 51, 155, 0.05);
}

/* ── Sentinel ── */
.sentinel {
  height: 1px;
  width: 100%;
}

/* ── Empty state ── */
.empty-state {
  min-height: 300px;
}
</style>
