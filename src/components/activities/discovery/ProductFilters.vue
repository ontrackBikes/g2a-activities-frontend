<template>
  <div>
    <!-- ═══════════════════════════════════════════════
         FILTER BAR
    ═══════════════════════════════════════════════ -->
    <div class="filter-bar-wrap">
      <div class="px-3">
        <div class="d-flex align-center ga-2 py-3 no-scrollbar overflow-x-auto">
          <!-- Filter button -->
          <v-btn
            variant="outlined"
            rounded="pill"
            size="small"
            color="brandColor2"
            prepend-icon="mdi-tune-variant"
            class="g2a-text-12 g2a-text-bold-600 flex-shrink-0"
            @click="dialogOpen = true"
          >
            Filter
            <v-badge
              v-if="totalActiveCount > 0"
              :content="totalActiveCount"
              color="brandColor2"
              inline
              class="ms-1"
            />
          </v-btn>

          <!-- Location -->
          <v-menu v-model="locationMenuOpen" :close-on-content-click="false">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="outlined"
                rounded="pill"
                size="small"
                color="brandColor2"
                append-icon="mdi-chevron-down"
                class="g2a-text-12 g2a-text-bold-600 flex-shrink-0"
              >
                Location
                <v-badge
                  v-if="safeVal.locationIds.length"
                  :content="safeVal.locationIds.length"
                  color="brandColor2"
                  inline
                  class="ms-1"
                />
              </v-btn>
            </template>
            <v-card min-width="180" rounded="lg" elevation="3" class="pa-2">
              <div
                v-for="loc in locations"
                :key="loc.id"
                class="quick-menu-item"
                @click="toggleArr('locationIds', loc.id)"
              >
                <v-icon
                  :icon="
                    safeVal.locationIds.includes(loc.id)
                      ? 'mdi-checkbox-marked'
                      : 'mdi-checkbox-blank-outline'
                  "
                  size="16"
                  :color="
                    safeVal.locationIds.includes(loc.id)
                      ? 'brandColor2'
                      : 'greyDark'
                  "
                  class="me-2"
                />
                <span class="g2a-text-13">{{ loc.label }}</span>
              </div>
            </v-card>
          </v-menu>

          <!-- Sort By -->
          <v-menu v-model="sortMenuOpen" :close-on-content-click="true">
            <template #activator="{ props: menuProps }">
              <v-btn
                v-bind="menuProps"
                variant="outlined"
                rounded="pill"
                size="small"
                color="brandColor2"
                class="g2a-text-12 g2a-text-bold-600 flex-shrink-0"
              >
                {{ activeSortLabel }}
              </v-btn>
            </template>
            <v-card min-width="200" rounded="lg" elevation="3" class="pa-2">
              <div
                v-for="opt in SORT_OPTIONS"
                :key="opt.value"
                class="quick-menu-item"
                @click="emitField('sortBy', opt.value)"
              >
                <v-icon
                  :icon="
                    safeVal.sortBy === opt.value
                      ? 'mdi-radiobox-marked'
                      : 'mdi-radiobox-blank'
                  "
                  size="16"
                  :color="
                    safeVal.sortBy === opt.value ? 'brandColor2' : 'greyDark'
                  "
                  class="me-2"
                />
                <span class="g2a-text-13">{{ opt.label }}</span>
              </div>
            </v-card>
          </v-menu>

          <!-- Tag quick buttons (up to 3) -->
          <v-btn
            v-for="tag in tags.slice(0, 3)"
            :key="tag.id"
            variant="outlined"
            rounded="pill"
            size="small"
            color="brandColor2"
            class="g2a-text-12 g2a-text-bold-600 flex-shrink-0"
            :style="
              safeVal.tagIds.includes(tag.id)
                ? 'background: rgba(41,51,155,0.07)'
                : ''
            "
            @click="toggleArr('tagIds', tag.id)"
          >
            {{ tag.name }}
          </v-btn>

          <!-- Clear all -->
          <v-btn
            v-if="hasActiveFilters"
            variant="text"
            size="small"
            color="error"
            class="g2a-text-12 g2a-text-bold-600 flex-shrink-0 ms-1"
            prepend-icon="mdi-close-circle-outline"
            @click="$emit('reset')"
          >
            Clear
          </v-btn>

          <!-- Results count -->
          <div
            class="ms-auto g2a-text-12 text-greyDark flex-shrink-0 d-none d-md-block"
          >
            <slot name="results-count" />
          </div>
        </div>
      </div>
    </div>

    <!-- ═══════════════════════════════════════════════
         FILTER DIALOG
    ═══════════════════════════════════════════════ -->
    <v-dialog
      v-model="dialogOpen"
      max-width="560"
      scrollable
      :fullscreen="$vuetify.display.xs"
    >
      <v-card rounded="lg" elevation="0" class="filter-dialog-card">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between pa-4 pb-3">
          <div class="d-flex align-center ga-2">
            <v-icon icon="mdi-tune-variant" size="18" color="brandColor2" />
            <span class="g2a-subtitle-dark">Filters & Sort</span>
          </div>
          <div class="d-flex align-center ga-1">
            <v-btn
              v-if="hasActiveFilters"
              variant="text"
              color="error"
              size="small"
              class="g2a-text-12 g2a-text-bold-600"
              @click="$emit('reset')"
            >
              Reset all
            </v-btn>
            <v-btn icon variant="text" size="small" @click="dialogOpen = false">
              <v-icon icon="mdi-close" size="20" />
            </v-btn>
          </div>
        </div>

        <v-divider />

        <!-- Tab + Options -->
        <div class="filter-body d-flex">
          <!-- Left tabs -->
          <div class="filter-tabs">
            <div
              v-for="tab in TABS"
              :key="tab.key"
              class="filter-tab"
              :class="{ 'filter-tab--active': activeTab === tab.key }"
              @click="activeTab = tab.key"
            >
              <span class="filter-tab__label g2a-text-13">{{ tab.label }}</span>
              <v-badge
                v-if="tabCount(tab.key) > 0"
                :content="tabCount(tab.key)"
                color="brandColor2"
                inline
                class="ms-1"
              />
            </div>
          </div>

          <!-- Right options -->
          <div class="filter-options no-scrollbar">
            <!-- Sort By -->
            <template v-if="activeTab === 'sortBy'">
              <div
                v-for="opt in SORT_OPTIONS"
                :key="opt.value"
                class="filter-option"
                @click="emitField('sortBy', opt.value)"
              >
                <v-icon
                  :icon="
                    safeVal.sortBy === opt.value
                      ? 'mdi-radiobox-marked'
                      : 'mdi-radiobox-blank'
                  "
                  size="15"
                  :color="
                    safeVal.sortBy === opt.value ? 'brandColor2' : 'greyDark'
                  "
                  class="me-2 flex-shrink-0"
                />
                <span
                  class="g2a-text-13"
                  :class="
                    safeVal.sortBy === opt.value
                      ? 'g2a-text-bold-600 text-brandColor2'
                      : 'text-greyDark'
                  "
                >
                  {{ opt.label }}
                </span>
              </div>
            </template>

            <!-- Location -->
            <template v-if="activeTab === 'location'">
              <div
                v-if="!locations.length"
                class="g2a-text-12 text-greyDark pa-1"
              >
                <v-progress-circular
                  indeterminate
                  size="14"
                  color="brandColor2"
                  class="me-1"
                />
                Loading…
              </div>
              <div
                v-for="loc in locations"
                :key="loc.id"
                class="filter-option"
                @click="toggleArr('locationIds', loc.id)"
              >
                <v-icon
                  :icon="
                    safeVal.locationIds.includes(loc.id)
                      ? 'mdi-checkbox-marked'
                      : 'mdi-checkbox-blank-outline'
                  "
                  size="15"
                  :color="
                    safeVal.locationIds.includes(loc.id)
                      ? 'brandColor2'
                      : 'greyDark'
                  "
                  class="me-2 flex-shrink-0"
                />
                <span
                  class="g2a-text-13"
                  :class="
                    safeVal.locationIds.includes(loc.id)
                      ? 'g2a-text-bold-600 text-brandColor2'
                      : 'text-greyDark'
                  "
                >
                  {{ loc.label }}
                </span>
              </div>
            </template>

            <!-- Tag -->
            <template v-if="activeTab === 'tag'">
              <div v-if="!tags.length" class="g2a-text-12 text-greyDark pa-1">
                
                No tags available
              </div>
              <div
                v-for="tag in tags"
                :key="tag.id"
                class="filter-option"
                @click="toggleArr('tagIds', tag.id)"
              >
                <v-icon
                  :icon="
                    safeVal.tagIds.includes(tag.id)
                      ? 'mdi-checkbox-marked'
                      : 'mdi-checkbox-blank-outline'
                  "
                  size="15"
                  :color="
                    safeVal.tagIds.includes(tag.id) ? 'brandColor2' : 'greyDark'
                  "
                  class="me-2 flex-shrink-0"
                />
                <span
                  class="g2a-text-13"
                  :class="
                    safeVal.tagIds.includes(tag.id)
                      ? 'g2a-text-bold-600 text-brandColor2'
                      : 'text-greyDark'
                  "
                >
                  {{ tag.name }}
                </span>
              </div>
            </template>

            <!-- Product Type -->
            <template v-if="activeTab === 'productType'">
              <div
                v-if="!productTypes.length"
                class="g2a-text-12 text-greyDark pa-1"
              >
                <v-progress-circular
                  indeterminate
                  size="14"
                  color="brandColor2"
                  class="me-1"
                />
                Loading…
              </div>
              <div
                class="filter-option"
                @click="emitField('productTypeId', null)"
              >
                <v-icon
                  :icon="
                    !safeVal.productTypeId
                      ? 'mdi-radiobox-marked'
                      : 'mdi-radiobox-blank'
                  "
                  size="15"
                  :color="!safeVal.productTypeId ? 'brandColor2' : 'greyDark'"
                  class="me-2 flex-shrink-0"
                />
                <span
                  class="g2a-text-13"
                  :class="
                    !safeVal.productTypeId
                      ? 'g2a-text-bold-600 text-brandColor2'
                      : 'text-greyDark'
                  "
                >
                  All Types
                </span>
              </div>
              <div
                v-for="pt in productTypes"
                :key="pt.id"
                class="filter-option"
                @click="emitField('productTypeId', pt.slug)"
              >
                <v-icon
                  :icon="
                    safeVal.productTypeId === pt.slug
                      ? 'mdi-radiobox-marked'
                      : 'mdi-radiobox-blank'
                  "
                  size="15"
                  :color="
                    safeVal.productTypeId === pt.slug
                      ? 'brandColor2'
                      : 'greyDark'
                  "
                  class="me-2 flex-shrink-0"
                />
                <span
                  class="g2a-text-13"
                  :class="
                    safeVal.productTypeId === pt.slug
                      ? 'g2a-text-bold-600 text-brandColor2'
                      : 'text-greyDark'
                  "
                >
                  {{ pt.name }}
                </span>
              </div>
            </template>
          </div>
        </div>

        <v-divider />

        <!-- Price Range -->
        <div class="pa-4 pb-2">
          <div class="g2a-text-13 g2a-text-bold-600 mb-3">Price Range</div>
          <v-range-slider
            :model-value="[safeVal.minPrice, safeVal.maxPrice]"
            :min="0"
            :max="50000"
            :step="500"
            color="brandColor2"
            thumb-label
            density="compact"
            hide-details
            @update:model-value="onPriceChange"
          />
          <div
            class="d-flex justify-space-between g2a-text-11 text-greyDark mt-1"
          >
            <span>₹{{ safeVal.minPrice.toLocaleString("en-IN") }}</span>
            <span>₹{{ safeVal.maxPrice.toLocaleString("en-IN") }}</span>
          </div>
        </div>

        <v-divider />

        <!-- Footer -->
        <div class="d-flex align-center justify-space-between pa-4">
          <span class="g2a-text-12 text-greyDark">
            {{
              totalActiveCount > 0
                ? `${totalActiveCount} filter${totalActiveCount > 1 ? "s" : ""} applied`
                : "No filters applied"
            }}
          </span>
          <v-btn
            rounded="lg"
            color="brandColor2"
            class="g2a-text-bold-600 g2a-text-13 px-6"
            @click="dialogOpen = false"
          >
            Show Results
          </v-btn>
        </div>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  modelValue: { type: Object, default: () => ({}) },
  locations: { type: Array, default: () => [] },
  tags: { type: Array, default: () => [] },
  productTypes: { type: Array, default: () => [] },
});

