<template>
  <v-card
    variant="outlined"
    rounded="lg"
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

          <!-- Wishlist button -->
          <v-btn
            icon
            size="x-small"
            variant="flat"
            color="white"
            class="product-card__wishlist"
            @click.stop="toggleWishlist"
          >
            <v-icon
              :icon="wishlisted ? 'mdi-heart' : 'mdi-heart-outline'"
              :color="wishlisted ? 'error' : 'greyDark'"
              size="16"
            />
          </v-btn>
        </div>
      </v-img>

      <!-- Category pill overlapping bottom of image -->
      <div v-if="product.category" class="product-card__category-pill">
        <v-chip
          size="x-small"
          color="brandColor2"
          class="g2a-text-10 g2a-text-bold-600 text-whte"
        >
          {{ product.category.name }}
        </v-chip>
      </div>
    </div>

    <!-- Content -->
    <v-card-text class="mt-2 pa-3 pb-3">
      <!-- Name -->
      <div class="g2a-text-14 g2a-text-bold-600 truncate-two-lines mb-2">
        {{ product.name }}
      </div>

      <!-- Location + Duration row -->
      <div
        class="d-flex align-center justify-space-between g2a-text-12 text-greyDark mb-2"
      >
        <div class="d-flex align-center">
          <v-icon
            icon="mdi-map-marker-outline"
            size="13"
            class="me-1"
            color="brandColor2"
          />
          {{ locationText }}
        </div>
        <div v-if="product.duration" class="d-flex align-center">
          <v-icon icon="mdi-clock-outline" size="13" class="me-1" />
          {{ product.duration }}
        </div>
      </div>

      <!-- Product type tags -->
      <div
        v-if="product.productTypes?.length"
        class="d-flex flex-wrap ga-1 mb-2"
      >
        <v-chip
          v-for="pt in product.productTypes.slice(0, 2)"
          :key="pt.id"
          size="x-small"
          variant="tonal"
          color="brandColor2"
          class="g2a-text-9 g2a-text-bold-600"
        >
          {{ pt.name }}
        </v-chip>
      </div>

      <!-- Divider -->
      <v-divider v-if="product.starting_price" class="mb-2" />

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
    </v-card-text>
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

  if (!locations.length) return "Andaman";

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

function toggleWishlist() {
  wishlisted.value = !wishlisted.value;
}
</script>

<style scoped>
.product-card {
  cursor: pointer;
  transition:
    box-shadow 0.18s ease,
    transform 0.18s ease;
  overflow: hidden;
}

.product-card:hover {
  box-shadow: 0 6px 24px rgba(41, 51, 155, 0.12) !important;
  transform: translateY(-3px);
}

.product-card__img-wrap {
  position: relative;
}

.product-card__wishlist {
  flex-shrink: 0;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.15) !important;
}

/* Category pill overlapping image bottom */
.product-card__category-pill {
  position: absolute;
  bottom: -23px;
  left: 260px;
  z-index: 1;
}
</style>
