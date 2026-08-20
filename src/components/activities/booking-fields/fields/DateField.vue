<template>
  <div>
    <div class="g2a-title-lg" :class="field.description ? 'mb-1' : 'mb-3'">
      {{ field.label || "Select Date" }}
    </div>

    <div
      v-if="field.description"
      class="text-greyDark d-flex align-center mb-3"
    >
      <div>{{ field.description }}</div>
    </div>

    <div ref="stripRef" class="date-strip">
      <template v-for="date in dates" :key="date.value">
        <div v-if="date.showMonth" class="month-card py-2">
          <span>{{ date.month }}</span>
        </div>

        <v-card
          :ref="(el) => setCardRef(el, date.value)"
          class="date-card py-4"
          :class="{ active: modelValue === date.value }"
          elevation="0"
          @click="select(date.value)"
        >
          <div class="date-number">
            {{ String(date.date).padStart(2, "0") }}
          </div>

          <div class="date-day">
            {{ date.day }}
          </div>
        </v-card>
      </template>
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
import { computed, nextTick, onMounted, ref, watch } from "vue";

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
});
const emit = defineEmits(["update:modelValue"]);

const today = new Date().toISOString().split("T")[0];

const stripRef = ref(null);
const cardRefs = new Map();

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
</style>
