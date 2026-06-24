<template>
  <div>
    <h1>All {{ categorySlug.replaceAll("-", " ") }} products</h1>
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

    <div
      ref="loadMoreTrigger"
      class="py-8 text-center"
    >
      <v-progress-circular
        v-if="loadingMore"
        indeterminate
      />
    </div>

    <div
      v-if="!loading && products.length === 0"
      class="text-center py-8"
    >
      No products found.
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  watch,
  onMounted,
  onBeforeUnmount,
} from "vue";

import { useRouter } from "vue-router";
import apiClient from "@/services/api";

import ProductCard from "./cards/ProductCard.vue";

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

const hasMore = ref(true);

const loading = ref(false);

const loadingMore = ref(false);

const loadMoreTrigger = ref(null);

let observer = null;

const buildParams = () => ({
  page: page.value,
  limit: props.pageSize,

  category_slug:
    props.categorySlug || undefined,

  product_type_slug:
    props.productTypeSlug ||
    undefined,

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
  if (
    loading.value ||
    loadingMore.value
  )
    return;

  try {
    if (reset) {
      loading.value = true;
      page.value = 1;
      hasMore.value = true;
      products.value = [];
    } else {
      loadingMore.value = true;
    }

    const response =
      await apiClient.get(
        "/v1/products/app/products-list",
        {
          params: buildParams(),
        }
      );

    const items =
      response.data?.data || [];

    if (reset) {
      products.value = items;
    } else {
      products.value.push(...items);
    }

    if (
      items.length <
      props.pageSize
    ) {
      hasMore.value = false;
    }

    page.value += 1;
  } catch (err) {
    console.error(
      "[ActivitiesProductList]",
      err
    );
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

const openProduct = (
  product
) => {
  router.push(
    `/activities/product/${product.slug}`
  );
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

watch(
  () => [
    props.categorySlug,
    props.productTypeSlug,
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