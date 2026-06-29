<template>
  <div class="my-5">
    <div class="d-flex align-center mb-6">
      <div
        class="g2a-text-bold-600"
        :class="mobile ? 'g2a-text-18' : 'g2a-text-24'"
      >
        What are you looking for today?
      </div>
    </div>

    <v-row class="ga-y-2">
      <v-col
        v-for="category in categories"
        :key="category.id"
        cols="6"
        sm="4"
        md="3"
        class="pa-2"
      >
        <v-hover v-slot="{ isHovering, props }">
          <v-card
            v-bind="props"
            variant="flat"
            rounded="xl"
            :color="getActivitieTheme(category.name).bg"
            class="overflow-hidden position-relative d-flex flex-column justify-space-between cursor-pointer"
            height="130"
            :style="{
              transform: isHovering ? 'scale(1.02) translateY(-2px)' : 'none',
              transition: 'all 0.25s cubic-bezier(0.2, 0.8, 0.2, 1)',
            }"
            @click="openCategory(category)"
          >
            <div class="pa-4 w-60 z-index-2">
              <div
                class="g2a-text-16 g2a-text-bold-700 line-height-tight"
                :class="getActivitieTheme(category.name).text"
              >
                {{ category.name }}
              </div>
              <div class="g2a-text-11 opacity-70 mt-1 text-grey-darken-3">
                Explore now
              </div>
            </div>

            <v-icon
              :icon="category.icon"
              size="72"
              :color="getActivitieTheme(category.name).iconColor"
              class="position-absolute"
              style="
                bottom: -10px;
                right: -6px;
                opacity: 0.9;
                transform: rotate(-5deg);
              "
            />
          </v-card>
        </v-hover>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/services/api";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const router = useRouter();
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

const getActivitieTheme = (name) => {
  const themes = {
    "Water Sports": {
      bg: "blue-lighten-5",
      text: "text-blue-darken-4",
      iconColor: "blue-lighten-3",
      accent: "bg-blue-darken-2",
    },
    "Day Trips": {
      bg: "orange-lighten-5",
      text: "text-orange-darken-4",
      iconColor: "orange-lighten-3",
      accent: "bg-orange-darken-2",
    },
    "Exclusive Experiences": {
      bg: "purple-lighten-5",
      text: "text-purple-darken-4",
      iconColor: "purple-lighten-3",
      accent: "bg-purple-darken-2",
    },
    "Getting Around": {
      bg: "grey-lighten-4",
      text: "text-grey-darken-4",
      iconColor: "grey-lighten-2",
      accent: "bg-grey-darken-2",
    },
    "History & Culture": {
      bg: "amber-lighten-5",
      text: "text-amber-darken-4",
      iconColor: "amber-lighten-3",
      accent: "bg-amber-darken-2",
    },
    "Treks and Walks": {
      bg: "green-lighten-5",
      text: "text-green-darken-4",
      iconColor: "green-lighten-3",
      accent: "bg-green-darken-2",
    },
    Stargazing: {
      bg: "deep-purple-lighten-5",
      text: "text-deep-purple-darken-4",
      iconColor: "deep-purple-lighten-3",
      accent: "bg-deep-purple-darken-2",
    },
    "Scuba Diving": {
      bg: "cyan-lighten-5",
      text: "text-cyan-darken-4",
      iconColor: "cyan-lighten-3",
      accent: "bg-cyan-darken-2",
    },
    Kayaking: {
      bg: "teal-lighten-5",
      text: "text-teal-darken-4",
      iconColor: "teal-lighten-3",
      accent: "bg-teal-darken-2",
    },
  };
  return (
    themes[name] || {
      bg: "light-blue-lighten-5",
      text: "text-light-blue-darken-4",
      iconColor: "light-blue-lighten-3",
      accent: "bg-light-blue-darken-2",
    }
  );
};

const loadCategories = async () => {
  try {
    const response = await apiClient.get("/v1/product-categories");

    categories.value = (response.data?.data || [])
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((item) => ({
        ...item,
        icon: item.icon || categoryIcons[item.name] || "mdi-shape-outline",
      }));
  } catch (err) {
    console.error("[CategoryGrid]", err);
  }
};

const openCategory = (category) => {
  router.push({
    name: "ActivitiesCategory",
    params: {
      category: category.slug,
    },
  });
};

onMounted(() => {
  loadCategories();
});
</script>
