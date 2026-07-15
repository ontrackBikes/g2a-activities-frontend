<template>
  <div>
    <!-- Hero -->

    <v-card
      rounded="lg"
      elevation="0"
      class="overflow-hidden mb-6"
    >
      <v-img
        :src="category?.banner_url"
        height="250"
        cover
      >
        <div
          class="fill-height d-flex align-end"
        >
          <div class="pa-6 text-white">
            <div class="text-h4 font-weight-bold">
              {{ category?.name }}
            </div>

            <div class="mt-2">
              {{
                category?.short_description
              }}
            </div>
          </div>
        </div>
      </v-img>
    </v-card>

    <!-- Product Types -->

    <div
      v-if="productTypes.length"
      class="mb-6"
    >
      <div
        class="g2a-subtitle g2a-text-bold-600 mb-3"
      >
        Browse By Type
      </div>

      <v-chip-group>
        <v-chip
          v-for="type in productTypes"
          :key="type.id"
          filter
          variant="outlined"
          @click="selectedType = type.id"
        >
          {{ type.name }}
        </v-chip>
      </v-chip-group>
    </div>

    <!-- Products -->

    <v-row>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        md="4"
      >
        <v-card
          rounded="lg"
          elevation="0"
          variant="outlined"
        >
          <v-img
            :src="product.thumbnail_url"
            height="220"
            cover
          />

          <v-card-text>
            <div
              class="g2a-text-16 g2a-text-bold-600"
            >
              {{ product.name }}
            </div>

            <div
              class="g2a-text-13 mt-2"
            >
              {{
                product.short_description
              }}
            </div>

            <div class="mt-3">
              <v-chip
                size="small"
                color="brandColor2"
              >
                {{
                  product.productType?.name
                }}
              </v-chip>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-empty-state
      v-if="!loading && !products.length"
      title="No products found"
    />
  </div>
</template>

<script setup>
import apiClient from "@/services/api";
import {
  ref,
  watch,
} from "vue";

const props = defineProps({
  categorySlug: {
    type: String,
    required: true,
  },
});

const loading = ref(false);

const category = ref(null);

const products = ref([]);

const productTypes = ref([]);

const selectedType = ref(null);

const loadData = async () => {
  try {
    loading.value = true;

    /**
     * Category
     */
    const categoryResponse =
      await apiClient.get(
        `/v1/product-categories/${props.categorySlug}`
      );

    category.value =
      categoryResponse.data.data;

    /**
     * Product Types
     */
    const productTypeResponse =
      await apiClient.get(
        `/v1/product-types?category_id=${category.value.id}`
      );

    productTypes.value =
      productTypeResponse.data.data || [];

    /**
     * Products
     */
    let url =
      `/v1/products?category_slug=${props.categorySlug}`;

    if (selectedType.value) {
      url += `&product_type_id=${selectedType.value}`;
    }

    const productsResponse =
      await apiClient.get(url);

    products.value =
      productsResponse.data.data || [];
  } catch (error) {
    console.error(error);
  } finally {
    loading.value = false;
  }
};

watch(
  () => props.categorySlug,
  loadData,
  {
    immediate: true,
  }
);

watch(selectedType, loadData);
</script>