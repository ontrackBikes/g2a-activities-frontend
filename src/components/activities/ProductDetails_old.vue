<template>
  <div>
    <!-- Loading State -->
    <div
      v-if="isLoading"
      class="fill-height d-flex justify-center align-center"
    >
      <v-progress-circular indeterminate color="brandColor" size="60" />
    </div>

    <!-- Error State -->
    <v-alert
      v-else-if="fetchError"
      type="error"
      variant="tonal"
      class="mx-auto"
      max-width="600"
    >
      {{ fetchError }}
    </v-alert>

    <!-- Content -->
    <template v-else-if="productDetails">
      <v-row>
        <!-- Left Column -->
        <v-col cols="12" lg="8">
          <!-- Hero Image -->
          <v-card rounded="lg" elevation="0" class="overflow-hidden mb-4">
            <v-img
              :src="selectedImageUrl"
              height="400"
              cover
              gradient="to top, rgba(0,0,0,.75), rgba(0,0,0,.15)"
            >
              <div class="fill-height d-flex flex-column justify-end pa-6">
                <div class="g2a-title text-white">
                  {{ productDetails.product?.name }}
                </div>

                <div class="d-flex align-center mt-2">
                  <v-icon
                    icon="mdi-map-marker"
                    color="white"
                    size="16"
                    class="me-1"
                  />
                  <span class="text-white">
                    {{ productDetails.location?.name }}
                  </span>
                </div>
              </div>
            </v-img>
          </v-card>

          <!-- Thumbnails & Images -->
          <v-slide-group class="mb-8 hide-slide-arrows">
            <v-slide-group-item
              v-for="(image, index) in activeImages"
              :key="image.id"
            >
              <v-card
                rounded="lg"
                elevation="0"
                class="me-3 cursor-pointer"
                :class="{
                  border: true,
                  'border-brandColor2': selectedImageIndex === index,
                }"
                @click="selectedImageIndex = index"
              >
                <v-img :src="image.image_url" width="140" height="90" cover />
              </v-card>
            </v-slide-group-item>
          </v-slide-group>

          <!-- About -->
          <div class="mb-10">
            <div
              class="d-flex align-center g2a-subtitle g2a-text-bold-700 mb-4"
            >
              <v-icon
                icon="mdi-information-outline"
                color="brandColor2"
                class="me-2"
                size="20"
              />
              About This Activity
            </div>
            <div class="g2a-text-16 text-medium-emphasis">
              {{
                isDescriptionExpanded
                  ? productDetails.product?.short_description
                  : truncatedDescription
              }}
            </div>

            <v-btn
              v-if="productDetails.product?.short_description?.length > 180"
              variant="text"
              color="brandColor2"
              size="small"
              class="px-0 mt-2"
              @click="isDescriptionExpanded = !isDescriptionExpanded"
            >
              {{ isDescriptionExpanded ? "Read Less" : "Read More" }}
            </v-btn>
          </div>

          <!-- Highlights -->
          <div v-if="activeHighlights.length" class="mb-10">
            <div
              class="d-flex align-center g2a-subtitle g2a-text-bold-700 mb-4"
            >
              <v-icon
                icon="mdi-star-circle-outline"
                color="brandColor2"
                class="me-2"
                size="20"
              />
              Highlights
            </div>
            <v-row>
              <v-col
                v-for="item in activeHighlights"
                :key="item.id"
                cols="12"
                md="6"
              >
                <v-card
                  variant="outlined"
                  rounded="lg"
                  elevation="0"
                  class="h-100"
                >
                  <v-card-text>
                    <div class="d-flex">
                      <v-icon
                        icon="mdi-star-circle"
                        color="warning"
                        class="me-3"
                      />
                      <div>{{ item.content }}</div>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- Things to Know -->
          <div v-if="activeThingsToKnow.length" class="mb-10">
            <div
              class="d-flex align-center g2a-subtitle g2a-text-bold-700 mb-4"
            >
              <v-icon
                icon="mdi-check-decagram-outline"
                color="brandColor2"
                class="me-2"
                size="20"
              />
              Things To Know
            </div>
            <v-row>
              <v-col
                v-for="item in activeThingsToKnow"
                :key="item.id"
                cols="12"
                md="6"
              >
                <div class="d-flex align-center py-2">
                  <v-icon
                    icon="mdi-check-circle"
                    color="success"
                    class="me-2"
                    size="20"
                  />
                  {{ item.content }}
                </div>
              </v-col>
            </v-row>
          </div>

          <!-- Inclusions / Exclusions -->
          <div
            v-if="activeInclusions.length || activeExclusions.length"
            class="mb-10"
          >
            <v-row>
              <v-col v-if="activeInclusions.length" cols="12" md="6">
                <v-card variant="outlined" rounded="lg" elevation="0">
                  <v-card-title>
                    <v-icon
                      icon="mdi-plus-circle-outline"
                      color="success"
                      class="me-2"
                      size="20"
                    />
                    Inclusions
                  </v-card-title>
                  <v-list density="compact">
                    <v-list-item
                      v-for="item in activeInclusions"
                      :key="item.id"
                    >
                      <template #prepend>
                        <v-icon icon="mdi-check" color="success" />
                      </template>
                      {{ item.content }}
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>

              <v-col v-if="activeExclusions.length" cols="12" md="6">
                <v-card variant="outlined" rounded="lg" elevation="0">
                  <v-card-title>
                    <v-icon
                      icon="mdi-minus-circle-outline"
                      color="error"
                      class="me-2"
                      size="20"
                    />
                    Exclusions
                  </v-card-title>
                  <v-list density="compact">
                    <v-list-item
                      v-for="item in activeExclusions"
                      :key="item.id"
                    >
                      <template #prepend>
                        <v-icon icon="mdi-close" color="error" />
                      </template>
                      {{ item.content }}
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>
          </div>

          <!-- FAQ -->
          <div v-if="activeFaqs.length" class="mb-10">
            <div
              class="d-flex align-center g2a-subtitle g2a-text-bold-700 mb-4"
            >
              <v-icon
                icon="mdi-frequently-asked-questions"
                color="brandColor2"
                class="me-2"
                size="20"
              />
              Frequently Asked Questions
            </div>
            <v-expansion-panels variant="accordion">
              <v-expansion-panel v-for="faq in activeFaqs" :key="faq.id">
                <v-expansion-panel-title>
                  {{ faq.question }}
                </v-expansion-panel-title>
                <v-expansion-panel-text>
                  {{ faq.answer }}
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </div>

          <!-- Terms -->
          <div v-if="activeTerms.length" class="mb-10">
            <div
              class="d-flex align-center g2a-subtitle g2a-text-bold-700 mb-4"
            >
              <v-icon
                icon="mdi-file-document-outline"
                color="brandColor2"
                class="me-2"
                size="20"
              />
              Terms & Conditions
            </div>
            <v-card variant="outlined" rounded="lg" elevation="0">
              <v-list>
                <v-list-item v-for="term in activeTerms" :key="term.id">
                  <template #prepend>
                    <v-icon icon="mdi-circle-small" />
                  </template>
                  {{ term.content }}
                </v-list-item>
              </v-list>
            </v-card>
          </div>

          <!-- Vendor -->
          <v-card variant="outlined" rounded="lg" elevation="0" class="mt-8">
            <v-card-text>
              <div class="d-flex align-center">
                <v-avatar size="52">
                  <v-icon icon="mdi-storefront-outline" size="28" />
                </v-avatar>
                <div class="ms-3">
                  <div class="g2a-text-16 g2a-text-bold-600">
                    {{ productDetails.vendor?.name }}
                  </div>
                  <div class="g2a-text-12">Verified Activity Partner</div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </v-col>

        <!-- Right Column – Booking Card -->
        <v-col cols="12" lg="4">
          <v-card rounded="lg" elevation="0" variant="outlined" class="mb-4">
            <v-card-text>
              <div class="d-flex justify-space-between align-center mb-5">
                <div>
                  <div class="g2a-subtitle g2a-text-bold-700">
                    Book Your Ticket
                  </div>
                </div>
                <v-chip color="success" size="small">Available</v-chip>
              </div>

              <div>
                <label class="data-label d-block mb-1"> Select Date </label>
                <v-text-field
                  v-model="bookingForm.date"
                  type="date"
                  variant="outlined"
                  density="comfortable"
                />
              </div>

              <div v-if="activeSlots.length">
                <label class="data-label d-block mb-1"> Select Slot </label>
                <v-select
                  v-model="bookingForm.slotId"
                  :items="activeSlots"
                  item-title="slot_name"
                  item-value="id"
                  variant="outlined"
                  placeholder="Select Slot"
                  density="comfortable"
                />
              </div>

              <div>
                <label class="data-label d-block mb-1"> Guests </label>
                <v-text-field
                  v-model="bookingForm.guests"
                  type="number"
                  min="1"
                  variant="outlined"
                />
              </div>

              <div class="d-flex align-center justify-space-between">
                <div>
                  <div class="g2a-subtitle g2a-text-bold-600 text-brandColor2">
                    ₹{{ productDetails.base_price }}
                  </div>

                  <div class="g2a-text-12 text-medium-emphasis">Per Adult</div>
                </div>

                <v-btn
                  color="brandColor"
                  size="large"
                  rounded="xl"
                  elevation="0"
                >
                  Book Now
                </v-btn>
              </div>
            </v-card-text>
          </v-card>

          <!-- Location Card -->
          <v-card rounded="lg" elevation="0" variant="outlined">
            <v-card-text>
              <div
                class="d-flex align-center g2a-subtitle g2a-text-bold-700 mb-3"
              >
                <v-icon
                  icon="mdi-map-marker-radius-outline"
                  color="brandColor2"
                  class="me-2"
                  size="20"
                />
                Location
              </div>

              <div>{{ productDetails.location?.name }}</div>
              <v-btn
                v-if="directionsUrl"
                :href="directionsUrl"
                target="_blank"
                variant="outlined"
                prepend-icon="mdi-map-marker"
                class="mt-4"
              >
                Get Directions
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import apiClient from "@/services/api";
import { useRouter, useRoute } from "vue-router";

