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
      <v-col cols="12" lg="8" sm="6">
        <product-hero
          :title="product.name"
          :image="selectedImage"
          :location="locationText"
          :thumbnail_url="product.thumbnail_url"
        />
      </v-col>
      <v-col cols="12" lg="4" sm="6">
        <product-gallery :images="product.images" />
      </v-col>

      <v-col cols="12" lg="8">
        <div class="">
          <ProductAbout :description="product.short_description" />
        </div>

        <div v-if="product.highlights?.length" class="mt-8">
          <ProductHighlights :highlights="product.highlights" />
        </div>

        <div v-if="product.thingsToKnow?.length" class="mt-8">
          <ProductThingsToKnow :items="product.thingsToKnow" />
        </div>

        <div v-if="product.tags?.length" class="mt-8">
          <ProductTags :tags="product.tags" />
        </div>

        <div
          v-if="
            product.inclusions?.some((i) => i.active) ||
            product.exclusions?.some((e) => e.active)
          "
          class="mt-8"
        >
          <div class="g2a-title-heading mb-3">What's Included</div>

          <v-row>
            <v-col cols="12" md="6">
              <ProductInclusions :inclusions="product.inclusions" />
            </v-col>

            <v-col cols="12" md="6">
              <ProductExclusions :exclusions="product.exclusions" />
            </v-col>
          </v-row>
        </div>

        <div v-if="product.faqs?.length" class="mt-8">
          <ProductFaqs :faqs="product.faqs" />
        </div>

        <div v-if="product.terms?.length" class="mt-8">
          <ProductTerms :terms="product.terms" />
        </div>

        <div v-if="relatedProducts.length" class="mt-10">
          <ProductRelated
            title="You May Also Like"
            :products="relatedProducts"
          />
        </div>
        <!-- <div v-if="locations.length" class="mt-8">
          <ProductLocations :locations="locations" />
        </div> -->
      </v-col>

      <!-- Booking Sidebar -->
      <v-col cols="12" lg="4">
        <ActivityBookingCard
          v-if="selectedLocation"
          :booking-template="product.bookingTemplate"
          :slots="slots"
          :error="availabilityError"
          :price="product.starting_price"
          @submit="checkAvailability"
          :nextAvailableDate="product.next_available_slot"
          :location-selected="locationText"
          @showLocationDialog="showLocationDialog = true"
          :showSelectLocation="availableLocations.length > 1"
          :out-of-stock="product.out_of_stock"
        />

        <v-card v-else rounded="lg" variant="outlined">
          <v-container class="text-center py-10">
            <v-icon size="48" color="brandColor"> mdi-map-marker </v-icon>

            <div class="g2a-title-4 mt-4">Choose your location</div>

            <div class="g2a-text-18 mb-6">
              Please select the location where you'd like to book this activity.
            </div>

            <v-btn
              rounded
              color="brandColor"
              flat
              @click="showLocationDialog = true"
            >
              Select Location
            </v-btn>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </template>
  <BookingQuotationDialog
    v-model="confirmationDialog"
    :quote="availabilityQuote"
    @continue="continueBooking"
  />
  <v-dialog v-model="showLocationDialog" max-width="420" persistent>
    <v-card rounded="xl">
      <v-card-title> Choose Location </v-card-title>

      <v-divider />

      <v-list>
        <v-list-item
          v-for="location in locations"
          :key="location.slug"
          @click="selectLocation(location)"
        >
          <v-list-item-title>
            {{ location.name }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script setup>
import apiClient from "@/services/api";

import { ref, computed, onMounted, watch } from "vue";

import { useRoute } from "vue-router";

import ProductAbout from "../../components/activities/product/ProductAbout.vue";
import ProductTags from "../../components/activities/product/ProductTags.vue";
import ProductLocations from "../../components/activities/product/ProductLocations.vue";
import ProductThingsToKnow from "../../components/activities/product/ProductThingsToKnow.vue";
import ProductInclusions from "../../components/activities/product/ProductInclusions.vue";
import ProductExclusions from "../../components/activities/product/ProductExclusions.vue";
import ProductFaqs from "../../components/activities/product/ProductFaqs.vue";
import ProductTerms from "../../components/activities/product/ProductTerms.vue";
import ActivityBookingCard from "../../components/activities/booking-fields/ActivityBookingCard.vue";
import ProductRelated from "../../components/activities/product/ProductRelated.vue";
import ProductHero from "../../components/activities/product/ProductHero.vue";
import { saveBooking } from "@/store/booking.js";
import router from "@/router/index.js";
import BookingQuotationDialog from "@/components/activities/checkout/BookingQuotationDialog.vue";
import ProductGallery from "@/components/activities/product/ProductGallery.vue";
import ProductHighlights from "../../components/activities/product/ProductHighlights.vue";

const route = useRoute();

const loading = ref(true);
const error = ref(null);

const product = ref(null);

const relatedProducts = ref([]);

const selectedImageIndex = ref(0);

const slots = ref([]);

const locations = computed(() => product.value?.locations || []);

const locationText = computed(() => {
  return selectedLocation.value?.name || "";
});

const selectedImage = computed(() => {
  if (product.value?.images?.[selectedImageIndex.value]) {
    return product.value.images[selectedImageIndex.value].image_url;
  }

  return product.value?.thumbnail_url || "";
});

const availabilityError = ref("");

const confirmationDialog = ref(false);

const availabilityQuote = ref(null);

const bookingRequest = ref(null);

const selectedLocation = ref(null);
const showLocationDialog = ref(false);

onMounted(() => {
  console.log("Product page mounted");
});

const checkAvailability = async (form) => {
  availabilityError.value = "";

  try {
    const payload = {
      ...form,
      location_slug: selectedLocation.value.slug,
    };

    const { data } = await apiClient.post(
      `/v1/products/app/${product.value.slug}/check-available`,
      payload,
    );

    if (!data.success) {
      throw new Error(data.message);
    }

    if (!data.available) {
      availabilityError.value =
        data.message || "Selected date is not available.";

      return;
    }

    // Keep request for checkout
    bookingRequest.value = payload;

    // Store availability response for dialog
    availabilityQuote.value = data.data;

    // Open confirmation dialog
    confirmationDialog.value = true;
  } catch (err) {
    console.error(err);

    availabilityError.value =
      err.response?.data?.message ||
      err.message ||
      "Unable to check availability.";
  }
};

const continueBooking = ({ quote, form }) => {
  console.log("🚀 ~ continueBooking ~ quote:", quote);
  //confirmationDialog.value = false;

  saveBooking({
    product: product.value,

    bookingTemplate: product.value.bookingTemplate,

    form: {
      ...bookingRequest.value,
      ...form,
    },
  });

  router.push({
    name: "Checkout",
    params: {
      estimate_id: quote.estimate_id,
    },
  });
};

const selectImage = (index) => {
  selectedImageIndex.value = index;
};

const availableLocations = ref([]);

const loadProduct = async () => {
  try {
    console.log("Loading product...");
    loading.value = true;
    error.value = null;

    const response = await apiClient.get(
      `/v1/products/app/products-list/${route.params.product}`,
    );
    console.log("🚀 ~ loadProduct ~ response:", response)

    
    product.value = response.data?.data;
    selectedLocation.value = product.value.selectedLocation || null;
    availableLocations.value = product.value.locations || [];

    if (availableLocations.length > 1) {
      const routeLocation = route.query.location;

      const matched = availableLocations.find((x) => x.slug === routeLocation);

      if (matched) {
        selectedLocation.value = matched;
      } else if (availableLocations.length === 1) {
        selectedLocation.value = availableLocations[0];

        await router.replace({
          query: {
            ...route.query,
            location: availableLocations[0].slug,
          },
        });
      } else {
        showLocationDialog.value = true;
      }
    }

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
const selectLocation = async (location) => {
  selectedLocation.value = location;
  showLocationDialog.value = false;

  const slug = `${product.value.slug}-in-${location.slug}`;

  await router.replace({
    name: "ProductDetails",
    params: {
      ...route.params,
      product: slug,
    },
  });

  await loadProduct();
};
onMounted(loadProduct);
</script>
