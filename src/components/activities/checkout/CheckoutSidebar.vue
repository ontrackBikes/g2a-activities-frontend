<template>
  <!-- ============================== DESKTOP / TABLET: sticky card ============================== -->
  <div
    v-if="!mobile"
    class="mt-4"
    :class="detailsExpanded ? '' : 'position-sticky'"
    style="top: 24px; z-index: 1"
  >
    <v-card v-if="loading" rounded="lg" variant="outlined" elevation="0">
      <v-card-item class="pa-5">
        <template #prepend>
          <v-skeleton-loader type="avatar" width="60" height="60" />
        </template>
        <v-skeleton-loader type="heading" class="mb-2" />
        <v-skeleton-loader type="text" width="60%" />
      </v-card-item>
      <v-divider />
      <v-card-text
        ><v-skeleton-loader type="list-item-two-line@3"
      /></v-card-text>
      <v-divider />
      <v-card-text><v-skeleton-loader type="button" height="48" /></v-card-text>
    </v-card>

    <v-card v-else-if="quote" rounded="lg" class="border" flat>
      <!-- Product -->
      <v-card-item class="pa-5">
        <template #prepend>
          <v-avatar rounded="lg" size="60" class="g2a-rounded-border">
            <v-img
              :src="quote.product?.thumbnail_url"
              :alt="quote.product?.name || 'Product image'"
              cover
            >
              <template #error>
                <div
                  class="d-flex align-center justify-center fill-height bg-grey-lighten-3"
                >
                  <v-icon color="grey" size="24">mdi-image-off-outline</v-icon>
                </div>
              </template>
              <template #placeholder>
                <div class="d-flex align-center justify-center fill-height">
                  <v-progress-circular indeterminate size="20" width="2" />
                </div>
              </template>
            </v-img>
          </v-avatar>
        </template>
        <v-card-title class="g2a-title-xl truncate-two-lines">
          {{ quote.product?.name || "Selected activity" }}
        </v-card-title>
        <v-card-subtitle
          v-if="quote.location?.name"
          class="g2a-title-2xl-2-light text-greyDark d-flex align-center text-truncate"
        >
          <v-icon size="14" class="mr-1">mdi-map-marker-outline</v-icon>
          <span class="text-truncate">{{ quote.location.name }}</span>
        </v-card-subtitle>
      </v-card-item>

      <v-divider />

      <v-container v-if="previewRows.length" class="pb-0">
        <DetailRow
          v-for="row in previewRows"
          :key="row.label"
          :label="row.label"
          :value="row.value"
        />
      </v-container>

      <G2AExpansionPanel
        v-model="detailsExpanded"
        v-if="hasMoreDetails"
        title="More Details"
        :border="false"
        :title-size="'default'"
      >
        <v-container>
          <DetailRow
            v-for="row in remainingRows"
            :key="row.label"
            :label="row.label"
            :value="row.value"
            bold
          />

          <v-divider v-if="dailyPricing.length" class="my-4" />
          <template v-if="dailyPricing.length">
            <div class="g2a-title-2xl-2 mb-3">Daily pricing</div>
            <DetailRow
              v-for="day in previewDailyPricing"
              :key="day.date"
              :label="formatDate(day.date)"
              :value="formatCurrency(day.unit_price)"
              bold
            />
            <button
              v-if="hasMorePricing"
              type="button"
              class="g2a-link g2a-title-2xl-2 bg-transparent border-0 pa-0"
              @click.stop="pricingDialog = true"
            >
              View all {{ dailyPricing.length }} days
            </button>
          </template>

          <v-divider class="my-4" />
          <DetailRow
            :label="`Subtotal${pricing.quantity > 1 ? ` (x${pricing.quantity})` : ''}`"
            :value="formatCurrency(pricing.subtotal)"
            bold
          />
          <DetailRow
            v-if="pricing.discount"
            label="Discount"
            :value="`-${formatCurrency(pricing.discount)}`"
            value-class="text-success"
            bold
          />
          <DetailRow
            v-if="pricing.tax"
            label="Taxes & fees"
            :value="formatCurrency(pricing.tax)"
            wrapper-class="mb-0"
            bold
          />
        </v-container>
      </G2AExpansionPanel>

      <v-divider />

      <v-card-text v-if="error" class="pb-0">
        <v-alert
          type="error"
          variant="tonal"
          density="compact"
          rounded="lg"
          class="g2a-title-2xl-2"
          role="alert"
          >{{ error }}</v-alert
        >
      </v-card-text>

      <v-card-text>
        <div
          class="d-flex justify-space-between align-center flex-wrap ga-2 mb-1"
        >
          <div class="g2a-title-md">Total payable</div>
          <div class="text-right">
            <div
              v-if="pricing.discount"
              class="g2a-title-2xl-2 text-greyDark text-decoration-line-through"
            >
              {{ formatCurrency(pricing.subtotal + pricing.tax) }}
            </div>
            <div class="g2a-title-xl text-brandColor2">
              {{ formatCurrency(pricing.grand_total) }}
            </div>
          </div>
        </div>
        <div
          v-if="pricing.tax"
          class="g2a-text-caption text-greyDark text-right mb-3"
        >
          Inclusive of taxes &amp; fees
        </div>

        <v-btn
          flat
          block
          rounded="lg"
          color="brandColor"
          class="my-3"
          size="large"
          :loading="submitting"
          :disabled="!canProceed"
          aria-label="Continue to payment"
          @click="$emit('proceed')"
        >
          Confirm & Pay
          <!-- &nbsp;{{ formatCurrency(pricing.grand_total) }} -->
        </v-btn>

        <!-- <div>
          By clicking "Confirm & Pay", you agree to the
          <a href="https://go2andaman.com/terms-of-service/" target="_blank" class="g2a-link">terms of service</a>.
        </div>
        <v-divider class="my-2" /> -->
        <div class="d-flex align-center justify-center text-greyDark mt-2">
          <v-icon size="14" class="mr-1">mdi-shield-check-outline</v-icon>
          No Hidden Charges
        </div>
      </v-card-text>
    </v-card>

    <v-card v-else rounded="lg" flat class="border mt-4">
      <v-card-text class="text-center py-10">
        <v-icon size="40" color="grey">mdi-receipt-text-outline</v-icon>
        <div class="g2a-text-16 mt-2">
          {{ error || "No booking summary available." }}
        </div>
      </v-card-text>
    </v-card>
  </div>

  <!-- ============================== MOBILE: fixed bottom bar + bottom sheet ============================== -->
  <template v-else>
    <div class="mobile-summary-bar">
      <v-card flat rounded="0">
        <v-card-text v-if="loading" class="d-flex align-center ga-3 py-3">
          <v-skeleton-loader type="text" width="45%" />
          <v-skeleton-loader
            type="button"
            width="130"
            height="44"
            class="ml-auto"
          />
        </v-card-text>

        <v-card-text v-else-if="quote" class="py-3">
          <button
            type="button"
            class="d-flex align-center justify-space-between w-100 bg-transparent border-0 pa-0 mb-2"
            aria-label="View booking details"
            aria-haspopup="dialog"
            :aria-expanded="detailsSheet"
            @click="detailsSheet = true"
          >
            <span class="d-flex flex-column text-left">
              <span class="g2a-text-caption text-greyDark">Total payable</span>
              <span class="g2a-title-xl text-brandColor2">{{
                formatCurrency(pricing.grand_total)
              }}</span>
            </span>
            <span class="g2a-link g2a-title-2xl-2 d-flex align-center">
              Details
              <v-icon size="18" class="ml-1">mdi-chevron-up</v-icon>
            </span>
          </button>

          <v-alert
            v-if="error"
            type="error"
            variant="tonal"
            density="compact"
            rounded="lg"
            class="g2a-title-2xl-2 mb-2"
            role="alert"
          >
            {{ error }}
          </v-alert>

          <v-btn
            flat
            block
            rounded="lg"
            color="brandColor"
            size="large"
            :loading="submitting"
            :disabled="!canProceed"
            aria-label="Continue to payment"
            @click="$emit('proceed')"
          >
            Confirm & Pay

            <!-- &nbsp;{{ formatCurrency(pricing.grand_total) }} -->
          </v-btn>
        </v-card-text>

        <v-card-text v-else class="text-center g2a-text-16 py-4">{{
          error || "No booking summary available."
        }}</v-card-text>
      </v-card>
    </div>

    <v-bottom-sheet v-if="quote" v-model="detailsSheet" inset scrollable>
      <v-card
        rounded="t-xl"
        class="d-flex flex-column"
        style="max-height: 90vh"
      >
        <div class="d-flex align-center justify-space-between pa-4">
          <div class="g2a-title-xl">Booking summary</div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            aria-label="Close details"
            @click="detailsSheet = false"
          />
        </div>
        <v-divider />

        <div class="pa-4" style="overflow-y: auto">
          <!-- Product -->
          <div class="d-flex ga-3 align-start mb-4">
            <v-avatar rounded="lg" size="56" class="g2a-rounded-border">
              <v-img
                :src="quote.product?.thumbnail_url"
                :alt="quote.product?.name || 'Product image'"
                cover
              >
                <template #error>
                  <div
                    class="d-flex align-center justify-center fill-height bg-grey-lighten-3"
                  >
                    <v-icon color="grey" size="20"
                      >mdi-image-off-outline</v-icon
                    >
                  </div>
                </template>
                <template #placeholder>
                  <div class="d-flex align-center justify-center fill-height">
                    <v-progress-circular indeterminate size="18" width="2" />
                  </div>
                </template>
              </v-img>
            </v-avatar>
            <div class="flex-grow-1" style="min-width: 0">
              <div class="g2a-title-xl truncate-two-lines">
                {{ quote.product?.name || "Selected activity" }}
              </div>
              <div
                v-if="quote.location?.name"
                class="g2a-title-2xl-2-light text-greyDark d-flex align-center text-truncate mt-1"
              >
                <v-icon size="14" class="mr-1">mdi-map-marker-outline</v-icon>
                <span class="text-truncate">{{ quote.location.name }}</span>
              </div>
            </div>
          </div>

          <DetailRow
            v-for="row in previewRows"
            :key="row.label"
            :label="row.label"
            :value="row.value"
          />

          <template v-if="remainingRows.length || dailyPricing.length">
            <v-divider class="my-3" />
            <DetailRow
              v-for="row in remainingRows"
              :key="row.label"
              :label="row.label"
              :value="row.value"
              bold
            />

            <template v-if="dailyPricing.length">
              <div class="g2a-title-2xl-2 mb-3 mt-2">Daily pricing</div>
              <DetailRow
                v-for="day in previewDailyPricing"
                :key="day.date"
                :label="formatDate(day.date)"
                :value="formatCurrency(day.unit_price)"
                bold
              />
              <button
                v-if="hasMorePricing"
                type="button"
                class="g2a-link g2a-title-2xl-2 bg-transparent border-0 pa-0"
                @click.stop="pricingDialog = true"
              >
                View all {{ dailyPricing.length }} days
              </button>
            </template>
          </template>

          <v-divider class="my-4" />
          <DetailRow
            :label="`Subtotal${pricing.quantity > 1 ? ` (x${pricing.quantity})` : ''}`"
            :value="formatCurrency(pricing.subtotal)"
            bold
          />
          <DetailRow
            v-if="pricing.discount"
            label="Discount"
            :value="`-${formatCurrency(pricing.discount)}`"
            value-class="text-success"
            bold
          />
          <DetailRow
            v-if="pricing.tax"
            label="Taxes & fees"
            :value="formatCurrency(pricing.tax)"
            wrapper-class="mb-0"
            bold
          />
        </div>

        <v-divider />
        <div class="pa-4">
          <div
            class="d-flex justify-space-between align-center flex-wrap ga-2 mb-2"
          >
            <span>Total payable</span>
            <div class="text-right">
              <div
                v-if="pricing.discount"
                class="g2a-title-2xl-2 text-greyDark text-decoration-line-through"
              >
                {{ formatCurrency(pricing.subtotal + pricing.tax) }}
              </div>
              <div class="g2a-title-xl text-brandColor2">
                {{ formatCurrency(pricing.grand_total) }}
              </div>
            </div>
          </div>
          <v-btn
            flat
            block
            rounded="lg"
            color="brandColor"
            size="large"
            :loading="submitting"
            :disabled="!canProceed"
            aria-label="Continue to payment"
            @click="$emit('proceed')"
          >
            Confirm & Pay

            <!-- &nbsp;{{ formatCurrency(pricing.grand_total) }} -->
          </v-btn>
        </div>
      </v-card>
    </v-bottom-sheet>
  </template>

  <!-- Full daily pricing dialog: shared by desktop and mobile -->
  <v-dialog
    v-model="pricingDialog"
    scrollable
    :fullscreen="mobile"
    :max-width="mobile ? undefined : 450"
    scrim="rgba(15,23,42,.30)"
    :style="{ backdropFilter: 'blur(5px)', webkitBackdropFilter: 'blur(5px)' }"
  >
    <v-card :rounded="mobile ? 0 : 'lg'">
      <div class="pa-4 d-flex align-center justify-space-between">
        <div class="g2a-title">Daily Pricing</div>
        <v-btn
          icon="mdi-close"
          variant="text"
          size="large"
          aria-label="Close daily pricing"
          @click="pricingDialog = false"
        />
      </div>
      <v-divider />
      <v-list
        class="no-scrollbar"
        :style="{ maxHeight: mobile ? '100%' : '360px', overflowY: 'auto' }"
      >
        <v-list-item v-for="day in dailyPricing" :key="day.date">
          <template #title
            ><span class="g2a-title-2xl-2">{{
              formatDate(day.date)
            }}</span></template
          >
          <template #append
            ><strong class="g2a-title-2xl-2">{{
              formatCurrency(day.unit_price)
            }}</strong></template
          >
        </v-list-item>
      </v-list>
      <v-divider />
      <div class="pa-2">
        <v-btn
          block
          color="primary"
          variant="text"
          @click="pricingDialog = false"
          >Close</v-btn
        >
      </div>
    </v-card>
  </v-dialog>

  <v-card v-if="mobile" rounded="lg" flat class="border">
    <v-container>
      <!-- <div>
          By clicking "Confirm & Pay", you agree to the
          <a href="https://go2andaman.com/terms-of-service/" target="_blank" class="g2a-link">terms of service</a>.
        </div>
        <v-divider class="my-2" /> -->
      <div class="d-flex align-center justify-center text-greyDark mt-2">
        <v-icon size="14" class="mr-1">mdi-shield-check-outline</v-icon>
        No Hidden Charges
      </div>
    </v-container>
  </v-card>
  <!-- Reserves space so page content isn't hidden behind the fixed bar -->
  <div class="mobile-summary-bar-spacer" />
