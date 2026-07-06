<template>
  <v-card
    rounded="xl"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        {{ config.title || "Seat Selection" }}
      </div>

      <div class="g2a-text-13 text-medium-emphasis mt-1">
        {{
          config.description ||
          "Select your travel class and preferred seating for each passenger."
        }}
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>

      <!-- Travel Class -->

      <v-select
        v-model="ferry.travel_class"
        :items="travelClasses"
        item-title="name"
        item-value="code"
        label="Travel Class"
        variant="outlined"
        density="comfortable"
        hide-details="auto"
        class="mb-6"
        :rules="[
          v => !!v || 'Travel Class is required'
        ]"
      />

      <!-- Passenger Seat Preference -->

      <v-row
        v-for="(participant, index) in participants"
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
                  v-model="participant.seat_preference"
                  :items="seatPreferences"
                  label="Seat Preference"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  :rules="[
                    v => !!v || 'Seat Preference is required'
                  ]"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="participant.seat_number"
                  label="Preferred Seat (Optional)"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
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
import { computed, watch } from "vue";
import { bookingStore } from "@/store/booking";

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

/*
|--------------------------------------------------------------------------
| Ferry
|--------------------------------------------------------------------------
*/

const ferry = computed({
  get() {
    if (!booking.form.ferry) {
      booking.form.ferry = {
        travel_class: "economy",
      };
    }

    return booking.form.ferry;
  },

  set(value) {
    booking.form.ferry = value;
  },
});

/*
|--------------------------------------------------------------------------
| Participants
|--------------------------------------------------------------------------
*/

const participants = computed({
  get() {
    if (!booking.form.participants) {
      booking.form.participants = [];
    }

    return booking.form.participants;
  },

  set(value) {
    booking.form.participants = value;
  },
});

const createParticipant = () => ({
  first_name: "",
  last_name: "",
  age: null,
  gender: "",
  nationality: "Indian",
  weight: null,
  height: null,
  shoe_size: "",
  passport_number: "",
  id_number: "",

  seat_preference: "No Preference",
  seat_number: "",
});

/*
|--------------------------------------------------------------------------
| Sync with Quote
|--------------------------------------------------------------------------
*/

watch(
  () => Math.max(Number(props.quote?.booking?.guests || 1), 1),
  (count) => {
    while (participants.value.length < count) {
      participants.value.push(createParticipant());
    }

    while (participants.value.length > count) {
      participants.value.pop();
    }
  },
  {
    immediate: true,
  },
);

/*
|--------------------------------------------------------------------------
| Options
|--------------------------------------------------------------------------
*/

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