<template>
  <v-card rounded="lg" class="border" flat>
    <v-container class="py-4">
      <div class="g2a-title-xl">
        {{ config.title || "Participant Details" }}
      </div>

      <div class="mt-1">
        {{
          config.description || "Please provide details for every participant."
        }}
      </div>
    </v-container>

    <v-divider />

    <div>
      <div v-for="(participant, index) in participants" :key="index">
        <v-container>
          <div class="my-2 g2a-title-md">Participant {{ index + 1 }}</div>

          <div>
            <v-row>
              <v-col cols="6" md="6">
                <v-text-field
                  v-model="participant.first_name"
                  label="First Name"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[(v) => !!v || 'First Name is required']"
                />
              </v-col>

              <v-col cols="6" md="6">
                <v-text-field
                  v-model="participant.last_name"
                  label="Last Name"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[(v) => !!v || 'Last Name is required']"
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-text-field
                  v-model.number="participant.age"
                  type="number"
                  label="Age"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[(v) => !!v || 'Age is required']"
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-select
                  v-model="participant.gender"
                  :items="genders"
                  label="Gender"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[(v) => !!v || 'Gender is required']"
                />
              </v-col>

              <v-col cols="4" md="4">
                <v-select
                  v-model="participant.nationality"
                  :items="nationalities"
                  label="Nationality"
                  density="compact"
                  variant="outlined"
                  rounded="lg"
                  hide-details="auto"
                  :rules="[(v) => !!v || 'Nationality is required']"
                />
              </v-col>
            </v-row>
          </div>
        </v-container>
        <v-divider v-if="index + 1 < participants.length" class="mt-2"></v-divider>
      </div>
    </div>
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
const STORAGE_KEY = "g2a_participants_v1";

const genders = ["Male", "Female", "Other"];

const nationalities = ["Indian", "Foreigner"];

/*
|--------------------------------------------------------------------------
| Local Storage
|--------------------------------------------------------------------------
*/

const loadParticipants = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
      return [];
    }

    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const saveParticipants = (participants) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(participants));
  } catch {
    // Ignore storage failures
  }
};

const participants = computed({
  get() {
    if (!Array.isArray(booking.form.participants)) {
      booking.form.participants = loadParticipants();
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
  seat_preference: "",
  seat_number: "",
});

watch(
  () => props.quote?.booking?.guests,
  (guests) => {
    const count = Number(guests || 1);

    if (!Array.isArray(booking.form.participants)) {
      booking.form.participants = [];
    }

    while (booking.form.participants.length < count) {
      booking.form.participants.push(createParticipant());
    }

    booking.form.participants.splice(count);
  },
  {
    immediate: true,
  },
);
/*
|--------------------------------------------------------------------------
| Auto Save
|--------------------------------------------------------------------------
*/

watch(
  participants,
  (value) => {
    saveParticipants(value);
  },
  {
    deep: true,
  },
);
</script>
