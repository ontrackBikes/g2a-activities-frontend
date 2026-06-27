<template>
  <v-card
    rounded="xl"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        Seat Selection
      </div>

      <div class="g2a-text-13 text-medium-emphasis mt-1">
        Select your travel class and preferred seating for each passenger.
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>

      <v-select
        v-model="ferry.travel_class"
        :items="travelClasses"
        item-title="name"
        item-value="code"
        label="Travel Class"
        variant="outlined"
        density="comfortable"
        class="mb-6"
      />

      <v-row
        v-for="(passenger,index) in participants"
        :key="index"
      >
        <v-col cols="12">

          <v-card
            variant="tonal"
            rounded="lg"
            class="pa-4 mb-4"
          >
            <div class="g2a-text-bold-600 mb-4">
              Passenger {{ index + 1 }}
            </div>

            <v-row>

              <v-col
                cols="12"
                md="6"
              >
                <v-select
                  v-model="passenger.seat_preference"
                  :items="seatPreferences"
                  label="Seat Preference"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="passenger.seat_number"
                  label="Preferred Seat (Optional)"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

            </v-row>

          </v-card>

        </v-col>
      </v-row>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed } from "vue";
import { bookingStore } from "@/store/booking";

const booking = bookingStore;

const defaultFerry = {
  travel_class: "economy",
};

const ferry = computed({
  get() {
    if (!booking.form.ferry) {
      booking.form.ferry = {
        ...defaultFerry,
      };
    }

    return booking.form.ferry;
  },

  set(value) {
    booking.form.ferry = value;
  },
});

const participants = computed(() => {
  if (!booking.form.participants) {
    booking.form.participants = [];
  }

  return booking.form.participants;
});

const travelClasses = [
  {
    code: "economy",
    name: "Economy",
  },
  {
    code: "premium",
    name: "Premium",
  },
  {
    code: "royal",
    name: "Royal",
  },
];

const seatPreferences = [
  "Window",
  "Aisle",
  "Front",
  "Back",
  "No Preference",
];
</script>