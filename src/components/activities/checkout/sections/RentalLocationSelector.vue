<template>
  <v-card rounded="lg">
    <v-toolbar flat density="comfortable">
      <v-btn
        v-if="view === 'hotel'"
        icon="mdi-arrow-left"
        variant="text"
        @click="view = 'list'"
      />

      <v-toolbar-title class="g2a-title-lg">
        <template v-if="view === 'list'">
          Select {{ mode === "pickup" ? "Pickup" : "Drop" }} Point
        </template>
        <template v-else>
          {{ mode === "pickup" ? "Deliver to Hotel" : "Drop at Hotel" }}
        </template>
      </v-toolbar-title>

      <v-spacer />

      <v-btn icon="mdi-close" variant="text" @click="$emit('close')" />
    </v-toolbar>

    <v-divider />

    <!-- Self pickup/drop point list -->
    <v-card-text v-if="view === 'list'" class="pa-4">
      <!-- Loading -->
      <div
        v-if="loading"
        class="d-flex flex-column align-center justify-center py-10"
      >
        <v-progress-circular indeterminate color="brandColor2" size="36" />
        <div class="mt-3 g2a-title-sm text-medium-emphasis">
          Loading locations…
        </div>
      </div>

      <!-- Error -->
      <v-alert v-else-if="error" type="error" variant="tonal" rounded="lg">
        <div
          class="d-flex flex-column flex-sm-row align-sm-center justify-space-between ga-3"
        >
          <span>{{ error }}</span>

          <v-btn
            size="small"
            variant="outlined"
            color="error"
            @click="fetchLocations"
          >
            Try Again
          </v-btn>
        </div>
      </v-alert>

      <!-- Empty -->
      <div
        v-else-if="!locations.length"
        class="d-flex flex-column align-center justify-center py-10 text-medium-emphasis"
      >
        <v-icon size="36" class="mb-2">mdi-map-marker-off-outline</v-icon>
        No {{ mode === "pickup" ? "pickup" : "drop" }} points are available for
        this location right now.
      </div>

      <!-- Data -->
      <v-row v-else>
        <v-col v-for="item in locations" :key="item.id" cols="12">
          <v-card
            rounded="lg"
            flat
            class="location-card"
            :class="{
              border: selected?.id === item.id,
            }"
            @click="selectLocation(item)"
          >
            <v-row no-gutters>
              <!-- Image -->
              <v-col cols="4" md="4">
                <v-img :src="item.image" height="100" cover class="fill-height">
                  <template #error>
                    <div
                      class="d-flex align-center justify-center fill-height bg-grey-lighten-3"
                    >
                      <v-icon size="40">mdi-image-off</v-icon>
                    </div>
                  </template>

                  <v-chip
                    v-if="item.type"
                    class="ma-3"
                    color="brandColor"
                    variant="flat"
                    size="small"
                  >
                    {{ item.type }}
                  </v-chip>
                </v-img>
              </v-col>

              <!-- Details -->
              <v-col cols="8" md="8">
                <v-container>
                  <div class="d-flex justify-space-between align-start">
                    <div>
                      <div class="g2a-title-lg">
                        {{ item.name }}
                      </div>

                      <!-- <div class="mt-2">
                        {{ item.address }}
                      </div> -->
                    </div>
                  </div>

                  <v-spacer />

                  <div class="d-flex justify-space-between align-center mt-4">
                    <a
                      v-if="item.gmapLink"
                      :href="item.gmapLink"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="g2a-link"
                      @click.stop
                    >
                      <v-icon size="18" class="mr-1">mdi-open-in-new</v-icon>
                      Google Map
                    </a>

                    <span v-else />

                    <!-- <v-btn
                      v-if="selected?.id !== item.id"
                      color="brandColor2"
                      variant="tonal"
                      rounded="pill"
                      @click.stop="selectLocation(item)"
                    >
                      Select
                    </v-btn> -->

                    <!-- <v-chip v-if="selected?.id == item.id" color="success" variant="flat">
                      Selected
                    </v-chip> -->
                  </div>
                </v-container>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>

      <v-btn
        block
        variant="outlined"
        color="brandColor2"
        rounded="lg"
        size="large"
        class="mt-4"
        prepend-icon="mdi-domain"
        @click="view = 'hotel'"
      >
        {{ mode === "pickup" ? "Deliver to Hotel" : "Drop at Hotel" }}
      </v-btn>
    </v-card-text>

    <!-- Hotel address form -->
    <v-card-text v-else class="pa-4">
      <v-text-field
        v-model="hotelName"
        placeholder="Enter your hotel name"
        density="compact"
        variant="outlined"
        rounded="lg"
        autofocus
        hide-details="auto"
      />

      <v-alert
        type="info"
        variant="tonal"
        density="compact"
        rounded="lg"
        class="g2a-title-sm mt-4"
      >
        Free within city limits. Extra charges (~₹100) apply if outside. Our
        agent will contact you for more details.
      </v-alert>

      <v-btn
        block
        color="brandColor2"
        rounded="lg"
        size="large"
        class="mt-4"
        :disabled="!hotelName.trim()"
        @click="confirmHotel"
      >
        Confirm
      </v-btn>
    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import apiClient from "@/services/api.js";

