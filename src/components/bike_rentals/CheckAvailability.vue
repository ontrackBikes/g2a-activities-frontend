<template>
  <div>
    <!-- ❌ LOCATION NOT FOUND -->
    <v-card
      v-if="locationNotFound"
      elevation="0"
      class="border g2a-rounded-border bg-white pa-6"
    >
      <h2 class="g2a-text-22 g2a-text-bold-600 mb-2">
        Rentals not available for this location
      </h2>

      <p class="text-grey g2a-text-15">
        {{ resolvedLocationName || "Unknown Location" }}
      </p>

      <v-alert type="info" variant="tonal" class="mt-4">
        Please choose a different serviceable location.
      </v-alert>
    </v-card>

    <!-- ✅ NORMAL FLOW -->
    <v-row v-else>
      <v-col cols="12" md="8">
        <!-- Header -->
        <div class="pb-4">
          <v-chip
            class="g2a-text-bold-600 text-uppercase"
            size="small"
            color="brandColor"
          >
            {{ productInfo.label || "Loading..." }}
          </v-chip>

          <div class="g2a-text-28 my-1 g2a-text-bold-600">
            {{ productInfo.description || "" }}
            <span> - {{ selectedLocation?.name }}</span>
          </div>

          <div class="text-grey">
            <v-icon size="16">mdi-map-marker</v-icon>
            {{ selectedLocation?.name }}
          </div>
        </div>

        <v-card elevation="0" class="border g2a-rounded-border bg-white">
          <v-progress-linear color="brandColor" :model-value="33" :height="6" />

          <div class="d-flex justify-space-between px-4 mt-4">
            <span class="g2a-text-13 text-grey">Step 1 of 3</span>
            <span class="g2a-text-13 text-grey">Location & Dates</span>
          </div>

          <v-container>
            <!-- Dates -->
            <v-row class="my-2">
              <v-col cols="12" md="6">
                <div class="g2a-text-12 g2a-text-bold-600 text-grey mb-2">
                  PICKUP DATE
                </div>
                <v-text-field
                  v-model="pickupDate"
                  type="date"
                  variant="outlined"
                  :min="minDate"
                />
              </v-col>

              <v-col cols="12" md="6">
                <div class="g2a-text-12 g2a-text-bold-600 text-grey mb-2">
                  RETURN DATE
                </div>
                <v-text-field
                  v-model="returnDate"
                  type="date"
                  variant="outlined"
                  :min="pickupDate"
                  :max="maxDate"
                />
              </v-col>
            </v-row>
          </v-container>

          <v-divider />

          <v-alert
            v-if="errorMessage"
            type="error"
            variant="tonal"
            class="mx-6 my-2"
          >
            {{ errorMessage }}
          </v-alert>

          <!-- Footer -->
          <div class="d-flex justify-end px-6 py-4">
            <v-btn
              color="brandColor"
              rounded="lg"
              size="large"
              :loading="loading"
              :disabled="!isValid"
              @click="continueNext"
            >
              Continue
              <v-icon end>mdi-arrow-right</v-icon>
            </v-btn>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import moment from "moment";
import apiClient from "@/services/api";

/* ---------------- PROPS ---------------- */
const props = defineProps({
  locationName: {
    type: String,
    default: null,
  },
});

/* ---------------- ROUTER ---------------- */
const router = useRouter();
const route = useRoute();

/* ---------------- STATE ---------------- */
const productInfo = ref({});
const selectedLocation = ref(null);
const locationNotFound = ref(false);

const pickupDate = ref(moment().add(2, "days").format("YYYY-MM-DD"));
const returnDate = ref(moment().add(3, "days").format("YYYY-MM-DD"));

const loading = ref(false);
const errorMessage = ref("");

/* ---------------- COMPUTED ---------------- */
const resolvedLocationName = computed(() => {
  return props.locationName || route.query.location || null;
});

const minDate = computed(() => moment().add(2, "days").format("YYYY-MM-DD"));

const maxDate = computed(() => moment().add(6, "months").format("YYYY-MM-DD"));

const isValid = computed(() => {
  return (
    selectedLocation.value &&
    pickupDate.value &&
    returnDate.value &&
    !loading.value
  );
});

/* ---------------- API ---------------- */
const fetchProductInfo = async () => {
  try {
    const { data } = await apiClient.get("/bike-rentals/product-info");
    if (data?.success) {
      productInfo.value = data.product;
    }
  } catch {
    /* silent */
  }
};

const fetchLocation = async () => {
  if (!resolvedLocationName.value) {
    locationNotFound.value = true;
    return;
  }

  try {
    const { data } = await apiClient.get(
      `/bike-rentals/location/${encodeURIComponent(
        resolvedLocationName.value,
      )}`,
    );

    if (data?.success && data.data) {
      selectedLocation.value = data.data;
    } else {
      locationNotFound.value = true;
    }
  } catch {
    locationNotFound.value = true;
  }
};

/* ---------------- CONTINUE ---------------- */
const continueNext = async () => {
  if (!isValid.value) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    const payload = {
      locationName: selectedLocation.value.name,
      startDate: pickupDate.value,
      endDate: returnDate.value,
      quantity: 1,
    };

    const { data } = await apiClient.post(
      "/bike-rentals/check-availability",
      payload,
    );

    if (!data?.success) {
      errorMessage.value = data?.message || "Not available for selected dates";
      return;
    }

    // ✅ Build URL manually
    const baseUrl = window.location.origin;
    const url = `${baseUrl}/select-pickup-delivery?location=${encodeURIComponent(
      selectedLocation.value.name,
    )}&startDate=${pickupDate.value}&endDate=${returnDate.value}`;

    // ✅ Open in new tab
    window.open(url, "_blank");
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Availability check failed";
  } finally {
    loading.value = false;
  }
};

/* ---------------- MOUNT ---------------- */
onMounted(async () => {
  await fetchProductInfo();
  await fetchLocation();
});
</script>