</template>

<script setup>
import G2AExpansionPanel from "@/components/common/G2AExpansionPanel.vue";
import { computed, ref, h } from "vue";
import { useDisplay } from "vuetify";
import { VCol, VRow } from "vuetify/components";

defineEmits(["proceed"]);

const props = defineProps({
  quote: { type: Object, default: null },
  submitting: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  error: { type: String, default: "" },
});

const { mobile } = useDisplay();

const pricingDialog = ref(false);
const detailsSheet = ref(false);
const detailsExpanded = ref(null);

/*
|--------------------------------------------------------------------------
| Reusable label/value row — this is the one piece of markup that genuinely
| repeats a lot (booking details, daily pricing, price breakdown, in both
| the desktop card and the mobile sheet), so it's worth a tiny component.
|--------------------------------------------------------------------------
*/

const formatValue = (value) => {
  if (value == null) return "";

  // Array
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        // Array of { label, value }
        if (
          item &&
          typeof item === "object" &&
          "label" in item &&
          "value" in item
        ) {
          return `${item.label}: ${formatValue(item.value)}`;
        }

        return formatValue(item);
      })
      .join(", ");
  }

  // Object
  if (typeof value === "object") {
    // Prefer common display fields
    if (value.name) return value.name;
    if (value.label) return value.label;
    if (value.title) return value.title;

    // Fallback
    return Object.values(value).map(formatValue).join(", ");
  }

  return String(value);
};

