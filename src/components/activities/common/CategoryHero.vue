<template>
  <v-card
    flat
    rounded="xl"
    class="overflow-hidden text-white"
    :style="{
      backgroundImage: `linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.55)), url(${coverImage})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
    }"
  >
    <v-container
      class="fill-height d-flex align-center px-6 px-md-10"
      :style="{ minHeight: mobile ? '240px' : '420px' }"
    >
      <v-row align="center">
        <v-col
          cols="12"
          md="7"
        >
          <v-chip
            color="white"
            class="glass text-white px-2 mb-10"
          >
            Go2Andaman Experiences
          </v-chip>

          <div
            class="g2a-heading"
           
          >
            {{ category.cover_title || category.name }}
          </div>

          <div
            v-if="category.cover_subtitle"
            class="text-white mt-2"
          >
            {{ category.cover_subtitle }}
          </div>

          <!-- <div class="d-flex flex-wrap ga-8 mt-4">
            <div class="d-flex align-center">
              <v-icon
                icon="mdi-shape"
                class="mr-3"
              />

              <div>
                <div class="text-h5 font-weight-bold">
                  {{ category.overview?.product_types || 0 }}
                </div>

                <div class="text-caption">
                  Activity Types
                </div>
              </div>
            </div>

            <div class="d-flex align-center">
              <v-icon
                icon="mdi-map-marker-path"
                class="mr-3"
              />

              <div>
                <div class="text-h5 font-weight-bold">
                  {{ category.overview?.products || 0 }}
                </div>

                <div class="text-caption">
                  Experiences
                </div>
              </div>
            </div>
          </div> -->
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const props = defineProps({
  category: {
    type: Object,
    required: true,
  },
});

const fallbackImage =
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e";

const coverImage = computed(
  () =>
    props.category.cover_media_url ||
    props.category.image ||
    fallbackImage
);
</script>