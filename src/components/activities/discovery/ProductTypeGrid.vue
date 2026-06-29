<template>
  <div v-if="productTypes.length">
    <div class="mb-4">
      <h2 class="g2a-text-20 g2a-text-bold-700">
        Explore Activities
      </h2>

      <div class="g2a-text-12 text-greyDark">
        Choose a category of experience
      </div>
    </div>

    <v-row>
      <v-col
        v-for="item in productTypes"
        :key="item.id"
        cols="6"
        md="2"
      >
        <v-card
          variant="outlined"
          rounded="lg"
          class="cursor-pointer h-100"
          @click="openProductType(item)"
        >
          <v-container class="text-center py-6">
            <v-icon
              :icon="item.icon"
              size="36"
              color="primary"
            />

            <div
              class="mt-3 font-weight-medium"
            >
              {{ item.name }}
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import apiClient from "@/services/api";

import {
  ref,
  onMounted,
  watch,
} from "vue";

import {
  useRouter,
  useRoute,
} from "vue-router";

const router = useRouter();
const route = useRoute();

const props = defineProps({
  categorySlug: {
    type: String,
    required: true,
  },
});

const productTypes = ref([]);

const iconMap = {
  "Scuba Diving":
    "mdi-diving-scuba-mask",

  Kayaking:
    "mdi-kayaking",

  Snorkelling:
    "mdi-swim",

  Parasailing:
    "mdi-paraglide",

  Seakarting:
    "mdi-speedometer",

  "Game Fishing":
    "mdi-fish",

  Ferry:
    "mdi-ferry",

  Transfer:
    "mdi-car",

  Rental:
    "mdi-motorbike",

  "Bike Rental":
    "mdi-motorbike",

  "Day Trip":
    "mdi-island",

  Stargazing:
    "mdi-telescope",

  Trekking:
    "mdi-hiking",

  Cruise:
    "mdi-sail-boat",
};

const loadProductTypes =
  async () => {
    try {
      const response =
        await apiClient.get(
          "/v1/product-types",
          {
            params: {
              category_slug:
                props.categorySlug,
            },
          }
        );

      productTypes.value =
        (
          response.data?.data || []
        ).map((item) => ({
          ...item,
          icon:
            item.icon ||
            iconMap[item.name] ||
            "mdi-shape-outline",
        }));
    } catch (err) {
      console.error(
        "[ProductTypeGrid]",
        err
      );
    }
  };

const openProductType = (
  productType
) => {
  router.push({
    name:
      "ActivitiesProductType",

    params: {
      id: props.categorySlug,
      slug: productType.slug,
    },
  });
};

watch(
  () => props.categorySlug,
  loadProductTypes
);

onMounted(loadProductTypes);
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.v-card {
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}


</style>