const DetailRow = (rowProps) =>
  h(VRow, { noGutters: true, class: "py-2" }, [
    h(VCol, { cols: 4 }, () => rowProps.label),
    h(VCol, { cols: 8, class: "text-right" }, () =>
      h(
        "div",
        {
          class: "g2a-title-md",
          style: {
            overflowWrap: "anywhere",
            wordBreak: "break-word",
          },
        },
        rowProps.value,
      ),
    ),
  ]);

DetailRow.props = {
  label: { type: String, default: "" },
  value: { type: [String, Number], default: "" },
  bold: { type: Boolean, default: false },
  valueClass: { type: String, default: "" },
  wrapperClass: { type: String, default: "" },
};

/*
|--------------------------------------------------------------------------
| Quote
|--------------------------------------------------------------------------
*/

const booking = computed(() => props.quote?.booking || {});

const pricing = computed(() => ({
  currency: "INR",
  quantity: 1,
  unit_price: 0,
  subtotal: 0,
  discount: 0,
  tax: 0,
  grand_total: 0,
  ...props.quote?.pricing,
}));

const availability = computed(() => ({
  slots: [],
  daily_pricing: [],
  selected_slot: null,
  ...props.quote?.availability,
}));

const selectedSlot = computed(() => availability.value.selected_slot);

