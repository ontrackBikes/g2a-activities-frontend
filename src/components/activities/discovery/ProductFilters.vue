<template>
  <div>
    <!-- ═══════════════════════════════════════════════
         FILTER BAR (quick controls — apply immediately)
    ═══════════════════════════════════════════════ -->
    <div class="d-flex align-center ga-2 no-scrollbar overflow-x-auto">
      <!-- Filter button -->
      <v-btn
        flat
        class="border"
        rounded="lg"
        prepend-icon="mdi-tune-variant"
        @click="openDialog"
      >
        Filter
        <v-badge
          v-if="totalActiveCount > 0"
          :content="totalActiveCount"
          inline
          class="ms-1"
        />
      </v-btn>

      <!-- Location -->
      <v-menu v-model="locationMenuOpen" :close-on-content-click="false">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            flat
        class="border"
            rounded="lg"
            append-icon="mdi-chevron-down"
          >
            Location
            <v-badge
              v-if="safeVal.locationIds.length"
              :content="safeVal.locationIds.length"
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
            @click="toggleArrLive('locationIds', loc.slug)"
          >
            <v-icon
              :icon="
                safeVal.locationIds.includes(loc.slug)
                  ? 'mdi-checkbox-marked'
                  : 'mdi-checkbox-blank-outline'
              "
              size="16"
              :color="
                safeVal.locationIds.includes(loc.slug)
                  ? 'brandColor2'
                  : 'greyDark'
              "
              class="me-2"
            />
            <span class="">{{ loc.name }}</span>
          </div>
        </v-card>
      </v-menu>

      <!-- Sort By -->
      <v-menu v-model="sortMenuOpen" :close-on-content-click="true">
        <template #activator="{ props: menuProps }">
          <v-btn v-bind="menuProps" flat
        class="border" rounded="lg">
            {{ activeSortLabel }}
          </v-btn>
        </template>
        <v-card min-width="200" rounded="lg" elevation="3" class="pa-2">
          <div
            v-for="opt in SORT_OPTIONS"
            :key="opt.value"
            class="quick-menu-item"
            @click="emitFieldLive('sortBy', opt.value)"
          >
            <v-icon
              :icon="
                safeVal.sortBy === opt.value
                  ? 'mdi-radiobox-marked'
                  : 'mdi-radiobox-blank'
              "
              size="16"
              :color="safeVal.sortBy === opt.value ? 'brandColor2' : 'greyDark'"
              class="me-2"
            />
            <span class="">{{ opt.label }}</span>
          </div>
        </v-card>
      </v-menu>

      <!-- Tag quick buttons (up to 3) -->
      <v-btn
        v-for="tag in tags.slice(0, 3)"
        :key="tag.slug"
        flat
        class="border"
        rounded="lg"
        :style="
          safeVal.tagSlugs.includes(tag.slug)
            ? 'background: rgba(41,51,155,0.07)'
            : ''
        "
        @click="toggleArrLive('tagSlugs', tag.slug)"
      >
        {{ tag.name }}
      </v-btn>

      <!-- Clear all -->
      <v-btn
        v-if="hasActiveFilters"
        variant="text"
        color="error"
        rounded="xl"
        prepend-icon="mdi-close-circle-outline"
        @click="$emit('reset')"
      >
        Clear
      </v-btn>

      <!-- Results count -->
    </div>

    <!-- ═══════════════════════════════════════════════
         FILTER DIALOG (staged — only applies on "Apply Filters")
    ═══════════════════════════════════════════════ -->
    <v-dialog
      v-model="dialogOpen"
      max-width="560"
      scrollable
      :fullscreen="$vuetify.display.xs"
      scrim="rgba(15,23,42,.30)"
      :style="{
        backdropFilter: 'blur(5px)',
        webkitBackdropFilter: 'blur(5px)',
      }"
    >
      <v-card rounded="lg" elevation="0" class="filter-dialog-card">
        <!-- Header -->
        <div class="d-flex align-center justify-space-between pa-4 pb-3">
          <div class="d-flex align-center ga-2">
            <v-icon icon="mdi-tune-variant" size="18" />
            <span class="g2a-title-2xl">Filters & Sort</span>
          </div>
          <div class="d-flex align-center ga-1">
            <v-btn
              v-if="hasActiveDraftFilters"
              variant="text"
              color="error"
              class=" "
              @click="resetDraft"
            >
              Reset all
            </v-btn>
            <v-btn icon variant="text" size="small" @click="closeDialog">
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
              <span class="filter-tab__label">{{ tab.label }}</span>
              <v-badge
                v-if="tabCount(tab.key) > 0"
                :content="tabCount(tab.key)"
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
                    draft.sortBy === opt.value
                      ? 'mdi-radiobox-marked'
                      : 'mdi-radiobox-blank'
                  "
                  size="15"
                  :color="
                    draft.sortBy === opt.value ? 'brandColor2' : 'greyDark'
                  "
                  class="me-2 flex-shrink-0"
                />
                <span
                  class=""
                  :class="
                    draft.sortBy === opt.value
                      ? ' text-brandColor2'
                      : 'text-greyDark'
                  "
                >
                  {{ opt.label }}
                </span>
              </div>
            </template>

            <!-- Location -->
            <template v-if="activeTab === 'location'">
              <div v-if="!locations.length" class="text-greyDark pa-1">
                <v-progress-circular indeterminate size="14" class="me-1" />
                Loading…
              </div>
              <div
                v-for="loc in locations"
                :key="loc.slug"
                class="filter-option"
                @click="toggleArr('locationIds', loc.slug)"
              >
                <v-icon
                  :icon="
                    draft.locationIds.includes(loc.slug)
                      ? 'mdi-checkbox-marked'
                      : 'mdi-checkbox-blank-outline'
                  "
                  size="15"
                  :color="
                    draft.locationIds.includes(loc.slug)
                      ? 'brandColor2'
                      : 'greyDark'
                  "
                  class="me-2 flex-shrink-0"
                />
                <span
                  class=""
                  :class="
                    draft.locationIds.includes(loc.slug)
                      ? ' text-brandColor2'
                      : 'text-greyDark'
                  "
                >
                  {{ loc.name }}
                </span>
              </div>
            </template>

            <!-- Tag -->
            <template v-if="activeTab === 'tag'">
              <div v-if="!tags.length" class="text-greyDark pa-1">
                No tags available
              </div>
              <div
                v-for="tag in tags"
                :key="tag.id"
                class="filter-option"
                @click="toggleArr('tagSlugs', tag.slug)"
              >
                <v-icon
                  :icon="
                    draft.tagSlugs.includes(tag.slug)
                      ? 'mdi-checkbox-marked'
                      : 'mdi-checkbox-blank-outline'
                  "
                  size="15"
                  :color="
                    draft.tagSlugs.includes(tag.slug)
                      ? 'brandColor2'
                      : 'greyDark'
                  "
                  class="me-2 flex-shrink-0"
                />
                <span
                  class=""
                  :class="
                    draft.tagSlugs.includes(tag.slug)
                      ? 'text-brandColor2'
                      : 'text-greyDark'
                  "
                >
                  {{ tag.name }}
                </span>
              </div>
            </template>

            <!-- Product Type -->
            <template v-if="activeTab === 'productType'">
              <div v-if="!productTypes.length" class="text-greyDark pa-1">
                <v-progress-circular indeterminate size="14" class="me-1" />
                Loading…
              </div>
              <div
                class="filter-option"
                @click="emitField('productTypeSlug', null)"
              >
                <v-icon
                  :icon="
                    !draft.productTypeSlug
                      ? 'mdi-radiobox-marked'
                      : 'mdi-radiobox-blank'
                  "
                  size="15"
                  :color="!draft.productTypeSlug ? 'brandColor2' : 'greyDark'"
                  class="me-2 flex-shrink-0"
                />
                <span
                  class=""
                  :class="
                    !draft.productTypeSlug
                      ? ' text-brandColor2'
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
                @click="emitField('productTypeSlug', pt.slug)"
              >
                <v-icon
                  :icon="
                    draft.productTypeSlug === pt.slug
                      ? 'mdi-radiobox-marked'
                      : 'mdi-radiobox-blank'
                  "
                  size="15"
                  :color="
                    draft.productTypeSlug === pt.slug
                      ? 'brandColor2'
                      : 'greyDark'
                  "
                  class="me-2 flex-shrink-0"
                />
                <span
                  class=""
                  :class="
                    draft.productTypeSlug === pt.slug
                      ? ' text-brandColor2'
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

        <!-- Footer -->
        <div class="d-flex align-center justify-space-between pa-4">
          <span class="text-greyDark">
            {{
              draftActiveCount > 0
                ? `${draftActiveCount} filter${draftActiveCount > 1 ? "s" : ""} selected`
                : "No filters selected"
            }}
          </span>
          <v-btn flat rounded="lg" color="brandColor2" @click="applyFilters">
            Apply Filters
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
  productTypeSlug: null,
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