const router = useRouter();
const route = useRoute();

// ------------------------------------------------------------
// Reactive State
// ------------------------------------------------------------
const productDetails = ref(null);
const isLoading = ref(true);
const fetchError = ref(null);

// Booking form state
const bookingForm = ref({
  date: null,
  slotId: null,
  guests: 1,
});

// Image gallery state
const selectedImageIndex = ref(0);
const isDescriptionExpanded = ref(false);

// ------------------------------------------------------------
// Computed – Filter active items
// ------------------------------------------------------------
const activeImages = computed(() =>
  (productDetails.value?.images || []).filter((img) => img.active),
);

const activeHighlights = computed(() =>
  (productDetails.value?.highlights || []).filter((item) => item.active),
);

const activeThingsToKnow = computed(() =>
  (productDetails.value?.thingsToKnow || []).filter((item) => item.active),
);

const activeInclusions = computed(() =>
  (productDetails.value?.inclusions || []).filter((item) => item.active),
);

const activeExclusions = computed(() =>
  (productDetails.value?.exclusions || []).filter((item) => item.active),
);

const activeFaqs = computed(() =>
  (productDetails.value?.faqs || []).filter((item) => item.active),
);

const activeTerms = computed(() =>
  (productDetails.value?.terms || []).filter((item) => item.active),
);

