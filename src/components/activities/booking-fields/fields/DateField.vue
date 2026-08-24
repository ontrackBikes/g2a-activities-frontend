<template>
  <div>
    <div
      class="d-flex align-center justify-space-between"
      :class="field.description ? 'mb-1' : 'mb-3'"
    >
      <div class="g2a-title-lg">
        {{ field.label || "Select Date" }}
      </div>

      <div class="mode-toggle">
        <v-btn
          icon
          variant="text"
          size="36"
          class="mode-toggle-btn"
          :class="{ active: mode === 'strip' }"
          @click="mode = 'strip'"
        >
          <v-icon size="20">mdi-view-list</v-icon>
        </v-btn>

        <v-btn
          icon
          variant="text"
          size="36"
          class="mode-toggle-btn"
          :class="{ active: mode === 'calendar' }"
          @click="mode = 'calendar'"
        >
          <v-icon size="20">mdi-calendar-blank-outline</v-icon>
        </v-btn>
      </div>
    </div>

    <div
      v-if="field.description"
      class="text-greyDark d-flex align-center mb-3"
    >
      <div>{{ field.description }}</div>
    </div>

    <div v-if="mode === 'strip'" class="date-strip-wrapper">
      <v-btn
        v-if="!mobile"
        icon
        variant="elevated"
        size="36"
        class="scroll-arrow scroll-arrow-left"
        @click="scrollByPage(-1)"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>

      <div ref="stripRef" class="date-strip">
        <template v-for="date in dates" :key="date.value">
          <div v-if="date.showMonth" class="month-card py-2">
            <span>{{ date.month }}</span>
          </div>

          <v-card
            :ref="(el) => setCardRef(el, date.value)"
            class="date-card py-4"
            :class="[
              `status-${dateStatus(date.value)}`,
              { active: modelValue === date.value },
            ]"
            elevation="0"
            @click="select(date.value)"
          >
            <div class="date-number">
              {{ String(date.date).padStart(2, "0") }}
            </div>

            <div class="date-day">
              {{ date.day }}
            </div>

            <span
              v-if="dateStatus(date.value) !== 'unknown'"
              class="date-dot"
            />
          </v-card>
        </template>
      </div>

      <v-btn
        v-if="!mobile"
        icon
        variant="elevated"
        size="36"
        class="scroll-arrow scroll-arrow-right"
        @click="scrollByPage(1)"
      >
        <v-icon>mdi-chevron-right</v-icon>
      </v-btn>
    </div>

    <div v-else class="calendar-wrapper">
      <v-date-picker
        v-model="calendarDate"
        v-model:month="calendarMonth"
        v-model:year="calendarYear"
        :min="today"
        hide-header
        show-adjacent-months
        width="100%"
        elevation="0"
        border
      >
        <template #day="{ props: dayProps, item }">
          <v-btn
            v-bind="dayProps"
            :disabled="dayProps.disabled || isDateUnavailable(item.isoDate)"
            :class="`status-${dateStatus(item.isoDate)}`"
          >
            {{ item.localized }}
          </v-btn>
        </template>
      </v-date-picker>

      <div class="calendar-legend">
        <span class="legend-item">
          <span class="legend-dot status-available" /> Available
        </span>
        <span class="legend-item">
          <span class="legend-dot status-unavailable" /> Unavailable
        </span>
      </div>
    </div>

    <div v-if="selectedDateLabel" class="text-body-2 mt-2">
      Selected date: <strong>{{ selectedDateLabel }}</strong>
      <span v-if="!available && nextAvailableDateLabel">
        , Next available date: {{ nextAvailableDateLabel }}
      </span>
    </div>

    <div v-if="error" class="text-error text-caption mt-2">
      {{ error }}
    </div>
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, reactive, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import apiClient from "@/services/api";

const { mobile } = useDisplay();