const selectedSlotRow = computed(() => {
  const slot = selectedSlot.value;
  if (!slot) return null;
  return {
    label: slot.slot_type === "TIME" ? "Time" : "Variant",
    value:
      slot.slot_type === "TIME"
        ? `${slot.start_time} - ${slot.end_time}`
        : slot.name,
  };
});

const dailyPricing = computed(() => availability.value.daily_pricing || []);
const previewDailyPricing = computed(() => dailyPricing.value.slice(0, 3));
const hasMorePricing = computed(() => dailyPricing.value.length > 3);

const canProceed = computed(
  () =>
    Boolean(props.quote) && pricing.value.grand_total > 0 && !props.submitting,
);

/*
|--------------------------------------------------------------------------
| Booking Details
|--------------------------------------------------------------------------
*/

// Only genuinely structural date/time keys go here. Anything product-
// specific (guests, quantity, custom attributes) must be declared in that
// product's schema to show up — see SYSTEM_FIELD_KEYS below.
const ROW_LABELS = {
  travel_date: "Travel Date",
  pickup_date: "Pickup Date",
  pickup_time: "Pickup Time",
  return_date: "Return Date",
  drop_time: "Return Time",
  rental_days: "Rental Days",
};
const ROW_ORDER = Object.keys(ROW_LABELS);