// Normalized view of whatever the parent currently has (source of truth).
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

// Local staged copy that the dialog reads/writes. Only pushed to the
// parent when "Apply Filters" is clicked, so the button actually does
// something instead of just closing the dialog.
const draft = ref({ ...safeVal.value });

function syncDraftFromModel() {
  draft.value = {
    ...safeVal.value,
    locationIds: [...safeVal.value.locationIds],
    tagIds: [...safeVal.value.tagIds],
  };
}

function openDialog() {
  syncDraftFromModel();
  dialogOpen.value = true;
}

function closeDialog() {
  // discard any unapplied changes made while the dialog was open
  dialogOpen.value = false;
}

function applyFilters() {
  emit("update:modelValue", { ...draft.value });
  dialogOpen.value = false;
}

function resetDraft() {
  draft.value = { ...DEFAULT_FILTER, locationIds: [], tagIds: [] };
}

// ---- badge / label counts driven off whatever is currently applied ----
const totalActiveCount = computed(() => countActive(safeVal.value));
const hasActiveFilters = computed(() => totalActiveCount.value > 0);
const activeSortLabel = computed(
  () =>
    SORT_OPTIONS.find((o) => o.value === safeVal.value.sortBy)?.label ??
    "Sort by",
);

// ---- counts driven off the in-progress dialog selection ----
const draftActiveCount = computed(() => countActive(draft.value));
const hasActiveDraftFilters = computed(() => draftActiveCount.value > 0);

