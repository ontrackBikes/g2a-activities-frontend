<template>
  <!-- Loading -->
  <div v-if="loading">
    <v-skeleton-loader type="image" height="360" class="rounded-lg mb-4" />
    <v-row>
      <v-col cols="12" md="8">
        <v-skeleton-loader type="article" />
      </v-col>
      <v-col cols="12" md="4">
        <v-skeleton-loader type="card" />
      </v-col>
    </v-row>
  </div>

  <!-- Error -->
  <v-alert
    v-else-if="error"
    type="error"
    variant="tonal"
    rounded="lg"
    class="my-6"
  >
    <div
      class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3"
    >
      <span>{{ error }}</span>
      <v-btn color="error" variant="outlined" size="large" @click="loadProduct">
        Try Again
      </v-btn>
    </div>
  </v-alert>

  <!-- Content -->
  <template v-else-if="product">
    <!-- Breadcrumb -->
    <div class="d-flex align-center ga-1 g2a-text-13 text-greyDark my-4">
      <span class="cursor-pointer" @click="$router.push('/v2')"
        >Activities</span
      >
      <v-icon icon="mdi-chevron-right" size="14" />
      <span class="text-brandColor2 g2a-text-bold-600 truncate-two-lines">
        {{ product.name }}
      </span>
    </div>

    <v-row>
      <!-- Hero + Gallery -->
      <v-col cols="12" md="8">
        <product-hero
          :title="product.name"
          :image="selectedImage"
          :location="locationText"
          :thumbnail_url="product.thumbnail_url"
        />
      </v-col>

      <v-col cols="12" md="4">
        <product-gallery :images="product.images" />
      </v-col>

      <!-- Main content -->
      <v-col cols="12" lg="8">
        <ProductAbout :description="product.short_description" />

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
          <div class="g2a-title-2xl mb-3">What's Included</div>

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
      </v-col>

      <!-- Booking Sidebar -->
      <v-col cols="12" lg="4">
        <ActivityBookingCard
          v-if="selectedLocation"
          :booking-template="product.bookingTemplate"
          :slots="slots"
          :locations="availableLocations"
          :error="availabilityError"
          :price="product.starting_price"
          :priceType="product.price_type"
          :loading="checkingAvailability"
          @submit="checkAvailability"
          :nextAvailableDate="product.next_available_slot"
          :location-selected="locationText"
          @showLocationDialog="showLocationDialog = true"
          :showSelectLocation="availableLocations.length > 1"
          :out-of-stock="product.out_of_stock"
        />

        <v-card v-else rounded="lg" variant="outlined">
          <v-container class="text-center py-10">
            <v-icon size="48" color="brandColor">mdi-map-marker</v-icon>
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

  <!-- Not found fallback -->
  <v-container v-else class="py-16 text-center">
    <v-icon size="72" color="grey">mdi-emoticon-sad-outline</v-icon>
    <div class="g2a-title-4 mt-4">Activity not found</div>
    <v-btn class="mt-6" color="brandColor" flat @click="$router.push('/v2')">
      Browse Activities
    </v-btn>
  </v-container>

  <BookingQuotationDialog
    v-model="confirmationDialog"
    :quote="availabilityQuote"
    @continue="continueBooking"
  />

  <v-dialog v-model="showLocationDialog" max-width="420">
    <v-card rounded="lg" elevation="6">
      <v-card-title class="g2a-title-4 px-5 pt-5 pb-2">
        Choose Location
      </v-card-title>

      <v-card-subtitle class="g2a-title-2xl-2-light px-5 pb-4">
        Select the location you'd like to continue with.
      </v-card-subtitle>

      <v-divider />

      <v-list class="py-2" nav>
        <v-list-item
          v-for="location in locations"
          :key="location.slug"
          :active="selectedLocation?.slug === location.slug"
          rounded="lg"
          class="mx-3 my-2"
          color="brandColor"
          @click="selectLocation(location)"
        >
          <template #prepend>
            <v-avatar size="38" color="brandColor" variant="tonal">
              <v-icon size="20">mdi-map-marker</v-icon>
            </v-avatar>
          </template>

          <v-list-item-title class="g2a-title-2xl-1 g2a-text-bold-600">
            {{ location.name }}
          </v-list-item-title>

          <v-list-item-subtitle class="g2a-title-2xl-2-light text-greyDark">
            Available at this location
          </v-list-item-subtitle>

          <template #append>
            <v-icon size="18" color="grey"> mdi-chevron-right </v-icon>
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-card-actions class="px-4 py-3">
        <v-spacer />
        <v-btn
          variant="text"
          class="g2a-title-2xl-2 g2a-text-bold-500"
          @click="showLocationDialog = false"
        >
          Cancel
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import apiClient from "@/services/api";
import { ref, computed, onMounted, watch } from "vue";
import { useRoute } from "vue-router";

