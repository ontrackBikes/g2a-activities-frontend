<template>
  <v-card elevation="0" class="mb-6 g2a-rounded-border border bg-white">
    <v-progress-linear color="brandColor" model-value="66" height="6" />

    <v-container>
      <section>
        <div class="d-flex justify-space-between">
          <span class="g2a-text-13 text-grey">Step 2 of 3</span>
          <span class="g2a-text-13 text-grey">Details</span>
        </div>
        <div class="g2a-text-22 g2a-text-bold-600 my-2">Pickup & Delivery</div>
      </section>

      <!-- INCLUSIONS -->
      <section class="my-4">
        <v-card class="border bg-white" elevation="0">
          <v-container>
            <div class="g2a-text-bold-600 text-greyDark">
              <v-avatar
                color="darkGreen"
                variant="tonal"
                size="34"
                class="mr-2"
              >
                <v-icon size="22" icon="mdi-motorbike" />
              </v-avatar>
              What's Included ?
            </div>
            <v-divider class="my-2" />
            <v-row no-gutters>
              <v-col
                v-for="(item, index) in productInfo.inclusions || []"
                :key="index"
                cols="12"
                sm="6"
                class="d-flex align-center"
              >
                <v-icon color="darkGreen" size="20" class="mr-2">
                  mdi-check-circle
                </v-icon>
                <span class="g2a-text-15">{{ item }}</span>
              </v-col>
            </v-row>
          </v-container>
        </v-card>
      </section>

      <!-- QUANTITY -->
      <section class="my-4">
        <div class="g2a-text-12 g2a-text-bold-600 text-grey my-4">
          QUANTITY (Max
          {{
            bookingData?.selectedLocation?.maxQtyPerBooking ||
            productInfo.maxQuantity
          }})
        </div>

        <div class="d-flex align-center my-2">
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
      </section>

      <!-- PICKUP -->
      <section class="my-4">
        <div class="g2a-text-bold-600 my-4 d-flex align-center">
          <v-icon color="brandColor" class="mr-2">
            mdi-arrow-right-circle
          </v-icon>
          GETTING THE VEHICLE
        </div>

        <v-radio-group v-model="pickupType">
          <v-card
            v-for="(data, index) in pickupOptions"
            :key="index"
            class="my-2 py-4 g2a-rounded-border"
            variant="outlined"
            @click="pickupType = data.type"
            :class="{ active: pickupType === data.type }"
            :style="cardStyle(data.type)"
          >
            <div class="d-flex align-center px-4">
              <v-radio :value="data.type" color="darkGreen" />
              <div class="ml-3">
                <div class="g2a-text-bold-600">
                  {{ data.title }}
                  <span class="text-darkGreen">
                    ({{
                      data.onlineCharge === 0
                        ? "FREE"
                        : "₹" + data.onlineCharge
                    }})
                  </span>
                </div>
                <div class="g2a-text-12 text-greyDark">
                  {{ data.label }}
                </div>
              </div>
            </div>

            <v-select
              v-if="pickupType === 'self-pickup' && data.type === 'self-pickup'"
              v-model="selectedPickupPoint"
              :items="pickupAndDropPoints"
              item-title="name"
              item-value="name"
              label="Select Outlet"
              class="px-4 my-4"
              variant="outlined"
              density="compact"
            />

            <v-text-field
              v-if="pickupType === 'hotel' && data.type === 'hotel'"
              v-model="pickupHotelName"
              label="Hotel Name"
              class="px-4 my-4"
              variant="outlined"
              density="compact"
            />

            <div class="px-4">
              <v-alert
                v-if="data.infoText && pickupType === data.type"
                type="info"
                variant="tonal"
                class="py-2"
              >
                {{ data.infoText }}
              </v-alert>
            </div>
          </v-card>
        </v-radio-group>
      </section>

      <!-- DROP -->
      <section class="my-4">
        <div class="g2a-text-bold-600 d-flex my-4 align-center">
          <v-icon color="brandColor" class="mr-2">
            mdi-arrow-left-circle
          </v-icon>
          RETURNING THE VEHICLE
        </div>

        <v-radio-group v-model="dropType">
          <v-card
            v-for="(data, index) in dropOptions"
            :key="index"
            class="my-2 py-4 g2a-rounded-border"
            variant="outlined"
            @click="dropType = data.type"
            :class="{ active: dropType === data.type }"
            :style="dropCardStyle(data.type)"
          >
            <div class="d-flex align-center px-4">
              <v-radio :value="data.type" color="darkGreen" />
              <div class="ml-3">
                <div class="g2a-text-bold-600">
                  {{ data.title }}
                  <span class="text-darkGreen">
                    ({{
                      data.onlineCharge === 0
                        ? "FREE"
                        : "₹" + data.onlineCharge
                    }})
                  </span>
                </div>
                <div class="g2a-text-12 text-greyDark">
                  {{ data.label }}
                </div>
              </div>
            </div>

            <v-select
              v-if="dropType === 'self-drop' && data.type === 'self-drop'"
              v-model="selectedDropPoint"
              :items="pickupAndDropPoints"
              item-title="name"
              item-value="name"
              label="Select Outlet"
              class="px-4 my-4"
              variant="outlined"
              density="compact"
            />

            <v-text-field
              v-if="dropType === 'hotel' && data.type === 'hotel'"
              v-model="dropHotelName"
              label="Hotel Name"
              class="px-4 my-4"
              variant="outlined"
              density="compact"
            />

            <div class="px-4">
              <v-alert
                v-if="data.infoText && dropType === data.type"
                type="info"
                variant="tonal"
                class="py-2"
              >
                {{ data.infoText }}
              </v-alert>
            </div>
          </v-card>
        </v-radio-group>
      </section>
    </v-container>

    <!-- FOOTER -->
    <v-divider />

    <v-container>
      <div class="d-flex justify-space-between">
        <v-btn variant="text" @click="$emit('prev-step')">
          <v-icon start>mdi-arrow-left</v-icon> BACK
        </v-btn>

        <v-btn
          flat
          color="brandColor"
          rounded="lg"
          size="large"
          :disabled="!isStep2Valid"
          @click="$emit('next-step')"
        >
          Continue <v-icon end>mdi-arrow-right</v-icon>
        </v-btn>
      </div>
    </v-container>
  </v-card>
