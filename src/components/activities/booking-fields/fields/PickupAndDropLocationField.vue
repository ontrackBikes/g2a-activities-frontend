<template>
  <v-card class="border" flat rounded="lg">
    <div class="pa-2 px-4">
      <div class="g2a-title-md" :class="field.description ? 'mb-1' : 'mb-4'">
        {{ field.label || "Pickup & Drop Details" }}
      </div>

      <div
        v-if="field.description"
        class="text-greyDark d-flex align-center mb-4"
      >
        <div>{{ field.description }}</div>
      </div>

      <!-- PICKUP / DROP — connector rail with swap, Ola/Uber style -->
      <div
        v-if="hasSubField('pickup_location') || hasSubField('drop_location')"
        class="d-flex"
      >
        <!-- Rail: pickup dot -> dashed line -> drop marker -->
        <!-- <div class="rail d-flex flex-column align-center mr-3">
          <span class="rail-dot rail-dot--pickup" />
          <span class="rail-line" />
          <span class="rail-dot rail-dot--drop" />
        </div> -->

        <div class="flex-grow-1 position-relative min-w-0">
          <template v-if="hasSubField('pickup_location')">
            <location-picker
              :model-value="locationById(modelValue.pickup_location)"
              :locations="availableLocations"
              :loading="loadingLocations"
              :label="subFieldLabel('pickup_location', 'Pickup Location')"
              :location-slug="locationSlug"
              :rules="pickupLocationRules"
              class="mb-4"
              @update:model-value="updateSubField('pickup_location', $event)"
            />
          </template>

          <template v-if="hasSubField('drop_location')">
            <location-picker
              :model-value="locationById(modelValue.drop_location)"
              :locations="availableLocations"
              :loading="loadingLocations"
              :label="subFieldLabel('drop_location', 'Drop Location')"
              :location-slug="locationSlug"
              :rules="dropLocationRules"
              class="mb-4"
              @update:model-value="updateSubField('drop_location', $event)"
            />
          </template>

          <!-- Swap button, pinned to the rail -->
          <v-btn
            v-if="canSwap"
            class="swap-btn"
            icon="mdi-swap-vertical"
            size="small"
            variant="elevated"
            color="surface"
            :disabled="!modelValue.pickup_location && !modelValue.drop_location"
            @click="swapLocations"
          />
        </div>
      </div>

      <!-- Pickup Time -->
      <template v-if="hasSubField('pickup_time')">
        <v-text-field
          :model-value="pickupTimeLabel"
          :label="subFieldLabel('pickup_time', 'Pickup Time')"
          placeholder="Select pickup time"
          variant="outlined"
          density="compact"
          rounded="lg"
          prepend-inner-icon="mdi-clock-outline"
          :rules="pickupTimeRules"
          hide-details="auto"
          readonly
          @click="pickupTimeDialog = true"
        />

        <v-dialog
          v-model="pickupTimeDialog"
          max-width="480"
          :fullscreen="mobile"
          :transition="mobile ? 'dialog-bottom-transition' : undefined"
          scrim="rgba(15,23,42,.30)"
          :style="{
            backdropFilter: 'blur(5px)',
            webkitBackdropFilter: 'blur(5px)',
          }"
        >
          <v-card :rounded="mobile ? 0 : 'lg'" flat height="100%">
            <v-toolbar density="comfortable" color="transparent">
              <v-toolbar-title>Select Pickup Time</v-toolbar-title>

              <v-spacer />

              <v-btn icon variant="text" @click="pickupTimeDialog = false">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </v-toolbar>

            <v-divider />

            <v-card-text
              :style="{
                maxHeight: mobile ? 'calc(100% - 64px)' : '360px',
                overflowY: 'auto',
              }"
            >
              <v-row v-if="pickupTimeOptions.length" dense>
                <v-col
                  v-for="option in pickupTimeOptions"
                  :key="option.value"
                  cols="6"
                  sm="4"
                  md="3"
                >
                  <v-chip
                    rounded="lg"
                    :color="
                      modelValue.pickup_time === option.value
                        ? 'primary'
                        : undefined
                    "
                    :variant="
                      modelValue.pickup_time === option.value
                        ? 'flat'
                        : 'outlined'
                    "
                    :disabled="option.disabled"
                    label
                    class="w-100 justify-center"
                    @click="selectPickupTime(option.value)"
                  >
                    {{ option.title }}
                  </v-chip>
                </v-col>
              </v-row>

              <div v-else class="text-medium-emphasis text-body-2 pa-2">
                No pickup slots are available for the selected service hours.
              </div>
            </v-card-text>
          </v-card>
        </v-dialog>
      </template>

      <!-- <v-alert
        v-if="isKmBasedPricing"
        density="compact"
        variant="tonal"
        color="primary"
        icon="mdi-map-marker-distance"
        rounded="lg"
        class="mt-2 text-caption"
      >
        Price is calculated by road distance between your pickup and drop
        locations
        <template v-if="distanceKm != null">
          — <strong>{{ distanceKm }} km</strong>
          <span v-if="durationMinutes != null">
            (~{{ durationMinutes }} min)</span
          >, starting from <strong>{{ formattedFromPrice }}</strong
          >.
        </template>
        <template v-else> once both locations are selected. </template>
      </v-alert> -->
    </div>
  </v-card>
