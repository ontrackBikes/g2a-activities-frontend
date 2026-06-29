<template>
  <v-card
    variant="outlined"
    rounded="xl"
    elevation="0"
    class="product-card h-100"
    @click="$emit('click', product)"
  >
    <!-- Image -->
    <div class="product-card__img-wrap">
      <v-img :src="getImageUrl(product) || fallbackImg" height="185" cover>
        <template #placeholder>
          <div
            class="product-card__img-placeholder d-flex align-center justify-center fill-height"
          >
            <v-icon icon="mdi-image-outline" size="40" color="greyLight" />
          </div>
        </template>

        <!-- Top badges -->
        <div class="d-flex align-start justify-space-between pa-2">
          <div class="d-flex flex-column ga-1">
            <v-chip
              v-if="product.featured"
              size="x-small"
              color="brandColor"
              class="g2a-text-bold-600 g2a-text-10"
            >
              ⭐ Featured
            </v-chip>
            <v-chip
              v-if="firstTag"
              size="x-small"
              color="white"
              variant="elevated"
              class="g2a-text-bold-600 g2a-text-10 text-brandColor2"
            >
              {{ firstTag.name }}
            </v-chip>
          </div>
        </div>
      </v-img>
    </div>

    <!-- Content -->
    <v-container>
      <!-- Name -->

      <div class="g2a-title-4">{{ product.name }}</div>
      <div class="d-flex align-center g2a-text-12 mb-2" v-if="locationText">
        <v-icon
          icon="mdi-map-marker-outline"
          size="13"
          class="me-1"
          color="brandColor2"
        />
        {{ locationText }}
      </div>

      <!-- Divider -->
      <v-divider v-if="product.starting_price" class="my-2" />

      <!-- Price row -->
      <div
        v-if="product.starting_price"
        class="d-flex align-center justify-space-between"
      >
        <div>
          <div class="g2a-text-11 text-greyDark">starts from</div>
          <div class="d-flex align-baseline ga-1">
            <span class="g2a-text-18 g2a-text-bold-700 text-brandColor2">
              ₹{{ formatPrice(product.starting_price) }}
            </span>
            <span
              v-if="
                product.compare_price &&
                product.compare_price > product.base_price
              "
              class="g2a-text-12 text-decoration-line-through text-greyDark"
            >
              ₹{{ formatPrice(product.compare_price) }}
            </span>
          </div>
        </div>

        <!-- Discount badge -->
        <v-chip
          v-if="discountPct > 0"
          size="small"
          color="success"
          class="g2a-text-11 g2a-text-bold-700"
        >
          {{ discountPct }}% OFF
        </v-chip>

        <!-- CTA arrow if no discount -->
        <v-btn
          v-else
          icon
          size="small"
          variant="tonal"
          color="brandColor2"
          class="product-card__arrow"
        >
          <v-icon icon="mdi-arrow-right" size="16" />
        </v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const locationText = computed(() => {
  const locations = props.product.locations || [];

  if (!locations.length) return null;

  if (locations.length === 1) {
    return locations[0].name;
  }

  if (locations.length === 2) {
    return locations.map((l) => l.name).join(", ");
  }

  return `${locations[0].name} +${locations.length - 1}`;
});

defineEmits(["click"]);

const wishlisted = ref(false);
const fallbackImg =
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600";

// ── Computed ──────────────────────────────────────────────────────
const getImageUrl = (product) => {
  // vendor-product images take priority, then product-level images

  return product.thumbnail_url || product.vendorProduct?.images;
};

const firstTag = computed(() => props.product.tags?.[0] || null);

const discountPct = computed(() => {
  const base = props.product.base_price;
  const compare = props.product.compare_price;
  if (!base || !compare || compare <= base) return 0;
  return Math.round(((compare - base) / compare) * 100);
});

// ── Methods ───────────────────────────────────────────────────────
function formatPrice(val) {
  if (!val && val !== 0) return "—";
  return Number(val).toLocaleString("en-IN");
}
</script>

<style scoped></style>
