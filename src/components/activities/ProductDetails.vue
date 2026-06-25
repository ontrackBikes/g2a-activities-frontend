<template>
  <div class="product-detail-page" :class="{ 'is-loading': loading }">
    <!-- ═══════════════════════════════════════════
         SKELETON while loading
    ═══════════════════════════════════════════ -->
    <template v-if="loading">
      <v-container class="g2a-container-width pt-4">
        <v-skeleton-loader type="heading" class="mb-2" />
        <v-skeleton-loader type="text" width="260" class="mb-6" />
        <v-skeleton-loader
          type="image"
          height="420"
          rounded="lg"
          class="mb-4"
        />
        <v-row>
          <v-col cols="12" md="8">
            <v-skeleton-loader type="paragraph" class="mb-4" />
            <v-skeleton-loader type="paragraph" />
          </v-col>
          <v-col cols="12" md="4">
            <v-skeleton-loader type="card" height="200" />
          </v-col>
        </v-row>
      </v-container>
    </template>

    <!-- ═══════════════════════════════════════════
         ERROR STATE
    ═══════════════════════════════════════════ -->
    <template v-else-if="error">
      <v-container class="g2a-container-width py-16 text-center">
        <v-icon
          icon="mdi-alert-circle-outline"
          size="56"
          color="error"
          class="mb-3"
        />
        <div class="g2a-subtitle-dark mb-2">Activity not found</div>
        <div class="g2a-text-13 text-greyDark mb-6">{{ error }}</div>
        <v-btn
          variant="outlined"
          rounded="lg"
          color="brandColor2"
          @click="$router.back()"
        >
          Go Back
        </v-btn>
      </v-container>
    </template>

    <!-- ═══════════════════════════════════════════
         MAIN CONTENT
    ═══════════════════════════════════════════ -->
    <template v-else-if="product">
      <v-container class="g2a-container-width pt-4 pb-0">
        <!-- Breadcrumb -->
        <div class="d-flex align-center ga-1 g2a-text-12 text-greyDark mb-3">
          <span class="cursor-pointer" @click="$router.push('/')"
            >Activities</span
          >
          <v-icon icon="mdi-chevron-right" size="14" />
          <span
            v-if="product.productType"
            class="cursor-pointer"
            @click="$router.push('/')"
          >
            {{ product.productType.name }}
          </span>
          <v-icon
            v-if="product.productType"
            icon="mdi-chevron-right"
            size="14"
          />
          <span class="text-brandColor2 g2a-text-bold-600 truncate-two-lines">{{
            product.name
          }}</span>
        </div>

        <!-- Title row -->
        <div class="d-flex align-start justify-space-between ga-4 mb-1">
          <div>
            <h1 class="g2a-title-1 mb-0" style="line-height: 1.25">
              {{ product.name }}
            </h1>
            <div class="d-flex align-center flex-wrap ga-2 mt-2">
              <v-chip
                v-for="tag in product.tags"
                :key="tag.id"
                size="x-small"
                color="brandColor2"
                variant="tonal"
                class="g2a-text-10 g2a-text-bold-600"
              >
                {{ tag.name }}
              </v-chip>
              <div class="d-flex align-center g2a-text-12 text-greyDark">
                <v-icon icon="mdi-calendar-range" size="14" class="me-1" />
                {{ dateRangeLabel }}
              </div>
            </div>
          </div>

          <!-- Share / Wishlist -->
          <div class="d-flex align-center ga-2 flex-shrink-0">
            <v-btn icon variant="outlined" size="small" rounded @click="share">
              <v-icon icon="mdi-share-variant-outline" size="18" />
            </v-btn>
            <v-btn
              icon
              variant="outlined"
              size="small"
              rounded
              @click="wishlisted = !wishlisted"
            >
              <v-icon
                :icon="wishlisted ? 'mdi-heart' : 'mdi-heart-outline'"
                :color="wishlisted ? 'error' : undefined"
                size="18"
              />
            </v-btn>
          </div>
        </div>
      </v-container>

      <!-- ── Image Gallery ─────────────────────────────────────── -->
      <v-container class="g2a-container-width pt-3 pb-0">
        <div
          class="gallery-grid"
          :class="`gallery-grid--${Math.min(allImages.length, 3)}`"
        >
          <!-- Main hero image -->
          <div class="gallery-main" @click="openLightbox(0)">
            <v-img
              :src="allImages[0]?.image_url || fallbackImg"
              cover
              class="gallery-img rounded-lg"
              height="100%"
            >
              <template #placeholder>
                <div
                  class="fill-height d-flex align-center justify-center bg-grey-lighten-3"
                >
                  <v-icon icon="mdi-image" size="48" color="greyLight" />
                </div>
              </template>
            </v-img>
          </div>

          <!-- Thumbs (2 or 3) -->
          <div
            v-for="(img, i) in allImages.slice(1, 3)"
            :key="img.id || i"
            class="gallery-thumb"
            @click="openLightbox(i + 1)"
          >
            <v-img
              :src="img.image_url"
              cover
              class="gallery-img rounded-lg"
              height="100%"
            />
            <!-- "+N more" overlay on last thumb -->
            <div
              v-if="i === 1 && allImages.length > 3"
              class="gallery-more-overlay rounded-lg"
              @click.stop="openLightbox(2)"
            >
              <span class="g2a-text-16 g2a-text-bold-700 text-white"
                >+{{ allImages.length - 3 }}</span
              >
            </div>
          </div>
        </div>
      </v-container>

      <!-- ── Lightbox ──────────────────────────────────────────── -->
      <v-dialog v-model="lightboxOpen" max-width="960" scrim="black">
        <v-card elevation="0" color="black" class="pa-0">
          <div class="d-flex align-center justify-space-between pa-3">
            <span class="g2a-text-12 text-white" style="opacity: 0.7">
              {{ lightboxIndex + 1 }} / {{ allImages.length }}
            </span>
            <v-btn icon variant="text" @click="lightboxOpen = false">
              <v-icon icon="mdi-close" color="white" />
            </v-btn>
          </div>
          <v-img
            :src="allImages[lightboxIndex]?.image_url"
            max-height="75vh"
            contain
          />
          <div class="d-flex justify-center ga-3 pa-3">
            <v-btn
              icon
              variant="tonal"
              color="white"
              :disabled="lightboxIndex === 0"
              @click="lightboxIndex--"
            >
              <v-icon icon="mdi-chevron-left" />
            </v-btn>
            <v-btn
              icon
              variant="tonal"
              color="white"
              :disabled="lightboxIndex === allImages.length - 1"
              @click="lightboxIndex++"
            >
              <v-icon icon="mdi-chevron-right" />
            </v-btn>
          </div>
        </v-card>
      </v-dialog>

      <!-- ── Main Body: Content + Sticky Sidebar ───────────────── -->
      <v-container class="g2a-container-width pt-5 pb-10">
        <v-row>
          <!-- ════════════════ LEFT: CONTENT ════════════════ -->
          <v-col cols="12" md="8" class="pe-md-8">
            <!-- Description -->
            <div class="mb-6">
              <div
                class="g2a-subtitle-0"
                :class="{ 'description-clamped': !descExpanded }"
              >
                {{ product.short_description || "No description available." }}
              </div>
              <v-btn
                v-if="isDescLong"
                variant="text"
                color="brandColor2"
                size="small"
                class="mt-1 px-0 g2a-text-bold-600"
                @click="descExpanded = !descExpanded"
              >
                {{ descExpanded ? "Show less" : "Read more" }}
                <v-icon
                  :icon="descExpanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                  size="16"
                  class="ms-1"
                />
              </v-btn>
            </div>

            <v-divider class="mb-6" />

            <!-- Things to Know -->
            <template v-if="product.thingsToKnow?.length">
              <div class="g2a-subtitle-dark mb-4">Things to know</div>
              <v-row class="mb-6">
                <v-col
                  v-for="(col, ci) in chunked(product.thingsToKnow, 2)"
                  :key="ci"
                  cols="12"
                  sm="6"
                >
                  <div
                    v-for="item in col"
                    :key="item.id"
                    class="d-flex align-start ga-2 mb-2"
                  >
                    <v-icon
                      icon="mdi-check-circle-outline"
                      size="16"
                      color="brandColor2"
                      class="mt-1 flex-shrink-0"
                    />
                    <span class="g2a-text-13 text-greyDark">{{
                      item.content
                    }}</span>
                  </div>
                </v-col>
              </v-row>
              <v-divider class="mb-6" />
            </template>

            <!-- Highlights carousel -->
            <template v-if="product.highlights?.length">
              <div class="g2a-subtitle-dark mb-4">Highlights</div>
              <v-slide-group show-arrows class="mb-6">
                <v-slide-group-item
                  v-for="hl in product.highlights"
                  :key="hl.id"
                >
                  <v-card
                    variant="outlined"
                    rounded="lg"
                    elevation="0"
                    width="200"
                    class="me-3 pa-4 highlight-card"
                  >
                    <v-icon
                      icon="mdi-star-four-points"
                      size="20"
                      color="brandColor"
                      class="mb-2"
                    />
                    <div class="g2a-text-13 text-greyDark">
                      {{ hl.content }}
                    </div>
                  </v-card>
                </v-slide-group-item>
              </v-slide-group>
              <v-divider class="mb-6" />
            </template>

            <!-- Inclusions / Exclusions -->
            <template
              v-if="product.inclusions?.length || product.exclusions?.length"
            >
              <div class="g2a-subtitle-dark mb-4">What's included</div>
              <v-row class="mb-6">
                <v-col v-if="product.inclusions?.length" cols="12" sm="6">
                  <div
                    class="g2a-text-13 g2a-text-bold-600 mb-2 text-brandColor2"
                  >
                    Included
                  </div>
                  <div
                    v-for="inc in product.inclusions"
                    :key="inc.id"
                    class="d-flex align-start ga-2 mb-2"
                  >
                    <v-icon
                      icon="mdi-check"
                      size="16"
                      color="success"
                      class="mt-1 flex-shrink-0"
                    />
                    <span class="g2a-text-13">{{ inc.content }}</span>
                  </div>
                </v-col>
                <v-col v-if="product.exclusions?.length" cols="12" sm="6">
                  <div class="g2a-text-13 g2a-text-bold-600 mb-2 text-error">
                    Not included
                  </div>
                  <div
                    v-for="exc in product.exclusions"
                    :key="exc.id"
                    class="d-flex align-start ga-2 mb-2"
                  >
                    <v-icon
                      icon="mdi-close"
                      size="16"
                      color="error"
                      class="mt-1 flex-shrink-0"
                    />
                    <span class="g2a-text-13">{{ exc.content }}</span>
                  </div>
                </v-col>
              </v-row>
              <v-divider class="mb-6" />
            </template>

            <!-- Vendor Products: Ticket options by location -->
            <template v-if="product.vendorProducts?.length">
              <div class="g2a-subtitle-dark mb-1">Choose your ticket</div>
              <div class="g2a-text-12 text-greyDark mb-4">
                Select a location to see pricing and availability
              </div>

              <!-- Location tabs -->
              <div class="d-flex ga-2 no-scrollbar overflow-x-auto mb-4">
                <v-chip
                  v-for="vp in product.vendorProducts"
                  :key="vp.id"
                  size="small"
                  :color="
                    selectedVendorProductId === vp.id
                      ? 'brandColor2'
                      : undefined
                  "
                  :variant="
                    selectedVendorProductId === vp.id ? 'flat' : 'outlined'
                  "
                  class="g2a-text-12 g2a-text-bold-600 flex-shrink-0"
                  @click="selectedVendorProductId = vp.id"
                >
                  {{ vp.location?.name || "Location" }}
                </v-chip>
              </div>

              <!-- Selected vendor product info -->
              <div v-if="selectedVP">
                <v-card
                  variant="outlined"
                  rounded="lg"
                  elevation="0"
                  class="pa-4 mb-2 ticket-card"
                >
                  <div class="d-flex align-center justify-space-between">
                    <div>
                      <div class="g2a-text-12 text-greyDark">starts from</div>
                      <div class="d-flex align-baseline ga-1 mt-1">
                        <span
                          class="g2a-text-22 g2a-text-bold-700 text-brandColor2"
                        >
                          ₹{{ formatPrice(selectedVP.base_price) }}
                        </span>
                        <span class="g2a-text-13 text-greyDark">/ adult</span>
                      </div>
                    </div>
                    <div class="d-flex flex-column align-end ga-1">
                      <v-chip
                        size="x-small"
                        color="infoLight"
                        variant="flat"
                        class="g2a-text-11 text-brandColor2 g2a-text-bold-600"
                      >
                        {{ selectedVP.pricing_type }}
                      </v-chip>
                      <div class="g2a-text-12 text-greyDark">
                        Max {{ selectedVP.max_bookable_per_booking }} per
                        booking
                      </div>
                    </div>
                  </div>

                  <!-- Slots (if SLOT pricing) -->
                  <template v-if="selectedVP.slots?.length">
                    <v-divider class="my-3" />
                    <div class="g2a-text-12 g2a-text-bold-600 mb-2">
                      Available Slots
                    </div>
                    <div class="d-flex flex-wrap ga-2">
                      <v-chip
                        v-for="slot in selectedVP.slots"
                        :key="slot.id"
                        size="small"
                        :color="
                          selectedSlotId === slot.id ? 'brandColor2' : undefined
                        "
                        :variant="
                          selectedSlotId === slot.id ? 'flat' : 'outlined'
                        "
                        class="g2a-text-12"
                        @click="selectedSlotId = slot.id"
                      >
                        <v-icon
                          icon="mdi-clock-outline"
                          size="12"
                          class="me-1"
                        />
                        {{ slot.slot_name }}
                        <span
                          v-if="slot.start_time"
                          class="ms-1 text-greyDark g2a-text-11"
                        >
                          ({{ formatTime(slot.start_time) }})
                        </span>
                      </v-chip>
                    </div>
                  </template>
                </v-card>
              </div>
              <v-divider class="mb-6 mt-4" />
            </template>

            <!-- FAQs -->
            <template v-if="product.faqs?.length">
              <div class="g2a-subtitle-dark mb-4">FAQ's</div>
              <v-expansion-panels
                variant="accordion"
                elevation="0"
                class="mb-6 faq-panels"
              >
                <v-expansion-panel
                  v-for="faq in product.faqs"
                  :key="faq.id"
                  rounded="lg"
                >
                  <v-expansion-panel-title
                    class="g2a-text-14 g2a-text-bold-600 py-3"
                  >
                    {{ faq.question }}
                  </v-expansion-panel-title>
                  <v-expansion-panel-text class="g2a-text-13 text-greyDark">
                    {{ faq.answer }}
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
              <v-divider class="mb-6" />
            </template>

            <!-- Terms & Conditions -->
            <template v-if="product.terms?.length">
              <v-expansion-panels
                variant="accordion"
                elevation="0"
                class="mb-6 faq-panels"
              >
                <v-expansion-panel rounded="lg">
                  <v-expansion-panel-title
                    class="g2a-text-14 g2a-text-bold-600 py-3"
                  >
                    Terms &amp; Conditions
                  </v-expansion-panel-title>
                  <v-expansion-panel-text>
                    <div
                      v-for="term in product.terms"
                      :key="term.id"
                      class="d-flex align-start ga-2 mb-2"
                    >
                      <v-icon
                        icon="mdi-circle-small"
                        size="18"
                        color="greyDark"
                        class="flex-shrink-0"
                      />
                      <span class="g2a-text-13 text-greyDark">{{
                        term.content
                      }}</span>
                    </div>
                  </v-expansion-panel-text>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>

            <!-- Fulfilled by -->
            <div
              v-if="fulfillingVendor"
              class="d-flex align-center ga-1 g2a-text-12 text-greyDark mt-2 mb-4"
            >
              <span>Order fulfilled by</span>
              <span class="text-brandColor2 g2a-text-bold-600">{{
                fulfillingVendor.name
              }}</span>
              <v-icon
                icon="mdi-information-outline"
                size="14"
                color="greyDark"
              />
            </div>
          </v-col>

          <!-- ════════════════ RIGHT: STICKY SIDEBAR ════════════ -->
          <v-col cols="12" md="4">
            <div class="booking-sidebar">
              <!-- Price + Book CTA -->
              <v-card
                variant="outlined"
                rounded="lg"
                elevation="0"
                class="pa-4 mb-3"
              >
                <div class="d-flex align-center justify-space-between mb-4">
                  <div>
                    <div class="g2a-text-12 text-greyDark">Starts</div>
                    <div class="d-flex align-baseline ga-1">
                      <span
                        class="g2a-text-24 g2a-text-bold-700 text-brandColor2"
                      >
                        ₹{{ formatPrice(startingPrice) }}
                      </span>
                      <span class="g2a-text-13 text-greyDark">/ adult</span>
                    </div>
                  </div>
                  <v-btn
                    color="brandColor"
                    rounded="lg"
                    size="large"
                    class="g2a-text-bold-700 book-btn"
                    @click="onBook"
                  >
                    Book
                  </v-btn>
                </div>

                <!-- Date picker -->
                <v-text-field
                  v-model="selectedDate"
                  type="date"
                  variant="outlined"
                  density="compact"
                  hide-details
                  rounded="lg"
                  :min="today"
                  class="mb-3"
                  label="Select date"
                />

                <!-- Pax selector -->
                <div
                  class="d-flex align-center justify-space-between pa-3 rounded-lg"
                  style="border: 1px solid rgba(0, 0, 0, 0.12)"
                >
                  <span class="g2a-text-13 g2a-text-bold-600">Adults</span>
                  <div class="d-flex align-center ga-2">
                    <v-btn
                      icon
                      size="x-small"
                      variant="outlined"
                      :disabled="pax <= 1"
                      @click="pax--"
                    >
                      <v-icon icon="mdi-minus" size="14" />
                    </v-btn>
                    <span
                      class="g2a-text-14 g2a-text-bold-600"
                      style="min-width: 20px; text-align: center"
                      >{{ pax }}</span
                    >
                    <v-btn
                      icon
                      size="x-small"
                      variant="outlined"
                      :disabled="pax >= maxPax"
                      @click="pax++"
                    >
                      <v-icon icon="mdi-plus" size="14" />
                    </v-btn>
                  </div>
                </div>

                <!-- Total line -->
                <div
                  class="d-flex align-center justify-space-between mt-3 pa-3 rounded-lg"
                  style="background: rgba(41, 51, 155, 0.05)"
                >
                  <span class="g2a-text-13 g2a-text-bold-600">Total</span>
                  <span class="g2a-text-16 g2a-text-bold-700 text-brandColor2">
                    ₹{{ formatPrice(startingPrice * pax) }}
                  </span>
                </div>
              </v-card>

              <!-- Location card -->
              <v-card
                v-if="selectedVP?.location"
                variant="outlined"
                rounded="lg"
                elevation="0"
                class="pa-4 mb-3"
              >
                <div class="d-flex align-center ga-2 mb-3">
                  <v-icon
                    icon="mdi-map-marker-outline"
                    size="18"
                    color="brandColor2"
                  />
                  <span class="g2a-text-14 g2a-text-bold-600">{{
                    selectedVP.location.name
                  }}</span>
                </div>
                <v-btn
                  variant="outlined"
                  rounded="lg"
                  size="small"
                  color="brandColor2"
                  prepend-icon="mdi-directions"
                  class="g2a-text-12 g2a-text-bold-600"
                  :href="directionsUrl"
                  target="_blank"
                >
                  Get Directions
                </v-btn>
              </v-card>

              <!-- Opening hours (days of week) -->
              <v-card
                v-if="product.vendorProducts?.length"
                variant="outlined"
                rounded="lg"
                elevation="0"
                class="pa-4 mb-3"
              >
                <div class="g2a-text-13 g2a-text-bold-600 mb-3">
                  Opening hours
                </div>
                <div class="d-flex align-center ga-1 flex-wrap">
                  <div
                    v-for="day in DAYS"
                    :key="day.key"
                    class="day-pill"
                    :class="{ 'day-pill--active': isOpenDay(day.key) }"
                  >
                    {{ day.label }}
                  </div>
                </div>
              </v-card>
            </div>
          </v-col>
        </v-row>
      </v-container>

      <!-- ── Mobile sticky bottom bar ──────────────────────────── -->
      <div class="mobile-book-bar d-md-none">
        <v-container class="g2a-container-width py-3">
          <div class="d-flex align-center justify-space-between">
            <div>
              <div class="g2a-text-11 text-greyDark">Starts from</div>
              <div class="g2a-text-20 g2a-text-bold-700 text-brandColor2">
                ₹{{ formatPrice(startingPrice) }}
                <span class="g2a-text-12 text-greyDark g2a-text-bold-400"
                  >/ adult</span
                >
              </div>
            </div>
            <v-btn
              color="brandColor"
              rounded="lg"
              size="large"
              class="g2a-text-bold-700 px-8"
              @click="onBook"
            >
              Book Now
            </v-btn>
          </div>
        </v-container>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import apiClient from "@/services/api";