function countActive(f) {
  return (
    (f.sortBy !== "recommended" ? 1 : 0) +
    f.locationIds.length +
    f.tagIds.length +
    (f.productTypeSlug ? 1 : 0) +
    (f.minPrice > 0 || f.maxPrice < 50000 ? 1 : 0)
  );
}

function tabCount(key) {
  const f = draft.value;
  if (key === "sortBy") return f.sortBy !== "recommended" ? 1 : 0;
  if (key === "location") return f.locationIds.length;
  if (key === "tag") return f.tagIds.length;
  if (key === "productType") return f.productTypeSlug ? 1 : 0;
  return 0;
}

// ---- dialog-scoped mutators: write to draft only ----
function emitField(key, value) {
  draft.value = { ...draft.value, [key]: value };
}

function toggleArr(key, id) {
  const arr = [...draft.value[key]];
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id);
  else arr.splice(idx, 1);
  draft.value = { ...draft.value, [key]: arr };
}

// ---- quick-bar mutators (outside the dialog, no Apply button): apply live ----
function emitFieldLive(key, value) {
  emit("update:modelValue", { ...safeVal.value, [key]: value });
}

function toggleArrLive(key, id) {
  const arr = [...safeVal.value[key]];
  const idx = arr.indexOf(id);
  if (idx === -1) arr.push(id);
  else arr.splice(idx, 1);
  emit("update:modelValue", { ...safeVal.value, [key]: arr });
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
</style>
