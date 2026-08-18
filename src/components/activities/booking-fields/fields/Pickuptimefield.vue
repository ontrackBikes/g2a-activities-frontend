<template>
  <div>
    <v-text-field
      :model-value="pickupTimeLabel"
      :label="field.label || 'Pickup Time'"
      placeholder="Select pickup time"
      variant="outlined"
      density="compact"
      rounded="lg"
      prepend-inner-icon="mdi-clock-outline"
      :rules="rules"
      :error-messages="error ? [error] : []"
      hide-details="auto"
      readonly
      @click="dialog = true"
    />

    <v-dialog
      v-model="dialog"
      max-width="500"
      scrim="rgba(15,23,42,.30)"
      :style="{
        backdropFilter: 'blur(5px)',
        webkitBackdropFilter: 'blur(5px)',
      }"
    >
      <v-card rounded="lg" flat>
        <v-toolbar density="comfortable" color="transparent">
          <v-toolbar-title>Select Pickup Time</v-toolbar-title>

          <v-spacer />

          <v-btn icon variant="text" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-toolbar>

        <v-divider />

        <v-card-text
          :style="{
            maxHeight: mobile ? '100%' : '360px',
            overflowY: 'auto',
          }"
        >
          <v-row v-if="pickupTimeOptions.length" dense>
            <v-col
              v-for="option in pickupTimeOptions"
              :key="option.value"
              md="3"
              sm="4"
            >
              <v-chip
                rounded="lg"
                :color="modelValue === option.value ? 'primary' : undefined"
                :variant="modelValue === option.value ? 'flat' : 'outlined'"
                :disabled="option.disabled"
                label
                class="w-100 justify-center"
                @click="select(option.value)"
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
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useDisplay } from "vuetify";

const { mobile } = useDisplay();

const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  field: {
    type: Object,
    default: () => ({}),
  },
  form: {
    type: Object,
    default: () => ({}),
  },
  serviceHours: {
    type: Array,
    default: () => [],
  },
  error: {
    type: String,
    default: "",
  },
});

const emit = defineEmits(["update:modelValue"]);

const dialog = ref(false);

const rules = computed(() => {
  if (!props.field?.required) return [];

  return [(v) => !!v || "Please select a pickup time"];
});

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

const toMinutes = (hhmm) => {
  const [hours, minutes] = hhmm.split(":").map(Number);

  return hours * 60 + minutes;
};

// Pickup time only needs to be restricted when the selected date (from
// DateField, via the shared `form`) is today - any future date is
// unrestricted.
const minAllowedMinutes = computed(() => {
  const today = new Date().toISOString().split("T")[0];

  if (props.form.date !== today) return null;

  const now = new Date();

  // 12 hours = 720 minutes
  return now.getHours() * 60 + now.getMinutes() + 720;
});

const pickupTimeOptions = computed(() => {
  const minMinutes = minAllowedMinutes.value;

  return PICKUP_TIME_SLOTS.value.map((slot) => ({
    ...slot,
    disabled: minMinutes !== null && toMinutes(slot.value) < minMinutes,
  }));
});

const pickupTimeLabel = computed(() => {
  const match = pickupTimeOptions.value.find(
    (option) => option.value === props.modelValue,
  );

  return match?.title || "";
});

const select = (value) => {
  emit("update:modelValue", value);

  dialog.value = false;
};

// If the date changes (or time passes) and the currently selected pickup
// time falls before the new cutoff, it's no longer a valid choice - drop
// it instead of silently keeping a disabled option selected.
watch(pickupTimeOptions, (options) => {
  if (!props.modelValue) return;

  const option = options.find((item) => item.value === props.modelValue);

  if (option?.disabled) {
    emit("update:modelValue", "");
  }
});
</script>
