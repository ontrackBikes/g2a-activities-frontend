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
    >
      <div class="d-flex justify-space-between pa-2">
        <v-chip
          v-if="product.featured"
          size="x-small"
          color="amber"
        >
          Featured
        </v-chip>
      </div>
    </v-img>

    <div
      v-else
      class="product-card__placeholder"
    >
      <v-icon
        icon="mdi-image-outline"
        size="40"
      />
    </div>

    <v-card-text>
      <div
        class="g2a-text-16 g2a-text-bold-600 mb-1"
      >
        {{ product.name }}
      </div>

      <div
        class="g2a-text-12 text-greyDark mb-2"
      >
        {{ product.product_type?.name }}
      </div>

      <div
        v-if="product.short_description"
        class="g2a-text-12 mb-3"
      >
        {{ product.short_description }}
      </div>

      <div
        class="d-flex align-center justify-space-between"
      >
        <div>
          <div
            class="g2a-text-11 text-greyDark"
          >
            starts from
          </div>

          <div
            class="g2a-text-18 g2a-text-bold-700 text-brandColor2"
          >
            ₹{{
              Number(
                product.starting_price || 0
              ).toLocaleString("en-IN")
            }}
          </div>
        </div>

        <div
          v-if="
            product.locations &&
            product.locations.length
          "
          class="text-right"
        >
          <div
            class="g2a-text-11 text-greyDark"
          >
            Location
          </div>

          <div
            class="g2a-text-12 g2a-text-bold-600"
          >
            {{
              product.locations[0].name
            }}
          </div>
        </div>
      </div>

      <div
        v-if="
          product.tags &&
          product.tags.length
        "
        class="mt-3"
      >
        <v-chip
          v-for="tag in product.tags.slice(
            0,
            2
          )"
          :key="tag.slug"
          size="x-small"
          class="mr-1"
          variant="tonal"
        >
          {{ tag.name }}
        </v-chip>
      </div>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";

defineEmits(["click"]);

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const imageUrl = computed(() => {
  return (
    props.product.thumbnail_url ||
    null
  );
});
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-card__placeholder {
  height: 180px;

  display: flex;
  align-items: center;
  justify-content: center;

  background: rgba(
    var(--v-theme-brandColor2),
    0.05
  );
}
</style>