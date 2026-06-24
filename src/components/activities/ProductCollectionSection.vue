<template>
  <div class="mb-8">
    <div
      class="d-flex align-center justify-space-between mb-4"
    >
      <div
        class="g2a-subtitle g2a-text-bold-600"
      >
        {{ collection.name }}
      </div>

      <!-- <v-btn
        variant="text"
        size="small"
      >
        View All
      </v-btn> -->
    </div>

    <v-slide-group show-arrows>
      <v-slide-group-item
        v-for="product in collection.products"
        :key="product.id"
      >
        <div
          style="width:280px"
          class="me-4"
        >
          <ProductCard
            :product="product"
            @click="onProductClick"
          />
        </div>
      </v-slide-group-item>
    </v-slide-group>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import ProductCard from "./ProductCard.vue";

const props = defineProps({
  collection: {
    type: Object,
    required: true,
  },
});

const router = useRouter();

const onProductClick = (product) => {
  router.push(
    `/activities/product/${product.slug}`
  );
};
</script>