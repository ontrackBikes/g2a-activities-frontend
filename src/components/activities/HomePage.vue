<template>
  <div>
    <!-- Categories -->
    <div class="d-flex align-center g2a-subtitle g2a-text-bold-600 mb-4">
      <v-icon
        icon="mdi-compass-outline"
        size="22"
        color="brandColor2"
        class="me-2"
      />
      What are you looking for today?
    </div>

    <v-row>
      <v-col
        v-for="category in categories"
        :key="category.name"
        cols="6"
        sm="4"
        md="3"
      >
        <v-card
          variant="outlined"
          rounded="lg"
          elevation="0"
          class="pa-4 d-flex flex-column align-center justify-center text-center h-100"
          :to="category.route"
        >
          <v-icon :icon="category.icon" size="40" color="brandColor2" />

          <div class="g2a-text-14 text-brandColor2 g2a-text-bold-600 mt-3">
            {{ category.name }}
          </div>
        </v-card>
      </v-col>
    </v-row>

    <!-- Recommendations -->
    <div class="d-flex align-center mt-8 mb-4">
      <v-icon
        icon="mdi-star-circle-outline"
        size="22"
        color="brandColor2"
        class="me-2"
      />

      <div class="g2a-subtitle g2a-text-bold-600">Go2Andaman Recommends</div>

      <v-chip size="small" color="brandColor2" class="ms-2">
        <span class="g2a-text-10 g2a-text-bold-600">Best of the Best</span>
      </v-chip>
    </div>

    <v-slide-group show-arrows>
      <v-slide-group-item v-for="item in recommendations" :key="item.name">
        <v-card
          width="260"
          variant="outlined"
          rounded="lg"
          elevation="0"
          class="me-4"
        >
          <v-img :src="item.img" height="180" cover>
            <div class="pa-3">
              <v-chip size="small" color="brandColor">
                <v-icon
                  icon="mdi-star"
                  size="14"
                  color="brandColor"
                  class="me-1"
                  variant="flat"
                />
                {{ item.badge }}
              </v-chip>
            </div>
          </v-img>

          <v-card-text>
            <div class="g2a-text-16 g2a-text-bold-600">
              {{ item.name }}
            </div>

            <div
              class="d-flex align-center justify-space-between g2a-text-12 mt-2"
            >
              <div class="d-flex align-center">
                <v-icon icon="mdi-map-marker" size="12" class="me-1" />
                {{ item.location }}
              </div>

              <div class="d-flex align-center">
                <v-icon icon="mdi-clock-outline" size="12" class="me-1" />
                {{ item.duration }}
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>

    <!-- Locations -->
    <div class="d-flex align-center mt-8 mb-4">
      <v-icon
        icon="mdi-map-marker-radius-outline"
        size="22"
        color="brandColor2"
        class="me-2"
      />
      <div class="g2a-subtitle g2a-text-bold-600">Find by Location</div>
    </div>

    <v-row>
      <v-col v-for="location in locations" :key="location.name" cols="6" md="3">
        <v-card rounded="lg" elevation="0">
          <v-img
            :src="location.img"
            height="180"
            cover
            gradient="to top, rgba(0,0,0,.7), rgba(0,0,0,.1)"
          >
            <div class="fill-height d-flex flex-column justify-end pa-4">
              <div class="g2a-text-16 g2a-text-bold-600 text-white">
                {{ location.name }}
              </div>

              <div class="g2a-text-12 text-white">
                {{ location.count }} Activities
              </div>
            </div>
          </v-img>
        </v-card>
      </v-col>
    </v-row>

    <!-- Upcoming Events -->
    <div class="d-flex align-center mt-8 mb-4">
      <v-icon
        icon="mdi-calendar-clock-outline"
        size="22"
        color="brandColor2"
        class="me-2"
      />
      <div class="g2a-subtitle g2a-text-bold-600">Upcoming Events</div>
    </div>

    <v-row>
      <v-col v-for="event in events" :key="event.title" cols="12" sm="6" md="3">
        <v-card variant="outlined" rounded="lg" elevation="0" class="pa-4">
          <div class="d-flex align-center ga-4">
            <v-sheet
              rounded="lg"
              color="brandColor2"
              class="pa-3 text-center"
              min-width="60"
            >
              <div class="g2a-text-16 g2a-text-bold-600 text-white">
                {{ event.day }}
              </div>

              <div class="g2a-text-12 text-white">
                {{ event.month }}
              </div>
            </v-sheet>

            <div>
              <div class="g2a-text-16 g2a-text-bold-600">
                {{ event.title }}
              </div>

              <div class="d-flex align-center g2a-text-12 mt-1">
                <v-icon icon="mdi-map-marker" size="14" class="me-1" />
                {{ event.location }}
              </div>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import apiClient from "@/services/api";

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

    categories.value = (response.data?.data || []).map((category) => ({
      id: category.id,
      name: category.name,
      icon: categoryIcons[category.name] || "mdi-shape-outline",
      route: `/v2/${category.slug}`,
    }));
  } catch (error) {
    console.error("[HomePage] loadCategories", error);
  }
};

onMounted(async () => {
  await loadCategories();
});

const recommendations = ref([
  {
    name: "Scuba Diving at Havelock",
    location: "Havelock Island",
    duration: "3 Hours",
    badge: "Top Pick",
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
  },
  {
    name: "Mangrove Kayaking",
    location: "Baratang",
    duration: "2.5 Hours",
    badge: "Nature",
    img: "https://go2andaman.com/wp-content/uploads/2025/08/pexels-ladyfern-photos-3230581-scaled-e1713328873135.jpg",
  },
  {
    name: "Sunset Cruise",
    location: "Port Blair",
    duration: "2 Hours",
    badge: "Exclusive",
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  },
  {
    name: "Island Hopping",
    location: "Neil Island",
    duration: "6 Hours",
    badge: "Popular",
    img: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
  },
]);

const locations = ref([
  {
    name: "Havelock",
    count: 24,
    img: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
  },
  {
    name: "Neil Island",
    count: 15,
    img: "https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=800",
  },
  {
    name: "Port Blair",
    count: 30,
    img: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
  },
  {
    name: "Baratang",
    count: 10,
    img: "https://images.unsplash.com/photo-1589233584001-50a7f19b05d3?w=800",
  },
]);

const events = ref([
  {
    day: "12",
    month: "JUL",
    title: "Scuba Festival",
    location: "Havelock",
  },
  {
    day: "18",
    month: "JUL",
    title: "Kayaking Championship",
    location: "Baratang",
  },
  {
    day: "25",
    month: "JUL",
    title: "Island Marathon",
    location: "Neil Island",
  },
  {
    day: "03",
    month: "AUG",
    title: "Sunset Music Cruise",
    location: "Port Blair",
  },
]);
</script>
