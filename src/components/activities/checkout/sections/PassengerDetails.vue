<template>
  <v-card
    rounded="xl"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        Passenger Details
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>

      <v-expansion-panels
        multiple
        variant="accordion"
      >

        <v-expansion-panel
          v-for="(passenger,index) in passengers"
          :key="index"
        >

          <v-expansion-panel-title>

            Passenger {{ index + 1 }}

          </v-expansion-panel-title>

          <v-expansion-panel-text>

            <v-row>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="passenger.first_name"
                  label="First Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="passenger.last_name"
                  label="Last Name"
                  variant="outlined"
                  density="comfortable"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model.number="passenger.age"
                  type="number"
                  label="Age"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="passenger.gender"
                  :items="genders"
                  label="Gender"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="passenger.nationality"
                  :items="nationalities"
                  label="Nationality"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="passenger.weight"
                  label="Weight (kg)"
                  type="number"
                  variant="outlined"
                />
              </v-col>

              <v-col
                cols="12"
                md="6"
              >
                <v-text-field
                  v-model="passenger.height"
                  label="Height (cm)"
                  type="number"
                  variant="outlined"
                />
              </v-col>

            </v-row>

          </v-expansion-panel-text>

        </v-expansion-panel>

      </v-expansion-panels>

    </v-card-text>
  </v-card>
</template>

<script setup>
import { computed, watch } from "vue";
import { bookingStore } from "@/store/booking";

const booking = bookingStore;

const genders = [
  "Male",
  "Female",
  "Other",
];

const nationalities = [
  "Indian",
  "Foreigner",
];

const passengers = computed(() => booking.form.passengers);

watch(
  () => booking.form.guests,
  (guestCount) => {

    while (booking.form.passengers.length < guestCount) {

      booking.form.passengers.push({

        first_name: "",

        last_name: "",

        gender: "",

        age: null,

        nationality: "Indian",

        weight: null,

        height: null,

      });

    }

    booking.form.passengers.splice(guestCount);

  },
  {
    immediate: true,
  }
);
</script>