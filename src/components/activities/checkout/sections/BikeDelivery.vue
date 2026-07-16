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
            inline
            hide-details="auto"
            :rules="[(v) => !!v || 'Please select a pickup option']"
          >
            <v-radio label="Self Pickup" value="self" />
            <v-radio label="Hotel Pickup" value="hotel" class="ml-4" />
          </v-radio-group>
        </v-col>

        <v-col v-if="rental.pickup_type === 'self'" cols="12">
          <v-select
            v-model="rental.pickup_point"
            :items="pickupPoints"
            label="Select Pickup Point"
            prepend-inner-icon="mdi-map-marker"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details="auto"
            :rules="[(v) => !!v || 'Pickup point is required']"
          />
        </v-col>

        <template v-else-if="rental.pickup_type === 'hotel'">
          <v-col cols="12">
            <v-text-field
              v-model="rental.pickup_hotel_name"
              placeholder="Enter your hotel name"
              prepend-inner-icon="mdi-domain"
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
            inline
            hide-details="auto"
            :rules="[(v) => !!v || 'Please select a drop-off option']"
          >
            <v-radio label="Self Drop" value="self" />
            <v-radio label="Hotel Drop" value="hotel" class="ml-4" />
          </v-radio-group>
        </v-col>

        <v-col v-if="rental.drop_type === 'self'" cols="12">
          <v-select
            v-model="rental.drop_point"
            :items="pickupPoints"
            label="Select Drop Point"
            prepend-inner-icon="mdi-map-marker"
            density="compact"
            variant="outlined"
            rounded="lg"
            hide-details="auto"
            :rules="[(v) => !!v || 'Drop point is required']"
          />
        </v-col>

        <template v-else-if="rental.drop_type === 'hotel'">
          <v-col cols="12">
            <v-text-field
              v-model="rental.drop_hotel_name"
              placeholder="Enter your hotel name"
              prepend-inner-icon="mdi-domain"
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
              Free within city limits. Extra charges (~{{
                formatCurrency(outOfCityCharge)
              }}) apply if outside. Our agent will contact you for more details.
            </v-alert>
          </v-col>
        </template>
      </v-row>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, watch } from "vue";
import { bookingStore } from "@/store/booking";
import { onBeforeRouteLeave } from "vue-router";

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

/*
|--------------------------------------------------------------------------
| Hardcoded reference data (TODO: move to vendor/location config once
| the backend exposes a pickup-points endpoint)
|--------------------------------------------------------------------------
*/

const LOCATION_PICKUP_POINTS = {
  "port blair": [
    {
      name: "Veer Savarkar International Airport",
      address:
        "Veer Savarkar International Airport, Port Blair, Andaman and Nicobar Islands",
      pickup: true,
      drop: true,
    },
    {
      name: "Phoenix Bay Jetty",
      address:
        "Phoenix Bay Jetty, Aberdeen Bazaar, Port Blair, Andaman and Nicobar Islands",
      pickup: true,
      drop: true,
    },
    {
      name: "Haddo Jetty",
      address: "Haddo Jetty, Port Blair, Andaman and Nicobar Islands",
      pickup: true,
      drop: true,
    },
  ],

  havelock: [
    {
      name: "Havelock Jetty",
      address: "Havelock Jetty, Havelock Island, Andaman and Nicobar Islands",
      pickup: true,
      drop: true,
    },
    {
      name: "Go2Andaman Outlet (Srisha Travels) - Opposite Full Moon Cafe",
      address:
        "3, Havelock Island, Swaraj Dweep, Govind Nagar, Andaman and Nicobar Islands 744211",
      pickup: true,
      drop: true,
    },
  ],

  neil: [
    {
      name: "Neil Market",
      address: "Neil Kendra, Shaheed, Neil Kendra, 744104",
      pickup: true,
      drop: true,
    },
    {
      name: "Go2Andaman Outlet (Saha Travels) - 200m from Neil Jetty",
      address:
        "Neil Jetty, Bharatpur, Neil Island, Andaman and Nicobar Islands 744104",
      pickup: true,
      drop: true,
    },
  ],
};
const pickupTime = computed(() => {
  return props.quote?.booking?.pickup_time || "";
});
const pickupPoints = computed(() => {
  if (props.config.pickup_points?.length) {
    return props.config.pickup_points;
  }

  const location = props.quote?.location?.name?.toLowerCase() || "";

  let points = LOCATION_PICKUP_POINTS["port blair"];

  if (location.includes("havelock")) {
    points = LOCATION_PICKUP_POINTS.havelock;
  } else if (location.includes("neil")) {
    points = LOCATION_PICKUP_POINTS.neil;
  } else if (location.includes("port blair")) {
    points = LOCATION_PICKUP_POINTS["port blair"];
  }

  return points.map((point) => point.name);
});

/*
|--------------------------------------------------------------------------
| Local Storage
|--------------------------------------------------------------------------
*/

const defaultRentalDetails = () => ({
  pickup_time: "",
  pickup_type: "self",

  pickup_point: "",
  pickup_hotel_name: "",

  drop_type: "self",

  drop_point: "",
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

const normalizeRentalDetails = (rental) => {
  // Pickup
  if (rental.pickup_type === "self") {
    delete rental.pickup_hotel_name;

    if (!("pickup_point" in rental)) {
      rental.pickup_point = "";
    }
  } else if (rental.pickup_type === "hotel") {
    delete rental.pickup_point;

    if (!("pickup_hotel_name" in rental)) {
      rental.pickup_hotel_name = "";
    }
  }

  // Drop
  if (rental.drop_type === "self") {
    delete rental.drop_hotel_name;

    if (!("drop_point" in rental)) {
      rental.drop_point = "";
    }
  } else if (rental.drop_type === "hotel") {
    delete rental.drop_point;

    if (!("drop_hotel_name" in rental)) {
      rental.drop_hotel_name = "";
    }
  }

  return rental;
};

/*
|--------------------------------------------------------------------------
| Rental Details (bound to booking.form.rental_details so this section's
| key matches BOOKING_SECTIONS.RENTAL_DETAILS on the backend)
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

onBeforeRouteLeave(() => {
  localStorage.removeItem(STORAGE_KEY);
  booking.form.rental_details = defaultRentalDetails();
});
/*
|--------------------------------------------------------------------------
| Auto Save
|--------------------------------------------------------------------------
*/

watch(
  rental,
  (value) => {
    normalizeRentalDetails(value);
    saveRentalDetails(value);
  },
  {
    deep: true,
  },
);
</script>
