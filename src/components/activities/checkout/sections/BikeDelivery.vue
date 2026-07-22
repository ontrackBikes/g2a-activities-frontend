<template>
  <v-card rounded="lg" variant="outlined" elevation="0">
    <v-container class="py-2">
      <div class="g2a-title-xl">
        {{ config.title || "Rental Details" }}
      </div>

      <div v-if="config.description" class="mt-1">
        {{ config.description }}
      </div>
    </v-container>

    <v-divider />

    <!-- Getting the vehicle -->
    <v-container class="py-2">
      <div class="d-flex align-center ga-2 mb-4">
        <span class="g2a-title-md text-uppercase">Getting the Vehicle</span>
      </div>

      <v-row>
        <v-col cols="12">
          <v-radio-group
            v-model="rental.pickup_type"
            name="rental_pickup_type"
            inline
            hide-details="auto"
            :rules="[(v) => !!v || 'Please select a pickup option']"
          >
            <v-radio label="Self Pickup" value="self" />
            <v-radio label="Hotel Pickup" value="hotel" class="ml-4" />
          </v-radio-group>
        </v-col>

        <v-col v-if="rental.pickup_type === 'self'" cols="12">
          <v-text-field
            :model-value="rental.pickup_point?.name"
            label="Select Pickup Point"
            prepend-inner-icon="mdi-map-marker"
            append-inner-icon="mdi-chevron-down"
            variant="outlined"
            density="compact"
            rounded="lg"
            readonly
            hide-details="auto"
            :rules="[
              (v) => !!rental.pickup_point || 'Pickup point is required',
            ]"
            @click="pickUpDialog = true"
          />
        </v-col>

        <template v-else-if="rental.pickup_type === 'hotel'">
          <v-col cols="12">
            <v-text-field
              v-model="rental.pickup_hotel_name"
              placeholder="Enter your hotel name"
              density="compact"
              variant="outlined"
              rounded="lg"
              hide-details="auto"
              :rules="[(v) => !!v || 'Hotel name is required']"
            />
          </v-col>

          <v-col cols="12">
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
              rounded="lg"
              class="g2a-title-sm"
            >
              Free within city limits. Extra charges (~₹100) apply if outside.
              Our agent will contact you for more details.
            </v-alert>
          </v-col>
        </template>
      </v-row>
    </v-container>

    <v-divider class="my-2" />

    <!-- Returning the vehicle -->
    <v-container class="py-2">
      <div class="d-flex align-center ga-2 mb-4">
        <span class="g2a-title-md text-uppercase">Returning the Vehicle</span>
      </div>

      <v-row>
        <v-col cols="12">
          <v-radio-group
            v-model="rental.drop_type"
            name="rental_drop_type"
            inline
            hide-details="auto"
            :rules="[(v) => !!v || 'Please select a drop-off option']"
          >
            <v-radio label="Self Drop" value="self" />
            <v-radio label="Hotel Drop" value="hotel" class="ml-4" />
          </v-radio-group>
        </v-col>

        <v-col v-if="rental.drop_type === 'self'" cols="12">
          <v-text-field
            :model-value="rental.drop_point?.name"
            label="Select Drop Point"
            prepend-inner-icon="mdi-map-marker"
            append-inner-icon="mdi-chevron-down"
            variant="outlined"
            density="compact"
            rounded="lg"
            readonly
            hide-details="auto"
            :rules="[(v) => !!rental.drop_point || 'Drop point is required']"
            @click="dropDialog = true"
          />
        </v-col>

        <template v-else-if="rental.drop_type === 'hotel'">
          <v-col cols="12">
            <v-text-field
              v-model="rental.drop_hotel_name"
              placeholder="Enter your hotel name"
              variant="outlined"
              density="compact"
              rounded="lg"
              hide-details="auto"
              :rules="[(v) => !!v || 'Hotel name is required']"
            />
          </v-col>

          <v-col cols="12">
            <v-alert
              type="info"
              variant="tonal"
              density="compact"
              rounded="lg"
              class="g2a-title-sm"
            >
              Free within city limits. Extra charges (~₹100) apply if outside.
              Our agent will contact you for more details.
            </v-alert>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-card>

  <!-- Pickup Dialog -->
  <v-dialog
    v-model="pickUpDialog"
    max-width="700"
    scrollable
    scrim="rgba(15,23,42,.30)"
    :style="{
      backdropFilter: 'blur(5px)',
      webkitBackdropFilter: 'blur(5px)',
    }"
  >
    <rental-location-selector
      mode="pickup"
      :selected="rental.pickup_point"
      :location-slug="locationSlug"
      @selected="onPickupSelected"
      @close="pickUpDialog = false"
    />
  </v-dialog>

  <!-- Drop Dialog -->
  <v-dialog
    v-model="dropDialog"
    max-width="700"
    scrollable
    scrim="rgba(15,23,42,.30)"
    :style="{
      backdropFilter: 'blur(5px)',
      webkitBackdropFilter: 'blur(5px)',
    }"
  >
    <rental-location-selector
      mode="drop"
      :selected="rental.drop_point"
      :location-slug="locationSlug"
      @selected="onDropSelected"
      @close="dropDialog = false"
    />
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { onBeforeRouteLeave } from "vue-router";
import { bookingStore } from "@/store/booking";
import RentalLocationSelector from "./RentalLocationSelector.vue";

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },

  quote: {
    type: Object,
    required: true,
  },
});

