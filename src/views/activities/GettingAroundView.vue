<template>
  <div class="activities-list-page">
    <!-- Hero Banner for active category -->
    <div
      class="category-hero mb-8"
      :style="{ backgroundImage: `url(${activeData.heroImg})` }"
    >
      <div class="category-hero__overlay">
        <v-chip size="small" color="brandColor" class="mb-3">
          <v-icon icon="mdi-fire" size="12" class="me-1" />
          <span class="g2a-text-10 g2a-text-bold-600">{{
            activeData.badge
          }}</span>
        </v-chip>
        <div class="g2a-title-1 text-white">{{ activeData.title }}</div>
        <div class="g2a-subtitle-0 text-white mt-1" style="opacity: 0.85">
          {{ activeData.subtitle }}
        </div>
        <div class="d-flex align-center ga-4 mt-4">
          <div class="stat-pill">
            <v-icon icon="mdi-ticket-outline" size="14" class="me-1" />
            {{ activeData.totalProducts }} Experiences
          </div>
          <div class="stat-pill">
            <v-icon icon="mdi-star" size="14" color="amber" class="me-1" />
            {{ activeData.avgRating }} Avg Rating
          </div>
          <div class="stat-pill">
            <v-icon icon="mdi-map-marker" size="14" class="me-1" />
            {{ activeData.locations }} Locations
          </div>
        </div>
      </div>
    </div>

    <!-- Most Popular Sidebar + Main Content layout -->
    <v-row>
      <!-- Main content -->
      <v-col cols="12" md="8">
        <!-- Ticket Groups: rendered per section -->
        <div v-for="group in activeData.groups" :key="group.title" class="mb-8">
          <div class="d-flex align-center justify-space-between mb-4">
            <div>
              <div class="g2a-subtitle-dark">{{ group.title }}</div>
              <div class="g2a-text-12 text-greyDark mt-1">
                {{ group.description }}
              </div>
            </div>
            <v-chip
              v-if="group.tag"
              size="small"
              :color="group.tagColor || 'brandColor2'"
              variant="tonal"
            >
              <span class="g2a-text-10 g2a-text-bold-600">{{ group.tag }}</span>
            </v-chip>
          </div>

          <v-row>
            <v-col
              v-for="product in group.products"
              :key="product.id"
              cols="12"
              sm="6"
            >
              <v-card
                variant="outlined"
                rounded="lg"
                elevation="0"
                class="product-card h-100"
                @click="onProductClick(product)"
              >
                <!-- Product image (optional — only if product.img exists) -->
                <v-img
                  v-if="product.img"
                  :src="product.img"
                  height="150"
                  cover
                  class="product-card__img"
                >
                  <div class="d-flex justify-space-between pa-2">
                    <v-chip
                      v-if="product.badge"
                      size="x-small"
                      :color="product.badgeColor || 'brandColor'"
                      class="g2a-text-bold-600"
                    >
                      {{ product.badge }}
                    </v-chip>
                  </div>
                </v-img>

                <!-- No image: compact text-only card (like the wireframe) -->
                <div v-else class="product-card__no-img pa-4">
                  <v-chip
                    v-if="product.badge"
                    size="x-small"
                    :color="product.badgeColor || 'brandColor2'"
                    variant="tonal"
                    class="mb-3 g2a-text-bold-600"
                  >
                    {{ product.badge }}
                  </v-chip>
                  <div class="price-label g2a-text-12 text-greyDark">
                    starts
                  </div>
                  <div class="d-flex align-baseline ga-1 mt-1">
                    <span
                      class="g2a-text-18 g2a-text-bold-700 text-brandColor2"
                    >
                      ₹{{ product.price.toLocaleString("en-IN") }}
                    </span>
                    <span
                      v-if="product.originalPrice"
                      class="g2a-text-12 text-decoration-line-through text-greyDark ms-1"
                    >
                      ₹{{ product.originalPrice.toLocaleString("en-IN") }}
                    </span>
                    <v-chip
                      v-if="product.discount"
                      size="x-small"
                      color="success"
                      class="ms-1 g2a-text-bold-600"
                    >
                      {{ product.discount }}% OFF
                    </v-chip>
                  </div>
                </div>

                <v-card-text class="pt-2 pb-3">
                  <div class="g2a-text-14 g2a-text-bold-600 mb-1">
                    {{ product.name }}
                  </div>
                  <div
                    class="d-flex align-center justify-space-between g2a-text-12 text-greyDark"
                  >
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-map-marker" size="12" class="me-1" />
                      {{ product.location }}
                    </div>
                    <div class="d-flex align-center">
                      <v-icon icon="mdi-clock-outline" size="12" class="me-1" />
                      {{ product.duration }}
                    </div>
                  </div>

                  <!-- Price row (only for cards WITH image) -->
                  <div
                    v-if="product.img"
                    class="d-flex align-baseline ga-1 mt-2"
                  >
                    <span class="g2a-text-12 text-greyDark">starts</span>
                    <span
                      class="g2a-text-16 g2a-text-bold-700 text-brandColor2 ms-1"
                    >
                      ₹{{ product.price.toLocaleString("en-IN") }}
                    </span>
                    <span
                      v-if="product.originalPrice"
                      class="g2a-text-12 text-decoration-line-through text-greyDark ms-1"
                    >
                      ₹{{ product.originalPrice.toLocaleString("en-IN") }}
                    </span>
                    <v-chip
                      v-if="product.discount"
                      size="x-small"
                      color="success"
                      class="ms-1"
                    >
                      {{ product.discount }}% OFF
                    </v-chip>
                  </div>

                  <div class="d-flex align-center mt-2 ga-1">
                    <v-icon icon="mdi-star" size="12" color="amber" />
                    <span class="g2a-text-12 g2a-text-bold-600">{{
                      product.rating
                    }}</span>
                    <span class="g2a-text-12 text-greyDark"
                      >({{ product.reviews }})</span
                    >
                    <v-spacer />
                    <div class="d-flex align-center g2a-text-11 text-greyDark">
                      <v-icon icon="mdi-account-group" size="12" class="me-1" />
                      {{ product.seatsLeft }} left
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Promo Banner -->
        <v-card
          v-if="activeData.promo"
          rounded="lg"
          elevation="0"
          class="promo-banner pa-5 d-flex align-center justify-space-between"
        >
          <div>
            <div class="d-flex align-center mb-2 ga-2">
              <v-chip size="small" color="brandColor" class="g2a-text-bold-600">
                {{ activeData.promo.tag }}
              </v-chip>
            </div>
            <div class="g2a-subtitle-dark">{{ activeData.promo.title }}</div>
            <div class="g2a-text-12 text-greyDark mt-1">
              {{ activeData.promo.subtitle }}
            </div>
            <v-btn
              variant="outlined"
              rounded="lg"
              size="small"
              color="brandColor2"
              class="mt-4 g2a-text-bold-600"
              @click="onPromoClick"
            >
              {{ activeData.promo.cta }}
            </v-btn>
          </div>
          <v-img
            v-if="activeData.promo.img"
            :src="activeData.promo.img"
            width="120"
            height="120"
            cover
            rounded="lg"
            class="flex-shrink-0 ms-4"
          />
        </v-card>
      </v-col>

      <!-- Sidebar: Most Popular -->
      <v-col cols="12" md="4">
        <div class="sidebar-sticky">
          <div class="d-flex align-center mb-4">
            <v-icon
              icon="mdi-trophy-outline"
              size="18"
              color="brandColor2"
              class="me-2"
            />
            <div class="g2a-subtitle-1 g2a-text-bold-600">Most Popular</div>
          </div>

          <v-card
            v-for="item in activeData.popular"
            :key="item.id"
            variant="outlined"
            rounded="lg"
            elevation="0"
            class="popular-card mb-3 pa-3"
            @click="onProductClick(item)"
          >
            <div class="d-flex align-center ga-3">
              <!-- thumb -->
              <v-img
                :src="item.img || 'https://via.placeholder.com/72'"
                width="72"
                height="72"
                cover
                rounded="lg"
                class="flex-shrink-0"
              />
              <div class="flex-grow-1 min-width-0">
                <v-chip
                  v-if="item.badge"
                  size="x-small"
                  :color="item.badgeColor || 'brandColor'"
                  class="mb-1 g2a-text-bold-600"
                >
                  {{ item.badge }}
                </v-chip>
                <div class="g2a-text-13 g2a-text-bold-600 truncate-two-lines">
                  {{ item.name }}
                </div>
                <div class="g2a-text-12 text-greyDark mt-1">
                  {{ item.duration }}
                </div>
                <div
                  class="g2a-text-13 g2a-text-bold-700 text-brandColor2 mt-1"
                >
                  ₹{{ item.price.toLocaleString("en-IN") }}
                </div>
              </div>
              <v-icon
                icon="mdi-chevron-right"
                size="18"
                color="greyDark"
                class="flex-shrink-0"
              />
            </div>
          </v-card>

          <v-btn
            variant="outlined"
            rounded="lg"
            block
            color="brandColor2"
            class="mt-2 g2a-text-bold-600"
            @click="exploreAll"
          >
            Explore All
          </v-btn>
        </div>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

