<template>
  <v-card rounded="xl" variant="outlined" elevation="0">
    <v-container class="py-4">
      <div class="g2a-subtitle">
        {{ config.title || "Participant Details" }}
      </div>

      <div class="g2a-text-13 mt-1">
        {{
          config.description || "Please provide details for every participant."
        }}
      </div>
    </v-container>

    <v-divider />

    <div>
      <div
        
        v-for="(participant, index) in participants"
        :key="index"
      >
        <v-container>
          <div class="my-2"> Participant {{ index + 1 }} </div>

        <div>
          <v-row>
            <v-col cols="12" md="6">
              <v-text-field
                v-model="participant.first_name"
                label="First Name"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :rules="[(v) => !!v || 'First Name is required']"
              />
            </v-col>

            <v-col cols="12" md="6">
              <v-text-field
                v-model="participant.last_name"
                label="Last Name"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :rules="[(v) => !!v || 'Last Name is required']"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-text-field
                v-model.number="participant.age"
                type="number"
                label="Age"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :rules="[(v) => !!v || 'Age is required']"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="participant.gender"
                :items="genders"
                label="Gender"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :rules="[(v) => !!v || 'Gender is required']"
              />
            </v-col>

            <v-col cols="12" md="4">
              <v-select
                v-model="participant.nationality"
                :items="nationalities"
                label="Nationality"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                :rules="[(v) => !!v || 'Nationality is required']"
              />
            </v-col>
          </v-row>
        </div>
        </v-container>
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

const genders = ["Male", "Female", "Other"];

const nationalities = ["Indian", "Foreigner"];

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
</script>
