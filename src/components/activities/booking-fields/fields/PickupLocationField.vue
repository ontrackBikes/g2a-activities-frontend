<template>
  <location-picker
    :model-value="locationById(modelValue)"
    :locations="availableLocations"
    :loading="loadingLocations"
    :label="field.label || 'Pickup Location'"
    :description="field.description"
    :location-slug="locationSlug"
    :rules="rules"
    @update:model-value="update"
  />
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import apiClient from "@/services/api";
import LocationPicker from "../LocationPicker.vue";

const props = defineProps({
  modelValue: {
    type: [Number, String, Object],
    default: null,
  },
  field: {
    type: Object,
    default: () => ({}),
  },
  error: {
    type: String,
    default: "",
  },
  productSlug: {
    type: String,
    default: "",
  },
  productSlug: {
    type: String,
    default: "",
  },
  locationSlug: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const availableLocations = ref([]);
const loadingLocations = ref(false);

const rules = computed(() => {
  if (!props.field?.required) return [];

  return [(v) => !!v || "Please select a pickup location"];
});

// Configured locations are stored as ids. A customer-entered location is
// kept as its small custom-location object so it can be sent to the API.
const locationById = (location) => {
  if (!location) return null;

  if (typeof location === "object") return location;

  return availableLocations.value.find((loc) => loc.id === location) || null;
};

const update = (value) => {
  const locationValue = value?.is_custom
    ? {
        type: "custom",
        name: value.name,
        address: value.address,
        // lat/lng/signature come from a Google Places search result and are
        // required together for KM_BASED (distance-tier) pricing and for the
        // backend to verify the location. A manually typed location (no map
        // pick) won't have these — omit rather than send null so the backend
        // schema doesn't reject a partial submission.
        ...(value.lat != null && value.lng != null && value.signature
          ? { lat: value.lat, lng: value.lng, signature: value.signature }
          : {}),
        ...(value.place_types ? { place_types: value.place_types } : {}),
      }
    : (value?.id ?? null);

  emit("update:modelValue", locationValue);
};

const fetchLocations = async () => {
  if (!props.productSlug || !props.locationSlug) return;

  loadingLocations.value = true;

  try {
    const { data } = await apiClient.get(
      `/v1/products/app/${props.productSlug}/available-locations`,
      {
        params: {
          location_slug: props.locationSlug,
        },
      },
    );

    availableLocations.value = data.data || [];
  } catch (err) {
    console.error("Failed to load airport transfer locations", err);
    availableLocations.value = [];
  } finally {
    loadingLocations.value = false;
  }
};

onMounted(fetchLocations);
watch(() => props.productSlug, fetchLocations);
</script>