// ─── Category Nav ─────────────────────────────────────────────────────────────
const categories = ref([
  { key: "scuba", label: "Scuba", icon: "mdi-diving-scuba-mask" },
  { key: "kayaking", label: "Kayaking", icon: "mdi-kayaking" },
  { key: "experiences", label: "Experiences", icon: "mdi-star-four-points" },
  { key: "day-trips", label: "Day Trip", icon: "mdi-island" },
  { key: "water-sports", label: "Water Sport", icon: "mdi-water" },
  { key: "nature", label: "Nature Walk", icon: "mdi-tree" },
  { key: "getting-around", label: "Getting Around", icon: "mdi-car" },
  { key: "history", label: "History & Culture", icon: "mdi-bank" },
]);

const activeCategory = ref("getting-around");
const activeLocation = ref("All");

function exploreAll() {
  // TODO: navigate to full listing or apply "all" filter
  console.log("Explore All clicked");
}
function onProductClick(product) {
  // TODO: router.push({ name: 'ActivityDetail', params: { id: product.id } })
  console.log("Product clicked:", product.id);
  router.push({
    name: "ProductDetail",
    params: {
      id: product.id,
    },
  });
}
function onPromoClick() {
  // TODO: handle promo CTA navigation
  console.log("Promo CTA clicked");
}

