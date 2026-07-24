<template>
  <v-card class="border" variant="outlined" rounded="lg">
    <div class="pa-2 px-4">
      <div class="g2a-title-md mb-3">
        {{ field.label || "Transfer Details" }}
      </div>

      <!-- Transfer Direction -->
      <v-radio-group
        v-model="transferType"
        inline
        density="compact"
        hide-details
        class="mb-4"
      >
        <v-radio
          v-for="option in directionOptions"
          :key="option.value"
          :label="option.label"
          :value="option.value"
          class="mr-2"
        />
      </v-radio-group>

      <!-- Pickup Location (always on top, like a ride-hailing app) -->
      <template v-if="hasSubField('pickup_location')">
        <v-text-field
          v-if="airportSideKey === 'pickup_location'"
          :model-value="airportLocation?.name || 'Loading airport...'"
          :label="subFieldLabel('pickup_location', 'Pickup Location')"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details="auto"
          prepend-inner-icon="mdi-airplane"
          class="mb-4"
          readonly
          disabled
        />

        <location-picker
          v-else
          :model-value="modelValue.pickup_location"
          :locations="pickableLocations"
          :loading="loadingLocations"
          :label="subFieldLabel('pickup_location', 'Pickup Location')"
          class="mb-4"
          @update:model-value="updateSubField('pickup_location', $event)"
        />
      </template>

      <!-- Drop Location (always below pickup) -->
      <template v-if="hasSubField('drop_location')">
        <v-text-field
          v-if="airportSideKey === 'drop_location'"
          :model-value="airportLocation?.name || 'Loading airport...'"
          :label="subFieldLabel('drop_location', 'Drop Location')"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details="auto"
          prepend-inner-icon="mdi-airplane"
          class="mb-4"
          readonly
          disabled
        />

        <location-picker
          v-else
          :model-value="modelValue.drop_location"
          :locations="pickableLocations"
          :loading="loadingLocations"
          :label="subFieldLabel('drop_location', 'Drop Location')"
          class="mb-4"
          @update:model-value="updateSubField('drop_location', $event)"
        />
      </template>

      <!-- Pickup Time -->
      <v-select
        v-if="hasSubField('pickup_time')"
        :model-value="modelValue.pickup_time"
        :items="pickupTimeOptions"
        :label="subFieldLabel('pickup_time', 'Pickup Time')"
        placeholder="Select pickup time"
        variant="outlined"
        density="compact"
        rounded="lg"
        hide-details="auto"
        @update:model-value="updateSubField('pickup_time', $event)"
      />

      <div class="mt-5 text-warning">
        Within city limit INR 450, outside city limits starts from INR 800.
      </div>
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import apiClient from "@/services/api";
import LocationPicker from "../LocationPicker.vue";

const DEFAULT_DIRECTION_OPTIONS = [
  { label: "Airport → Location", value: "airport_to_location" },
  { label: "Location → Airport", value: "location_to_airport" },
];

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      transfer_type: "",
      pickup_location: null,
      drop_location: null,
      pickup_time: "",
    }),
  },
  field: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

/**
 * The direction options (Airport → Location / Location → Airport) come
 * from field.config.options, so backend can relabel or reorder them
 * without a frontend change.
 */
const directionOptions = computed(() => {
  return props.field.config?.options?.length
    ? props.field.config.options
    : DEFAULT_DIRECTION_OPTIONS;
});

/**
 * field.config.fields lists which sub-fields this activity actually wants
 * (pickup_location / drop_location / pickup_time) along with their labels.
 * Rendering off this list means an activity can drop a sub-field (e.g. no
 * pickup_time needed) without any component change.
 */
const subFields = computed(() => props.field.config?.fields || []);

const hasSubField = (key) => {
  // If the backend didn't send a config.fields list at all, fall back to
  // showing all three so the field still works.
  if (!subFields.value.length) return true;

  return subFields.value.some((subField) => subField.field === key);
};

const subFieldLabel = (key, fallback) => {
  const match = subFields.value.find((subField) => subField.field === key);

  return match?.label || fallback;
};

const transferType = ref(
  props.modelValue.transfer_type || directionOptions.value[0]?.value || "",
);

const availableLocations = ref([]);
const loadingLocations = ref(false);

/**
 * Airport is the common endpoint on every transfer, regardless of
 * direction - so it's auto-filled rather than picked by the user.
 * "location_to_airport" -> pickup is the fixed side, drop is user-picked
 * and vice versa for "airport_to_location".
 */
const airportLocation = computed(() => {
  return availableLocations.value.find((loc) => loc.type === "airport") || null;
});

const airportSideKey = computed(() => {
  return transferType.value === "airport_to_location"
    ? "pickup_location"
    : "drop_location";
});

// A user picking their own location shouldn't be offered the airport
// itself as an option there.
const pickableLocations = computed(() => {
  return availableLocations.value.filter((loc) => loc.type !== "airport");
});

// Single watcher covering both triggers that affect the airport side:
// the airport location finishing its fetch, and the direction being
// flipped. Consolidated into one emit so the two concerns can't race
// each other and clobber one another's update.
watch(
  [transferType, airportLocation],
  ([newType], oldValues) => {
    const [oldType] = oldValues || [];
    const patch = { transfer_type: newType };

    const newAirportKey =
      newType === "airport_to_location" ? "pickup_location" : "drop_location";

    if (airportLocation.value) {
      patch[newAirportKey] = airportLocation.value;
    }

    // Direction flipped - the side that used to hold the airport now
    // needs a real, deliberate pick from the user instead of stale data.
    if (oldType && oldType !== newType) {
      const oldAirportKey =
        oldType === "airport_to_location" ? "pickup_location" : "drop_location";

      patch[oldAirportKey] = null;
    }

    emit("update:modelValue", {
      ...props.modelValue,
      ...patch,
    });
  },
  { immediate: true },
);

const updateSubField = (key, value) => {
  emit("update:modelValue", {
    ...props.modelValue,
    transfer_type: transferType.value,
    [key]: value,
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
