<template>
  <div>
    <!-- Updated header to show selected location dynamically -->
    <v-card class="mb-6" elevation="0">
      <v-container>
        <v-chip
          size="small"
          color="warning"
          class="g2a-text-12 g2a-text-bold-700"
          >VEHICLE RENTAL</v-chip
        >
        <h2 class="g2a-title-1 mt-2">
          Scooty Rental - {{ bookingData.selectedLocation?.name }}
        </h2>
        <p class="text-greyDark g2a-text-14 mt-1">
          <v-icon size="16" class="mr-1">mdi-map-marker</v-icon>
          {{ bookingData.selectedLocation?.name }}
        </p>
      </v-container>
    </v-card>

    <!-- Main Content Card -->
    <v-card elevation="0" class="mb-6 g2a-rounded-border border">
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
        <h3 class="g2a-title-3 mb-6">Select Location & Dates</h3>

        <!-- Island Selection -->
        <div class="mb-8">
          <p class="g2a-text-caption text-greyDark g2a-text-bold-600 mb-4">
            ISLAND
          </p>
          <v-row>
            <v-col
              cols="12"
              sm="6"
              md="4"
              v-for="location in locationData.locations"
              :key="location.id"
            >
              <v-card
                :outlined="bookingData.selectedLocation?.id !== location.id"
                class="cursor-pointer g2a-rounded-border"
                min-height="80"
                max-height="80"
                :style="{
                  borderColor:
                    bookingData.selectedLocation?.id === location.id
                      ? '#FF8C00'
                      : '#dde2e4',
                  borderWidth:
                    bookingData.selectedLocation?.id === location.id
                      ? '2px'
                      : '1px',
                  backgroundColor:
                    bookingData.selectedLocation?.id === location.id
                      ? '#FFF3E0'
                      : '#FFFFFF',
                }"
                @click="selectLocation(location)"
                elevation="0"
              >
                <v-container class="text-center">
                  <p
                    class="g2a-text-bold-600"
                    :class="
                      bookingData.selectedLocation?.id === location.id
                        ? 'text-red'
                        : 'text-greyDark'
                    "
                  >
                    {{ location.name }}
                  </p>
                  <!-- <p class="g2a-text-12 text-greyDark mt-2">
                    ₹{{ location.dailyRate }}/day
                  </p> -->
                  <span
                    v-if="bookingData.selectedLocation?.id === location.id"
                    class="g2a-text-12 align-center g2a-text-bold-600 mt-2 text-warning"
                  >
                    <v-icon size="14" class="mr-1">mdi-check-circle</v-icon
                    >Selected
                  </span>
                </v-container>
              </v-card>
            </v-col>
          </v-row>
        </div>

        <!-- Planning Ahead Alert -->
        <v-alert
          type="info"
          :icon="false"
          class="my-2"
          color="primary"
          text-color="#29339B"
          border="start"
          variant="tonal"
        >
          <div class="d-flex align-center">
            <v-icon color="primary" size="20" class="mr-3"
              >mdi-clock-outline</v-icon
            >
            <span class="g2a-text-14"
              ><strong>Planning ahead?</strong> Bookings must be made at least
              48 hours in advance.</span
            >
          </div>
        </v-alert>

        <!-- Date Selection -->
        <v-row class="my-4">
          <v-col cols="12" md="6">
            <p class="g2a-text-caption text-greyDark g2a-text-bold-600 mb-2">
              PICKUP DATE
            </p>
            <v-text-field
              v-model="bookingData.pickupDate"
              type="date"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :min="minDate"
              class="custom-border"
              @update:model-value="validateDates"
            />
          </v-col>
          <v-col cols="12" md="6">
            <p class="g2a-text-caption text-greyDark g2a-text-bold-600 mb-2">
              RETURN DATE
            </p>
            <v-text-field
              v-model="bookingData.returnDate"
              type="date"
              variant="outlined"
              density="comfortable"
              hide-details="auto"
              :min="bookingData.pickupDate || minDate"
              class="custom-border"
              @update:model-value="validateDates"
            />
          </v-col>
        </v-row>

        <!-- Operational Hours -->
        <v-card
          elevation="0"
          class="pa-4 mb-4 g2a-rounded-border bg-background"
        >
          <p class="g2a-text-caption text-greyDark mb-2">
            Operational Hours (Peak Season)
          </p>
          <p class="g2a-text-14 g2a-text-bold-600">
            Pickup/Dropoff: 08:00 AM - 05:00 PM
          </p>
        </v-card>
      </v-container>
      <v-divider> </v-divider>
      <v-alert
        :icon="false"
        color="background"
        text-color="grey"
        density="compact"
      >
        <div class="d-flex align-center justify-space-between w-100">
          <v-btn
            variant="text"
            color="#999999"
            size="large"
            @click="goBack"
            class="px-2"
          >
            <v-icon start>mdi-arrow-left</v-icon>
            BACK
          </v-btn>

          <v-btn
            color="warning"
            rounded="lg"
            size="large"
            :disabled="!isStep1Valid"
            @click="continueToStep2"
          >
            Continue
            <v-icon end>mdi-arrow-right</v-icon>
          </v-btn>
        </div>
      </v-alert>
    </v-card>
  </div>
</template>

<script setup>
import { computed } from "vue";
import moment from "moment";

const props = defineProps({
  bookingData: {
    type: Object,
    required: true,
  },
  locationData: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update-booking", "next-step"]);

const minDate = computed(() => {
  return moment().add(2, "days").format("YYYY-MM-DD");
});

const isStep1Valid = computed(() => {
  return (
    props.bookingData.selectedLocation &&
    props.bookingData.pickupDate &&
    props.bookingData.returnDate
  );
});

const selectLocation = (location) => {
  emit("update-booking", { selectedLocation: location });
};

const validateDates = () => {
  if (props.bookingData.pickupDate && props.bookingData.returnDate) {
    const pickup = moment(props.bookingData.pickupDate);
    const dropoff = moment(props.bookingData.returnDate);
    if (dropoff.isBefore(pickup)) {
      emit("update-booking", { returnDate: "" });
    }
  }
};

const continueToStep2 = () => {
  if (isStep1Valid.value) {
    emit("next-step");
  }
};

const goBack = () => {
  // Can add history navigation here
};
</script>

<style scoped>
.cursor-pointer {
  cursor: pointer;
}

.w-100 {
  width: 100%;
}
</style>