// Each product's booking template already carries a per-field `visible` /
// `hidden` flag (see product_page_schema.fields on the schema), and some
// fields (e.g. transfer_type) nest their own sub-fields under `config.fields`
// (pickup_location, drop_location, pickup_time). We flatten all of that into
// one lookup so both top-level and nested fields resolve correctly.
const flattenSchemaFields = (fields = []) =>
  fields.reduce((acc, field) => {
    acc.push(field);
    if (Array.isArray(field.config?.fields)) {
      acc.push(...flattenSchemaFields(field.config.fields));
    }
    return acc;
  }, []);

const schemaFields = computed(() =>
  flattenSchemaFields(
    props.quote?.product?.bookingTemplate?.product_page_schema?.fields || [],
  ),
);

const schemaFieldByKey = computed(() =>
  schemaFields.value.reduce((acc, field) => {
    acc[field.field] = field;
    return acc;
  }, {}),
);

const fieldLabels = computed(() =>
  schemaFields.value.reduce((acc, field) => {
    acc[field.field] = field.label || prettyLabel(field.field);
    return acc;
  }, {}),
);

// Structural date/time keys are intrinsic to every booking and show even
// when a product's schema doesn't explicitly declare them (schemas mostly
// describe form INPUTS, and date pickers/slot pickers aren't always modeled
// as a "field"). Everything else -- guests, quantity, custom attributes --
// only shows if the product's schema actually defines that field, so it's
// opt-in per product instead of tagging along on whatever the backend
// happens to attach to the booking payload.
const SYSTEM_FIELD_KEYS = new Set(ROW_ORDER);

