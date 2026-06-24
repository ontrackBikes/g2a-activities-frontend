<template>
  <div>
    <v-row>
      <v-col
        v-for="product in products"
        :key="product.slug"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <ProductCard
          :product="product"
          @click="openProduct(product)"
        />
      </v-col>
    </v-row>

    <!-- Loading -->
    <div
      v-if="loading && products.length === 0"
      class="text-center py-10"
    >
      <v-progress-circular
        indeterminate
        color="primary"
      />
    </div>

    <!-- Empty -->
    <div
      v-else-if="!loading && products.length === 0"
      class="text-center py-10"
    >
      <v-icon
        icon="mdi-package-variant"
        size="48"
        color="grey"
      />

      <div class="mt-2">
        No products found
      </div>
    </div>

    <!-- Infinite Loader -->
    <div
      ref="loadMoreTrigger"
      class="py-8 text-center"
    >
      <v-progress-circular
        v-if="loadingMore"
        indeterminate
        color="primary"
      />
    </div>
  </div>
</template>

<script setup>
import apiClient from "@/services/api";
import ProductCard from "@/components/activities/cards/ProductCard.vue";

import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

import { useRouter } from "vue-router";

const router = useRouter();

const props = defineProps({
  categorySlug: {
    type: String,
    default: null,
  },

  productTypeSlug: {
    type: String,
    default: null,
  },

  locationSlug: {
    type: String,
    default: null,
  },

  tagSlug: {
    type: String,
    default: null,
  },

  search: {
    type: String,
    default: null,
  },

  featured: {
    type: Boolean,
    default: null,
  },

  sort: {
    type: String,
    default: "recommended",
  },

  pageSize: {
    type: Number,
    default: 10,
  },
});

const products = ref([]);

const page = ref(1);

const loading = ref(false);

const loadingMore = ref(false);

const hasMore = ref(true);

const loadMoreTrigger = ref(null);

let observer = null;

const buildParams = () => ({
  page: page.value,

  limit: props.pageSize,

  category_slug:
    props.categorySlug || undefined,

  product_type_slug:
    props.productTypeSlug || undefined,

  location_slug:
    props.locationSlug || undefined,

  tag_slug:
    props.tagSlug || undefined,

  search:
    props.search || undefined,

  featured:
    props.featured === null
      ? undefined
      : props.featured,

  sort: props.sort,
});

const loadProducts = async (
  reset = false
) => {
  try {
    if (
      loading.value ||
      loadingMore.value
    ) {
      return;
    }

    if (reset) {
      loading.value = true;

      page.value = 1;

      hasMore.value = true;

      products.value = [];
    } else {
      if (!hasMore.value) return;

      loadingMore.value = true;
    }

    const response =
      await apiClient.get(
        "/v1/products/app/products-list",
        {
          params: buildParams(),
        }
      );

    const rows =
      response.data?.data || [];

    if (reset) {
      products.value = rows;
    } else {
      products.value.push(...rows);
    }

    if (
      rows.length <
      props.pageSize
    ) {
      hasMore.value = false;
    }

    page.value++;
  } catch (err) {
    console.error(
      "[InfiniteProductList]",
      err
    );
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const setupObserver = () => {
  observer =
    new IntersectionObserver(
      async (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          hasMore.value
        ) {
          await loadProducts();
        }
      },
      {
        rootMargin: "300px",
      }
    );

  if (
    loadMoreTrigger.value
  ) {
    observer.observe(
      loadMoreTrigger.value
    );
  }
};

const openProduct = (
  product
) => {
  router.push(
    `/activities/product/${product.slug}`
  );
};

watch(
  () => [
    props.categorySlug,
    props.productTypeSlug,
    props.locationSlug,
    props.tagSlug,
    props.search,
    props.featured,
    props.sort,
  ],
  async () => {
    await loadProducts(true);
  }
);

onMounted(async () => {
  await loadProducts(true);

  setupObserver();
});

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>