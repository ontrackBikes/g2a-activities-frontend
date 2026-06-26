<template>
  <v-card
    rounded="xl"
    variant="outlined"
    elevation="0"
  >
    <v-card-title class="py-4">
      <div class="g2a-subtitle">
        Participant Details
      </div>

      <div class="g2a-text-13 text-medium-emphasis mt-1">
        Please provide details for every participant.
      </div>
    </v-card-title>

    <v-divider />

    <v-card-text>

      <v-expansion-panels
        multiple
        variant="accordion"
      >

        <v-expansion-panel
          v-for="(participant,index) in participants"
          :key="index"
        >

          <v-expansion-panel-title>

            Participant {{ index + 1 }}

          </v-expansion-panel-title>

          <v-expansion-panel-text>

            <v-row>

              <template
                v-for="field in fields"
                :key="field"
              >

                <!-- First Name -->

                <v-col
                  v-if="field==='first_name'"
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="participant.first_name"
                    label="First Name"
                    variant="outlined"
                  />
                </v-col>

                <!-- Last Name -->

                <v-col
                  v-if="field==='last_name'"
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="participant.last_name"
                    label="Last Name"
                    variant="outlined"
                  />
                </v-col>

                <!-- Age -->

                <v-col
                  v-if="field==='age'"
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model.number="participant.age"
                    label="Age"
                    type="number"
                    variant="outlined"
                  />
                </v-col>

                <!-- Gender -->

                <v-col
                  v-if="field==='gender'"
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="participant.gender"
                    :items="genders"
                    label="Gender"
                    variant="outlined"
                  />
                </v-col>

                <!-- Nationality -->

                <v-col
                  v-if="field==='nationality'"
                  cols="12"
                  md="4"
                >
                  <v-select
                    v-model="participant.nationality"
                    :items="nationalities"
                    label="Nationality"
                    variant="outlined"
                  />
                </v-col>

                <!-- Weight -->

                <v-col
                  v-if="field==='weight'"
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model.number="participant.weight"
                    type="number"
                    label="Weight (kg)"
                    variant="outlined"
                  />
                </v-col>

                <!-- Height -->

                <v-col
                  v-if="field==='height'"
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model.number="participant.height"
                    type="number"
                    label="Height (cm)"
                    variant="outlined"
                  />
                </v-col>

                <!-- Shoe Size -->

                <v-col
                  v-if="field==='shoe_size'"
                  cols="12"
                  md="4"
                >
                  <v-text-field
                    v-model="participant.shoe_size"
                    label="Shoe Size"
                    variant="outlined"
                  />
                </v-col>

                <!-- Passport -->

                <v-col
                  v-if="field==='passport_number'"
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="participant.passport_number"
                    label="Passport Number"
                    variant="outlined"
                  />
                </v-col>

                <!-- ID -->

                <v-col
                  v-if="field==='id_number'"
                  cols="12"
                  md="6"
                >
                  <v-text-field
                    v-model="participant.id_number"
                    label="Government ID"
                    variant="outlined"
                  />
                </v-col>

              </template>

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

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

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

const fields = computed(() => {
  return (
    props.config.fields || [
      "first_name",
      "last_name",
      "age",
      "gender",
    ]
  );
});

const participants = computed(
  () => booking.form.participants
);

watch(
  () => booking.form.guests,
  (count) => {

    while (
      booking.form.participants.length < count
    ) {
      booking.form.participants.push({
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
      });
    }

    booking.form.participants.splice(count);

  },
  {
    immediate: true,
  }
);
</script>