</template>

<script setup>
import axios from "axios";
import { ref, computed, watch, onMounted } from "vue";
import { useRoute } from "vue-router";

const props = defineProps({
  bookingData: Object,
  productInfo: Object,
});

const route = useRoute();
const routeLocationName = computed(() => route.params.location);

const fetchLocationFromRoute = async () => {
  const locationName = routeLocationName.value;
  if (!locationName) return;

  try {
    const res = await axios.get(
      `http://localhost:3000/api/bike-rentals/location/${locationName}`
    );

    const location = res.data?.data;
    if (!location) return;

    emit("update", {
      selectedLocation: location,
    });
  } catch (err) {
    console.error("Failed to load location from route", err);
  }
};

onMounted(fetchLocationFromRoute);

watch(() => route.params.location, fetchLocationFromRoute);

const emit = defineEmits(["update", "next-step", "prev-step"]);

const pickupType = ref(props.bookingData.pickupType || "self-pickup");
const dropType = ref(props.bookingData.dropType || "self-drop");

const selectedPickupPoint = ref(props.bookingData.pickup || null);
const pickupHotelName = ref(props.bookingData.pickupHotelName || "");

const selectedDropPoint = ref(props.bookingData.drop || null);
const dropHotelName = ref(props.bookingData.dropHotelName || "");

const pickupAndDropPoints = ref([]);

const pickupOptions = computed(
  () => props.bookingData.selectedLocation?.deliveryOptions || []
);

const dropOptions = computed(
  () => props.bookingData.selectedLocation?.dropOptions || []
);

const fetchPoints = async () => {
  const name = props.bookingData.selectedLocation?.name;
  if (!name) return;

  const res = await axios.get(
    `http://localhost:3000/api/bike-rentals/pickup-drop-points/${name}`
  );

  if (props.bookingData.selectedLocation?.name === name) {
    pickupAndDropPoints.value = res.data?.data || [];
  }
};

watch(() => props.bookingData.selectedLocation, fetchPoints, {
  immediate: true,
});

watch(pickupType, (v) => {
  emit("update", { pickupType: v });
  if (v !== "hotel") pickupHotelName.value = "";
  if (v !== "self-pickup") selectedPickupPoint.value = null;
});

watch(dropType, (v) => {
  emit("update", { dropType: v });
  if (v !== "hotel") dropHotelName.value = "";
  if (v !== "self-drop") selectedDropPoint.value = null;
});

watch(selectedPickupPoint, (v) => emit("update", { pickup: v }));
watch(pickupHotelName, (v) => emit("update", { pickupHotelName: v }));
watch(selectedDropPoint, (v) => emit("update", { drop: v }));
watch(dropHotelName, (v) => emit("update", { dropHotelName: v }));

const increaseQuantity = () => {
  const max =
    props.bookingData?.selectedLocation?.maxQtyPerBooking ||
    props.productInfo.maxQuantity;

  if (props.bookingData.quantity < max) {
    emit("update", { quantity: props.bookingData.quantity + 1 });
  }
};

const decreaseQuantity = () => {
  if (props.bookingData.quantity > 1) {
    emit("update", { quantity: props.bookingData.quantity - 1 });
  }
};

const isStep2Valid = computed(() => {
  if (pickupType.value === "self-pickup" && !selectedPickupPoint.value)
    return false;

  if (pickupType.value === "hotel" && !pickupHotelName.value) return false;

  if (dropType.value === "self-drop" && !selectedDropPoint.value) return false;

  if (dropType.value === "hotel" && !dropHotelName.value) return false;

  return true;
});

const cardStyle = (type) => ({
  border: pickupType.value === type ? "1px solid #006400" : "1px solid #dde2e4",
  background: pickupType.value === type ? "#f0f6f0" : "#fff",
});

const dropCardStyle = (type) => ({
  border: dropType.value === type ? "1px solid #006400" : "1px solid #dde2e4",
  background: dropType.value === type ? "#f0f6f0" : "#fff",
});
</script>

<style scoped>
.active {
  border: 1px solid #006400;
  background: #f0f6f0;
}
</style>
