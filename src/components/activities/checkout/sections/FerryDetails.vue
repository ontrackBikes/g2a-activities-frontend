<template>
  <v-card rounded="lg" flat class="border">
    <v-container class="py-2">
      <div class="g2a-title-xl">
        {{ config.title || "Ferry Details" }}
      </div>

      <div v-if="config.description" class="mt-1">
        {{ config.description }}
      </div>
    </v-container>

    <v-divider />

    <v-container class="py-2">
      <v-row no-gutters>
        <v-col cols="12">
          <v-text-field
            :model-value="operatorLabel"
            label="Ferry Operator"
            placeholder="Select your ferry operator"
            prepend-inner-icon="mdi-ferry"
            append-inner-icon="mdi-chevron-down"
            variant="outlined"
            density="compact"
            rounded="lg"
            readonly
            hide-details="auto"
            class="mb-4"
            :rules="[(v) => !!v || 'Please select a ferry operator']"
            @click="operatorDialog = true"
          />
        </v-col>

        <v-col v-if="ferry.operator === 'Others'" cols="12">
          <v-text-field
            v-model="ferry.custom_operator"
            label="Operator Name"
            placeholder="Enter your ferry operator name"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details="auto"
            class="mb-4"
            :rules="[(v) => !!v || 'Please enter your ferry operator name']"
          />
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="ferry.ferry_time"
            type="time"
            label="Ferry Time (optional)"
            variant="outlined"
            density="compact"
            rounded="lg"
            hide-details="auto"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-card>

  <!-- Operator Dialog -->
  <v-dialog
    v-model="operatorDialog"
    max-width="500"
    scrollable
    :fullscreen="mobile"
    scrim="rgba(15,23,42,.30)"
    :style="{
      backdropFilter: 'blur(5px)',
      webkitBackdropFilter: 'blur(5px)',
    }"
  >
    <v-card :rounded="mobile ? 0 : 'lg'" flat>
      <v-toolbar density="comfortable" color="transparent">
        <v-toolbar-title>Select Ferry Operator</v-toolbar-title>

        <v-spacer />

        <v-btn icon variant="text" @click="operatorDialog = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-divider />

      <v-card-text class="pa-4">
        <v-text-field
          v-model="search"
          placeholder="Search ferry operators..."
          prepend-inner-icon="mdi-magnify"
          variant="outlined"
          density="compact"
          rounded="lg"
          hide-details
          class="mb-4"
        />

        <v-list
          lines="one"
          density="comfortable"
          :style="{ maxHeight: mobile ? '100%' : '360px', overflowY: 'auto' }"
        >
          <v-list-item
            v-for="operator in filteredOperators"
            :key="operator"
            rounded="lg"
            :active="ferry.operator === operator"
            @click="selectOperator(operator)"
          >
            <template #prepend>
              <v-avatar color="brandColor2" variant="tonal">
                <v-icon>mdi-ferry</v-icon>
              </v-avatar>
            </template>

            <v-list-item-title>
              {{ operator }}
            </v-list-item-title>

            <template v-if="ferry.operator === operator" #append>
              <v-icon color="brandColor2">mdi-check-circle</v-icon>
            </template>
          </v-list-item>

          <template v-if="filteredOperators.length === 0">
            <div class="text-center py-8">
              <v-icon size="48" color="grey">mdi-ferry</v-icon>

              <div class="text-medium-emphasis mt-2">
                No matching ferry operators found.
              </div>
            </div>
          </template>
        </v-list>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import { useDisplay } from "vuetify";
import { bookingStore } from "@/store/booking";

const { mobile } = useDisplay();

const props = defineProps({
  config: {
    type: Object,
    default: () => ({}),
  },
});

const booking = bookingStore;

const DEFAULT_OPERATORS = [
  "Makruzz",
  "Green Ocean",
  "Nautika",
  "Sea Link Cruises",
  "Government Ferry Services",
];

// Backend can override the default operator list via config.operators,
// but "Others" is always appended so an operator not in the list can
// still be entered manually.
const operators = computed(() => {
  const configured = props.config?.operators?.length
    ? props.config.operators
    : DEFAULT_OPERATORS;

  return [...configured, "Others"];
});

const search = ref("");

const filteredOperators = computed(() => {
  const query = search.value.trim().toLowerCase();

  if (!query) return operators.value;

  return operators.value.filter((operator) =>
    operator.toLowerCase().includes(query),
  );
});

const ferry = computed({
  get() {
    if (!booking.form.ferry_details) {
      booking.form.ferry_details = {
        operator: "",
        custom_operator: "",
        ferry_time: "",
      };
    }

    return booking.form.ferry_details;
  },

  set(value) {
    booking.form.ferry_details = value;
  },
});

const operatorDialog = ref(false);

const operatorLabel = computed(() => {
  if (!ferry.value.operator) return "";

  if (ferry.value.operator === "Others") {
    return ferry.value.custom_operator || "Others";
  }

  return ferry.value.operator;
});

const selectOperator = (value) => {
  ferry.value.operator = value;

  operatorDialog.value = false;
  search.value = "";
};

// Only the "Others" operator needs a free-text name - clear any stale
// custom name once a listed operator is picked instead.
watch(
  () => ferry.value.operator,
  (value) => {
    if (value !== "Others") {
      ferry.value.custom_operator = "";
    }
  },
);
</script>
