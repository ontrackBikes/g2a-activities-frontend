<template>
  <v-card class="border" flat rounded="lg">
    <v-container>
      <div
        v-if="field.description"
        class="text-greyDark d-flex align-center mb-3"
      >
        <div>{{ field.description }}</div>
      </div>

      <v-row>
        <v-col cols="12" md="6">
          <v-text-field
            v-model="pickupDate"
            type="date"
            label="Pickup Date"
            :min="todayString"
            :error-messages="error ? [error] : []"
            variant="outlined"
            density="compact"
            hide-details="auto"
            rounded="lg"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="pickupTime"
            :items="pickupTimeOptions"
            item-title="title"
            item-value="value"
            label="Pickup Time"
            variant="outlined"
            density="compact"
            hide-details="auto"
            rounded="lg"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-text-field
            v-model="returnDate"
            type="date"
            label="Drop Date"
            :min="minimumReturnDate"
            :error-messages="error ? [error] : []"
            variant="outlined"
            density="compact"
            hide-details="auto"
            rounded="lg"
          />
        </v-col>

        <v-col cols="12" md="6">
          <v-select
            v-model="pickupTime"
            :items="pickupTimeOptions"
            item-title="title"
            item-value="value"
            label="Drop Time"
            variant="outlined"
            density="compact"
            hide-details="auto"
            rounded="lg"
            readonly
            disabled
          />
        </v-col>
      </v-row>

      <v-card flat class="border mt-4" rounded="lg">
        <v-container class="text-warning my-auto d-flex align-center">
          <v-icon class="mr-2">mdi-information</v-icon> Drop time is
          automatically set to 24 hours after pickup time. You can contact us if
          you need a different drop time.
        </v-container>
      </v-card>
    </v-container>
  </v-card>
</template>

<script setup>
import { computed, ref, watch } from "vue";

const props = defineProps({
  form: {
    type: Object,
    required: true,
  },

  field: {
    type: Object,
    default: () => ({}),
  },

  error: {
    type: String,
    default: "",
  },

  // From the check-available API's `availability.min_booking_lead_hours` -
  // the pickup time must be at least this many hours ahead of now.
  minBookingLeadHours: {
    type: Number,
    default: 0,
  },
});

const todayDate = new Date();

// Only past dates are actually barred - same-day/lead-time rules are the
// backend's job (it already reports them back via check-available), so the
// picker itself shouldn't pre-emptively rule out today.
const todayString = todayDate.toISOString().split("T")[0];

const tomorrow = new Date(todayDate);
tomorrow.setDate(tomorrow.getDate() + 1);

const tomorrowString = tomorrow.toISOString().split("T")[0];

const dayAfterTomorrow = new Date(todayDate);
dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2);

const dayAfterTomorrowString = dayAfterTomorrow.toISOString().split("T")[0];

const PICKUP_TIME_SLOTS = [
  { title: "10:00 AM", value: "10:00" },
  { title: "10:30 AM", value: "10:30" },
  { title: "11:00 AM", value: "11:00" },
  { title: "11:30 AM", value: "11:30" },
  { title: "12:00 PM", value: "12:00" },
  { title: "12:30 PM", value: "12:30" },
  { title: "1:00 PM", value: "13:00" },
  { title: "1:30 PM", value: "13:30" },
  { title: "2:00 PM", value: "14:00" },
  { title: "2:30 PM", value: "14:30" },
  { title: "3:00 PM", value: "15:00" },
  { title: "3:30 PM", value: "15:30" },
  { title: "4:00 PM", value: "16:00" },
  { title: "4:30 PM", value: "16:30" },
  { title: "5:00 PM", value: "17:00" },
  { title: "5:30 PM", value: "17:30" },
  { title: "6:00 PM", value: "18:00" },
];

const slotDateTime = (dateStr, hhmm) => {
  if (!dateStr) return null;

  const [year, month, day] = dateStr.split("-").map(Number);
  const [hours, minutes] = hhmm.split(":").map(Number);

  return new Date(year, month - 1, day, hours, minutes, 0, 0);
};

const formatDateToYMD = (date) => date.toISOString().split("T")[0];

const MAX_LOOKAHEAD_DAYS = 90;