// ─── Dummy Data ────────────────────────────────────────────────────────────────
// Each category key maps to its page data.
// Replace `products`, `groups`, `popular` etc. with real API calls once backend is ready.

const categoryData = ref({
  "getting-around": {
    heroImg:
      "https://go2andaman.com/wp-content/uploads/2025/10/SCOOTY-RENTAL-IMG2025-8-e1763714893701.jpg",
    badge: "Travel Essential",
    title: "Getting Around",
    subtitle:
      "Reliable airport, jetty and island taxi transfers across Port Blair, Havelock and Neil Island.",
    totalProducts: 4,
    avgRating: "4.8",
    locations: 3,

    promo: {
      tag: "Private Transfers",
      title: "Pre-Book Your Airport & Jetty Transfers",
      subtitle:
        "Comfortable vehicles, professional drivers and timely pickups across the Andaman Islands.",
      cta: "Book Transfer",
      img: "https://go2andaman.com/wp-content/uploads/2025/09/airport-transfer-andaman.jpg",
    },

    groups: [
      {
        title: "Airport & Jetty Transfers",
        description:
          "Convenient point-to-point transfers for a hassle-free journey.",
        tag: "Most Booked",
        tagColor: "success",

        products: [
          {
            id: "airport-transfer",
            name: "Airport Transfers",
            location: "Port Blair",
            duration: "As per schedule",
            price: 800,
            originalPrice: 1000,
            discount: 20,
            rating: 4.8,
            reviews: 412,
            seatsLeft: 18,
            badge: "Best Seller",
            badgeColor: "brandColor",
            img: "https://go2andaman.com/wp-content/uploads/2025/10/AIRPORT-IMG2025-36-e1763718232427.jpg",
          },
          {
            id: "port-blair-airport-jetty-transfer",
            name: "Port Blair Airport / Jetty Transfer Taxi",
            location: "Port Blair",
            duration: "30 - 60 mins",
            price: 1200,
            originalPrice: 1500,
            discount: 20,
            rating: 4.7,
            reviews: 286,
            seatsLeft: 12,
            badge: "Popular",
            badgeColor: "info",
            img: "https://go2andaman.com/wp-content/uploads/2025/10/AIRPORT-IMG2025-4.jpg",
          },
          {
            id: "neil-jetty-transfer",
            name: "Neil Jetty Transfer Taxi",
            location: "Neil Island",
            duration: "15 - 30 mins",
            price: 700,
            originalPrice: 900,
            discount: 22,
            rating: 4.8,
            reviews: 174,
            seatsLeft: 8,
            badge: null,
            img: "https://go2andaman.com/wp-content/uploads/2025/10/IMG20250929123306.jpg",
          },
          {
            id: "havelock-jetty-transfer",
            name: "Havelock Jetty Transfer Taxi",
            location: "Havelock Island",
            duration: "20 - 40 mins",
            price: 800,
            originalPrice: 1000,
            discount: 20,
            rating: 4.9,
            reviews: 324,
            seatsLeft: 10,
            badge: "Top Rated",
            badgeColor: "amber",
            img: "https://go2andaman.com/wp-content/uploads/2025/10/IMG20250929123433.jpg",
          },
        ],
      },
      {
        title: "Bike Rentals",
        description: "The most fun way to get around on the islands.",
        tag: "₹ 600 onwards",
        tagColor: "success",

        products: [
          {
            id: "bike-rental-in-port-blair",
            name: "Bike Rental - Port Blair",
            location: "Port Blair",
            duration: "As per day",
            price: 600,
            originalPrice: 1000,
            discount: 20,
            rating: 4.8,
            reviews: 312,
            seatsLeft: 18,
            badge: "Best Seller",
            badgeColor: "brandColor",
            img: "https://go2andaman.com/wp-content/uploads/2025/10/SCOOTY-RENTAL-IMG2025-22-e1763714249500.jpg",
          },
          {
            id: "bike-rental-in-havelock",
            name: "Bike Rental - Havelock",
            location: "Havelock",
            duration: "Per day",
            price: 700,
            originalPrice: 1500,
            discount: 20,
            rating: 4.7,
            reviews: 286,
            seatsLeft: 12,
            badge: "Popular",
            badgeColor: "info",
            img: "https://go2andaman.com/wp-content/uploads/2025/10/SCOOTY-RENTAL-IMG2025-16-e1763713589117.jpg",
          },
          {
            id: "bike-rental-in-neil",
            name: "Bike Rental - Neil Island",
            location: "Neil Island",
            duration: "15 - 30 mins",
            price: 700,
            originalPrice: 900,
            discount: 22,
            rating: 4.8,
            reviews: 174,
            seatsLeft: 8,
            badge: null,
            img: "https://go2andaman.com/wp-content/uploads/2025/10/SCOOTY-RENTAL-IMG2025-18.jpg",
          },
        ],
      },
    ],

    popular: [
      {
        id: "airport-transfer",
        name: "Airport Transfers",
        duration: "Flexible",
        price: 800,
        rating: 4.8,
        badge: "Best Seller",
        badgeColor: "brandColor",
        img: "https://go2andaman.com/wp-content/uploads/2025/10/AIRPORT-IMG2025-36-e1763718232427.jpg",
      },
      {
        id: "port-blair-airport-jetty-transfer",
        name: "Port Blair Airport / Jetty Transfer Taxi",
        duration: "30 - 60 mins",
        price: 1200,
        rating: 4.7,
        badge: "Popular",
        badgeColor: "info",
        img: "https://go2andaman.com/wp-content/uploads/2025/10/AIRPORT-IMG2025-4.jpg",
      },
      {
        id: "bike=rental-port-blair",
        name: "Bike Rental - Port Blair",
        duration: "Per day",
        price: 600,
        rating: 4.9,
        badge: "Top Rated",
        badgeColor: "amber",
        img: "https://go2andaman.com/wp-content/uploads/2025/10/SCOOTY-RENTAL-IMG2025-22-e1763714249500.jpg",
      },
    ],
  },
});