const emit = defineEmits(["update:modelValue", "reset"]);

const DEFAULT_FILTER = {
  sortBy: "recommended",
  locationIds: [],
  tagIds: [],
  productTypeId: null,
  minPrice: 0,
  maxPrice: 50000,
};

const TABS = [
  { key: "sortBy", label: "Sort By" },
  { key: "location", label: "Location" },
  { key: "tag", label: "Tag" },
  { key: "productType", label: "Product Type" },
];


const SORT_OPTIONS = [
  { value: "recommended", label: "Recommended" },
  { value: "price_asc", label: "Price: Low → High" },
  { value: "price_desc", label: "Price: High → Low" },
  { value: "newest", label: "Newest First" },
];

const activeTab = ref("sortBy");
const dialogOpen = ref(false);
const sortMenuOpen = ref(false);
const locationMenuOpen = ref(false);

const safeVal = computed(() => ({
  ...DEFAULT_FILTER,
  ...props.modelValue,
  locationIds: Array.isArray(props.modelValue?.locationIds)
    ? props.modelValue.locationIds
    : [],
  tagIds: Array.isArray(props.modelValue?.tagIds)
    ? props.modelValue.tagIds
    : [],
}));

const totalActiveCount = computed(() => {
  const f = safeVal.value;
  return (
    (f.sortBy !== "recommended" ? 1 : 0) +
    f.locationIds.length +
    f.tagIds.length +
    (f.productTypeId ? 1 : 0) +
    (f.minPrice > 0 || f.maxPrice < 50000 ? 1 : 0)
  );
});

