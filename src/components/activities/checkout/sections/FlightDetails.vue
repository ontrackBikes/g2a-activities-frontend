<template>
  <v-card rounded="lg" flat class="border">
    <v-container class="py-2">
      <div class="g2a-title-xl">
        {{ config.title || "Flight Details" }}
      </div>

      <div v-if="config.description" class="mt-1">
        {{ config.description }}
      </div>
    </v-container>

    <v-divider />

    <v-container class="py-2">
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field
            :model-value="airlineLabel"
            label="Airline"
            placeholder="Select your airline"
            prepend-inner-icon="mdi-airplane"
            append-inner-icon="mdi-chevron-down"
            variant="outlined"
            density="compact"
            rounded="lg"
            readonly
            hide-details="auto"
            class="mb-4"
            :rules="[(v) => !!v || 'Please select an airline']"
            @click="airlineDialog = true"
          />
        </v-col>

        <v-col v-if="flight.airline === 'Others'" cols="12">
          <v-text-field
            v-model="flight.custom_airline"
            label="Airline Name"
            placeholder="Enter your airline name"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details="auto"
            class="mb-4"
            :rules="[(v) => !!v || 'Please enter your airline name']"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="flight.flight_number"
            label="Flight Number"
            placeholder="e.g. IX 3742"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details="auto"
            :rules="[(v) => !!v || 'Please enter your flight number']"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <!-- Airline Dialog -->
  <v-dialog
    v-model="airlineDialog"
    max-width="500"
    scrollable
    :fullscreen="mobile"
    scrim="rgba(15,23,42,.30)"
    :style="{
      backdropFilter: 'blur(5px)',
      webkitBackdropFilter: 'blur(5px)',
    }"
  >
    <v-card :rounded="mobile ? 0 : 'lg'" flat>
      <v-toolbar density="comfortable" color="transparent">
        <v-toolbar-title>Select Airline</v-toolbar-title>

        <v-spacer />

        <v-btn icon variant="text" @click="airlineDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />

      <v-card-text class="pa-4">
        <v-text-field
          v-model="search"
          placeholder="Search airlines..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-4"
        />

        <v-list
          lines="one"
          density="comfortable"
          :style="{ maxHeight: mobile ? '100%' : '360px', overflowY: 'auto' }"
        >
          <v-list-item
            v-for="airline in filteredOperators"
            :key="airline"
            rounded="lg"
            :active="flight.airline === airline"
            @click="selectAirline(airline)"
          >
            <template #prepend>
              <v-avatar color="brandColor2" variant="tonal">
                <v-icon>mdi-airplane</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              {{ airline }}
            </v-list-item-title>

            <template v-if="flight.airline === airline" #append>
              <v-icon color="brandColor2">mdi-check-circle</v-icon>
            </template>
          </v-list-item>

          <template v-if="filteredOperators.length === 0">
            <div class="text-center py-8">
              <v-icon size="48" color="grey">mdi-airplane-off</v-icon>

              <div class="text-medium-emphasis mt-2">
                No matching airlines found.
              </div>
            </div>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { bookingStore } from "@/store/booking";

const { mobile } = useDisplay();

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

const booking = bookingStore;

const DEFAULT_OPERATORS = [
  "IndiGo",
  "Air India",
  "Air India Express",
  "Akasa Air",
  "SpiceJet",
  "Alliance Air",
  "Star Air",
  "Emirates",
  "Qatar Airways",
  "Etihad Airways",
  "Singapore Airlines",
  "Lufthansa",
  "British Airways",
  "Turkish Airlines",
  "Air Arabia",
  "Oman Air",
  "Saudia",
  "Malaysia Airlines",
  "Thai Airways",
  "SriLankan Airlines",
];

// Backend can override the default carrier list via config.operators, but
// "Others" is always appended so a flight not in the list can still be
// entered manually.
const operators = computed(() => {
  const configured = props.config?.operators?.length
    ? props.config.operators
    : DEFAULT_OPERATORS;

  return [...configured, "Others"];
});

const search = ref("");

const filteredOperators = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) return operators.value;

  return operators.value.filter((airline) =>
    airline.toLowerCase().includes(query),
  );
});

const flight = computed({
  get() {
    if (!booking.form.flight_details) {
      booking.form.flight_details = {
        airline: "",
        custom_airline: "",
        flight_number: "",
      };
    }

    return booking.form.flight_details;
  },

  set(value) {
    booking.form.flight_details = value;
  },
});

const airlineDialog = ref(false);

const airlineLabel = computed(() => {
  if (!flight.value.airline) return "";

  if (flight.value.airline === "Others") {
    return flight.value.custom_airline || "Others";
  }

  return flight.value.airline;
});

const selectAirline = (value) => {
  flight.value.airline = value;

  airlineDialog.value = false;
  search.value = "";
};

// Only the "Others" airline needs a free-text name - clear any stale
// custom name once a listed carrier is picked instead.
watch(
  () => flight.value.airline,
  (value) => {
    if (value !== "Others") {
      flight.value.custom_airline = "";
    }
  },
);
</script>
