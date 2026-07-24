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
          :model-value="locationById(modelValue.pickup_location)"
          :locations="pickableLocations"
          :loading="loadingLocations"
          :label="subFieldLabel('pickup_location', 'Pickup Location')"
          :rules="pickupLocationRules"
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
          :model-value="locationById(modelValue.drop_location)"
          :locations="pickableLocations"
          :loading="loadingLocations"
          :label="subFieldLabel('drop_location', 'Drop Location')"
          :rules="dropLocationRules"
          class="mb-4"
          @update:model-value="updateSubField('drop_location', $event)"
        />
      </template>

      <!-- Pickup Time -->
      <v-select
        v-if="hasSubField('pickup_time')"
        :model-value="modelValue.pickup_time"
        :items="pickupTimeOptions"
        item-title="title"
        item-value="value"
        :label="subFieldLabel('pickup_time', 'Pickup Time')"
        placeholder="Select pickup time"
        variant="outlined"
        density="compact"
        rounded="lg"
        :rules="pickupTimeRules"
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

const directionOptions = computed(() => {
  return props.field.config?.options?.length
    ? props.field.config.options
    : DEFAULT_DIRECTION_OPTIONS;
});

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

const isSubFieldRequired = (key) => {
  const match = subFields.value.find((subField) => subField.field === key);

  return !!match?.required;
};

// Self-contained validation - which location is required flips with the
// selected direction: the airport side is always auto-filled (and
// disabled), so only the side the user actually has to pick themselves
// carries a rule. Airport → Location needs a drop location; Location →
// Airport needs a pickup location.
const pickupLocationRules = computed(() => {
  if (!hasSubField("pickup_location")) return [];
  if (airportSideKey.value === "pickup_location") return [];

  return [(v) => !!v || "Please select a pickup location"];
});

const dropLocationRules = computed(() => {
  if (!hasSubField("drop_location")) return [];
  if (airportSideKey.value === "drop_location") return [];

  return [(v) => !!v || "Please select a drop location"];
});

const pickupTimeRules = computed(() => {
  if (!isSubFieldRequired("pickup_time")) return [];

  return [(v) => !!v || "Please select a pickup time"];
});

const transferType = ref(
  props.modelValue.transfer_type || directionOptions.value[0]?.value || "",
);

const availableLocations = ref([]);
const loadingLocations = ref(false);

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

// Configured locations are stored as ids. A customer-entered location is
// kept as its small custom-location object so it can be sent to the API.
const locationById = (location) => {
  if (!location) return null;

  if (typeof location === "object") return location;

  return availableLocations.value.find((loc) => loc.id === location) || null;
};

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
      patch[newAirportKey] = airportLocation.value.id;
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
  const isLocationField = key === "pickup_location" || key === "drop_location";
  const locationValue = value?.is_custom
    ? {
        type: "custom",
        name: value.name,
        address: value.address,
      }
    : value?.id ?? null;

  emit("update:modelValue", {
    ...props.modelValue,
    transfer_type: transferType.value,
    [key]: isLocationField ? locationValue : value,
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

// `value` must stay in 24-hour HH:mm form - that's what the backend's
// pickup_time validation expects. `title` is just the display label.
const pickupTimeOptions = [
  { title: "07:00 AM", value: "07:00" },
  { title: "07:30 AM", value: "07:30" },
  { title: "08:00 AM", value: "08:00" },
  { title: "08:30 AM", value: "08:30" },
  { title: "09:00 AM", value: "09:00" },
  { title: "09:30 AM", value: "09:30" },
  { title: "10:00 AM", value: "10:00" },
  { title: "10:30 AM", value: "10:30" },
  { title: "11:00 AM", value: "11:00" },
  { title: "11:30 AM", value: "11:30" },
  { title: "12:00 PM", value: "12:00" },
  { title: "12:30 PM", value: "12:30" },
  { title: "01:00 PM", value: "13:00" },
  { title: "01:30 PM", value: "13:30" },
  { title: "02:00 PM", value: "14:00" },
  { title: "02:30 PM", value: "14:30" },
  { title: "03:00 PM", value: "15:00" },
  { title: "03:30 PM", value: "15:30" },
  { title: "04:00 PM", value: "16:00" },
  { title: "04:30 PM", value: "16:30" },
  { title: "05:00 PM", value: "17:00" },
  { title: "05:30 PM", value: "17:30" },
  { title: "06:00 PM", value: "18:00" },
  { title: "06:30 PM", value: "18:30" },
  { title: "07:00 PM", value: "19:00" },
  { title: "07:30 PM", value: "19:30" },
  { title: "08:00 PM", value: "20:00" },
];
</script>
