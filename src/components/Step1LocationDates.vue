<template>
  <div>
    <!-- Card -->
    <v-card elevation="0" class="border g2a-rounded-border">
      <v-progress-linear
        color="warning"
        model-value="33"
        :height="6"
      ></v-progress-linear>
      <div class="d-flex align-center justify-space-between px-4 mt-4">
        <span class="g2a-text-12 text-greyDark">Step 1 of 3</span>
        <span class="g2a-text-12 text-greyDark">Location & Dates</span>
      </div>

      <v-container>
        <h3 class="my-4">Select Location & Dates</h3>

        <!-- Locations -->
        <v-row class="my-2">
          <v-col
            cols="12"
            sm="6"
            md="4"
            v-for="location in locationData.locations"
            :key="location.id"
          >
            <v-card
              elevation="0"
              class="cursor-pointer pa-4 h-100 d-flex flex-column justify-center"
              :style="cardStyle(location)"
              @click="selectLocation(location)"
            >
              <p class="font-weight-bold text-center">
                {{ location.name }}
              </p>
              <p
                v-if="selectedLocation?.name === location.name"
                class="text-warning text-center mt-2"
              >
                <v-icon size="14">mdi-check-circle</v-icon>
                Selected
              </p>
            </v-card>
          </v-col>
        </v-row>
        <v-alert
          class="my-2"
          type="info"
          variant="tonal"
          border="start"
          v-for="(data, index) in productInfo?.pickupDropMessages"
          :key="index"
        >
          {{ data }}
        </v-alert>
        <!-- Dates -->
        <v-row class="my-2">
          <v-col cols="12" md="6">
            <p class="text-caption">PICKUP DATE</p>
            <v-text-field
              v-model="pickupDate"
              type="date"
              variant="outlined"
              :min="minDate"
              @update:model-value="validateDates"
            />
          </v-col>

          <v-col cols="12" md="6">
            <p class="text-caption">RETURN DATE</p>
            <v-text-field
              v-model="returnDate"
              type="date"
              variant="outlined"
              :min="pickupDate || minDate"
              @update:model-value="validateDates"
            />
          </v-col>
        </v-row>

        <v-alert>
          <div class="g2a-text-bold-600">Operational Hours (Peak Season)</div>
          <div>
            Pickup/Dropoff: {{ bookingData.selectedLocation?.timings.season }}
          </div>
        </v-alert>
      </v-container>

      <v-divider />

      <!-- Footer -->
      <div class="d-flex align-center justify-space-between w-100 px-6 py-4">
        <v-btn variant="text" disabled>
          <v-icon start>mdi-arrow-left</v-icon>
          Back
        </v-btn>

        <v-btn
          color="warning"
          rounded="lg"
          size="large"
          :disabled="!isValid"
          @click="continueNext"
        >
          Continue
          <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-card>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import moment from "moment";

/* -------------------- PROPS -------------------- */

const props = defineProps({
  productInfo: Object,
  bookingData: Object,
  locationData: Object,
});

const emit = defineEmits(["update", "next-step"]);

/* -------------------- LOCAL STATE -------------------- */

const selectedLocation = ref(props.bookingData.selectedLocation);
const pickupDate = ref(props.bookingData.pickupDate);
const returnDate = ref(props.bookingData.returnDate);

/* -------------------- COMPUTED -------------------- */

const minDate = computed(() => moment().add(2, "days").format("YYYY-MM-DD"));

const isValid = computed(() => {
  return selectedLocation.value && pickupDate.value && returnDate.value;
});

/* -------------------- METHODS -------------------- */

const cardStyle = (location) => ({
  border:
    selectedLocation.value?.name === location.name
      ? "2px solid #FF8C00"
      : "1px solid #dde2e4",
  background:
    selectedLocation.value?.name === location.name ? "#FFF3E0" : "#FFFFFF",
});

const emitUpdate = () => {
  emit("update", {
    selectedLocation: selectedLocation.value,
    pickupDate: pickupDate.value,
    returnDate: returnDate.value,
  });
};

const selectLocation = (location) => {
  selectedLocation.value = location;
  emitUpdate();
};

const validateDates = () => {
  if (pickupDate.value && returnDate.value) {
    if (moment(returnDate.value).isBefore(moment(pickupDate.value))) {
      returnDate.value = "";
    }
  }
  emitUpdate();
};

const continueNext = () => {
  if (isValid.value) emit("next-step");
};

/* -------------------- SYNC FROM PARENT -------------------- */

watch(
  () => props.bookingData,
  (val) => {
    selectedLocation.value = val.selectedLocation;
    pickupDate.value = val.pickupDate;
    returnDate.value = val.returnDate;
  },
  { deep: true }
);
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}
</style>
