<template>
  <v-card elevation="0" class="mb-6 g2a-rounded-border border bg-white">
    <v-progress-linear color="warning" model-value="66" height="6" />

    <div class="d-flex justify-space-between px-4 mt-4">
      <span class="g2a-text-13 text-grey">Step 2 of 3</span>
      <span class="g2a-text-13 text-grey">Details</span>
    </div>

    <v-container>
      <div class="g2a-text-22 g2a-text-bold-600 my-2">Pickup & Delivery</div>

      <!-- <div>
        {{ productInfo }}
      </div> -->

      <v-card class="border bg-white my-6" elevation="0">
        <v-container>
          <div class="g2a-text-bold-600 text-greyDark">
            <v-avatar color="green" variant="tonal" size="34" class="mr-2">
              <v-icon size="22" icon="mdi-motorbike"></v-icon>
            </v-avatar>
            Inclusions
          </div>
          <v-divider color="black" class="my-4" />
          <v-row>
            <v-col
              v-for="(item, index) in productInfo.inclusions"
              :key="index"
              cols="12"
              sm="6"
              class="d-flex align-center"
            >
              <v-icon color="green" size="20" class="mr-2">
                mdi-check-circle
              </v-icon>
              <span class="g2a-text-15">{{ item }}</span>
            </v-col>
          </v-row>
        </v-container>
      </v-card>

      <!-- QUANTITY -->
      <div class="mb-8">
        <div class="g2a-text-12 g2a-text-bold-600 text-grey my-4">QUANTITY</div>
        <div class="d-flex align-center">
          <v-btn icon variant="outlined" size="small" @click="decreaseQuantity">
            <v-icon>mdi-minus</v-icon>
          </v-btn>

          <div class="mx-6 g2a-text-bold-600 g2a-text-20">
            {{ bookingData.quantity }}
          </div>

          <v-btn icon variant="outlined" size="small" @click="increaseQuantity">
            <v-icon>mdi-plus</v-icon>
          </v-btn>
        </div>
      </div>

      <!-- PICKUP -->
      <section class="mb-10">
        <div class="g2a-text-bold-600 mb-3 d-flex align-center">
          <v-icon color="warning" class="mr-2">mdi-arrow-right-circle</v-icon>
          <span class="text-blackLight1">GETTING THE VEHICLE</span>
        </div>

        <v-radio-group v-model="pickupType">
          <!-- SELF PICKUP -->
          <v-card
            class="mb-3 g2a-rounded-border"
            variant="outlined"
            @click="pickupType = 'self-pickup'"
            :class="{ active: pickupType === 'self-pickup' }"
            :style="cardStyle('self-pickup')"
          >
            <div class="d-flex align-center px-4 my-4">
              <v-radio value="self-pickup" color="warning" />
              <div class="ml-3">
                <div class="g2a-text-bold-600">Self Pickup</div>
                <div class="g2a-text-12 text-greyDark">
                  Collect from our outlet (Free)
                </div>
              </div>
            </div>

            <v-divider
              v-if="pickupType === 'self-pickup'"
              color="error"
            ></v-divider>

            <v-select
              v-if="pickupType === 'self-pickup'"
              v-model="selectedPickupPoint"
              :items="pickupAndDropPoints"
              item-title="name"
              item-value="name"
              label="Select Outlet"
              class="px-4 my-4"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </v-card>

          <!-- HOTEL DELIVERY -->
          <v-card
            class="g2a-rounded-border"
            variant="outlined"
            @click="pickupType = 'hotel'"
            :class="{ active: pickupType === 'hotel' }"
            :style="cardStyle('hotel')"
          >
            <div class="d-flex align-center px-4 my-4">
              <v-radio value="hotel" color="warning" />
              <div class="ml-3">
                <div class="g2a-text-bold-600">Hotel Delivery</div>
                <div class="g2a-text-12 text-greyDark">Drop at your hotel</div>
              </div>
            </div>

            <v-divider v-if="pickupType === 'hotel'" color="error"></v-divider>

            <div class="px-4 my-4">
              <v-alert
                v-if="pickupType === 'hotel'"
                type="info"
                variant="tonal"
                class="py-2"
              >
                Free within city limits. Outside → ₹100 approx.
              </v-alert>
            </div>

            <v-text-field
              v-if="pickupType === 'hotel'"
              v-model="pickupHotelName"
              label="Hotel Name"
              class="px-4 my-4"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </v-card>
        </v-radio-group>
      </section>

      <!-- DROP -->
      <section>
        <div class="g2a-text-bold-600 mb-3 d-flex align-center">
          <v-icon color="warning" class="mr-2">mdi-arrow-left-circle</v-icon>
          <span class="text-blackLight1">RETURNING THE VEHICLE</span>
        </div>

        <v-radio-group v-model="dropType">
          <!-- SELF DROP -->
          <v-card
            class="mb-3 g2a-rounded-border"
            variant="outlined"
            @click="dropType = 'self-drop'"
            :class="{ active: dropType === 'self-drop' }"
            :style="dropCardStyle('self-drop')"
          >
            <div class="d-flex align-center px-4 my-4">
              <v-radio value="self-drop" color="warning" />
              <div class="ml-3">
                <div class="g2a-text-bold-600">Self Drop</div>
                <div class="g2a-text-12 text-greyDark">
                  Return to outlet (Free)
                </div>
              </div>
            </div>

            <v-divider
              v-if="dropType === 'self-drop'"
              color="error"
            ></v-divider>

            <v-select
              v-if="dropType === 'self-drop'"
              v-model="selectedDropPoint"
              :items="pickupAndDropPoints"
              item-title="name"
              item-value="name"
              label="Select Outlet"
              class="px-4 my-4"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </v-card>

          <!-- HOTEL PICKUP -->
          <v-card
            class="g2a-rounded-border"
            variant="outlined"
            @click="dropType = 'hotel'"
            :class="{ active: dropType === 'hotel' }"
            :style="dropCardStyle('hotel')"
          >
            <div class="d-flex align-center px-4 my-4">
              <v-radio value="hotel" color="warning" />
              <div class="ml-3">
                <div class="g2a-text-bold-600">Hotel Pickup</div>
                <div class="g2a-text-12 text-greyDark">
                  We collect from your hotel
                </div>
              </div>
            </div>

            <v-divider v-if="dropType === 'hotel'" color="error"></v-divider>

            <div class="px-4 my-4">
              <v-alert
                v-if="dropType === 'hotel'"
                type="info"
                variant="tonal"
                class="py-2"
              >
                Free within city limits. Outside → ₹100 approx.
              </v-alert>
            </div>

            <v-text-field
              v-if="dropType === 'hotel'"
              v-model="dropHotelName"
              label="Hotel Name"
              class="px-4 my-4"
              variant="outlined"
              density="compact"
              hide-details="auto"
            />
          </v-card>
        </v-radio-group>
      </section>
    </v-container>

    <!-- FOOTER -->
    <v-divider />

    <div class="d-flex align-center justify-space-between w-100 px-6 py-4">
      <v-btn variant="text" @click="$emit('prev-step')">
        <v-icon start>mdi-arrow-left</v-icon>
        BACK
      </v-btn>

      <v-btn
        color="error"
        rounded="lg"
        size="large"
        :disabled="!isStep2Valid"
        @click="$emit('next-step')"
      >
        <span class="g2a-text-bold-600">Continue</span>
        <v-icon end>mdi-arrow-right</v-icon>
      </v-btn>
    </div>
  </v-card>