// No matching schema field -> only show if it's a structural system field.
// Matching schema field -> only show if not explicitly hidden for this product.
const isFieldHiddenInSummary = (key) => {
  const field = schemaFieldByKey.value[key];
  if (field) {
    return field.hidden === true || field.visible === false;
  }
  return !SYSTEM_FIELD_KEYS.has(key);
};

// Resolves a raw stored value (e.g. "airport_to_location") to its schema-
// defined option label (e.g. "Airport → Location"), when the field has a
// config.options list. Falls back to null so the caller can use formatValue.
const resolveOptionLabel = (key, value) => {
  const options = schemaFieldByKey.value[key]?.config?.options;
  if (!Array.isArray(options)) return null;
  return options.find((option) => option.value === value)?.label ?? null;
};

// Row order follows the schema's field order first, then any system/legacy
// keys (travel_date, etc.) that aren't part of the schema at all.
const fieldOrder = computed(() => {
  const schemaOrder = schemaFields.value.map((field) => field.field);
  const extras = ROW_ORDER.filter((key) => !schemaOrder.includes(key));
  return [...schemaOrder, ...extras];
});

const bookingRows = computed(() =>
  Object.entries(booking.value)
    .filter(
      ([, value]) => value !== null && value !== undefined && value !== "",
    )
    .filter(([key]) => !isFieldHiddenInSummary(key))
    .sort(([a], [b]) => {
      const indexA = fieldOrder.value.indexOf(a);
      const indexB = fieldOrder.value.indexOf(b);
      if (indexA === -1 && indexB === -1) return 0;
      if (indexA === -1) return 1;
      if (indexB === -1) return -1;
      return indexA - indexB;
    })
    .map(([key, value]) => {
      const label =
        fieldLabels.value[key] || ROW_LABELS[key] || prettyLabel(key);
      const isTimeLabel = label === "Pickup Time" || label === "Return Time";
      return {
        label,
        value: key.includes("date")
          ? formatDate(value)
          : isTimeLabel
            ? formatTime(value)
            : (resolveOptionLabel(key, value) ?? formatValue(value)),
      };
    }),
);

// First 3 rows (+ selected slot) show up-front; the rest live under "More details".
const previewRows = computed(() => {
  const rows = bookingRows.value.slice(0, 3);
  return selectedSlotRow.value ? [...rows, selectedSlotRow.value] : rows;
});
const remainingRows = computed(() => bookingRows.value.slice(3));
const hasMoreDetails = computed(
  () => remainingRows.value.length > 0 || dailyPricing.value.length > 0,
);

/*
|--------------------------------------------------------------------------
| Helpers
|--------------------------------------------------------------------------
*/

const formatCurrency = (value) => {
  const amount = Number(value);
  if (!Number.isFinite(amount)) return "-";
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: pricing.value.currency || "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `₹${amount.toLocaleString("en-IN")}`;
  }
};

const prettyLabel = (value) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

const formatDate = (date) => {
  const parsed = new Date(date);
  if (Number.isNaN(parsed.getTime())) return date;
  return parsed.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

// Backend sends pickup/drop times as bare "HH:mm" (or "HH:mm:ss") strings,
// which `new Date()` can't parse directly — so match the hour/minute manually
// before falling back to a full date parse for anything else (e.g. ISO datetimes).
const formatTime = (value) => {
  if (value == null || value === "") return value;

  const match = String(value).match(/^(\d{1,2}):(\d{2})/);
  if (match) {
    let hours = parseInt(match[1], 10);
    const minutes = match[2];
    const period = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

defineExpose({ formatCurrency, formatDate, formatTime });
</script>

<style scoped>
/* Vuetify doesn't ship a utility class for "stuck to the bottom of the
   viewport", so this bit of positioning CSS is genuinely necessary. */
.mobile-summary-bar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 20;
  box-shadow: 0 -2px 12px rgba(0, 0, 0, 0.08);
  padding-bottom: env(safe-area-inset-bottom, 0);
}

/* Reserves space at the end of the page so content isn't hidden behind the fixed bar. */
.mobile-summary-bar-spacer {
  height: calc(96px + env(safe-area-inset-bottom, 0));
}
</style>
