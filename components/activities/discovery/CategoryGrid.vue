<template>
  <div>
    <div class="d-flex align-center my-4">
      <div class="g2a-text-24 g2a-text-bold-700">
        What are you looking for today?
      </div>
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
          variant="outlined"
          rounded="lg"
          elevation="0"
          class="category-card h-100"
          @click="openCategory(category)"
        >
          <v-container class="text-center py-6">
            <v-icon :icon="category.icon" size="40" color="brandColor2" />

            <div class="mt-3 g2a-text-14 text-brandColor2 g2a-text-bold-600">
              {{ category.name }}
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import apiClient from "@/services/api";

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

<style scoped>
.category-card {
  cursor: pointer;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}

.category-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}
</style>