const activeSlots = computed(() =>
  (productDetails.value?.slots || []).filter((slot) => slot.active),
);

// ------------------------------------------------------------
// Computed – UI helpers
// ------------------------------------------------------------
const selectedImageUrl = computed(() => {
  if (
    activeImages.value.length &&
    activeImages.value[selectedImageIndex.value]
  ) {
    return activeImages.value[selectedImageIndex.value].image_url;
  }
  return productDetails.value?.product?.thumbnail_url || "";
});

const truncatedDescription = computed(() => {
  const text = productDetails.value?.product?.short_description || "";
  if (text.length <= 180) return text;
  return `${text.slice(0, 180)}...`;
});

const directionsUrl = computed(() => {
  const lat = productDetails.value?.location?.latitude;
  const lng = productDetails.value?.location?.longitude;
  if (!lat || !lng) return null;
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
});

// ------------------------------------------------------------
// Data fetching
// ------------------------------------------------------------
const fetchProductDetails = async () => {
  isLoading.value = true;
  fetchError.value = null;
  try {
    const { data } = await apiClient.get(
      `/v1/vendor-products/${route.params.id}`,
    );
    if (data?.success) {
      productDetails.value = data.data;
    } else {
      fetchError.value = "Failed to load product data.";
    }
  } catch (err) {
    console.error("Error fetching product details:", err);
    fetchError.value = "An error occurred while fetching product details.";
  } finally {
    isLoading.value = false;
  }
};

// ------------------------------------------------------------
// Lifecycle
// ------------------------------------------------------------
onMounted(fetchProductDetails);
</script>

<style scoped>
.hide-slide-arrows :deep(.v-slide-group__prev),
.hide-slide-arrows :deep(.v-slide-group__next) {
  display: none !important;
}
</style>