const hasActiveFilters = computed(() => totalActiveCount.value > 0);

const activeSortLabel = computed(
  () =>
    SORT_OPTIONS.find((o) => o.value === safeVal.value.sortBy)?.label ??
    "Sort by",
);

function tabCount(key) {
  const f = safeVal.value;
  if (key === "sortBy") return f.sortBy !== "recommended" ? 1 : 0;
  if (key === "location") return f.locationIds.length;
  if (key === "tag") return f.tagIds.length;
  if (key === "productType") return f.productTypeId ? 1 : 0;
  return 0;
}

function emitField(key, value) {
  emit("update:modelValue", { ...safeVal.value, [key]: value });
}

function toggleArr(key, id) {
  const arr = [...safeVal.value[key]];
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id);
  else arr.splice(idx, 1);
  emit("update:modelValue", { ...safeVal.value, [key]: arr });
}

function onPriceChange([min, max]) {
  emit("update:modelValue", { ...safeVal.value, minPrice: min, maxPrice: max });
}
</script>

<style scoped>
.filter-bar-wrap {
  border-bottom: 1px solid rgba(0, 0, 0, 0.07);
  background: #fff;
  position: sticky;
  top: 0;
  z-index: 10;
  border-radius: 12px;
}

.quick-menu-item {
  display: flex;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.1s;
  user-select: none;
}
.quick-menu-item:hover {
  background: rgba(41, 51, 155, 0.05);
}

.filter-dialog-card {
  overflow: hidden;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.filter-body {
  display: flex;
  min-height: 260px;
  max-height: 340px;
}

.filter-tabs {
  flex-shrink: 0;
  width: 120px;
  border-right: 1px solid rgba(0, 0, 0, 0.07);
  padding: 8px 0;
}

.filter-tab {
  display: flex;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  border-left: 2px solid transparent;
  transition: background 0.12s;
  user-select: none;
}
.filter-tab__label {
  color: rgba(0, 0, 0, 0.5);
  font-weight: 500;
  line-height: 1.2;
}
.filter-tab:hover .filter-tab__label {
  color: rgba(0, 0, 0, 0.75);
}
.filter-tab--active {
  border-left-color: #29339b;
  background: rgba(41, 51, 155, 0.04);
}
.filter-tab--active .filter-tab__label {
  color: #29339b;
  font-weight: 600;
}

.filter-options {
  flex: 1;
  overflow-y: auto;
  padding: 8px 12px;
}

.filter-option {
  display: flex;
  align-items: center;
  padding: 8px 6px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.1s;
  user-select: none;
}
.filter-option:hover {
  background: rgba(41, 51, 155, 0.05);
}
</style>
