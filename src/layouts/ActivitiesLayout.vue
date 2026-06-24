<template>
  <div class="activities-list-page">
    <!-- Category Nav Tabs -->
    <div class="category-nav-wrapper">
      <v-container class="py-0">
        <div class="category-nav no-scrollbar">
          <button
            v-for="cat in categories"
            :key="cat.key"
            class="cat-tab"
            :class="{ active: activeRoute === cat.route }"
            @click="setCategory(cat)"
          >
            <v-icon :icon="cat.icon" size="16" class="me-1" />
            {{ cat.label }}
          </button>
        </div>
      </v-container>
    </div>

    <div class="my-4">
      <router-view></router-view>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

const categories = [
  {
    key: "v2",
    label: "Home",
    icon: "mdi-home",
    route: "Activities",
  },
  {
    key: "scuba",
    label: "Scuba",
    icon: "mdi-diving-scuba-mask",
    route: "Scuba",
  },
  {
    key: "kayaking",
    label: "Kayaking",
    icon: "mdi-kayaking",
    route: "Kayaking",
  },
  {
    key: "day-trips",
    label: "Day Trip",
    icon: "mdi-island",
    route: "DayTrips",
  },
  {
    key: "water-sports",
    label: "Water Sport",
    icon: "mdi-water",
    route: "WaterSports",
  },
  {
    key: "getting-around",
    label: "Getting Around",
    icon: "mdi-car",
    route: "GettingAround",
  },
  {
    key: "history",
    label: "History & Culture",
    icon: "mdi-bank",
    route: "History",
  },
];

const activeRoute = computed(() => route.name);

function setCategory(category) {
  router.push({
    name: category.route,
  });
}
</script>

<style scoped>
/* ── Category Nav ── */
.category-nav-wrapper {
  position: sticky;
  top: 70px;
  z-index: 9999;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
  border-radius: 8px;
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
  top: 70px;
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
</style>
