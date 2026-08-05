<template>
  <v-card class="border" variant="outlined" rounded="lg">
    <div class="pa-2 px-4">
      <div class="g2a-title-md mb-3">
        {{ field.label || "Pickup & Drop Location" }}
      </div>

      <template v-if="hasSubField('pickup_location')">
        <location-picker
          :model-value="locationById(modelValue.pickup_location)"
          :locations="pickupLocationOptions"
          :loading="loadingLocations"
          :label="subFieldLabel('pickup_location', 'Pickup Location')"
          :rules="pickupLocationRules"
          class="mb-4"
          @update:model-value="updateSubField('pickup_location', $event)"
        />
      </template>

      <template v-if="hasSubField('drop_location')">
        <location-picker
          :model-value="locationById(modelValue.drop_location)"
          :locations="dropLocationOptions"
          :loading="loadingLocations"
          :label="subFieldLabel('drop_location', 'Drop Location')"
          :rules="dropLocationRules"
          @update:model-value="updateSubField('drop_location', $event)"
        />
      </template>
    </div>
  </v-card>
</template>

<script setup>
import { computed, ref, onMounted, watch } from "vue";
import apiClient from "@/services/api";
import LocationPicker from "../LocationPicker.vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      pickup_location: null,
      drop_location: null,
    }),
  },
  field: {
    type: Object,
    required: true,
  },
  form: {
    type: Object,
    default: () => ({}),
  },
  locationSlug: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const subFields = computed(() => props.field.config?.fields || []);

const hasSubField = (key) => {
  // If the backend didn't send a config.fields list at all, fall back to
  // showing both so the field still works.
  if (!subFields.value.length) return true;

  return subFields.value.some((subField) => subField.field === key);
};

const subFieldLabel = (key, fallback) => {
  const match = subFields.value.find((subField) => subField.field === key);

  return match?.label || fallback;
};

const isSubFieldRequired = (key) => {
  const match = subFields.value.find((subField) => subField.field === key);

  // Default to required when there's no explicit config for the sub-field.
  return match ? !!match.required : true;
};

const pickupLocationRules = computed(() => {
  if (!hasSubField("pickup_location") || !isSubFieldRequired("pickup_location")) {
    return [];
  }

  return [(v) => !!v || "Please select a pickup location"];
});

const dropLocationRules = computed(() => {
  if (!hasSubField("drop_location") || !isSubFieldRequired("drop_location")) {
    return [];
  }

  return [(v) => !!v || "Please select a drop location"];
});

const availableLocations = ref([]);
const loadingLocations = ref(false);

// Picking the same location for both ends doesn't make sense - each picker
// excludes whatever's already selected on the other one. Custom (manually
// entered) locations have no id, so they never collide with anything.
const pickupLocationOptions = computed(() => {
  const dropId = props.modelValue.drop_location;

  if (!dropId || typeof dropId === "object") return availableLocations.value;

  return availableLocations.value.filter((loc) => loc.id !== dropId);
});

const dropLocationOptions = computed(() => {
  const pickupId = props.modelValue.pickup_location;

  if (!pickupId || typeof pickupId === "object") return availableLocations.value;

  return availableLocations.value.filter((loc) => loc.id !== pickupId);
});

// Configured locations are stored as ids. A customer-entered location is
// kept as its small custom-location object so it can be sent to the API.
const locationById = (location) => {
  if (!location) return null;

  if (typeof location === "object") return location;

  return availableLocations.value.find((loc) => loc.id === location) || null;
};

const updateSubField = (key, value) => {
  const locationValue = value?.is_custom
    ? {
        type: "custom",
        name: value.name,
        address: value.address,
      }
    : value?.id ?? null;

  emit("update:modelValue", {
    ...props.modelValue,
    [key]: locationValue,
  });
};

const fetchLocations = async () => {
  loadingLocations.value = true;

  try {
    const { data } = await apiClient.get(
      "/v1/products/app/airport-transfers/available-locations",
      {
        params: props.locationSlug
          ? { location_slug: props.locationSlug }
          : undefined,
      },
    );

    availableLocations.value = data.data || [];
  } catch (err) {
    console.error("Failed to load pickup/drop locations", err);
  } finally {
    loadingLocations.value = false;
  }
};

onMounted(fetchLocations);

// The product's location is resolved async on the parent view - refetch
// once it becomes known (or if it ever changes).
watch(() => props.locationSlug, fetchLocations);
</script>