const booking = bookingStore;

const STORAGE_KEY = "g2a_rental_details_v1";

const pickUpDialog = ref(false);
const dropDialog = ref(false);

/*
|--------------------------------------------------------------------------
| Location
|--------------------------------------------------------------------------
|
| The quote (from /v1/booking-estimates/:estimate_id) carries the location
| this product/booking belongs to. We use its slug to fetch the correct
| set of pickup/drop points from the backend. Falls back to Port Blair,
| the only rental city live today, if the quote hasn't resolved a slug.
|
*/

const locationSlug = computed(
  () => props.quote?.location?.slug || "port-blair",
);

// Out-of-city delivery surcharge. Configurable per-product via
// config.out_of_city_charge; falls back to the platform default.
const outOfCityCharge = computed(() => props.config?.out_of_city_charge ?? 100);

/*
|--------------------------------------------------------------------------
| Pickup / Drop Selection
|--------------------------------------------------------------------------
*/

const onPickupSelected = (location) => {
  rental.value.pickup_point = location;
  pickUpDialog.value = false;
};

const onDropSelected = (location) => {
  rental.value.drop_point = location;
  dropDialog.value = false;
};

/*
|--------------------------------------------------------------------------
| Pickup Time
|--------------------------------------------------------------------------
*/

const pickupTime = computed(() => {
  return props.quote?.booking?.pickup_time || "";
});

/*
|--------------------------------------------------------------------------
| Local Storage
|--------------------------------------------------------------------------
*/

const defaultRentalDetails = () => ({
  pickup_time: "",

  pickup_type: "self",
  pickup_point: null,
  pickup_hotel_name: "",

  drop_type: "self",
  drop_point: null,
  drop_hotel_name: "",
});

const loadRentalDetails = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    const rental = raw
      ? {
          ...defaultRentalDetails(),
          ...JSON.parse(raw),
        }
      : defaultRentalDetails();

    return normalizeRentalDetails(rental);
  } catch {
    return defaultRentalDetails();
  }
};

const saveRentalDetails = (value) => {
  try {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        pickup_time: value.pickup_time,
        pickup_type: value.pickup_type,
        pickup_point: value.pickup_point,
        pickup_hotel_name: value.pickup_hotel_name,
        drop_type: value.drop_type,
        drop_point: value.drop_point,
        drop_hotel_name: value.drop_hotel_name,
      }),
    );
  } catch {
    // Ignore storage failures
  }
};

/*
|--------------------------------------------------------------------------
| Normalize
|--------------------------------------------------------------------------
*/

const normalizeRentalDetails = (rental) => {
  if (rental.pickup_type === "self") {
    rental.pickup_hotel_name = "";
    if (rental.pickup_point === undefined) rental.pickup_point = null;
  } else {
    rental.pickup_point = null;
    if (rental.pickup_hotel_name === undefined) rental.pickup_hotel_name = "";
  }

  if (rental.drop_type === "self") {
    rental.drop_hotel_name = "";
    if (rental.drop_point === undefined) rental.drop_point = null;
  } else {
    rental.drop_point = null;
    if (rental.drop_hotel_name === undefined) rental.drop_hotel_name = "";
  }

  return rental;
};
/*
|--------------------------------------------------------------------------
| Rental Details
|--------------------------------------------------------------------------
*/

const rental = computed({
  get() {
    if (!booking.form.rental_details) {
      booking.form.rental_details = loadRentalDetails();
    }

    return booking.form.rental_details;
  },

  set(value) {
    booking.form.rental_details = value;
  },
});

/*
|--------------------------------------------------------------------------
| Watchers
|--------------------------------------------------------------------------
*/

watch(
  [() => rental.value.pickup_type, () => rental.value.drop_type],
  () => {
    normalizeRentalDetails(rental.value);
  },
  {
    immediate: true,
  },
);

watch(
  () => pickupTime.value,
  (value) => {
    rental.value.pickup_time = value;
  },
  {
    immediate: true,
  },
);

watch(
  rental,
  (value) => {
    normalizeRentalDetails(value);
    saveRentalDetails(value);
  },
  { deep: true, immediate: true },
);

/*
|--------------------------------------------------------------------------
| Cleanup
|--------------------------------------------------------------------------
*/

onBeforeRouteLeave(() => {
  localStorage.removeItem(STORAGE_KEY);
  booking.form.rental_details = defaultRentalDetails();
});
</script>
