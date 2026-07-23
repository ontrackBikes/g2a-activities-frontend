<template>
  <v-card
    class="border"
    variant="outlined"
    rounded="lg"
  >
    <div class="pa-2 px-4">
      <div class="g2a-title-md mb-3">
        {{ field.label || "Transfer Details" }}
      </div>

      <!-- Transfer Type -->
      <v-radio-group
        v-model="transferType"
        inline
        density="compact"
        hide-details
        class="mb-4"
      >
        <v-radio
          label="Airport → Location"
          value="airport_to_location"
        />

        <v-radio
          class="ml-2"
          label="Location → Airport"
          value="location_to_airport"
        />
      </v-radio-group>

      <!-- Location Picker -->
      <location-picker
        :model-value="modelValue.location"
        :locations="availableLocations"
        :loading="loadingLocations"
        :label="
          transferType === 'airport_to_location'
            ? 'Drop Location'
            : 'Pickup Location'
        "
        @update:model-value="updateLocation"
      />

      <!-- Pickup Time -->
      <v-select
        :model-value="modelValue.pickupTime"
        :items="pickupTimeOptions"
        label="Pickup Time"
        placeholder="Select pickup time"
        variant="outlined"
        density="compact"
        rounded="lg"
        hide-details="auto"
        class="mt-4"
        @update:model-value="updatePickupTime"
      />

      <div class="mt-5 text-warning">
        Within city limit INR 450, outside city limits starts from INR 800.
      </div>
    </div>
  </v-card>
</template>
<script setup>
import { ref, watch, onMounted } from "vue";
import apiClient from "@/services/api";
import LocationPicker from "../LocationPicker.vue";


const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      transferType: "airport_to_location",
      location: null,
      pickupTime: "",
    }),
  },
  field: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const transferType = ref(
  props.modelValue.transferType || "airport_to_location",
);

const availableLocations = ref([]);
const loadingLocations = ref(false);

watch(transferType, (value) => {
  emit("update:modelValue", {
    ...props.modelValue,
    transferType: value,
  });
});

const updateLocation = (location) => {
  emit("update:modelValue", {
    ...props.modelValue,
    transferType: transferType.value,
    location,
  });
};

const updatePickupTime = (pickupTime) => {
  emit("update:modelValue", {
    ...props.modelValue,
    transferType: transferType.value,
    pickupTime,
  });
};

const fetchLocations = async () => {
  loadingLocations.value = true;

  try {
    const { data } = await apiClient.get(
      "/v1/products/app/airport-transfers/available-locations",
    );

    availableLocations.value = data.data || [];
  } catch (err) {
    console.error("Failed to load airport transfer locations", err);
  } finally {
    loadingLocations.value = false;
  }
};

onMounted(fetchLocations);

const pickupTimeOptions = [
  "07:00 AM",
  "07:30 AM",
  "08:00 AM",
  "08:30 AM",
  "09:00 AM",
  "09:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "01:00 PM",
  "01:30 PM",
  "02:00 PM",
  "02:30 PM",
  "03:00 PM",
  "03:30 PM",
  "04:00 PM",
  "04:30 PM",
  "05:00 PM",
  "05:30 PM",
  "06:00 PM",
  "06:30 PM",
  "07:00 PM",
  "07:30 PM",
  "08:00 PM",
];
</script>
