<template>
  <div>
    <!-- Card -->
    <v-card elevation="0" class="border g2a-rounded-border bg-white">
      <v-progress-linear
        color="brandColor"
        model-value="33"
        :height="6"
      ></v-progress-linear>
      <div class="d-flex align-center justify-space-between px-4 mt-4">
        <span class="g2a-text-13 text-grey">Step 1 of 3</span>
        <span class="g2a-text-13 text-grey"
          ><span v-if="!selectLocation">Location & </span>Dates</span
        >
      </div>

      <v-container>
        <div v-if="!selectLocation">
          <div class="g2a-text-22 g2a-text-bold-600 my-2">
            Select Location & Dates
          </div>

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
                <div class="font-weight-bold g2a-text-15 text-center">
                  {{ location.name }}
                </div>
                <p
                  v-if="selectedLocation?.name === location.name"
                  class="text-brandColor text-caption g2a-text-bold-600 text-center"
                >
                  <v-icon size="13">mdi-check-circle</v-icon>
                  Selected
                </p>
              </v-card>
            </v-col>
          </v-row>

          <v-alert
            class="my-2 py-2"
            type="info"
            variant="tonal"
            border="start"
            v-for="(data, index) in productInfo?.pickupDropMessages"
            :key="index"
          >
            <span class="g2a-text-15 g2a-text-bold-500">{{ data }}</span>
          </v-alert>
        </div>
        <!-- Dates -->
        <v-row class="my-2">
          <v-col cols="12" md="6">
            <div class="g2a-text-12 g2a-text-bold-600 text-grey mb-2">
              PICKUP DATE
            </div>
            <v-text-field
              v-model="pickupDate"
              type="date"
              variant="outlined"
              hide-details="auto"
              :min="minDate"
              @update:model-value="validateDates"
            />
          </v-col>

          <v-col cols="12" md="6">
            <div class="g2a-text-12 g2a-text-bold-600 text-grey mb-2">
              RETURN DATE
            </div>
            <v-text-field
              v-model="returnDate"
              type="date"
              variant="outlined"
              hide-details="auto"
              :min="pickupDate || minDate"
              :max="maxDate"
              @update:model-value="validateDates"
            />
          </v-col>
        </v-row>

        <v-alert color="background">
          <div class="g2a-text-bold-600 text-greyDark">
            Operational Hours
            <span v-if="bookingData.selectedLocation?.isPeakMonth"
              >(Peak Season)</span
            >
          </div>
          <div
            class="text-greyDark"
            v-if="bookingData.selectedLocation?.isPeakMonth"
          >
            Pickup/Dropoff: {{ bookingData.selectedLocation?.timings.season }}
          </div>
          <div class="text-greyDark" v-else>
            Pickup/Dropoff:
            {{ bookingData.selectedLocation?.timings.offSeason }}
          </div>
        </v-alert>
      </v-container>

      <v-divider />

      <!-- Footer -->
      <div class="d-flex align-center justify-space-between w-100 px-6 py-4">
        <v-btn variant="text" disabled>
          <v-icon start>mdi-arrow-left</v-icon>
          BACK
        </v-btn>

        <v-btn
          flat
          color="brandColor"
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
const maxDate = computed(() => moment().add(6, "month").format("YYYY-MM-DD"));

const isValid = computed(() => {
  return selectedLocation.value && pickupDate.value && returnDate.value;
});

/* -------------------- METHODS -------------------- */

const cardStyle = (location) => ({
  border:
    selectedLocation.value?.name === location.name
      ? "2px solid #FF6B36"
      : "1px solid #dde2e4",
  background:
    selectedLocation.value?.name === location.name ? "#FFF5F2" : "#FFFFFF",
  color: selectedLocation.value?.name === location.name ? "#D84316" : "#212121",
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