</template>

<script setup>
import axios from "axios";
import { ref, computed, watch } from "vue";

const props = defineProps({
  bookingData: Object,
  productInfo: Object,
});

const emit = defineEmits(["update", "next-step", "prev-step"]);

// LOCAL STATE
const pickupType = ref(props.bookingData.pickupType || "self-pickup");
const dropType = ref(props.bookingData.dropType || "self-drop");

const selectedPickupPoint = ref(props.bookingData.pickup || null);
const pickupHotelName = ref(props.bookingData.pickupHotelName || "");

const selectedDropPoint = ref(props.bookingData.drop || null);
const dropHotelName = ref(props.bookingData.dropHotelName || "");

const pickupAndDropPoints = ref([]);

// FETCH POINTS
const fetchPoints = async () => {
  if (!props.bookingData.selectedLocation?.name) return;

  const res = await axios.get(
    `http://localhost:3000/api/bike-rentals/pickup-drop-points/${props.bookingData.selectedLocation.name}`
  );
  pickupAndDropPoints.value = res.data?.data || [];
};

watch(() => props.bookingData.selectedLocation, fetchPoints, {
  immediate: true,
});

// WATCHERS → UPDATE PARENT
watch(pickupType, (v) => emit("update", { pickupType: v }));
watch(dropType, (v) => emit("update", { dropType: v }));

watch(selectedPickupPoint, (v) => emit("update", { pickup: v }));
watch(pickupHotelName, (v) => emit("update", { pickupHotelName: v }));

watch(selectedDropPoint, (v) => emit("update", { drop: v }));
watch(dropHotelName, (v) => emit("update", { dropHotelName: v }));

// QUANTITY
const increaseQuantity = () => {
  if (props.bookingData.quantity < props.productInfo.maxQuantity) {
    emit("update", { quantity: props.bookingData.quantity + 1 });
  }
};

const decreaseQuantity = () => {
  if (props.bookingData.quantity > 1) {
    emit("update", { quantity: props.bookingData.quantity - 1 });
  }
};

// VALIDATION
const isStep2Valid = computed(() => {
  if (pickupType.value === "self-pickup" && !selectedPickupPoint.value)
    return false;

  if (pickupType.value === "hotel" && !pickupHotelName.value) return false;

  if (dropType.value === "self-drop" && !selectedDropPoint.value) return false;

  if (dropType.value === "hotel" && !dropHotelName.value) return false;

  return true;
});

const cardStyle = (type) => ({
  border: pickupType.value === type ? "1px solid #FF6B36" : "1px solid #dde2e4",
  background: pickupType.value === type ? "#FFF5F2" : "#FFFFFF",
});

const dropCardStyle = (type) => ({
  border: dropType.value === type ? "1px solid #FF6B36" : "1px solid #dde2e4",
  background: dropType.value === type ? "#FFF5F2" : "#FFFFFF",
});
</script>