// Finds the earliest pickup date/time - starting from tomorrow, since bike
// rentals can't be booked same-day (matches the server-side rule in
// dateRange.service.js) - whose date-time clears `now + minLeadHours`.
// Walks the fixed daily slot schedule day by day so a lead time that spans
// more than one day (e.g. 60h) correctly lands on a later date rather than
// just the first disabled day.
const computeNextAvailableSlot = (minLeadHours) => {
  const cutoff = new Date();

  cutoff.setMinutes(
    cutoff.getMinutes() + (Number(minLeadHours) || 0) * 60,
  );

  for (
    let dayOffset = 1;
    dayOffset <= MAX_LOOKAHEAD_DAYS;
    dayOffset += 1
  ) {
    const candidate = new Date(todayDate);
    candidate.setDate(candidate.getDate() + dayOffset);

    const dateStr = formatDateToYMD(candidate);

    const firstSlot = PICKUP_TIME_SLOTS.find(
      (slot) => slotDateTime(dateStr, slot.value) >= cutoff,
    );

    if (firstSlot) {
      return { date: dateStr, time: firstSlot.value };
    }
  }

  // Shouldn't happen with any realistic lead time - avoid leaving the
  // form without a value if it does.
  return { date: tomorrowString, time: PICKUP_TIME_SLOTS[0].value };
};

// All slots are always selectable - lead-time/availability rules are
// enforced by the backend (via check-available), not pre-emptively here.
const pickupTimeOptions = PICKUP_TIME_SLOTS;

// Tracks whether the pickup date/time reflects a deliberate choice - either
// a booking resumed with values already in `form`, or the customer editing
// the fields themselves - as opposed to still holding our own best-guess
// auto-selection. Only auto-selection keeps recomputing as the real lead
// hours arrive from the check-available API; once this flips true it stops
// touching these fields.
//
// Keyed off `pickup_time` rather than `pickup_date`: ProductBooking.vue
// always pre-fills `form.pickup_date` with its own "tomorrow" placeholder
// (and keeps it synced to the URL) before this component even mounts, so
// checking that would treat every fresh page load as already decided.
// `pickup_time` has no such placeholder - it's only ever non-empty for a
// genuinely restored/shared booking - so it's the reliable "already
// decided" signal.
const hasUserSetPickup = ref(!!props.form.pickup_time);

// Set around our own programmatic writes to pickupDate/pickupTime so their
// setters below don't mistake an auto-selection for user input.
let isAutoSetting = false;

const pickupDate = computed({
  get() {
    return props.form.pickup_date || tomorrowString;
  },
  set(value) {
    if (!isAutoSetting) hasUserSetPickup.value = true;

    props.form.pickup_date = value;
  },
});

const pickupTime = computed({
  get() {
    // Falls back to the first slot rather than "" - pickup_time must
    // never sit blank, since the check-available API rejects an empty
    // value outright (a 400, not a normal "unavailable" result), and
    // slots are no longer disabled client-side to justify clearing it.
    return props.form.pickup_time || PICKUP_TIME_SLOTS[0].value;
  },
  set(value) {
    if (!isAutoSetting) hasUserSetPickup.value = true;

    props.form.pickup_time = value;
  },
});

const returnDate = computed({
  get() {
    return props.form.return_date || dayAfterTomorrowString;
  },
  set(value) {
    props.form.return_date = value;
  },
});

const minimumReturnDate = computed(() => {
  return pickupDate.value || tomorrowString;
});

watch(
  pickupDate,
  (newPickup) => {
    const pickup = new Date(newPickup);
    const drop = new Date(returnDate.value);

    if (drop <= pickup) {
      pickup.setDate(pickup.getDate() + 1);
      props.form.return_date = pickup.toISOString().split("T")[0];
    }
  },
  {
    immediate: true,
  },
);

watch(
  () => props.form,
  () => {
    if (!props.form.return_date) {
      props.form.return_date = dayAfterTomorrowString;
    }
  },
  {
    immediate: true,
    deep: true,
  },
);

// Auto-select the next available pickup date/time once real lead-hours
// data is known, instead of always guessing "tomorrow at 10am". Runs
// immediately at mount with whatever `minBookingLeadHours` starts as
// (usually 0, before the first check-available response lands), then
// re-runs and corrects the selection when the real value arrives -
// `hasUserSetPickup` is what stops it from then fighting a restored
// booking or the customer's own edit.
watch(
  () => props.minBookingLeadHours,
  () => {
    if (hasUserSetPickup.value) return;

    const { date, time } = computeNextAvailableSlot(
      props.minBookingLeadHours,
    );

    isAutoSetting = true;
    pickupDate.value = date;
    pickupTime.value = time;
    isAutoSetting = false;
  },
  { immediate: true },
);
</script>

<style scoped>
/* Native date inputs shrink to fit their text, so the browser's
   calendar icon ends up right after the value instead of at the far
   right of the field - force it to fill the input so the icon lands
   at the field's right edge. */
:deep(input[type="date"]) {
  width: 100%;
}
</style>
