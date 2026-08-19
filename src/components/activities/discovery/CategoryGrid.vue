<template>
  <div>
    <div class="my-8 g2a-title-2xl">What are you looking for today?</div>

    <v-row>
      <v-col
        v-for="category in categories"
        :key="category.id"
        cols="6"
        sm="4"
        md="3"
      >
        <v-card
          flat
          rounded="lg"
          height="130"
          class="category-card"
          :color="activityColors[category.name] || 'surface'"
          @click="openCategory(category)"
        >
          <v-container class="fill-height position-relative pa-4">
            <div
              class="g2a-title-2xl"
              :style="{
                color: getThemeColor(`${activityColors[category.name]}-text`),
              }"
            >
              {{ category.name }}
            </div>

            <v-icon
              :icon="category.icon"
              size="72"
              :color="`${activityColors[category.name]}-icon`"
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
  "Cab Service": "mdi-taxi",
};

const activityColors = {
  "Water Sports": "cat-blue",
  "Day Trips": "cat-orange",
  "Exclusive Experiences": "cat-purple",
  "Getting Around": "cat-pink",
  "History & Culture": "cat-amber",
  "Treks and Walks": "cat-green",
  Stargazing: "cat-deep-purple",
  "Scuba Diving": "cat-cyan",
  Kayaking: "cat-teal",
  "Cab Service": "cat-purple",
};

function getThemeColor(colorName) {
  return (
    theme.current.value.colors[colorName] || theme.current.value.colors.primary
  );
}

async function loadCategories() {
  try {
    const { data } = await apiClient.get("/v1/product-categories");

    categories.value = (data?.data || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((category) => ({
        ...category,
        icon:
          category.icon || categoryIcons[category.name] || "mdi-shape-outline",
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
.category-icon {
  position: absolute;
  right: 0;
  bottom: 0;
  opacity: 0.12;
  transform: rotate(-8deg);
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
</style>
