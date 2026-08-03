<template>
  <!-- Trigger -->
  <v-text-field
    :model-value="displayValue"
    :label="label"
    placeholder="Select a location"
    prepend-inner-icon="mdi-map-marker"
    variant="outlined"
    density="compact"
    rounded="lg"
    readonly
    class="mb-4"
    hide-details="auto"
    @click="dialog = true"
  />

  <!-- Location Picker -->
  <v-dialog
    v-model="dialog"
    max-width="700"
    persistent
    scrollable
    :fullscreen="mobile"
    transition="dialog-bottom-transition"
    scrim="rgba(15,23,42,.30)"
    :style="{
      backdropFilter: 'blur(5px)',
      webkitBackdropFilter: 'blur(5px)',
    }"
  >
    <v-card rounded="xl" min-height="95vh">
      <!-- Header -->
      <v-toolbar density="comfortable" color="transparent">
        <v-toolbar-title>Select Location</v-toolbar-title>

        <v-spacer />

        <v-btn icon variant="text" @click="dialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />

      <v-card-text class="pa-4">
        <!-- Search -->
        <v-text-field
          v-model="search"
          placeholder="Search hotels, jetties, restaurants..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-4"
        />

        <!-- Categories -->
        <div class="d-flex flex-wrap ga-2 mb-4">
          <v-chip-group v-model="selectedCategory" mandatory>
            <v-chip value="all"> All </v-chip>

            <v-chip value="hotel"> Hotels </v-chip>

            <v-chip value="jetty"> Jetties </v-chip>

            <v-chip value="restaurant"> Restaurants </v-chip>

            <v-chip value="attraction"> Attractions </v-chip>

            <v-chip value="airport"> Airport </v-chip>
          </v-chip-group>
        </div>

        <!-- Locations -->
        <v-list lines="two" density="comfortable">
          <v-list-item
            v-for="location in filteredLocations"
            :key="location.id"
            rounded="lg"
            @click="selectLocation(location)"
          >
            <template #prepend>
              <v-avatar color="primary" variant="tonal">
                <v-icon>
                  {{ getIcon(location.type) }}
                </v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              {{ location.name }}
            </v-list-item-title>

            <v-list-item-subtitle>
              {{ location.address }}
            </v-list-item-subtitle>
          </v-list-item>

          <!-- Empty -->
          <template v-if="filteredLocations.length === 0">
            <div class="text-center py-8">
              <v-icon size="48" color="grey"> mdi-map-search </v-icon>

              <div class="text-medium-emphasis mt-2">
                No matching locations found.
              </div>
            </div>
          </template>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <!-- Manual Entry -->
        <v-divider class="my-4" />

        <v-btn
          block
          color="primary"
          variant="tonal"
          prepend-icon="mdi-map-marker-plus"
          @click="manualDialog = true"
        >
          Can't find your location?
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>

  <!-- Manual Location Dialog -->
  <v-dialog v-model="manualDialog" max-width="500">
    <v-card rounded="xl">
      <v-card-title> Enter Location </v-card-title>

      <v-card-text>
        <v-text-field
          v-model="manualLocation.name"
          label="Location Name"
          placeholder="Hotel, Jetty, Landmark..."
          variant="outlined"
          density="compact"
          rounded="lg"
          class="mb-3"
        />

        <v-textarea
          v-model="manualLocation.address"
          label="Address"
          placeholder="Enter full address"
          variant="outlined"
          density="compact"
          rounded="lg"
          rows="3"
        />
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />

        <v-btn variant="text" @click="manualDialog = false"> Cancel </v-btn>

        <v-btn color="primary" @click="confirmManualLocation"> Confirm </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    default: null,
  },

  label: {
    type: String,
    default: "Select Location",
  },

  locations: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["update:modelValue"]);

const dialog = ref(false);
const manualDialog = ref(false);

const search = ref("");
const selectedCategory = ref("all");

const manualLocation = ref({
  name: "",
  address: "",
});

const displayValue = computed(() => {
  if (!props.modelValue) return "";

  return props.modelValue.name || "";
});

const filteredLocations = computed(() => {
  let items = [...props.locations];

  if (selectedCategory.value !== "all") {
    items = items.filter((item) => item.type === selectedCategory.value);
  }

  if (search.value.trim()) {
    const q = search.value.toLowerCase();

    items = items.filter((item) =>
      [item.name, item.address, item.type]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q),
    );
  }

  return items;
});

const selectLocation = (location) => {
  emit("update:modelValue", location);

  dialog.value = false;

  search.value = "";
  selectedCategory.value = "all";
};

const confirmManualLocation = () => {
  if (!manualLocation.value.name.trim()) return;

  emit("update:modelValue", {
    id: null,
    type: "custom",
    name: manualLocation.value.name,
    address: manualLocation.value.address,
    lat: null,
    lng: null,
    is_custom: true,
  });

  manualLocation.value = {
    name: "",
    address: "",
  };

  manualDialog.value = false;
  dialog.value = false;
};

const getIcon = (type) => {
  switch (type) {
    case "hotel":
      return "mdi-bed";

    case "jetty":
      return "mdi-ferry";

    case "restaurant":
      return "mdi-silverware-fork-knife";

    case "airport":
      return "mdi-airplane";

    case "attraction":
      return "mdi-camera";

    case "landmark":
      return "mdi-map-marker";

    default:
      return "mdi-map-marker";
  }
};
</script>
