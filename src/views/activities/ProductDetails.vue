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
        <product-hero
          :title="product.name"
          :image="selectedImage"
          :location="locationText"
          :thumbnail_url="product.thumbnail_url"
        />
      </v-col>
      <v-col cols="12" lg="4">
        <ProductGallery :images="product.images" @select="openLightbox" />
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

        <div v-if="locations.length" class="mt-8">
          <ProductLocations :locations="locations" />
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
      </v-col>

      <!-- Booking Sidebar -->
      <v-col cols="12" lg="4">
        <!-- <ActivityBookingCard :slots="slots" :price="product.starting_price" /> -->
        <ActivityBookingCard
          :booking-template="product.bookingTemplate"
          :slots="slots"
          :error="availabilityError"
          :price="product.starting_price"
          @submit="checkAvailability"
          :nextAvailableDate="product.next_available_slot"
        />
      </v-col>
    </v-row>
  </template>
  <BookingConfirmationDialog
    v-model="confirmationDialog"
    :quote="availabilityQuote"
    @continue="continueBooking"
  />
</template>

<script setup>
import apiClient from "@/services/api";

import { ref, computed, onMounted, watch } from "vue";

import { useRoute } from "vue-router";

import ProductAbout from "../../components/activities/product/ProductAbout.vue";
import ProductHighlights from "../../components/activities/product/ProductHighlights.vue";
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
import ProductGallery from "../../components/activities/product/ProductGallery.vue";
import { saveBooking } from "@/store/booking.js";
import router from "@/router/index.js";
import BookingConfirmationDialog from "@/components/activities/checkout/BookingConfirmationDialog.vue";

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

const availabilityError = ref("");

const confirmationDialog = ref(false);

const availabilityQuote = ref(null);

const bookingRequest = ref(null);

const checkAvailability = async (form) => {
  availabilityError.value = "";

  try {
    const payload = {
      ...form,

      // Temporary
      location_slug: "havelock",
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

const continueBooking = () => {
  confirmationDialog.value = false;

  saveBooking({
    product: product.value,

    bookingTemplate: product.value.bookingTemplate,

    form: {
      ...bookingRequest.value,

      availability: availabilityQuote.value,
    },
  });

  router.push({
    name: "Checkout",
  });
};

const selectImage = (index) => {
  selectedImageIndex.value = index;
};

const loadProduct = async () => {
  try {
    loading.value = true;
    error.value = null;

    const response = await apiClient.get(
      `/v1/products/app/products-list/${route.params.productType}`,
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
