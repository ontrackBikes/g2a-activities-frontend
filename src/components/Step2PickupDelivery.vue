<template>
  <div>
    <!-- Dynamic header with selected location -->
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
        model-value="66"
        :height="6"
      ></v-progress-linear>
      <div class="d-flex align-center justify-space-between px-4 mt-4">
        <span class="g2a-text-12 text-greyDark">Step 2 of 3</span>
        <span class="g2a-text-12 text-greyDark">Details</span>
      </div>
      <v-container>
        <h3 class="g2a-title-3 mb-6">Pickup & Delivery</h3>

        <!-- Inclusions Card -->
        <v-card
          elevation="0"
          class="mb-8 pa-6 g2a-rounded-border"
          :style="{
            backgroundColor: '#F5F5F5',
            borderLeft: '4px solid #4CAF50',
          }"
        >
          <div class="d-flex align-center mb-4">
            <v-icon color="#4CAF50" class="mr-2" size="20"
              >mdi-check-circle</v-icon
            >
            <p class="g2a-text-bold-600">Inclusions</p>
          </div>
          <v-row class="mt-3">
            <v-col cols="12" sm="6">
              <div class="d-flex align-center mb-3">
                <v-icon small color="#4CAF50" class="mr-2">mdi-check</v-icon>
                <span class="g2a-text-14">1 Litre Fuel Free</span>
              </div>
              <div class="d-flex align-center">
                <v-icon small color="#4CAF50" class="mr-2">mdi-check</v-icon>
                <span class="g2a-text-14">All Legal Documents</span>
              </div>
            </v-col>
            <v-col cols="12" sm="6">
              <div class="d-flex align-center mb-3">
                <v-icon small color="#4CAF50" class="mr-2">mdi-check</v-icon>
                <span class="g2a-text-14">2 Helmets Included</span>
              </div>
              <div class="d-flex align-center">
                <v-icon small color="#4CAF50" class="mr-2">mdi-check</v-icon>
                <span class="g2a-text-14">No KM Limit</span>
              </div>
            </v-col>
          </v-row>
        </v-card>

        <!-- Quantity Section -->
        <div class="mb-8">
          <p class="g2a-text-caption text-greyDark mb-4">QUANTITY</p>
          <div class="d-flex align-center">
            <v-btn
              icon
              variant="outlined"
              color="#CCCCCC"
              size="small"
              @click="decreaseQuantity"
              :disabled="bookingData.quantity <= 1"
            >
              <v-icon>mdi-minus</v-icon>
            </v-btn>
            <div class="mx-6" style="min-width: 40px; text-align: center">
              <span class="g2a-text-bold-600 g2a-text-20">{{
                bookingData.quantity
              }}</span>
            </div>
            <v-btn
              icon
              variant="outlined"
              color="#FF8C00"
              size="small"
              @click="increaseQuantity"
            >
              <v-icon>mdi-plus</v-icon>
            </v-btn>
          </div>
        </div>

        <!-- Getting the Vehicle -->
        <div class="mb-8">
          <div class="d-flex align-center mb-4">
            <v-icon color="#FF8C00" class="mr-2" size="20"
              >mdi-information</v-icon
            >
            <p class="g2a-text-bold-600">GETTING THE VEHICLE</p>
          </div>

          <!-- Self Pickup Option -->
          <v-card
            class="mb-4 pa-4 cursor-pointer g2a-rounded-border"
            :style="{
              borderLeft:
                bookingData.pickupOption === 'self-pickup'
                  ? '4px solid #FF8C00'
                  : 'none',
              backgroundColor:
                bookingData.pickupOption === 'self-pickup'
                  ? '#FFF3E0'
                  : 'transparent',
            }"
            @click="selectPickupOption('self-pickup')"
            elevation="0"
          >
            <v-row align="center">
              <v-col cols="1">
                <v-radio
                  :model-value="bookingData.pickupOption"
                  value="self-pickup"
                  color="#FF8C00"
                  @update:model-value="selectPickupOption('self-pickup')"
                />
              </v-col>
              <v-col cols="11">
                <p class="g2a-text-bold-600 mb-1">Self Pickup</p>
                <p class="g2a-text-14 text-greyDark">
                  Collect from our outlets (Free)
                </p>
                <v-select
                  v-if="bookingData.pickupOption === 'self-pickup'"
                  v-model="selectedOutlet"
                  :items="
                    locationData.outlets.filter(
                      (o) => o.locationId === bookingData.selectedLocation?.id
                    )
                  "
                  item-title="name"
                  item-value="id"
                  variant="outlined"
                  density="comfortable"
                  label="Select Outlet"
                  class="mt-3 custom-border"
                  @update:model-value="updatePickupOutlet"
                />
              </v-col>
            </v-row>
          </v-card>

          <!-- Hotel Delivery Option -->
          <v-card
            class="pa-4 cursor-pointer g2a-rounded-border"
            :style="{
              borderLeft:
                bookingData.pickupOption === 'hotel-delivery'
                  ? '4px solid #FF8C00'
                  : 'none',
              backgroundColor:
                bookingData.pickupOption === 'hotel-delivery'
                  ? '#FFF3E0'
                  : 'transparent',
            }"
            @click="selectPickupOption('hotel-delivery')"
            elevation="0"
          >
            <v-row align="center">
              <v-col cols="1">
                <v-radio
                  :model-value="bookingData.pickupOption"
                  value="hotel-delivery"
                  color="#FF8C00"
                  @update:model-value="selectPickupOption('hotel-delivery')"
                />
              </v-col>

              <v-col cols="11">
                <p class="g2a-text-bold-600 mb-1">Hotel Delivery</p>
                <p class="g2a-text-14 text-greyDark">Drop at your hotel</p>

                <!-- Delivery Info -->
                <v-alert
                  v-if="bookingData.pickupOption === 'hotel-delivery'"
                  type="info"
                  :icon="false"
                  class="mt-3 g2a-rounded-border"
                  color="#F2F6FF"
                  text-color="#29339B"
                  density="compact"
                >
                  <span class="g2a-text-13">
                    Delivery Info: Free within city limits. If outside (verified
                    by agent), extra charges (~₹100) apply.
                  </span>
                </v-alert>

                <!-- Hotel Name (Mandatory) -->
                <v-text-field
                  v-if="bookingData.pickupOption === 'hotel-delivery'"
                  v-model="pickupHotelName"
                  placeholder="Hotel Name (Mandatory)"
                  variant="outlined"
                  density="comfortable"
                  class="mt-3 custom-border"
                  @update:model-value="updatePickupHotel"
                />
              </v-col>
            </v-row>
          </v-card>
        </div>

        <!-- Returning the Vehicle -->
        <div>
          <div class="d-flex align-center mb-4">
            <v-icon color="#FF8C00" class="mr-2" size="20"
              >mdi-information</v-icon
            >
            <p class="g2a-text-bold-600">RETURNING THE VEHICLE</p>
          </div>

          <!-- Self Dropoff Option -->
          <v-card
            class="mb-4 pa-4 cursor-pointer g2a-rounded-border"
            :style="{
              borderLeft:
                bookingData.dropoffOption === 'self-dropoff'
                  ? '4px solid #FF8C00'
                  : 'none',
              backgroundColor:
                bookingData.dropoffOption === 'self-dropoff'
                  ? '#FFF3E0'
                  : 'transparent',
            }"
            @click="selectDropoffOption('self-dropoff')"
            elevation="0"
          >
            <v-row align="center">
              <v-col cols="1">
                <v-radio
                  :model-value="bookingData.dropoffOption"
                  value="self-dropoff"
                  color="#FF8C00"
                  @update:model-value="selectDropoffOption('self-dropoff')"
                />
              </v-col>
              <v-col cols="11">
                <p class="g2a-text-bold-600 mb-1">Self Dropoff</p>
                <p class="g2a-text-14 text-greyDark">
                  Return to our outlets (Free)
                </p>
              </v-col>
            </v-row>
          </v-card>

          <!-- Hotel Pickup Option -->
          <v-card
            class="pa-4 cursor-pointer g2a-rounded-border"
            :style="{
              borderLeft:
                bookingData.dropoffOption === 'hotel-pickup'
                  ? '4px solid #FF8C00'
                  : 'none',
              backgroundColor:
                bookingData.dropoffOption === 'hotel-pickup'
                  ? '#FFF3E0'
                  : 'transparent',
            }"
            @click="selectDropoffOption('hotel-pickup')"
            elevation="0"
          >
            <v-row align="center">
              <v-col cols="1">
                <v-radio
                  :model-value="bookingData.dropoffOption"
                  value="hotel-pickup"
                  color="#FF8C00"
                  @update:model-value="selectDropoffOption('hotel-pickup')"
                />
              </v-col>
              <v-col cols="11">
                <p class="g2a-text-bold-600 mb-1">Hotel Pickup</p>
                <p class="g2a-text-14 text-greyDark">
                  We collect from your hotel
                </p>
                <v-alert
                  v-if="bookingData.dropoffOption === 'hotel-pickup'"
                  type="info"
                  :icon="false"
                  class="mt-3 g2a-rounded-border"
                  color="#F2F6FF"
                  text-color="#29339B"
                  density="compact"
                >
                  <span class="g2a-text-13"
                    >Collection Info: Free within city limits. Extra charges
                    (~₹100) apply if outside.</span
                  >
                </v-alert>
                <v-text-field
                  v-if="bookingData.dropoffOption === 'hotel-pickup'"
                  v-model="hotelName"
                  placeholder="Hotel Name (Mandatory)"
                  variant="outlined"
                  density="comfortable"
                  class="mt-3 custom-border"
                  @update:model-value="updateDropoffHotel"
                />
              </v-col>
            </v-row>
          </v-card>
        </div>
      </v-container>
      <v-divider> </v-divider>
      <!-- Navigation Buttons -->
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
            :disabled="!isStep2Valid"
            @click="continueToStep3"
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
import { ref, computed } from "vue";

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

