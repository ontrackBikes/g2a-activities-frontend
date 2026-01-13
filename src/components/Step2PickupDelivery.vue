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
        <p class="g2a-text-bold-600 mb-3">GETTING THE VEHICLE</p>

        <v-radio-group v-model="pickupType">
          <!-- SELF PICKUP -->
          <v-card
            class="pa-4 mb-3 g2a-rounded-border"
            variant="outlined"
            @click="pickupType = 'self-pickup'"
            :class="{ active: pickupType === 'self-pickup' }"
          >
            <div class="d-flex align-center">
              <v-radio value="self-pickup" />
              <div class="ml-3">
                <p class="g2a-text-bold-600">Self Pickup</p>
                <p class="g2a-text-14 text-greyDark">
                  Collect from our outlet (Free)
                </p>
              </div>
            </div>

            <v-select
              v-if="pickupType === 'self-pickup'"
              v-model="selectedPickupPoint"
              :items="pickupAndDropPoints"
              item-title="name"
              item-value="name"
              label="Select Outlet"
              class="mt-3"
            />
          </v-card>

          <!-- HOTEL DELIVERY -->
          <v-card
            class="pa-4 g2a-rounded-border"
            variant="outlined"
            @click="pickupType = 'hotel-delivery'"
            :class="{ active: pickupType === 'hotel-delivery' }"
          >
            <div class="d-flex align-center">
              <v-radio value="hotel-delivery" />
              <div class="ml-3">
                <p class="g2a-text-bold-600">Hotel Delivery</p>
                <p class="g2a-text-14 text-greyDark">Drop at your hotel</p>
              </div>
            </div>

            <v-alert
              v-if="pickupType === 'hotel-delivery'"
              type="info"
              variant="tonal"
              class="my-3"
            >
              Free within city limits. Outside → ₹100 approx.
            </v-alert>

            <v-text-field
              v-if="pickupType === 'hotel-delivery'"
              v-model="pickupHotelName"
              label="Hotel Name"
            />
          </v-card>
        </v-radio-group>
      </section>

      <!-- DROP -->
      <section>
        <p class="g2a-text-bold-600 mb-3">RETURNING THE VEHICLE</p>

        <v-radio-group v-model="dropType">
          <!-- SELF DROP -->
          <v-card
            class="pa-4 mb-3 g2a-rounded-border"
            variant="outlined"
            @click="dropType = 'self-drop'"
            :class="{ active: dropType === 'self-drop' }"
          >
            <div class="d-flex align-center">
              <v-radio value="self-drop" />
              <div class="ml-3">
                <p class="g2a-text-bold-600">Self Drop</p>
                <p class="g2a-text-14 text-greyDark">Return to outlet (Free)</p>
              </div>
            </div>

            <v-select
              v-if="dropType === 'self-drop'"
              v-model="selectedDropPoint"
              :items="pickupAndDropPoints"
              item-title="name"
              item-value="name"
              label="Select Outlet"
              class="mt-3"
            />
          </v-card>

          <!-- HOTEL PICKUP -->
          <v-card
            class="pa-4 g2a-rounded-border"
            variant="outlined"
            @click="dropType = 'hotel-pickup'"
            :class="{ active: dropType === 'hotel-pickup' }"
          >
            <div class="d-flex align-center">
              <v-radio value="hotel-pickup" />
              <div class="ml-3">
                <p class="g2a-text-bold-600">Hotel Pickup</p>
                <p class="g2a-text-14 text-greyDark">
                  We collect from your hotel
                </p>
              </div>
            </div>

            <v-alert
              v-if="dropType === 'hotel-pickup'"
              type="info"
              variant="tonal"
              class="my-3"
            >
              Free within city limits. Outside → ₹100 approx.
            </v-alert>

            <v-text-field
              v-if="dropType === 'hotel-pickup'"
              v-model="dropoffHotelName"
              label="Hotel Name"
            />
          </v-card>
        </v-radio-group>
      </section>
    </v-container>

    <!-- FOOTER -->
    <v-divider />

    <v-card-actions class="justify-space-between">
      <v-btn variant="text" @click="$emit('prev-step')">Back</v-btn>

      <v-btn
        color="warning"
        :disabled="!isStep2Valid"
        @click="$emit('next-step')"
      >
        Continue
      </v-btn>
    </v-card-actions>
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
const dropoffHotelName = ref(props.bookingData.dropoffHotelName || "");

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
watch(dropoffHotelName, (v) => emit("update", { dropoffHotelName: v }));

// QUANTITY
const increaseQuantity = () =>
  emit("update", { quantity: props.bookingData.quantity + 1 });

const decreaseQuantity = () => {
  if (props.bookingData.quantity > 1) {
    emit("update", { quantity: props.bookingData.quantity - 1 });
  }
};

// VALIDATION
const isStep2Valid = computed(() => {
  if (pickupType.value === "self-pickup" && !selectedPickupPoint.value)
    return false;

  if (pickupType.value === "hotel-delivery" && !pickupHotelName.value)
    return false;

  if (dropType.value === "self-drop" && !selectedDropPoint.value) return false;

  if (dropType.value === "hotel-pickup" && !dropoffHotelName.value)
    return false;

  return true;
});
</script>
