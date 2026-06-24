<template>
  <div>
    <div
      class="g2a-subtitle mb-4"
    >
      {{ title }}
    </div>

    <v-row>
      <v-col
        v-for="product in products"
        :key="product.id"
        cols="12"
        md="4"
      >
        <v-card
          class="cursor-pointer"
          variant="outlined"
          @click="
            openProduct(product)
          "
        >
          <v-img
            :src="
              product.thumbnail_url
            "
            height="180"
            cover
          />

          <v-card-text>
            {{ product.name }}
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

defineProps({
  title: String,
  products: Array,
});

const openProduct = (
  product
) => {
  router.push({
    name:
      "ProductDetails",

    params: {
      slug:
        product.slug,
    },
  });
};
</script>