const emit = defineEmits(["update-booking", "next-step", "prev-step"]);

const selectedOutlet = ref(props.bookingData.pickupOutlet);
const pickupHotelName = ref(props.bookingData.pickupHotelName || "");

const hotelName = ref(props.bookingData.dropoffHotelName || "");

const isStep2Valid = computed(() => {
  if (
    props.bookingData.pickupOption === "self-pickup" &&
    !props.bookingData.pickupOutlet
  ) {
    return false;
  }

  if (
    props.bookingData.pickupOption === "hotel-delivery" &&
    !props.bookingData.pickupHotelName
  ) {
    return false;
  }

  if (
    props.bookingData.dropoffOption === "hotel-pickup" &&
    !props.bookingData.dropoffHotelName
  ) {
    return false;
  }

  return true;
});

const increaseQuantity = () => {
  emit("update-booking", { quantity: props.bookingData.quantity + 1 });
};

const decreaseQuantity = () => {
  if (props.bookingData.quantity > 1) {
    emit("update-booking", { quantity: props.bookingData.quantity - 1 });
  }
};

const selectPickupOption = (option) => {
  emit("update-booking", { pickupOption: option });
};

const selectDropoffOption = (option) => {
  emit("update-booking", { dropoffOption: option });
};

const updatePickupOutlet = (value) => {
  emit("update-booking", { pickupOutlet: value });
};

const updatePickupHotel = (value) => {
  emit("update-booking", { pickupHotelName: value });
};

const updateDropoffHotel = (value) => {
  emit("update-booking", { dropoffHotelName: value });
};

const continueToStep3 = () => {
  if (isStep2Valid.value) {
    emit("next-step");
  }
};

const goBack = () => {
  emit("prev-step");
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