const props = defineProps({
  mode: {
    type: String,
    default: "pickup",
    validator: (value) => ["pickup", "drop"].includes(value),
  },

  selected: {
    type: Object,
    default: null,
  },

  // Which rental hub to load pickup/drop points for. Falls back to
  // "port-blair" since that's the only live rental city today.
  locationSlug: {
    type: String,
    default: "port-blair",
  },

  // Whether the field this dialog was opened from currently holds a
  // hotel delivery/return instead of a self point — used to land on the
  // hotel form (pre-filled) when reopening.
  selectedType: {
    type: String,
    default: "self",
  },

  hotelName: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["selected", "hotel-selected", "close"]);

/*
|--------------------------------------------------------------------------
| View state
|--------------------------------------------------------------------------
|
| The dialog has two views: the list of self pickup/drop points, and a
| simple form for entering a hotel address. It opens straight into
| whichever one matches the field's current selection.
|
*/

const view = ref(props.selectedType === "hotel" ? "hotel" : "list");
const hotelName = ref(props.hotelName || "");

const confirmHotel = () => {
  emit("hotel-selected", hotelName.value.trim());
};

/*
|--------------------------------------------------------------------------
| In-memory cache
|--------------------------------------------------------------------------
|
*/

const CACHE_TTL_MS = 5 * 60 * 1000;
const locationsCache = new Map();

const getCached = (slug) => {
  const entry = locationsCache.get(slug);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    locationsCache.delete(slug);
    return null;
  }
  return entry.data;
};

const setCached = (slug, data) => {
  locationsCache.set(slug, { data, timestamp: Date.now() });
};

/*
|--------------------------------------------------------------------------
| Fetch
|--------------------------------------------------------------------------
*/

const rawLocations = ref([]);
const loading = ref(false);
const error = ref("");

let abortController = null;

// Defensive normalizer: adapts the API response shape into what the
// template expects, regardless of snake_case/camelCase differences.
const normalizeLocation = (raw, index) => ({
  id: raw.id ?? raw._id ?? index,
  name: raw.name ?? "",
  slug: raw.slug ?? raw.location_point_slug ?? "",
  type: raw.type ?? raw.location_type ?? "",
  image: raw.image ?? raw.image_url ?? raw.imageUrl ?? "",
  address: raw.address ?? "",
  gmapLink: raw.gmap_link ?? raw.gmapLink ?? raw.google_map_link ?? "",
  pickup: Boolean(raw.pickup ?? raw.is_pickup),
  drop: Boolean(raw.drop ?? raw.is_drop),
});

const fetchLocations = async () => {
  const slug = props.locationSlug;

  const cached = getCached(slug);
  if (cached) {
    rawLocations.value = cached;
    error.value = "";
    loading.value = false;
    return;
  }

  abortController?.abort();
  abortController = new AbortController();

  loading.value = true;
  error.value = "";

  try {
    const { data } = await apiClient.get(
      `/v1/bike-rentals/locations/${encodeURIComponent(slug)}/pickup-drop-points`,
      { signal: abortController.signal },
    );

    if (!data?.success) {
      throw new Error(data?.message || "Failed to load locations.");
    }

    const normalized = Array.isArray(data.data)
      ? data.data.map(normalizeLocation)
      : [];

    rawLocations.value = normalized;
    setCached(slug, normalized);
  } catch (err) {
    if (err.code === "ERR_CANCELED" || err.name === "CanceledError") return;

    error.value =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong while loading locations.";
    rawLocations.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(fetchLocations);

watch(
  () => props.locationSlug,
  () => fetchLocations(),
);

onBeforeUnmount(() => {
  abortController?.abort();
});

/*
|--------------------------------------------------------------------------
| Computed
|--------------------------------------------------------------------------
*/

const locations = computed(() =>
  rawLocations.value.filter((location) =>
    props.mode === "pickup" ? location.pickup : location.drop,
  ),
);

/*
|--------------------------------------------------------------------------
| Methods
|--------------------------------------------------------------------------
*/

const selectLocation = (location) => {
  emit("selected", location);
};

const close = () => {
  emit("close");
};
</script>

<style scoped>
.location-card {
  cursor: pointer;
  transition: border-color 0.15s ease;
}
</style>