// ─── Router ─────────────────────────────────────────────────────
const route = useRoute();
const router = useRouter();

// ─── State ──────────────────────────────────────────────────────
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const wishlisted = ref(false);
const descExpanded = ref(false);
const lightboxOpen = ref(false);
const lightboxIndex = ref(0);
const selectedVendorProductId = ref(null);
const selectedSlotId = ref(null);
const selectedDate = ref("");
const pax = ref(1);

const fallbackImg =
  "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200";

const DAYS = [
  { key: "mon", label: "M" },
  { key: "tue", label: "T" },
  { key: "wed", label: "W" },
  { key: "thu", label: "T" },
  { key: "fri", label: "F" },
  { key: "sat", label: "S" },
  { key: "sun", label: "S" },
];

// ─── Computed ────────────────────────────────────────────────────
const allImages = computed(() => {
  const imgs = product.value?.images || [];
  return [...imgs].sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
});

const selectedVP = computed(
  () =>
    product.value?.vendorProducts?.find(
      (vp) => vp.id === selectedVendorProductId.value,
    ) || null,
);

const startingPrice = computed(() => {
  if (!product.value?.vendorProducts?.length) return 0;
  return Math.min(
    ...product.value.vendorProducts.map((vp) => Number(vp.base_price) || 0),
  );
});