// Fallback for categories without full data yet
const fallbackData = {
  heroImg:
    "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=1200",
  badge: "Coming Soon",
  title: "More coming soon",
  subtitle: "We're adding more experiences in this category. Check back soon!",
  totalProducts: 0,
  avgRating: "—",
  locations: 0,
  promo: null,
  groups: [],
  popular: [],
};

const activeData = computed(
  () => categoryData.value[activeCategory.value] || fallbackData,
);
</script>

<style scoped>
/* ── Category Nav ── */
.category-nav-wrapper {
  position: sticky;
  top: 0;
  z-index: 10;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.category-nav {
  display: flex;
  gap: 0;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.cat-tab {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  padding: 14px 16px;
  font-size: 13px;
  font-weight: 500;
  color: rgba(0, 0, 0, 0.6);
  border: none;
  background: none;
  cursor: pointer;
  border-bottom: 2px solid transparent;
  transition:
    color 0.15s,
    border-color 0.15s;
  white-space: nowrap;
}

.cat-tab:hover {
  color: rgb(var(--v-theme-brandColor2));
}

.cat-tab.active {
  color: rgb(var(--v-theme-brandColor2));
  border-bottom-color: rgb(var(--v-theme-brandColor2));
  font-weight: 600;
}

/* ── Hero Banner ── */
.category-hero {
  border-radius: 16px;
  overflow: hidden;
  background-size: cover;
  background-position: center;
  min-height: 200px;
  position: relative;
}

.category-hero__overlay {
  background: linear-gradient(
    to right,
    rgba(0, 0, 0, 0.72) 40%,
    rgba(0, 0, 0, 0.1)
  );
  padding: 36px 32px;
  min-height: 200px;
}

.stat-pill {
  display: inline-flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(4px);
  color: #fff;
  font-size: 12px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.25);
}

/* ── Product Cards ── */
.product-card {
  cursor: pointer;
  transition:
    box-shadow 0.15s,
    transform 0.15s;
}

.product-card:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1) !important;
  transform: translateY(-2px);
}

.product-card__no-img {
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-brandColor2), 0.03),
    rgba(var(--v-theme-brandColor2), 0.06)
  );
  border-radius: 12px 12px 0 0;
}

/* ── Popular Sidebar ── */
.sidebar-sticky {
  position: sticky;
  top: 135px;
}

.popular-card {
  cursor: pointer;
  transition: box-shadow 0.15s;
}

.popular-card:hover {
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08) !important;
}

/* ── Promo Banner ── */
.promo-banner {
  border: 1px dashed rgba(var(--v-theme-brandColor2), 0.4) !important;
  background: linear-gradient(
    135deg,
    rgba(var(--v-theme-brandColor2), 0.04),
    rgba(var(--v-theme-brandColor), 0.04)
  );
}

/* ── Utilities ── */
.min-width-0 {
  min-width: 0;
}

.cursor-pointer {
  cursor: pointer;
}

.activities-list-page {
  background: #fafafa;
  min-height: 100vh;
}
</style>