const props = defineProps({
  modelValue: String,

  field: {
    type: Object,
    required: true,
  },

  error: {
    type: String,
    default: "",
  },

  nextAvailableDate: {
    type: String,
    default: "",
  },
  available: {
    type: Boolean,
    default: true,
  },

  form: {
    type: Object,
    default: () => ({}),
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

const today = new Date().toISOString().split("T")[0];

const mode = ref("strip");

const stripRef = ref(null);
const cardRefs = new Map();

const scrollByPage = (direction) => {
  const strip = stripRef.value;
  if (!strip) return;

  strip.scrollBy({
    left: direction * strip.offsetWidth * 0.8,
    behavior: "smooth",
  });
};

const calendarDate = computed({
  get: () =>
    props.modelValue ? new Date(`${props.modelValue}T00:00:00`) : null,
  set: (val) => {
    if (!val) return;

    const d = new Date(val);
    const iso = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

    emit("update:modelValue", iso);
  },
});

const calendarMonth = ref(new Date().getMonth());
const calendarYear = ref(new Date().getFullYear());

// date (ISO string) -> true | false | "unknown", from the calendar API.
// A date with no entry yet (not fetched, or still loading) renders the
// same as "unknown" - neutral, not treated as unavailable.
const calendarStatus = reactive(new Map());
const loadedToDate = ref("");
const loadedPage = ref(0);

const calendarSlug = computed(() => {
  if (!props.productSlug || !props.locationSlug) return "";
  return `${props.productSlug}-in-${props.locationSlug}`;
});

const dateStatus = (value) => {
  if (!calendarStatus.has(value)) return "unknown";

  const status = calendarStatus.get(value);
  if (status === true) return "available";
  if (status === false) return "unavailable";
  return "unknown";
};

const isDateUnavailable = (value) => calendarStatus.get(value) === false;

const fetchCalendarPage = async (page) => {
  if (!calendarSlug.value || page <= loadedPage.value) return;

  try {
    const { data } = await apiClient.get(
      `/v1/products/app/${calendarSlug.value}/calendar`,
      {
        params: {
          page,
          guests: props.form?.guests || undefined,
          quantity: props.form?.quantity || undefined,
        },
      },
    );

    for (const d of data.dates || []) {
      calendarStatus.set(d.date, d.available);
    }

    loadedToDate.value = data.to_date || loadedToDate.value;
    loadedPage.value = Math.max(loadedPage.value, data.page || page);
  } catch (err) {
    console.error("Failed to load product calendar", err);
  }
};

const resetCalendar = () => {
  calendarStatus.clear();
  loadedToDate.value = "";
  loadedPage.value = 0;

  if (calendarSlug.value) fetchCalendarPage(1);
};

watch(calendarSlug, () => resetCalendar(), { immediate: true });

watch(
  () => [props.form?.guests, props.form?.quantity],
  () => resetCalendar(),
);

// Fetch the next 3-month chunk once the user navigates the calendar past
// the currently loaded window (max page 8, per the API's ~2yr cap).
watch([calendarMonth, calendarYear], () => {
  if (!loadedToDate.value || loadedPage.value >= 8) return;

  const displayed = new Date(calendarYear.value, calendarMonth.value, 1);

  if (displayed > new Date(`${loadedToDate.value}T00:00:00`)) {
    fetchCalendarPage(loadedPage.value + 1);
  }
});

const setCardRef = (el, value) => {
  if (el) {
    cardRefs.set(value, el.$el || el);
  } else {
    cardRefs.delete(value);
  }
};

const scrollToSelected = (behavior = "smooth") => {
  const card = props.modelValue && cardRefs.get(props.modelValue);
  if (!card || !stripRef.value) return;

  const strip = stripRef.value;
  const left = card.offsetLeft - strip.offsetWidth / 2 + card.offsetWidth / 2;

  strip.scrollTo({ left, behavior });
};

onMounted(() => {
  if (!props.modelValue) {
    emit("update:modelValue", today);
  }

  nextTick(() => scrollToSelected("auto"));
});

watch(
  () => props.modelValue,
  () => nextTick(() => scrollToSelected("smooth")),
);

const dates = computed(() => {
  const items = [];
  let lastMonth = "";

  for (let i = 0; i < 60; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);

    const month = d
      .toLocaleDateString("en-IN", {
        month: "short",
      })
      .toUpperCase();

    items.push({
      value: d.toISOString().split("T")[0],
      day: d.toLocaleDateString("en-IN", {
        weekday: "short",
      }),
      date: d.getDate(),
      month,
      showMonth: month !== lastMonth,
    });

    lastMonth = month;
  }

  return items;
});

const select = (value) => {
  if (isDateUnavailable(value)) return;

  emit("update:modelValue", value);
};

const selectedDateLabel = computed(() => {
  if (!props.modelValue) return "";

  return new Date(props.modelValue).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
});

const nextAvailableDateLabel = computed(() => {
  if (!props.nextAvailableDate) return "";

  return new Date(props.nextAvailableDate).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
});
</script>

<style scoped>
/* Mode toggle */

.mode-toggle {
  display: flex;
  align-items: center;
  gap: 2px;
  background: #f0f0f0;
  border-radius: 999px;
  padding: 4px;
  flex-shrink: 0;
}

.mode-toggle-btn {
  border-radius: 10px !important;
  color: #9ca3af;
}

.mode-toggle-btn.active {
  background: white !important;
  color: #0f1b3d;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.12);
}

/* Strip + scroll arrows */

.date-strip-wrapper {
  position: relative;
}

.date-strip {
  display: flex;
  gap: 12px;
  overflow-x: auto;
  padding: 5px;
  scrollbar-width: none;
}

.date-strip::-webkit-scrollbar {
  display: none;
}

.scroll-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
  background: white !important;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

.scroll-arrow-left {
  left: -18px;
}

.scroll-arrow-right {
  right: -18px;
}

/* Calendar */

.calendar-wrapper :deep(.v-date-picker) {
  border-radius: 18px;
}

.calendar-wrapper :deep(.v-picker-title) {
  display: none;
}

.calendar-wrapper .v-btn.status-available:not(.v-btn--disabled) {
  color: #16a34a;
}

.calendar-wrapper .v-btn.status-unavailable {
  color: #b0b0b0 !important;
  text-decoration: line-through;
}

.calendar-legend {
  display: flex;
  gap: 16px;
  margin-top: 8px;
  padding: 0 4px;
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #6b7280;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.legend-dot.status-available {
  background: #22c55e;
}

.legend-dot.status-unavailable {
  background: #b0b0b0;
}

/* Month */

.month-card {
  width: 42px;
  min-width: 42px;
  border: 1px solid #ececec;
  border-radius: 18px;
  background: #f7f7f7;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.month-card span {
  transform: rotate(-90deg);
  font-weight: 700;
  letter-spacing: 2px;
  color: #4b5563;
}

/* Date */

.date-card {
  width: 54px;
  min-width: 54px;

  border-radius: 18px !important;
  border: 1px solid #e6e6e6;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  cursor: pointer;
  flex-shrink: 0;

  transition: 0.25s;
}

.date-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.08);
}

.date-number {
  color: #111827;
}

.date-day {
  font-weight: 500;
  color: #374151;
}

/* Active */

.date-card.active {
  background: #0f1b3d !important;
  border-color: #0f1b3d !important;
}

.date-card.active .date-number,
.date-card.active .date-day {
  color: white;
}

/* Availability status */

.date-card.status-unavailable {
  opacity: 0.45;
  cursor: not-allowed;
}

.date-card.status-unavailable:hover {
  transform: none;
  box-shadow: none;
}

.date-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  margin-top: 4px;
}

.date-card.status-available .date-dot {
  background: #22c55e;
}

.date-card.status-unavailable .date-dot {
  background: #b0b0b0;
}

.date-card.active .date-dot {
  background: white;
}
</style>