import ProductAbout from "../../components/activities/product/ProductAbout.vue";
import ProductTags from "../../components/activities/product/ProductTags.vue";
import ProductThingsToKnow from "../../components/activities/product/ProductThingsToKnow.vue";
import ProductInclusions from "../../components/activities/product/ProductInclusions.vue";
import ProductExclusions from "../../components/activities/product/ProductExclusions.vue";
import ProductFaqs from "../../components/activities/product/ProductFaqs.vue";
import ProductTerms from "../../components/activities/product/ProductTerms.vue";
import ActivityBookingCard from "../../components/activities/booking-fields/ActivityBookingCard.vue";
import ProductRelated from "../../components/activities/product/ProductRelated.vue";
import ProductHero from "../../components/activities/product/ProductHero.vue";
import ProductGallery from "@/components/activities/product/ProductGallery.vue";
import ProductHighlights from "../../components/activities/product/ProductHighlights.vue";
import BookingQuotationDialog from "@/components/activities/checkout/BookingQuotationDialog.vue";

import { saveBooking } from "@/store/booking.js";
import router from "@/router/index.js";

const route = useRoute();

const loading = ref(true);
const error = ref(null);
const product = ref(null);
const relatedProducts = ref([]);
const selectedImageIndex = ref(0);
const slots = ref([]);
const availableLocations = ref([]);
const selectedLocation = ref(null);
const showLocationDialog = ref(false);

const availabilityError = ref("");
const checkingAvailability = ref(false);
const confirmationDialog = ref(false);
const availabilityQuote = ref(null);
const bookingRequest = ref(null);

// Guards against out-of-order responses: if the user navigates again before
// an in-flight request resolves, we abort the stale request and ignore its
// response even if it somehow still resolves.
let activeController = null;
let requestId = 0;

const locations = computed(() => product.value?.locations || []);
const locationText = computed(() => selectedLocation.value?.name || "");

const selectedImage = computed(() => {
  if (product.value?.images?.[selectedImageIndex.value]) {
    return product.value.images[selectedImageIndex.value].image_url;
  }
  return product.value?.thumbnail_url || "";
});

const checkAvailability = async (form) => {
  availabilityError.value = "";
  checkingAvailability.value = true;

  try {
    const payload = {
      ...form,
      location_slug: selectedLocation.value?.slug,
    };

    const { data } = await apiClient.post(
      `/v1/products/app/${product.value.slug}/check-available`,
      payload,
    );

    if (!data.success) {
      throw new Error(data.message || "Unable to check availability.");
    }

    if (!data.available) {
      availabilityError.value =
        data.message || "Selected date is not available.";
      return;
    }

    bookingRequest.value = payload;
    availabilityQuote.value = data.data;
    confirmationDialog.value = true;
  } catch (err) {
    availabilityError.value =
      err.response?.data?.message ||
      err.message ||
      "Unable to check availability.";
  } finally {
    checkingAvailability.value = false;
  }
};

const continueBooking = ({ quote, form }) => {
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
    params: { estimate_id: quote.estimate_id },
  });
};

const loadProduct = async () => {
  // Cancel any in-flight request for a previous product/location before
  // starting a new one.
  activeController?.abort();
  activeController = new AbortController();

  const currentRequestId = ++requestId;

  loading.value = true;
  error.value = null;

  try {
    const response = await apiClient.get(
      `/v1/products/app/products-list/${route.params.product}`,
      { signal: activeController.signal },
    );

    // A newer request has since started; discard this stale response.
    if (currentRequestId !== requestId) {
      return;
    }

    const data = response.data?.data;

    if (!data) {
      product.value = null;
      return;
    }

    product.value = data;
    selectedLocation.value = data.selectedLocation || null;
    availableLocations.value = data.locations || [];

    if (availableLocations.value.length > 1) {
      const routeLocation = route.query.location;

      const matched = availableLocations.value.find(
        (x) => x.slug === routeLocation,
      );

      if (matched) {
        selectedLocation.value = matched;
      } else if (!selectedLocation.value) {
        showLocationDialog.value = true;
      }
    } else if (availableLocations.value.length === 1) {
      selectedLocation.value = availableLocations.value[0];
    }

    slots.value = data.slots || [];
    relatedProducts.value = data.related_products || [];
  } catch (err) {
    // Aborted requests aren't real errors — a newer request is already
    // in flight, so just let it take over silently.
    if (err.name === "CanceledError" || err.code === "ERR_CANCELED") {
      return;
    }

    if (currentRequestId !== requestId) {
      return;
    }

    error.value =
      err.response?.data?.message ||
      err.message ||
      "Failed to load this activity. Please try again.";
  } finally {
    if (currentRequestId === requestId) {
      loading.value = false;
    }
  }
};

const selectLocation = async (location) => {
  showLocationDialog.value = false;

  const slug = `${product.value.slug}-in-${location.slug}`;

  // Changing route.params.product here triggers the watcher below, which
  // calls loadProduct() itself — so we don't call it again here, and we
  // don't optimistically set selectedLocation, to avoid a duplicate fetch
  // and a moment of state that doesn't match the URL.
  await router.replace({
    name: "ProductDetails",
    params: { ...route.params, product: slug },
  });
};

watch(
  () => [route.params.category, route.params.slug, route.params.product],
  async () => {
    selectedImageIndex.value = 0;
    await loadProduct();
    window.scrollTo({ top: 0, behavior: "smooth" });
  },
);

onMounted(loadProduct);
</script>
