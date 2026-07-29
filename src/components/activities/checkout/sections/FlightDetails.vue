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

        <v-col v-if="flight.airline === 'others'" cols="12">
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

      <v-card-text
        :style="{ maxHeight: mobile ? '100%' : '360px', overflowY: 'auto' }"
      >
        <v-row dense>
          <v-col
            v-for="operator in operators"
            :key="operator.value"
            md="3"
            sm="4"
          >
            <v-chip
              rounded="lg"
              :color="flight.airline === operator.value ? 'primary' : undefined"
              :variant="flight.airline === operator.value ? 'flat' : 'outlined'"
              label
              class="w-100 justify-center"
              @click="selectAirline(operator.value)"
            >
              {{ operator.title }}
            </v-chip>
          </v-col>
        </v-row>
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
  { title: "IndiGo", value: "indigo" },
  { title: "Air India", value: "air_india" },
  { title: "SpiceJet", value: "spicejet" },
  { title: "Vistara", value: "vistara" },
  { title: "Akasa Air", value: "akasa_air" },
  { title: "Alliance Air", value: "alliance_air" },
];

// Backend can override the default carrier list via config.operators, but
// "Others" is always appended so a flight not in the list can still be
// entered manually.
const operators = computed(() => {
  const configured = props.config?.operators?.length
    ? props.config.operators
    : DEFAULT_OPERATORS;

  return [...configured, { title: "Others", value: "others" }];
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

  if (flight.value.airline === "others") {
    return flight.value.custom_airline || "Others";
  }

  return (
    operators.value.find((operator) => operator.value === flight.value.airline)
      ?.title || ""
  );
});

const selectAirline = (value) => {
  flight.value.airline = value;

  airlineDialog.value = false;
};

// Only the "Others" airline needs a free-text name - clear any stale
// custom name once a listed carrier is picked instead.
watch(
  () => flight.value.airline,
  (value) => {
    if (value !== "others") {
      flight.value.custom_airline = "";
    }
  },
);
</script>