const maxPax = computed(() => selectedVP.value?.max_bookable_per_booking || 10);

const fulfillingVendor = computed(
  () => product.value?.vendorProducts?.[0]?.vendor || null,
);

const isDescLong = computed(
  () => (product.value?.short_description || "").length > 300,
);

const today = computed(() => new Date().toISOString().split("T")[0]);

const dateRangeLabel = computed(() => {
  if (!product.value?.vendorProducts?.length) return "Multiple slots";
  return "Mon, 22 Jun – Tue, 30 Jun, Multiple slots"; // TODO: replace with real schedule range
});

const directionsUrl = computed(() => {
  const loc = selectedVP.value?.location;
  if (!loc) return "#";
  if (loc.latitude && loc.longitude) {
    return `https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + " Andaman")}`;
});

// ─── Helpers ─────────────────────────────────────────────────────
function formatPrice(val) {
  if (!val && val !== 0) return "—";
  return Number(val).toLocaleString("en-IN");
}

function formatTime(t) {
  if (!t) return "";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const display = (hour % 12 || 12) + ":" + m + " " + ampm;
  return display;
}

function chunked(arr, size) {
  const result = [];
  for (let i = 0; i < arr.length; i += size)
    result.push(arr.slice(i, i + size));
  return result;
}

function isOpenDay(/* key */) {
  // TODO: derive from vendor schedules when backend provides them
  // For now show all days as open
  return true;
}

function openLightbox(idx) {
  lightboxIndex.value = idx;
  lightboxOpen.value = true;
}

function share() {
  if (navigator.share) {
    navigator.share({ title: product.value?.name, url: window.location.href });
  } else {
    navigator.clipboard.writeText(window.location.href);
  }
}

function onBook() {
  // TODO: router.push({ name: "Checkout", query: { product: product.value.slug, date: selectedDate.value, pax: pax.value } })
  console.log("Book:", {
    productSlug: product.value?.slug,
    vendorProductId: selectedVendorProductId.value,
    slotId: selectedSlotId.value,
    date: selectedDate.value,
    pax: pax.value,
  });
}

// ─── API ─────────────────────────────────────────────────────────
async function fetchProduct() {
  loading.value = true;
  error.value = null;

  try {
    // TODO: GET /v1/products/app/products-list/:slug
    const slug = route.params.slug;
    const res = await apiClient.get(`/v1/products/app/products-list/${slug}`);
    product.value = res.data?.data || res.data;

    // Default: select first vendor product
    if (product.value?.vendorProducts?.length) {
      selectedVendorProductId.value = product.value.vendorProducts[0].id;
    }
  } catch (err) {
    console.error("[ProductDetailView] fetchProduct error:", err);
    error.value =
      err.response?.status === 404
        ? "This activity does not exist or has been removed."
        : "Failed to load activity details. Please try again.";

    // ── DUMMY DATA (remove when API is ready) ─────────────────
    product.value = DUMMY_PRODUCT;
    selectedVendorProductId.value = DUMMY_PRODUCT.vendorProducts[0].id;
    error.value = null;
    // ─────────────────────────────────────────────────────────
  } finally {
    loading.value = false;
  }
}

// Auto-select first slot when vendor product changes
watch(selectedVendorProductId, () => {
  const vp = selectedVP.value;
  selectedSlotId.value = vp?.slots?.[0]?.id || null;
});

onMounted(() => {
  selectedDate.value = today.value;
  fetchProduct();
});

// ─── DUMMY DATA — remove when API is live ────────────────────────
const DUMMY_PRODUCT = {
  id: 1,
  name: "Boat DSD at Havelock",
  slug: "boat-dsd-havelock",
  short_description: `Dive into a World of Aquatic Wonder at Aquarium Paradise, Bengaluru!
Prepare to be mesmerised as you step into Aquarium Paradise, Bengaluru's most enchanting gateway to the underwater world. Nestled in the heart of the city, this one-of-a-kind experience brings the ocean to your doorstep, offering an immersive journey through the breathtaking beauty of marine life.

This is not just a dive — it's a passport to a realm where time slows down and nature takes centre stage. Our expert instructors ensure your safety while guiding you through the wonders beneath the surface.`,
  featured: true,
  productType: { id: 1, name: "Scuba Diving" },
  tags: [
    { id: 1, name: "Beginner Friendly" },
    { id: 2, name: "Certified Divers" },
  ],
  images: [
    {
      id: 1,
      image_url:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200",
      sort_order: 1,
    },
    {
      id: 2,
      image_url:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800",
      sort_order: 2,
    },
    {
      id: 3,
      image_url:
        "https://images.unsplash.com/photo-1551244072-5d12893278bc?w=800",
      sort_order: 3,
    },
    {
      id: 4,
      image_url:
        "https://images.unsplash.com/photo-1582967788606-a171c1080cb0?w=800",
      sort_order: 4,
    },
  ],
  thingsToKnow: [
    { id: 1, content: "Duration 8 hours and 30 minutes" },
    { id: 2, content: "Ticket needed for all ages" },
    { id: 3, content: "Entry allowed for all ages" },
    { id: 4, content: "Kid friendly" },
    { id: 5, content: "Pets not allowed" },
    { id: 6, content: "Washrooms available" },
  ],
  highlights: [
    {
      id: 1,
      content:
        "Explore graceful wooden arcades and elegant courtly spaces full of history.",
    },
    {
      id: 2,
      content:
        "Explore graceful wooden arcades and elegant courtly spaces full of history.",
    },
    { id: 3, content: "Crystal clear waters with 20m+ visibility" },
  ],
  inclusions: [
    { id: 1, content: "PADI certified instructor" },
    { id: 2, content: "All dive equipment" },
    { id: 3, content: "Underwater photos" },
  ],
  exclusions: [
    { id: 1, content: "Hotel transfers" },
    { id: 2, content: "Lunch and refreshments" },
  ],
  faqs: [
    {
      id: 1,
      question: "Do I need prior experience?",
      answer:
        "No prior experience is required. Our certified instructors will guide you through a 30-minute briefing before the dive.",
    },
    {
      id: 2,
      question: "What should I bring?",
      answer:
        "Bring comfortable swimwear, a towel, sunscreen, and a valid photo ID. All diving equipment is provided.",
    },
    {
      id: 3,
      question: "Is it safe for non-swimmers?",
      answer:
        "Yes, non-swimmers can participate in the Discover Scuba Diving (DSD) program under direct instructor supervision.",
    },
  ],
  terms: [
    {
      id: 1,
      content:
        "Cancellations made 48 hours before the activity are eligible for a full refund.",
    },
    {
      id: 2,
      content: "No refunds for no-shows or cancellations within 24 hours.",
    },
    {
      id: 3,
      content:
        "Participants with heart conditions, respiratory issues, or pregnancy should consult a doctor before participating.",
    },
  ],
  vendorProducts: [
    {
      id: 101,
      vendor_id: 1,
      pricing_type: "SLOT",
      base_price: 6500,
      max_bookable_per_booking: 6,
      base_capacity: 10,
      location: {
        id: 2,
        name: "Havelock Island",
        latitude: 11.978,
        longitude: 93.0093,
      },
      vendor: { id: 1, name: "Dive India" },
      slots: [
        {
          id: 1,
          slot_name: "Morning",
          start_time: "08:00:00",
          end_time: "11:00:00",
          default_price: 6500,
        },
        {
          id: 2,
          slot_name: "Afternoon",
          start_time: "13:00:00",
          end_time: "16:00:00",
          default_price: 6500,
        },
      ],
    },
    {
      id: 102,
      vendor_id: 1,
      pricing_type: "SLOT",
      base_price: 6500,
      max_bookable_per_booking: 6,
      base_capacity: 10,
      location: {
        id: 3,
        name: "Neil Island",
        latitude: 11.8305,
        longitude: 93.0434,
      },
      vendor: { id: 1, name: "Dive India" },
      slots: [
        {
          id: 3,
          slot_name: "Morning",
          start_time: "09:00:00",
          end_time: "12:00:00",
          default_price: 6500,
        },
      ],
    },
    {
      id: 103,
      vendor_id: 2,
      pricing_type: "FIXED",
      base_price: 6500,
      max_bookable_per_booking: 8,
      base_capacity: 12,
      location: {
        id: 1,
        name: "Port Blair",
        latitude: 11.6234,
        longitude: 92.7265,
      },
      vendor: { id: 2, name: "Sea Hawk Adventures" },
      slots: [],
    },
  ],
};
</script>

<style scoped>
/* ── Gallery grid ── */
.gallery-grid {
  display: grid;
  gap: 8px;
  height: 420px;
}

.gallery-grid--1 {
  grid-template-columns: 1fr;
}
.gallery-grid--2 {
  grid-template-columns: 3fr 2fr;
}
.gallery-grid--3 {
  grid-template-columns: 3fr 2fr;
  grid-template-rows: 1fr 1fr;
}

.gallery-main {
  grid-row: 1 / -1; /* span all rows */
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
}

.gallery-thumb {
  position: relative;
  cursor: pointer;
  overflow: hidden;
  border-radius: 12px;
}

.gallery-img {
  transition: transform 0.2s ease;
}
.gallery-main:hover .gallery-img,
.gallery-thumb:hover .gallery-img {
  transform: scale(1.03);
}

.gallery-more-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

/* ── Description clamp ── */
.description-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* ── Highlight card ── */
.highlight-card {
  transition: box-shadow 0.15s;
}
.highlight-card:hover {
  box-shadow: 0 4px 16px rgba(41, 51, 155, 0.1) !important;
}

/* ── Ticket card ── */
.ticket-card {
  background: linear-gradient(
    135deg,
    rgba(41, 51, 155, 0.02),
    rgba(255, 187, 0, 0.03)
  );
}

/* ── FAQ panels ── */
.faq-panels :deep(.v-expansion-panel) {
  margin-bottom: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1) !important;
  border-radius: 10px !important;
}
.faq-panels :deep(.v-expansion-panel::after) {
  display: none !important;
}
.faq-panels :deep(.v-expansion-panel-title) {
  padding: 14px 16px !important;
}
.faq-panels :deep(.v-expansion-panel-text__wrapper) {
  padding: 0 16px 14px !important;
}

/* ── Day pills (opening hours) ── */
.day-pill {
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 600;
  background: rgba(0, 0, 0, 0.06);
  color: rgba(0, 0, 0, 0.4);
}
.day-pill--active {
  background: rgb(41, 51, 155);
  color: #fff;
}

/* ── Sticky sidebar ── */
.booking-sidebar {
  position: sticky;
  top: 80px;
}

/* ── Book button ── */
.book-btn {
  font-size: 15px;
  min-width: 100px;
}

/* ── Mobile bottom bar ── */
.mobile-book-bar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: #fff;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.08);
}

/* Ensure page doesn't get hidden behind bottom bar on mobile */
.product-detail-page {
  padding-bottom: 80px;
}
@media (min-width: 960px) {
  .product-detail-page {
    padding-bottom: 0;
  }
}

.cursor-pointer {
  cursor: pointer;
}
.cursor-pointer:hover {
  text-decoration: underline;
}
</style>
