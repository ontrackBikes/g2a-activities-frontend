<template>
  <v-card
    variant="outlined"
    rounded="lg"
    elevation="0"
    class="product-card h-100"
    @click="$emit('click', product)"
  >
  
    <v-img
      v-if="imageUrl"
      :src="imageUrl"
      height="180"
      cover
    />

    <div
      v-else
      class="product-card__no-img pa-4"
    >
      <v-icon
        icon="mdi-image-outline"
        size="40"
      />
    </div>

    <v-card-text>
      <div
        class="g2a-text-16 g2a-text-bold-600"
      >
        {{ product.name }}
      </div>

      <div
        class="g2a-text-12 text-greyDark mt-1"
      >
        {{ product.productType?.name }}
      </div>

      <div
        v-if="product.short_description"
        class="g2a-text-12 mt-2"
      >
        {{ product.short_description }}
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const imageUrl = computed(() => {
  return (
    props.product.thumbnail_url ||
    props.product.images?.[0]?.image_url ||
    null
  );
});
</script>