</template>

<script setup>
import { ref, computed, onMounted, watch } from "vue";
import { useDisplay } from "vuetify";
import apiClient from "@/services/api";
import LocationPicker from "../LocationPicker.vue";

const { mobile } = useDisplay();

const props = defineProps({
  modelValue: {
    type: Object,
    default: () => ({
      pickup_location: null,
      drop_location: null,
      pickup_time: "",
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
  serviceHours: {
    type: Array,
    default: () => [],
  },
  minBookingLeadHours: {
    type: Number,
    default: 0,
  },
  productSlug: {
    type: String,
    default: "",
  },
  locationSlug: {
    type: String,
    default: "",
  },
  // Latest availability/pricing result for this product (from
  // ProductBooking.vue's `pricing` computed). Used to show a live
  // distance/price hint for KM_BASED products once both locations are set.
  pricing: {
    type: Object,
    default: () => ({}),
  },
});

const emit = defineEmits(["update:modelValue"]);

const isKmBasedPricing = computed(
  () => props.pricing?.pricing_type === "KM_BASED",
);

const distanceKm = computed(() => props.pricing?.distance_km ?? null);

const durationMinutes = computed(() => props.pricing?.duration_minutes ?? null);

const formattedFromPrice = computed(() => {
  const price = props.pricing?.unit_price;

  return Number.isFinite(Number(price))
    ? `₹${Number(price).toLocaleString("en-IN")}`
    : "";
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

  // Pickup/drop location default to required for a cab service unless the
  // backend explicitly says otherwise.
  return match ? !!match.required : true;
};

const pickupLocationRules = computed(() => {
  if (!hasSubField("pickup_location")) return [];
  if (!isSubFieldRequired("pickup_location")) return [];

  return [
    (v) => !!v || "Please select a pickup location",
    () =>
      !isSameLocation.value || "Pickup and drop locations cannot be the same",
  ];
});

const dropLocationRules = computed(() => {
  if (!hasSubField("drop_location")) return [];
  if (!isSubFieldRequired("drop_location")) return [];

  return [
    (v) => !!v || "Please select a drop location",
    () =>
      !isSameLocation.value || "Pickup and drop locations cannot be the same",
  ];
});

const pickupTimeRules = computed(() => {
  if (!hasSubField("pickup_time")) return [];
  if (!isSubFieldRequired("pickup_time")) return [];

  return [(v) => !!v || "Please select a pickup time"];
});

const availableLocations = ref([]);
const loadingLocations = ref(false);

const isSameLocation = computed(() => {
  const pickup = props.modelValue.pickup_location;
  const drop = props.modelValue.drop_location;

  if (!pickup || !drop) return false;

  const pickupId = typeof pickup === "object" ? pickup.id : pickup;
  const dropId = typeof drop === "object" ? drop.id : drop;

  return pickupId === dropId;
});

// Configured locations are stored as ids. A customer-entered location is
// kept as its small custom-location object so it can be sent to the API.
const locationById = (location) => {
  if (!location) return null;

  if (typeof location === "object") return location;

  return availableLocations.value.find((loc) => loc.id === location) || null;
};

const updateSubField = (key, value) => {
  const isLocationField = key === "pickup_location" || key === "drop_location";

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

  const updated = {
    ...props.modelValue,
    [key]: isLocationField ? locationValue : value,
  };

  // Prevent pickup & drop from being the same
  if (
    updated.pickup_location &&
    updated.drop_location &&
    updated.pickup_location === updated.drop_location
  ) {
    if (key === "pickup_location") {
      updated.drop_location = null;
    } else {
      updated.pickup_location = null;
    }
  }

  emit("update:modelValue", updated);
};

// -------------------------------------------------------------------
// Swap — the little reversing arrows between pickup & drop that every
// ride-hailing app has. Bypasses updateSubField's same-location guard
// since a straight swap can never produce a collision.
// -------------------------------------------------------------------
const canSwap = computed(
  () => hasSubField("pickup_location") && hasSubField("drop_location"),
);

const swapLocations = () => {
  emit("update:modelValue", {
    ...props.modelValue,
    pickup_location: props.modelValue.drop_location,
    drop_location: props.modelValue.pickup_location,
  });
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

// ---------------------------------------------------------------------
// Pickup time slot generation
//
// `serviceHours` is an array of `{ start_time, end_time }` windows (both
// "HH:mm" or "HH:mm:ss" strings) - a product can have more than one
// service window per day (e.g. a morning and an evening shift). Slots are
// generated per window at a fixed 30-minute cadence, merged, deduped and
// sorted. This also supports overnight windows (e.g. start 22:00, end
// 06:00) and rounds ragged boundary times like "22:29:00" down/up to the
// nearest valid slot. With no windows configured, the whole day is used.
// ---------------------------------------------------------------------

const SLOT_INTERVAL_MINUTES = 30;
const MINUTES_IN_DAY = 24 * 60;

const parseTimeToMinutes = (value, fallback) => {
  if (!value || typeof value !== "string") return fallback;

  const [hoursStr, minutesStr] = value.split(":");
  const hours = Number(hoursStr);
  const minutes = Number(minutesStr);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) return fallback;

  return hours * 60 + minutes;
};

const formatMinutesToHHmm = (totalMinutes) => {
  const normalized =
    ((totalMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
};

const formatMinutesToLabel = (totalMinutes) => {
  const normalized =
    ((totalMinutes % MINUTES_IN_DAY) + MINUTES_IN_DAY) % MINUTES_IN_DAY;
  const hours24 = Math.floor(normalized / 60);
  const minutes = normalized % 60;

  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;

  return `${String(hours12).padStart(2, "0")}:${String(minutes).padStart(2, "0")} ${period}`;
};

// Rounds each configured window's start up, and end down, to the nearest
// slot boundary so every generated option is bookable and none of them
// spill outside the service window. If a window's end <= start, it's
// treated as spanning midnight (e.g. 22:00 -> 06:00). No windows at all
// falls back to the full day, matching the old single-object default.
const serviceWindows = computed(() => {
  const windows = Array.isArray(props.serviceHours) ? props.serviceHours : [];

  if (!windows.length) {
    return [{ start: 0, end: MINUTES_IN_DAY }];
  }

  return windows.map((window) => {
    const rawStart = parseTimeToMinutes(window?.start_time, 0);
    const rawEnd = parseTimeToMinutes(window?.end_time, MINUTES_IN_DAY);

    const start =
      Math.ceil(rawStart / SLOT_INTERVAL_MINUTES) * SLOT_INTERVAL_MINUTES;

    let end = Math.ceil(rawEnd / SLOT_INTERVAL_MINUTES) * SLOT_INTERVAL_MINUTES;

    if (end <= start) {
      end += MINUTES_IN_DAY;
    }

    return { start, end };
  });
});

// `value` stays in 24-hour HH:mm form - that's what the backend's
// pickup_time validation expects. `title` is just the display label.
// Generated fresh whenever serviceHours changes, one pass per window,
// then deduped and sorted so overlapping windows don't produce repeats.
const PICKUP_TIME_SLOTS = computed(() => {
  const seen = new Set();
  const slots = [];

  for (const { start, end } of serviceWindows.value) {
    for (
      let minutes = start;
      minutes <= end;
      minutes += SLOT_INTERVAL_MINUTES
    ) {
      const value = formatMinutesToHHmm(minutes);

      if (seen.has(value)) continue;
      seen.add(value);

      slots.push({
        title: formatMinutesToLabel(minutes),
        value,
      });
    }
  }

  return slots.sort((a, b) => a.value.localeCompare(b.value));
});

// The pickup time must be at least `minBookingLeadHours` (from the
// check-available API's `availability.min_booking_lead_hours`) ahead of
// now. Compared as full date-times rather than a same-day-only check, so a
// lead time that spans past midnight (e.g. 24h) still disables the
// relevant early slots on the following day, not just "today".
const cutoffDateTime = computed(() => {
  const cutoff = new Date();

  cutoff.setMinutes(cutoff.getMinutes() + (Number(props.minBookingLeadHours) || 0) * 60);

  return cutoff;
});

const slotDateTime = (dateStr, hhmm) => {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = hhmm.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

const pickupTimeOptions = computed(() => {
  const cutoff = cutoffDateTime.value;
  const selectedDate = props.form.date;

  return PICKUP_TIME_SLOTS.value.map((slot) => {
    const slotDate = slotDateTime(selectedDate, slot.value);

    return {
      ...slot,
      disabled: !!slotDate && slotDate < cutoff,
    };
  });
});

const pickupTimeDialog = ref(false);

const pickupTimeLabel = computed(() => {
  const match = pickupTimeOptions.value.find(
    (option) => option.value === props.modelValue.pickup_time,
  );

  return match?.title || "";
});

const selectPickupTime = (value) => {
  updateSubField("pickup_time", value);

  pickupTimeDialog.value = false;
};

// If the date changes (or time passes) and the currently selected pickup
// time falls before the new cutoff, it's no longer a valid choice - drop
// it instead of silently keeping a disabled option selected.
watch(pickupTimeOptions, (options) => {
  const current = props.modelValue.pickup_time;

  if (!current) return;

  const option = options.find((item) => item.value === current);

  if (option?.disabled) {
    updateSubField("pickup_time", "");
  }
});
</script>

<style scoped>
/* Signature element: the pickup -> drop connector rail. Everything else
   in this file leans on Vuetify utility classes / props by design. */
.rail {
  width: 20px;
  padding-top: 18px;
  padding-bottom: 34px;
}

.rail-dot {
  flex-shrink: 0;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 2px solid rgb(var(--v-theme-success));
}

.rail-dot--drop {
  border-radius: 3px;
  border-color: rgb(var(--v-theme-error));
}

.rail-line {
  flex: 1;
  width: 0;
  min-height: 32px;
  border-left: 2px dashed rgba(var(--v-theme-on-surface), 0.25);
  margin: 6px 0;
}

.swap-btn {
  position: absolute;
  top: 28px;
  right: 4px;
  border: 1px solid rgba(var(--v-theme-on-surface), 0.15) !important;
}

@media (max-width: 600px) {
  .swap-btn {
    top: 24px;
    right: 0;
  }
}
</style>
