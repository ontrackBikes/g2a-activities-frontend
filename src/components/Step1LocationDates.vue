<template>
  <div>
    <v-card elevation="0" class="border g2a-rounded-border bg-white">
      <v-progress-linear color="brandColor" model-value="33" :height="6" />

      <div class="d-flex align-center justify-space-between px-4 mt-4">
        <span class="g2a-text-13 text-grey">Step 1 of 3</span>
        <span class="g2a-text-13 text-grey">
          <span v-if="!bookingData.selectedLocation">Location & </span>Dates
        </span>
      </div>

      <v-container>
        <!-- Locations -->
        <div v-if="!bookingData.selectedLocation">
          <div class="g2a-text-22 g2a-text-bold-600 my-2">
            Select Location & Dates
          </div>

          <v-row class="my-2">
            <v-col
              v-for="location in locationData.locations"
              :key="location.id"
              cols="12"
              sm="6"
              md="4"
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
                  v-if="bookingData.selectedLocation?.name === location.name"
                  class="text-brandColor text-caption g2a-text-bold-600 text-center"
                >
                  <v-icon size="13">mdi-check-circle</v-icon>
                  Selected
                </p>
              </v-card>
            </v-col>
          </v-row>

          <v-alert
            v-for="(msg, i) in productInfo?.pickupDropMessages"
            :key="i"
            class="my-2 py-2"
            type="info"
            variant="tonal"
            border="start"
          >
            <span class="g2a-text-15 g2a-text-bold-500">{{ msg }}</span>
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
              @update:model-value="updateDates"
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
              @update:model-value="updateDates"
            />
          </v-col>
        </v-row>

        <!-- Operational Hours -->
        <v-alert color="background">
          <div class="g2a-text-bold-600 text-greyDark">
            Operational Hours
            <span v-if="bookingData.selectedLocation?.isPeakMonth">
              (Peak Season)
            </span>
          </div>
          <div class="text-greyDark">
            Pickup/Dropoff:
            {{
              bookingData.selectedLocation?.isPeakMonth
                ? bookingData.selectedLocation?.timings.season
                : bookingData.selectedLocation?.timings.offSeason
            }}
          </div>
        </v-alert>
      </v-container>

      <v-divider />

      <v-alert
        v-if="errorMessage"
        type="error"
        variant="tonal"
        class="mx-6 my-2"
      >
        {{ errorMessage }}
      </v-alert>

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
import { ref, computed } from "vue";
import moment from "moment";
import axios from "axios";

const props = defineProps({
  productInfo: Object,
  bookingData: Object,
  locationData: Object,
});

const emit = defineEmits(["update", "next-step"]);

const pickupDate = ref(props.bookingData.pickupDate);
const returnDate = ref(props.bookingData.returnDate);
const loading = ref(false);
const errorMessage = ref("");

const minDate = computed(() => moment().add(2, "days").format("YYYY-MM-DD"));
const maxDate = computed(() => moment().add(6, "months").format("YYYY-MM-DD"));

const isValid = computed(
  () =>
    props.bookingData.selectedLocation && pickupDate.value && returnDate.value
);

/* -------------------- UI HELPERS -------------------- */

const cardStyle = (location) => ({
  border:
    props.bookingData.selectedLocation?.name === location.name
      ? "2px solid #FF6B36"
      : "1px solid #dde2e4",
  background:
    props.bookingData.selectedLocation?.name === location.name
      ? "#FFF5F2"
      : "#FFFFFF",
});

/* -------------------- STATE UPDATES -------------------- */

const selectLocation = (location) => {
  emit("update", { selectedLocation: location });
};

const updateDates = () => {
  if (
    pickupDate.value &&
    returnDate.value &&
    moment(returnDate.value).isBefore(moment(pickupDate.value))
  ) {
    returnDate.value = "";
  }

  emit("update", {
    pickupDate: pickupDate.value,
    returnDate: returnDate.value,
  });
};

/* -------------------- CONTINUE + API -------------------- */

const continueNext = async () => {
  if (!isValid.value || loading.value) return;

  loading.value = true;
  errorMessage.value = "";

  try {
    const payload = {
      locationName: props.bookingData.selectedLocation.name,
      startDate: pickupDate.value,
      endDate: returnDate.value,
      quantity: props.bookingData.quantity || 1,
      pickup: !!props.bookingData.pickupType,
      drop: !!props.bookingData.dropType,
    };

    const { data } = await axios.post(
      "http://localhost:3000/api/bike-rentals/check-availability",
      payload
    );

    if (!data.success) {
      errorMessage.value = data.message || "Not available for selected dates";
      return;
    }

    // optional: store availability response
    emit("update", { availability: data.data });

    emit("next-step");
  } catch (err) {
    errorMessage.value =
      err.response?.data?.message || "Failed to check availability";
  } finally {
    loading.value = false;
  }
};
</script>
