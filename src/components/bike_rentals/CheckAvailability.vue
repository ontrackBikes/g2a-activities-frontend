<template>
  <div style="max-width: 1260px; margin: 0 auto; padding: 0 16px;">
    <!-- ❌ LOCATION NOT FOUND -->
    <v-card v-if="locationNotFound" elevation="0" class="border g2a-rounded-border bg-white pa-6">
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

    <!-- NORMAL FLOW -->
    <v-row v-else>
      <v-col cols="12" md="8">
        <!-- Header -->
        <div class="pb-4">
          <v-chip class="g2a-text-bold-600 text-uppercase" size="small" color="brandColor">
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
            <span class="g2a-text-13 text-grey">Dates</span>
          </div>

          <v-container>
            <!-- Dates -->
            <v-row class="my-2">
              <v-col cols="12" md="6">
                <div class="g2a-text-12 g2a-text-bold-600 text-grey mb-2" style="letter-spacing: 0.09rem">
                  PICKUP DATE
                </div>
                <v-text-field v-model="pickupDate" type="date" variant="outlined" :min="minDate" :max="maxDate"
                  hide-details="auto" :error="!!pickupDate && !isDateAllowed(pickupDate)"
                  :error-messages="!!pickupDate && !isDateAllowed(pickupDate) ? 'This date is not available' : ''" />
              </v-col>

              <v-col cols="12" md="6">
                <div class="g2a-text-12 g2a-text-bold-600 text-grey mb-2" style="letter-spacing: 0.09rem">
                  RETURN DATE
                </div>
                <v-text-field v-model="returnDate" type="date" variant="outlined" :min="pickupDate" :max="maxDate"
                  hide-details="auto" :error="!!returnDate && !isDateAllowed(returnDate)"
                  :error-messages="!!returnDate && !isDateAllowed(returnDate) ? 'This date is not available' : ''" />
              </v-col>
            </v-row>

            <v-alert v-if="errorMessage" type="error" variant="tonal" class="my-2">
              {{ errorMessage }}
            </v-alert>
          </v-container>

          <v-divider />

          <v-container class="bg-surface">
            <div class="text-end">
              <v-btn color="brandColor" rounded="xl" flat size="x-large" :loading="loading" :disabled="!isValid"
                @click="continueNext">
                Continue
              </v-btn>
            </div>
          </v-container>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
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
  return props.locationName || route.query.location || "Port Blair";
});

const minDate = computed(() => moment().add(2, "days").format("YYYY-MM-DD"));
const maxDate = computed(() => moment().add(6, "months").format("YYYY-MM-DD"));

// Combined set of all blackout dates (location + product level)
const blackoutDateSet = computed(() => {
  const locationDates = selectedLocation.value?.blackoutDates || [];
  const productDates = productInfo.value?.blackoutDates || [];
  return new Set([...locationDates, ...productDates]);
});

// Returns true if the date string is selectable (not blacked out)
const isDateAllowed = (dateStr) => {
  return !blackoutDateSet.value.has(moment(dateStr).format("YYYY-MM-DD"));
};

// Finds the next valid (non-blacked-out) date on or after a given date
const nextAllowedDate = (fromDate) => {
  let candidate = moment(fromDate);
  const limit = moment(maxDate.value);
  while (candidate.isSameOrBefore(limit)) {
    if (isDateAllowed(candidate.format("YYYY-MM-DD"))) {
      return candidate.format("YYYY-MM-DD");
    }
    candidate.add(1, "day");
  }
  return null;
};

const isValid = computed(() => {
  return (
    selectedLocation.value &&
    pickupDate.value &&
    returnDate.value &&
    isDateAllowed(pickupDate.value) &&
    isDateAllowed(returnDate.value) &&
    !loading.value
  );
});

/* ---------------- WATCHERS ---------------- */

// When pickup date changes, check if return date is still valid.
// If return date is now before the new pickup date, or is a blackout date, reset it.
watch(pickupDate, (newPickup) => {
  if (!returnDate.value) return;

  const needsReset =
    moment(returnDate.value).isSameOrBefore(moment(newPickup)) ||
    !isDateAllowed(returnDate.value);

  if (needsReset) {
    // Find the first valid date that is at least 1 day after the new pickup
    const candidate = nextAllowedDate(
      moment(newPickup).add(1, "day").format("YYYY-MM-DD"),
    );
    returnDate.value = candidate || "";
  }
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
      `/bike-rentals/location/${encodeURIComponent(resolvedLocationName.value)}`,
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

    const baseUrl = window.location.origin;
    const url = `${baseUrl}/select-pickup-delivery?location=${encodeURIComponent(
      selectedLocation.value.name,
    )}&startDate=${pickupDate.value}&endDate=${returnDate.value}`;

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
