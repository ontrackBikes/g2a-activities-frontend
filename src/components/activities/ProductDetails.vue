<template>
  <div v-if="loading" class="text-center py-16">
    <v-progress-circular indeterminate color="primary" size="60" />
  </div>

  <v-alert v-else-if="error" type="error" variant="tonal">
    {{ error }}
  </v-alert>

  <template v-else-if="product">
    <!-- Breadcrumb -->
    <div class="d-flex align-center ga-1 g2a-text-13 text-greyDark my-4">
      <span class="cursor-pointer" @click="$router.push('/v2')"
        >Activities</span
      >
      <v-icon icon="mdi-chevron-right" size="14" />
      <span class="text-brandColor2 g2a-text-bold-600 truncate-two-lines">{{
        product.name
      }}</span>
    </div>

    <v-row>
      <!-- Main Content -->
      <v-col cols="12" lg="8">
        <activity-hero
          :title="product.name"
          :image="selectedImage"
          :location="locationText"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <ActivityGallery :images="product.images" @select="openLightbox" />
      </v-col>

      <v-col cols="12" lg="8">
        <div class="">
          <ActivityAbout :description="product.short_description" />
        </div>

        <div v-if="product.thingsToKnow?.length" class="mt-8">
          <ActivityThingsToKnow :items="product.thingsToKnow" />
        </div>

        <div v-if="product.highlights?.length" class="mt-8">
          <ActivityHighlights :highlights="product.highlights" />
        </div>

        <div v-if="product.tags?.length" class="mt-8">
          <ActivityTags :tags="product.tags" />
        </div>

        <div v-if="locations.length" class="mt-8">
          <ActivityLocations :locations="locations" />
        </div>

        <div
          v-if="
            product.inclusions?.some((i) => i.active) ||
            product.exclusions?.some((e) => e.active)
          "
          class="mt-8"
        >
          <div class="g2a-subtitle-dark mb-4">What's Included</div>

          <v-row>
            <v-col cols="12" md="6">
              <ActivityInclusions :inclusions="product.inclusions" />
            </v-col>

            <v-col cols="12" md="6">
              <ActivityExclusions :exclusions="product.exclusions" />
            </v-col>
          </v-row>
        </div>

        <div v-if="product.faqs?.length" class="mt-8">
          <ActivityFaqs :faqs="product.faqs" />
        </div>

        <div v-if="product.terms?.length" class="mt-8">
          <ActivityTerms :terms="product.terms" />
        </div>

        <div v-if="relatedProducts.length" class="mt-10">
          <ActivityRelatedProducts
            title="You May Also Like"
            :products="relatedProducts"
          />
        </div>
      </v-col>

      <!-- Booking Sidebar -->
      <v-col cols="12" lg="4">
        <ActivityBookingCard :slots="slots" :price="product.starting_price" />
      </v-col>
    </v-row>
  </template>
</template>

<script setup>
import apiClient from "@/services/api";

import { ref, computed, onMounted, watch } from "vue";

import { useRoute } from "vue-router";

import ActivityAbout from "../../../components/activities/details/ActivityAbout.vue";
import ActivityHighlights from "../../../components/activities/details/ActivityHighlights.vue";
import ActivityTags from "../../../components/activities/details/ActivityTags.vue";
import ActivityLocations from "../../../components/activities/details/ActivityLocations.vue";
import ActivityThingsToKnow from "../../../components/activities/details/ActivityThingsToKnow.vue";
import ActivityInclusions from "../../../components/activities/details/ActivityInclusions.vue";
import ActivityExclusions from "../../../components/activities/details/ActivityExclusions.vue";
import ActivityFaqs from "../../../components/activities/details/ActivityFaqs.vue";
import ActivityTerms from "../../../components/activities/details/ActivityTerms.vue";
import ActivityBookingCard from "../../../components/activities/details/ActivityBookingCard.vue";
import ActivityRelatedProducts from "../../../components/activities/details/ActivityRelatedProducts.vue";
import ActivityHero from "../../../components/activities/details/ActivityHero.vue";
import ActivityGallery from "../../../components/activities/details/ActivityGallery.vue";

const route = useRoute();

const loading = ref(true);
const error = ref(null);

const product = ref(null);

const relatedProducts = ref([]);

const selectedImageIndex = ref(0);

const slots = ref([]);

const locations = computed(() => product.value?.locations || []);

const locationText = computed(() =>
  locations.value.map((x) => x.name).join(", "),
);

const selectedImage = computed(() => {
  if (product.value?.images?.[selectedImageIndex.value]) {
    return product.value.images[selectedImageIndex.value].image_url;
  }

  return product.value?.thumbnail_url || "";
});

const selectImage = (index) => {
  selectedImageIndex.value = index;
};

const loadProduct = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await apiClient.get(
      `/v1/products/app/products-list/${route.params.slug}`,
    );

    product.value = response.data.data;
    slots.value = response.data.data.slots || [];
    relatedProducts.value = response.data.data.related_products || [];
  } catch (err) {
    console.error(err);
    error.value = "Failed to load product";
  } finally {
    loading.value = false;
  }
};

watch(
  () => [route.params.category, route.params.slug],
  async () => {
    selectedImageIndex.value = 0;
    await loadProduct();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  },
);

onMounted(loadProduct);
</script>
