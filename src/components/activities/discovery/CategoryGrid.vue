<template>
  <div>
    <div class="mb-8 mt-4 g2a-title-heading">
      What are you looking for today?
    </div>

    <v-row>
      <v-col
        v-for="category in categories"
        :key="category.id"
        cols="6"
        sm="4"
        md="3"
      >
        <v-card
          variant="flat"
          rounded="xl"
          height="130"
          class="category-card"
          :color="getActivitieTheme(category.name).bg"
          @click="openCategory(category)"
        >
          <v-container class="fill-height position-relative pa-4">
            <div
              class="g2a-title-4"
              :class="getActivitieTheme(category.name).text"
            >
              {{ category.name }}
            </div>

            <v-icon
              :icon="category.icon"
              size="72"
              :color="getActivitieTheme(category.name).iconColor"
              class="category-icon"
            />
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTheme } from "vuetify";

import apiClient from "@/services/api";

const router = useRouter();
const theme = useTheme();

const categories = ref([]);

const categoryIcons = {
  "Water Sports": "mdi-water",
  "Day Trips": "mdi-island",
  "Exclusive Experiences": "mdi-star-four-points",
  "Getting Around": "mdi-car",
  "History & Culture": "mdi-bank",
  "Treks and Walks": "mdi-hiking",
  Stargazing: "mdi-telescope",
  "Scuba Diving": "mdi-diving-scuba-mask",
  Kayaking: "mdi-kayaking",
};

const activityColors = {
  "Water Sports": "blue",
  "Day Trips": "orange",
  "Exclusive Experiences": "purple",
  "Getting Around": "grey",
  "History & Culture": "amber",
  "Treks and Walks": "green",
  Stargazing: "deep-purple",
  "Scuba Diving": "cyan",
  Kayaking: "teal",
};

function getActivitieTheme(name) {
  const color = activityColors[name] || "light-blue";
  const dark = theme.global.current.value.dark;

  return {
    bg: dark ? "surface-variant" : `${color}-lighten-5`,
    text: dark ? "text-white" : `text-${color}-darken-4`,
    iconColor: dark ? `${color}-lighten-1` : `${color}-lighten-3`,
  };
}

async function loadCategories() {
  try {
    const { data } = await apiClient.get("/v1/product-categories");

    categories.value = (data?.data || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => ({
        ...category,
        icon:
          category.icon ||
          categoryIcons[category.name] ||
          "mdi-shape-outline",
      }));
  } catch (err) {
    console.error("[CategoryGrid]", err);
  }
}

function openCategory(category) {
  router.push({
    name: "ActivitiesCategory",
    params: {
      category: category.slug,
    },
  });
}

onMounted(loadCategories);
</script>

<style scoped>
.category-card {
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.category-icon {
  position: absolute;
  right: -8px;
  bottom: -8px;
  opacity: 0.22;
  transform: rotate(-8deg);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
</style>