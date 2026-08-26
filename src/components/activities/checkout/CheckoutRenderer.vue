<template>
  <div>
    <SectionRenderer
      v-for="(section, index) in sections"
      :key="`${section.section}-${section.config?.key ?? index}`"
      :section="section"
      :quote="quote"
      class="my-4"
    />
  </div>
</template>

<script setup>
import { computed } from "vue";

import SectionRenderer from "./SectionRenderer.vue";

const props = defineProps({
  bookingTemplate: {
    type: Object,
    required: true,
  },
  quote: {
    type: Object,
    required: true,
  },
});

// A pickup/drop being an airport or jetty isn't something admins toggle
// per product (the same cab service might sometimes go to the airport and
// sometimes not) - so these sections are added automatically based on the
// locations actually picked for this booking, on top of whatever the
// product's own booking page schema configures.
const hasLocationType = (location, type) =>
  (location?.place_types || []).includes(type);

const isAirportLocation = (location) =>
  hasLocationType(location, "airport") ||
  /airport/i.test(location?.name || "");

const isJettyLocation = (location) => hasLocationType(location, "jetty");

const locationDerivedSections = computed(() => {
  const booking = props.quote?.booking || {};
  const locations = [booking.pickup_location, booking.drop_location];

  const sections = [];

  if (locations.some(isAirportLocation)) {
    sections.push("flight_details");
  }

  if (locations.some(isJettyLocation)) {
    sections.push("ferry_details");
  }

  return sections;
});

const sections = computed(() => {
  const configured = (
    props.bookingTemplate?.booking_page_schema?.sections || []
  ).filter((section) => section.enabled);

  const configuredKeys = new Set(configured.map((section) => section.section));

  const derived = locationDerivedSections.value
    .filter((section) => !configuredKeys.has(section))
    .map((section) => ({ section, enabled: true, sort_order: 0 }));

  return [...configured, ...derived].sort(
    (a, b) => (b.sort_order ?? 0) - (a.sort_order ?? 0),
  );
});
</script>
